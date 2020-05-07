# pylint: disable=abstract-method
import os
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

        # Basic validation that we have the right files
        upload_files = validated_data.pop("upload_files", [])
        # Assert that there are exactly two uploaded files
        # Currently we only handles the exactly-two case
        num_upload_files = len(upload_files)
        if num_upload_files != 2:
            raise exceptions.ValidationError(
                detail=(
                    "Only a single pair of GPS/Dustrak files is currently supported. "
                    + f"Please upload exactly 2 files. You uploaded {num_upload_files}."
                )
            )

        # Check that we have a dustrak file and a gps file
        dustrak_upload_file = None
        gps_upload_file = None
        missing_file_errors = []
        for upload_file in upload_files:
            file_name = upload_file.name
            _, file_ext = os.path.splitext(file_name)
            if file_ext == '.csv':
                dustrak_upload_file = upload_file
            elif file_ext == '.log':
                gps_upload_file = upload_file
        if dustrak_upload_file is None:
            missing_file_errors.append(
                "No Dustrak file found. "
                + "Please upload a Dustrak file with a .csv extension. "
            )
        if gps_upload_file is None:
            missing_file_errors.append(
                "No GPS file found. "
                + "Please upload a GPS file with a .log extension. "
            )
        if len(missing_file_errors) > 0:
            raise exceptions.ValidationError(detail=missing_file_errors)

        # Now that we've validated the basics, create Collection and try to process
        collection = Collection.objects.create(
            starts_at=validated_data.get("starts_at"),
            ends_at=validated_data.get("ends_at"),
        )

        ## Create Collection, safe files, read into dataframe ##

        parsing_errors = []

        # Save CollectionFile and process for Dustrak
        dustrak_collection_file = CollectionFile.objects.create(collection=collection)
        dustrak_collection_file.file.save(
            dustrak_upload_file.name,
            dustrak_upload_file,
        )
        dustrak_df = None  # need this to break out of try scope
        try:
            dustrak_metadata, dustrak_df = load_dustrak(
                dustrak_collection_file.file.path, tz="America/Los_Angeles"
            )
        except Exception as e:
            parsing_errors.append(f"Dustrak file failed to process with: {repr(e)}")

        # Save CollectionFile and process for GPS
        gps_collection_file = CollectionFile.objects.create(collection=collection)
        gps_collection_file.file.save(
            gps_upload_file.name, gps_upload_file,
        )
        gps_df = None  # need this to break out of try scope
        try:
            gps_df = load_gps(gps_collection_file.file.path)
        except Exception as e:
            parsing_errors.append(f"GPS file failed to process with: {repr(e)}")

        if len(parsing_errors) > 0:
            raise exceptions.ValidationError(detail=parsing_errors)

        ## Join two dataframes ###

        joined_df = join_dustrak(air_quality=dustrak_df, gps=gps_df)
        save_dustrak(
            joined_data=joined_df,
            gps_collection_file=gps_collection_file,
            pollutant_collection_file=dustrak_collection_file,
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
