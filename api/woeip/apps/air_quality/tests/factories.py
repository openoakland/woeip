"""Model factories for tests"""
import factory
import pytz

from woeip.apps.air_quality.models import Calibration, Collection, CollectionFile, Device, Pollutant, Sensor
from woeip.apps.core.tests.factories import UserFactory


class DeviceFactory(factory.DjangoModelFactory):
    class Meta:
        model = Device

    name = factory.Faker('sentence', nb_words=3)
    serial = factory.Faker('pystr', max_chars=10)
    firmware = factory.Faker('pyint')


class PollutantFactory(factory.DjangoModelFactory):
    class Meta:
        model = Pollutant
    name = factory.Faker('pystr', max_chars=255)
    description = factory.Faker('sentence', nb_words=3)


class SensorFactory(factory.DjangoModelFactory):
    class Meta:
        model = Sensor

    name = factory.Faker('sentence', nb_words=3)
    device = factory.SubFactory(DeviceFactory)
    pollutant = factory.SubFactory(PollutantFactory)
    unit = factory.Faker('sentence', nb_words=2)


class CalibrationFactory(factory.DjangoModelFactory):
    class Meta:
        model = Calibration
    sensor = factory.SubFactory(SensorFactory)
    user = factory.SubFactory(UserFactory)
    calibrated_at = factory.Faker('past_datetime', tzinfo=pytz.utc)


class CollectionFactory(factory.DjangoModelFactory):
    class Meta:
        model = Collection

    starts_at = factory.Faker('past_datetime', tzinfo=pytz.utc)
    ends_at = factory.Faker('past_datetime', tzinfo=pytz.utc)
    route = factory.Faker('sentence', nb_words=3)


class CollectionFileFactory(factory.DjangoModelFactory):
    class Meta:
        model = CollectionFile

    collection = factory.SubFactory(CollectionFactory)
    sensor = factory.SubFactory(SensorFactory)
    user = factory.SubFactory(UserFactory)
    file = factory.django.FileField()
    uploaded_at = factory.Faker('past_datetime', tzinfo=pytz.utc)
    processor_version = factory.Faker('pyint')
    processed_at = factory.Faker('past_datetime', tzinfo=pytz.utc)
