"""Model factories for tests"""
import random

import factory
import factory.fuzzy
import pytz
from django.contrib.gis.geos import Point

from woeip.apps.air_quality import models
from woeip.apps.core.tests.factories import UserFactory


class FuzzyPoint(factory.fuzzy.BaseFuzzyAttribute):
    def fuzz(self):
        return Point(
            random.random() * 180 - 90,
            random.random() * 360 - 180
        )


class DeviceFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Device

    name = factory.Faker('sentence', nb_words=3)
    serial = factory.Faker('pystr', max_chars=10)
    firmware = factory.Faker('pyint')


class PollutantFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Pollutant

    name = factory.Faker('pystr', max_chars=64)
    description = factory.Faker('sentence', nb_words=3)


class SensorFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Sensor

    name = factory.Faker('sentence', nb_words=3)
    device = factory.SubFactory(DeviceFactory)
    pollutant = factory.SubFactory(PollutantFactory)
    unit = factory.Faker('sentence', nb_words=2)


class CalibrationFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Calibration
    sensor = factory.SubFactory(SensorFactory)
    user = factory.SubFactory(UserFactory)
    calibrated_at = factory.Faker('past_datetime', tzinfo=pytz.utc)


class CollectionFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Collection

    starts_at = factory.Faker('past_datetime', tzinfo=pytz.utc)
    ends_at = factory.Faker('past_datetime', tzinfo=pytz.utc)


class CollectionFileFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.CollectionFile

    collection = factory.SubFactory(CollectionFactory)
    sensor = factory.SubFactory(SensorFactory)
    user = factory.SubFactory(UserFactory)
    file = factory.django.FileField()
    uploaded_at = factory.Faker('past_datetime', tzinfo=pytz.utc)
    processor_version = factory.Faker('pyint')
    processed_at = factory.Faker('past_datetime', tzinfo=pytz.utc)


class TimeGeoFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.TimeGeo

    collection_file = factory.SubFactory(CollectionFileFactory)
    location = FuzzyPoint()
    time = factory.Faker('past_datetime', tzinfo=pytz.utc)


class PollutantValueFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.PollutantValue

    collection_file = factory.SubFactory(CollectionFileFactory)
    time_geo = factory.SubFactory(TimeGeoFactory)
    pollutant = factory.SubFactory(PollutantFactory)
    value = factory.Faker("pyfloat")
