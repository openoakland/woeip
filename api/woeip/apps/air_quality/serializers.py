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


class CalibrationSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.HyperlinkedRelatedField(
        many=False,
        read_only=True,
        view_name="user-detail",
    )

    class Meta:
        model = Calibration
        fields = ["calibrated_at", "user"]


class CollectionFileSerializer(serializers.ModelSerializer):
    collection = serializers.HyperlinkedRelatedField(
        read_only=True,
        view_name="collection-detail",
    )
    sensor = serializers.StringRelatedField()
    user = serializers.StringRelatedField()

    class Meta:
        model = CollectionFile
        fields = [
            "collection",
            "sensor",
            "user",
            "file",
            "uploaded_at",
            "processor_version",
            "processed_at",
        ]


class DeviceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Device
        fields = ["name", "serial", "firmware"]


class PollutantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pollutant
        fields = ["name", "description"]


class PollutantValueSerializer(serializers.ModelSerializer):
    time_geo = serializers.StringRelatedField()
    pollutant = serializers.StringRelatedField()

    class Meta:
        model = PollutantValue
        fields = ["time_geo", "pollutant", "value"]


class CollectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Collection
        fields = ["starts_at", "ends_at", "collection_files"]


class CollectionGeoSerializer(serializers.Serializer):
    pollutant_values = serializers.ListField(child=PollutantValueSerializer())


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sensor
        fields = ["name", "unit"]


class TimeGeoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimeGeo
        fields = ["location", "time"]
