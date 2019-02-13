import pytest

from woeip.apps.air_quality.tests import factories


@pytest.mark.django_db
def test_factories():
    device = factories.DeviceFactory()
    route = factories.RouteFactory()
    sensor = factories.SensorFactory()
    session = factories.SessionFactory()
    sessiondata = factories.SessionDataFactory()
    data = factories.DataFactory()
