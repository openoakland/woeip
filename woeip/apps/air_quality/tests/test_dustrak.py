# pylint: disable=W0621
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from woeip.apps.air_quality import dustrak, models
from woeip.apps.air_quality.tests import factories

test_data_directory = Path(__file__).parent / 'data'


@pytest.fixture
def target_data():
    """Load the target output"""
    target_data = pd.read_csv(test_data_directory / 'joined.csv', parse_dates=['time'])
    target_data.set_index('time', inplace=True)
    target_data = target_data.tz_localize('UTC')
    target_data.reset_index(inplace=True)

    return target_data


def test_joiner(target_data):
    """Test the output of the function that joins GPS and air quality measurements based on time stamps"""
    dustrak_file_handle = open(test_data_directory / 'dustrak.csv', 'r')
    gps_file_handle = open(test_data_directory / 'gps.log', 'r')

    with pytest.warns(UserWarning):
        joined_data = dustrak.join(dustrak_file_handle, gps_file_handle)

    dustrak_file_handle.close()
    gps_file_handle.close()

    for column in target_data:
        if column == 'time':
            assert all(target_data[column] == joined_data[column])
        else:
            assert np.allclose(target_data[column], joined_data[column])


@pytest.mark.django_db
def test_save(target_data):
    """Test ability to save a session of joined GPS/air quality measurement data to the database"""
    session_data = factories.SessionDataFactory()
    session_data.save()

    dustrak.save(target_data, session_data)

    assert len(models.Data.objects.all()) == len(target_data)
