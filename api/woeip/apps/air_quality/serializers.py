# pylint: disable=abstract-method
from django.core.files.base import ContentFile
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
    upload_files = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Collection
        fields = ["starts_at", "ends_at", "collection_files", "upload_files"]
        extra_kwargs = {"collection_files": {"required": False}}

    def create(self, validated_data):
        collection = Collection.objects.create(
            starts_at=validated_data.get("starts_at"),
            ends_at=validated_data.get("ends_at"),
        )
        collection.save()

        for upload_file in validated_data.pop("upload_files", []):
            collection_file = CollectionFile.objects.create(
                collection=collection,
            )
            collection_file.file.save(
                upload_file["file_name"], ContentFile(upload_file["file_data"]))

        return collection


class CollectionGeoSerializer(serializers.Serializer):
    metadata = CollectionSerializer()
    pollutant_values = serializers.ListField(child=PollutantValueSerializer())


class CollectionSequenceSerializer(serializers.Serializer):
    sequence = serializers.IntegerField()


class SensorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Sensor
        fields = ["name", "device", "pollutant", "unit"]


class TimeGeoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TimeGeo
        fields = ["location", "time"]
