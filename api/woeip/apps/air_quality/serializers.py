# pylint: disable=abstract-method
from rest_framework import serializers
from woeip.apps.air_quality.models import Calibration
from woeip.apps.air_quality.models import Collection
from woeip.apps.air_quality.models import CollectionFile
from woeip.apps.air_quality.models import Device
from woeip.apps.air_quality.models import Pollutant
from woeip.apps.air_quality.models import PollutantValue
from woeip.apps.air_quality.models import Sensor
from woeip.apps.air_quality.models import TimeGeo


class CalibrationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Calibration
        fields = ["sensor", "user", "calibrated_at"]


class CollectionFileSerializer(serializers.ModelSerializer):
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

    def create(self, validated_data):
        files_data = self.context.get('view').request.FILES
        collection = models.Collection.objects.create(
            starts_at=validated_data.get('starts_at'),
            ends_at=validated_data.get('ends_at'),
        )
        sensor_ids = validated_data.get('sensor_ids')
        for file_index, file in files_data:
            sensor = Sensor.objects.get(pk=sensor_ids[file_index])
            CollectionFile.objects.create(
                collection=collection,
                sensor=sensor,
                file=file,
            )
        return collection


class CollectionGeoSerializer(serializers.Serializer):
    metadata = CollectionSerializer()
    pollutant_values = serializers.ListField(child=PollutantValueSerializer())


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sensor
        fields = ["name", "device", "pollutant", "unit"]


class TimeGeoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimeGeo
        fields = ["location", "time"]
