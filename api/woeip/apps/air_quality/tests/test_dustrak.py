from pathlib import Path

import numpy as np
import pandas as pd
import pytest
from woeip.apps.air_quality import dustrak
from woeip.apps.air_quality import models
from woeip.apps.air_quality.tests import factories

TEST_DATA_DIRECTORY = Path(__file__).parent / "data"
JOINED_PATH = TEST_DATA_DIRECTORY / "joined.csv"
GPS_PATH = TEST_DATA_DIRECTORY / "gps.log"
DUSTRAK_PATH = TEST_DATA_DIRECTORY / "dustrak.csv"


def get_target_data(target_path):
    """Load the target output"""
    return pd.read_csv(target_path, infer_datetime_format=True, parse_dates=["time"])


def test_joiner():
    """Test the output of the function that joins GPS and air quality measurements based on time stamps"""
    _, air_quality = dustrak.load_dustrak(DUSTRAK_PATH, tz="America/Los_Angeles")
    gps = dustrak.load_gps(GPS_PATH)

    with pytest.warns(UserWarning):
        joined_data = dustrak.join(air_quality, gps)

    target_data = get_target_data(target_path=JOINED_PATH)
    for column in target_data:
        if column == "time":
            assert all(target_data[column] == joined_data[column])
        else:
            assert np.allclose(target_data[column], joined_data[column])


@pytest.mark.django_db
def test_save():
    """Test ability to save a session of joined GPS/air quality data to the database, based on measurement/value"""
    collection = factories.CollectionFactory()
    gps_collection_file = factories.CollectionFileFactory(collection=collection)
    pollutant_collection_file = factories.CollectionFileFactory(collection=collection)
    pollutant = factories.PollutantFactory()
    target_data = get_target_data(target_path=JOINED_PATH)
    dustrak.save(
        target_data,
        gps_collection_file=gps_collection_file,
        pollutant_collection_file=pollutant_collection_file,
        pollutant=pollutant,
    )
    assert np.allclose(
        target_data["measurement"],
        models.PollutantValue.objects.values_list("value", flat=True),
    )
