#!/usr/bin/env python
import datetime
import io
import itertools
import warnings

import numpy as np
import pandas as pd
import pynmea2
import pytz
from django.contrib.gis import geos

from . import models


def parse_gps_sentence(sentence):
    """Parse an NMEA 0183 formatted data sample.

    Parameters
    ----------
    sentence : str
        A NMEA 0183 formatted "sentence" with the prefix $GPRMC
        (Recommended minimum specific GPS/Transit data)

    Returns
    -------
    A pynmea2.types.talker.RMC object

    References
    ----------
    http://aprs.gids.nl/nmea (NMEA Sentence Information)
    """
    try:
        gps = pynmea2.parse(sentence)
        if not gps.is_valid:
            gps = None

    except pynmea2.nmea.SentenceTypeError:
        gps = None

    return gps


def sentence_to_dict(sentence):
    """Convert an NMEA sentence object to a dict of values

    Parameters
    ----------
    sentence : pynmea2.types.talker.RMC

    Returns
    -------
    A dict containing the key-value pair for each field in the
    NMEA sentence
    """
    sentence_dict = {}
    for field in sentence.fields:
        field_attribute_name = field[1]
        sentence_dict[field_attribute_name] = getattr(sentence, field_attribute_name)

    return sentence_dict


def combine_date_and_time(date_series, time_series):
    """Combine a date and time series into a datetime series

    Parameters
    ----------
    date_series : pandas Series
    time_series : pandas Series

    Returns
    -------
    A pandas Series of datetimes
    """
    datetimes = []
    for date, time in zip(date_series.values, time_series.values):
        dt = pd.datetime.combine(date, time)
        datetimes.append(dt)

    return datetimes


def degree_minute_to_decimal(degmin):
    """Convert a geospatial location from degrees/minute notation to decimal
    degrees

    Parameters
    ----------
    degmin : float
        A latitude or longitude value expressed as (degrees * 100 + minutes)
        e.g., latitude -12217.45234 is 122° 17.45234' W

    Returns
    -------
    The latitude/longitude as a decimal
    """
    degrees = degmin // 100
    minutes = (degmin - (degrees * 100))
    return degrees + minutes / 60


def load_dustrak(contents, tz):
    """Load and condition data from a DusTrak raw data file

    Parameters
    ----------
    contents : str
        File contents as string

    Returns
    -------
    A dict of header information and a pandas DataFrame of data
    """
    contents = io.StringIO(contents)

    header = {}
    lines = itertools.takewhile(lambda x: x != '\n', contents)
    for line in lines:
        line = line.rstrip('\n')
        key, value = line.split(',')
        header[key] = value

    data = pd.read_csv(contents)

    if data.columns[0] != 'Elapsed Time [s]':
        raise ValueError('First column must be elapsed time in seconds')

    start_time = ' '.join([header['Test Start Date'],
                           header['Test Start Time']])
    start_time = datetime.datetime.strptime(start_time, '%m/%d/%Y %I:%M:%S %p')

    local_timezone = pytz.timezone(tz)
    start_time = local_timezone.localize(start_time)
    start_time = start_time.astimezone(pytz.timezone('UTC'))

    sample_interval_minutes = header['Test Interval [M:S]'].split(':')[0]
    if sample_interval_minutes != '0':
        raise NotImplementedError('Minute sampling intervals not supported')

    sample_offsets = np.array(data['Elapsed Time [s]'], dtype='timedelta64[s]')
    sample_times = pd.Timestamp(start_time) + pd.to_timedelta(sample_offsets)
    sample_times = sample_times.tz_localize('UTC')

    data['time'] = sample_times
    data.sort_values(by='time', inplace=True)

    return header, data


def load_gps(contents):
    """Load and condition data from a GPS raw data file

    Parameters
    ----------
    contents : str

    Returns
    -------
    A pandas DataFrame
    """
    gps = []
    for sample in contents.split('\n'):
        if sample.startswith('$GPRMC'):
            gps_sample = parse_gps_sentence(sample)
            gps_dict = sentence_to_dict(gps_sample)
            gps.append(gps_dict)

    gps = pd.DataFrame(gps)

    sample_times = combine_date_and_time(gps.datestamp, gps.timestamp)
    sample_times = pd.DatetimeIndex(sample_times, tz='UTC')
    gps['time'] = sample_times
    gps.sort_values(by='time', inplace=True)

    gps['lat'] = gps.lat.apply(float)
    gps['lon'] = gps.lon.apply(float)

    gps['lat'] = gps.lat.apply(degree_minute_to_decimal)
    gps['lon'] = gps.lon.apply(degree_minute_to_decimal)

    latitudes = []
    for _, (lat, lat_dir) in gps[['lat', 'lat_dir']].iterrows():
        if lat_dir == 'N':
            latitudes.append(lat)
        else:
            latitudes.append(-lat)

    longitudes = []
    for _, (lon, lon_dir) in gps[['lon', 'lon_dir']].iterrows():
        if lon_dir == 'E':
            longitudes.append(lon)
        else:
            longitudes.append(-lon)

    gps['lat'] = latitudes
    gps['lon'] = longitudes

    return gps


def join(air_quality, gps, tolerance=3.):
    """Join a DusTrak and a GPS tables into a single table.

    The DusTrak device collects time stamps and air quality measurements, but no geospatial
    information. Scientists will also take a GPS device on their sessions that records timestamps
    and latitudes/longitudes. Merge the two files by matching timestamps.

    Parameters
    ----------
    dustrak : pandas DataFrame
    gps : pandas DataFrame
    tz : str
    tolerance : numeric
        How far away (in seconds) can a air quality measurement be from a GPS measurement to be
        linked to it

    Returns
    -------
    A pandas DataFrame containing the sample time (in UTC), latitude, longitude, and measurement
    """
    joined_data = pd.merge_asof(air_quality, gps, on='time', direction='nearest',
                                tolerance=pd.Timedelta(f'{tolerance}s'))

    invalid_indices = joined_data[['lat', 'lon', 'Mass [mg/m3]']].isnull().any(1)
    joined_data = joined_data[~invalid_indices]

    n_dropped = invalid_indices.sum()

    if n_dropped > 0:
        message = f"{n_dropped} air quality samples dropped that were not within {tolerance} seconds of a GPS sample."
        warnings.warn(message)

    joined_data = joined_data[['time', 'Mass [mg/m3]', 'lat', 'lon']]
    joined_data.rename(columns={'Mass [mg/m3]': 'measurement'}, inplace=True)

    return joined_data


def save(joined_data, session_data):
    """Save a table of joined data to the database

    Parameters
    ----------
    joined_data : pandas DataFrame
    session_data : woeip.apps.air_quality.models.SessionData
    """
    data = []
    for _, row in joined_data.iterrows():
        dat = models.Data(session_data=session_data,
                          value=row['measurement'],
                          time=row['time'],
                          latlon=geos.Point(row['lon'], row['lat']))
        data.append(dat)

    models.Data.objects.bulk_create(data)
