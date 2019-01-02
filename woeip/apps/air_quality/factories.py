import random

import factory
import factory.fuzzy
from django.contrib.gis import geos

from woeip.apps.air_quality.models import Data, Device, Route, Sensor, Session, SessionData
from woeip.apps.core.factories import UserFactory


class FuzzyLineString(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        points = [(random.random(), random.random())
                  for _ in range(20)]

        return geos.LineString(points)


class DeviceFactory(factory.DjangoModelFactory):
    class Meta:
        model = Device

    name = factory.Faker('sentence', nb_words=3)
    manufacturer = factory.Faker('word')
    serial_number = factory.Faker('pystr', max_chars=10)
    model_number = factory.Faker('pyint')
    calibration_date = factory.Faker('past_date')
    firmware_version = factory.Faker('pyint')


class RouteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Route

    name = factory.Sequence(lambda n: 'Route %d' % n)
    path = FuzzyLineString()


class SensorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Sensor

    name = factory.Faker('sentence', nb_words=3)
    unit = factory.Faker('sentence', nb_words=2)
    device = factory.SubFactory(DeviceFactory)


class SessionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Session

    date_collected = factory.Faker('past_datetime')
    route = factory.SubFactory(RouteFactory)
    collected_by = factory.SubFactory(UserFactory)


class SessionDataFactory(factory.DjangoModelFactory):
    class Meta:
        model = SessionData

    uri = factory.Faker('uri')
    sensor = factory.SubFactory(SensorFactory)
    session = factory.SubFactory(SessionFactory)
    uploaded_by = factory.SubFactory(UserFactory)


class DataFactory(factory.DjangoModelFactory):
    class Meta:
        model = Data

    session_data = factory.SubFactory(SessionDataFactory)
    value = factory.Faker('pyfloat')
    time = factory.Faker('past_datetime')
    latlon = factory.Faker('latlng')
