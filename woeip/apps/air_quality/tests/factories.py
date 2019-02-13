import factory
import factory.fuzzy
import faker
import pytz
from django.contrib.gis import geos

from woeip.apps.air_quality.models import Data, Device, Route, Sensor, Session, SessionData
from woeip.apps.core.tests.factories import UserFactory

fake = faker.Faker()


class FuzzyLatLon(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        return geos.Point(fake.latlng())


class FuzzyRoute(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        points = [fake.latlng() for _ in range(20)]

        return geos.LineString(points)


class DeviceFactory(factory.DjangoModelFactory):
    class Meta:
        model = Device

    name = factory.Faker('sentence', nb_words=3)
    manufacturer = factory.Faker('word')
    serial_number = factory.Faker('pystr', max_chars=10)
    model_number = factory.Faker('pyint')
    calibration_date = factory.Faker('past_date', tzinfo=pytz.utc)
    firmware_version = factory.Faker('pyint')


class RouteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Route

    name = factory.Sequence(lambda n: 'Route %d' % n)
    path = FuzzyRoute()


class SensorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Sensor

    name = factory.Faker('sentence', nb_words=3)
    unit = factory.Faker('sentence', nb_words=2)
    device = factory.SubFactory(DeviceFactory)


class SessionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Session

    date_collected = factory.Faker('past_datetime', tzinfo=pytz.utc)
    route = factory.SubFactory(RouteFactory)
    collected_by = factory.SubFactory(UserFactory)


class SessionDataFactory(factory.DjangoModelFactory):
    class Meta:
        model = SessionData

    upload = factory.django.FileField()
    sensor = factory.SubFactory(SensorFactory)
    session = factory.SubFactory(SessionFactory)
    uploaded_by = factory.SubFactory(UserFactory)


class DataFactory(factory.DjangoModelFactory):
    class Meta:
        model = Data

    session = factory.SubFactory(SessionFactory)
    value = factory.Faker('pyfloat')
    time = factory.Faker('past_datetime', tzinfo=pytz.utc)
    latlon = FuzzyLatLon()
