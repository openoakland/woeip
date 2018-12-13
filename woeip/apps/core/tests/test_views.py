import datetime
import json
from unittest import mock

import pytest
import pytz
from django.db import DatabaseError
from django.urls import reverse

from ..constants import Status


def assert_health_status(client, status_code, overall_status, database_status):
    now = datetime.datetime(2012, 1, 1, tzinfo=pytz.UTC)

    with mock.patch('django.utils.timezone.now', return_value=now):
        response = client.get(reverse('health'))

    assert response.status_code == status_code

    actual = json.loads(response.content)
    expected = {
        'timestamp': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'overall_status': overall_status,
        'detailed_status': {
            'database_status': database_status
        }
    }
    assert actual == expected


@pytest.mark.django_db
def test_health(client):
    assert_health_status(client, 200, Status.OK, Status.OK)


@pytest.mark.django_db
def test_health_database_outage(client):
    with mock.patch('django.db.backends.base.base.BaseDatabaseWrapper.cursor', side_effect=DatabaseError):
        assert_health_status(client, 503, Status.UNAVAILABLE, Status.UNAVAILABLE)
