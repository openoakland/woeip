"""Model factories for tests"""
import random

import factory.fuzzy
from faker.providers.python import Provider as PythonProvider
import pytz
from django.contrib.gis.geos import Point
from woeip.apps.air_quality import models
from woeip.apps.core.tests.factories import UserFactory


class Provider(PythonProvider):
    """Custom Faker provider methods
    """

    def random_value_in_range(self, min_value, max_value, digits=6):
        # min_value and max_value apply to left-of-decimal value
        # to get [0,1), need to set both to 0
        base_val = self.pyfloat(
            min_value=0, max_value=0, positive=True, right_digits=digits
        )
        return round(base_val * (max_value - min_value) + min_value, digits)

    def west_oakland_geo_point(self):
        lon_range = [-122.308052, -122.269242]
        lat_range = [37.798291, 37.823804]
        lon = self.random_value_in_range(
            min_value=lon_range[0], max_value=lon_range[1], digits=6
        )
        lat = self.random_value_in_range(
            min_value=lat_range[0], max_value=lat_range[1], digits=6
        )
        return Point(lon, lat)

    def pollutant_value(self):
        return self.random_value_in_range(min_value=0.0, max_value=0.050, digits=3)


# Register new provider with Faker
factory.Faker.add_provider(Provider)


class DeviceFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Device

    name = factory.Faker("sentence", nb_words=3)
    serial = factory.Faker("pystr", max_chars=10)
    firmware = factory.Faker("pyint")


class PollutantFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Pollutant

    name = factory.Faker("random_element", elements=["PM1", "PM2.5", "PM4", "PM10"],)
    description = factory.Faker("sentence", nb_words=3)


class SensorFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Sensor

    name = factory.Faker("sentence", nb_words=3)
    device = factory.SubFactory(DeviceFactory)
    pollutant = factory.SubFactory(PollutantFactory)
    unit = factory.Faker("sentence", nb_words=2)


class CalibrationFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Calibration

    sensor = factory.SubFactory(SensorFactory)
    user = factory.SubFactory(UserFactory)
    calibrated_at = factory.Faker("past_datetime", tzinfo=pytz.utc)


class CollectionFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.Collection

    starts_at = factory.Faker("past_datetime", tzinfo=pytz.utc)
    ends_at = factory.Faker("past_datetime", tzinfo=pytz.utc)


class CollectionFileFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.CollectionFile

    collection = factory.SubFactory(CollectionFactory)
    sensor = factory.SubFactory(SensorFactory)
    user = factory.SubFactory(UserFactory)
    file = factory.django.FileField()
    uploaded_at = factory.Faker("past_datetime", tzinfo=pytz.utc)
    processor_version = factory.Faker("pyint")
    processed_at = factory.Faker("past_datetime", tzinfo=pytz.utc)


class TimeGeoFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.TimeGeo

    collection_file = factory.SubFactory(CollectionFileFactory)
    location = factory.Faker("west_oakland_geo_point")
    time = factory.Faker("past_datetime", tzinfo=pytz.utc)


class PollutantValueFactory(factory.DjangoModelFactory):
    class Meta:
        model = models.PollutantValue

    collection_file = factory.SubFactory(CollectionFileFactory)
    time_geo = factory.SubFactory(TimeGeoFactory)
    pollutant = factory.SubFactory(PollutantFactory)
    value = factory.Faker("pollutant_value")
