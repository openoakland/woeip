import logging

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect, render
from django.views import View
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from woeip.apps.air_quality import models, serializers
from woeip.apps.air_quality.forms import CollectionForm

logger = logging.getLogger(__name__)


class CalibrationViewSet(viewsets.ModelViewSet):
    queryset = models.Calibration.objects.all()
    serializer_class = serializers.CalibrationSerializer

    def get_queryset(self):
        queryset = models.Calibration.objects.all()

        return queryset


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = models.Collection.objects.all()
    serializer_class = serializers.CollectionSerializer

    @action(detail=True, methods=["GET"])
    def geo(self, request, pk=None):
        collection = get_object_or_404(self.queryset, pk=pk)
        pollutant_values = models.PollutantValue.objects.filter(
            collection_file__collection=collection,
        )
        serializer = serializers.CollectionGeoSerializer(
            {
                "metadata": collection,
                "pollutant_values": pollutant_values
            },
            context={"request": request},
        )

        return Response(serializer.data)


class CollectionFileViewSet(viewsets.ModelViewSet):
    queryset = models.CollectionFile.objects.all()
    serializer_class = serializers.CollectionFileSerializer

    def get_queryset(self):
        queryset = models.CollectionFile.objects.all()

        return queryset


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = models.Device.objects.all()
    serializer_class = serializers.DeviceSerializer

    def get_queryset(self):
        queryset = models.Device.objects.all()
        device_name = self.request.query_params.get("name", None)
        if device_name:
            queryset = queryset.filter(name=device_name)

        serial = self.request.query_params.get("serial", None)
        if serial:
            queryset = queryset.filter(serial=serial)

        return queryset


class PollutantViewSet(viewsets.ModelViewSet):
    queryset = models.Pollutant.objects.all()
    serializer_class = serializers.PollutantSerializer


class PollutantValueViewSet(viewsets.ModelViewSet):
    queryset = models.PollutantValue.objects.all()
    serializer_class = serializers.PollutantValueSerializer


class SensorViewSet(viewsets.ModelViewSet):
    queryset = models.Sensor.objects.all()
    serializer_class = serializers.SensorSerializer

    def get_queryset(self):
        queryset = models.Sensor.objects.all()
        sensor_name = self.request.query_params.get("name", None)
        if sensor_name:
            queryset = queryset.filter(name=sensor_name)

        return queryset


class TimeGeoViewSet(viewsets.ModelViewSet):
    queryset = models.TimeGeo.objects.all()
    serializer_class = serializers.TimeGeoSerializer
