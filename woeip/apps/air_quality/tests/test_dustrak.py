from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from woeip.apps.air_quality import dustrak


def test_joiner():
    test_data_directory = Path(__file__).parent / 'data'
    dustrak_file_handle = open(test_data_directory / 'dustrak.csv', 'r')
    gps_file_handle = open(test_data_directory / 'gps.log', 'r')

    with pytest.warns(UserWarning):
        test_joined_data = dustrak.join(dustrak_file_handle, gps_file_handle)

    dustrak_file_handle.close()
    gps_file_handle.close()

    joined_data = pd.read_csv(test_data_directory / 'joined.csv', parse_dates=['time'])
    joined_data.set_index('time', inplace=True)
    joined_data = joined_data.tz_localize('UTC')
    joined_data.reset_index(inplace=True)

    for column in joined_data:
        if column == 'time':
            assert all(joined_data[column] == test_joined_data[column])
        else:
            assert np.allclose(joined_data[column], test_joined_data[column])
