import random

import factory
from django.contrib.gis import geos

from woeip.apps.air_quality.models import Data, Device, Organization, Participant, Route, Sensor, Session, SessionData


def generate_route(n):
    points = []
    for _ in range(n):
        points.append(geos.Point(random.random(), random.random()))

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


class OrganizationFactory(factory.DjangoModelFactory):
    class Meta:
        model = Organization

    name = factory.Faker('sentence', nb_words=3)
    website = factory.Faker('uri')
    email = factory.Faker('email')
    contact = factory.SubFactory('woeip.apps.air_quality.factories.ParticipantFactory')


class ParticipantFactory(factory.DjangoModelFactory):
    class Meta:
        model = Participant

    name = factory.Faker('name')
    email = factory.Faker('email')
    organization = factory.SubFactory(OrganizationFactory)


class RouteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Route

    name = factory.Faker('word')
    path = generate_route(10)


class SensorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Sensor

    name = factory.Faker('sentence', nb_words=3)
    unit = factory.Faker('sentence', nb_words=2)
    device = factory.SubFactory(DeviceFactory)


class SessionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Session

    date_collected = factory.Faker('post_datetime')
    route = factory.SubFactory(RouteFactory)
    collected_by = factory.SubFactory(ParticipantFactory)
    metadata = factory.Faker('pydict')


class SessionDataFactory(factory.DjangoModelFactory):
    class Meta:
        model = SessionData

    uri = factory.Faker('uri')
    sensor = factory.SubFactory(Sensor)
    session = factory.SubFactory(Session)
    upload_time = factory.Faker('past_datetime')
    uploaded_by = factory.SubFactory(ParticipantFactory)
    hash = factory.Faker('md5')


class DataFactory(factory.DjangoModelFactory):
    class Meta:
        model = Data

    session_data = factory.SubFactory(SessionDataFactory)
    value = factory.Faker('pyfloat')
    time = factory.Faker('past_datetime')
    latlon = factory.Faker('latlng')
