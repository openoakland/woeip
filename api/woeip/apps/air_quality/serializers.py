# pylint: disable=abstract-method
from django.core.files.base import ContentFile
from rest_framework import serializers, exceptions
from woeip.apps.air_quality.dustrak import (
    load_dustrak,
    load_gps,
    join as join_dustrak,
    save as save_dustrak,
)
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
        fields = ["id", "name", "description"]


class PollutantValueSerializer(serializers.ModelSerializer):
    time_geo = serializers.StringRelatedField()
    pollutant = serializers.StringRelatedField()

    class Meta:
        model = PollutantValue
        fields = ["time_geo", "pollutant", "value"]


class CollectionSerializer(serializers.HyperlinkedModelSerializer):
    upload_files = serializers.ListField(write_only=True, required=False)
    pollutant = serializers.PrimaryKeyRelatedField(
        queryset=Pollutant.objects.all(), write_only=True, required=True
    )

    class Meta:
        model = Collection
        fields = [
            "id",
            "starts_at",
            "ends_at",
            "collection_files",
            "upload_files",
            "pollutant",
        ]
        extra_kwargs = {"collection_files": {"required": False}}

    def create(self, validated_data):
        # Assert that there are exactly two uploaded files
        # Currently we only handles the exactly-two case
        num_upload_files = len(validated_data.get("upload_files", []))
        if num_upload_files != 2:
            raise exceptions.ValidationError(
                detail=(
                    "Only a single pair of GPS/Dustrak files is currently supported. "
                    + f"Please upload exactly 2 files. You uploaded {num_upload_files}."
                )
            )

        collection = Collection.objects.create(
            starts_at=validated_data.get("starts_at"),
            ends_at=validated_data.get("ends_at"),
        )

        collection_files = []
        for upload_file in validated_data.pop("upload_files", []):
            collection_file = CollectionFile.objects.create(collection=collection)
            collection_file.file.save(
                upload_file["file_name"], ContentFile(upload_file["file_data"])
            )
            collection_files.append(collection_file)

        dustrak_df = None
        gps_df = None
        dustrak_exception = None
        gps_exception = None
        for collection_file in collection_files:
            if "dustrak" in str(collection_file.file.path):
                try:
                    dustrak_file = collection_file
                    dustrak_metadata, dustrak_df = load_dustrak(
                        dustrak_file.file.path, tz="America/Los_Angeles"
                    )
                except Exception as e:
                    dustrak_exception = e
                    continue
            elif "gps" in str(collection_file.file.path):
                try:
                    gps_file = collection_file
                    gps_df = load_gps(gps_file.file.path)
                except Exception as e:
                    gps_exception = e
                    continue

        # Error messages if parsing failed
        errors = []
        if dustrak_df is None and dustrak_exception is None:
            errors.append(
                "No Dustrak file found. "
                + "Please upload a Dustrak file with 'dustrak' in the filename. "
            )
        elif dustrak_exception is not None:
            errors.append(
                f"Dustrak file failed to process with: {repr(dustrak_exception)}"
            )

        # Error messages if parsing failed
        if gps_df is None and gps_exception is None:
            errors.append(
                "No GPS file found. "
                + "Please upload a GPS file with 'gps' in the filename. "
            )
        elif gps_exception is not None:
            errors.append(f"GPS file failed to process with: {repr(gps_exception)}")

        if len(errors) > 0:
            raise exceptions.ValidationError(detail=errors)

        joined_df = join_dustrak(air_quality=dustrak_df, gps=gps_df)
        save_dustrak(
            joined_data=joined_df,
            gps_collection_file=gps_file,
            pollutant_collection_file=dustrak_file,
            pollutant=validated_data.pop("pollutant"),
        )

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
