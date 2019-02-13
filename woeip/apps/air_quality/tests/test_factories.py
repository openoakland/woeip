import pytest

from woeip.apps.air_quality.tests import factories


@pytest.mark.django_db
def test_factories():
    factories.DeviceFactory()
    factories.RouteFactory()
    factories.SensorFactory()
    factories.SessionFactory()
    factories.SessionDataFactory()
    factories.DataFactory()
