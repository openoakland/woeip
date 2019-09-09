from woeip.apps.air_quality.models import (
    Device,
    Pollutant,
    Sensor,
    Calibration,
    Collection,
    CollectionFile,
    TimeGeo,
    PollutantValue,
)

from rest_framework import serializers


class DeviceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Device
        fields = ["name", "serial", "firmware"]


class PollutantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pollutant
        fields = ["name", "description"]


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sensor
        fields = ["name", "unit"]


class CalibrationSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        many=False,
        read_only=True,
        view_name="user-detail",
    )

    class Meta:
        model = Calibration
        fields = ["calibrated_at", "user"]


class CollectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Collection
        fields = []


class CollectionFileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CollectionFile
        fields = []


class TimeGeoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimeGeo
        fields = []


class PollutantValueSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PollutantValue
        fields = []
