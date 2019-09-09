import logging

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.views import View
from rest_framework import generics, viewsets
from rest_framework.decorators import action

from woeip.apps.air_quality.forms import CollectionForm
from woeip.apps.air_quality import models, serializers

logger = logging.getLogger(__name__)


class Upload(LoginRequiredMixin, View):
    def get(self, request):
        """Present file upload form to user"""
        return render(self.request, 'air_quality/upload.html', {
            'form': CollectionForm
        })

    def post(self, request):
        """Save files to SessionData table"""
        files = self.request.FILES
        form = CollectionForm(self.request.POST, files)
        if form.is_valid():
            form.save()
            return redirect('view')
        else:
            messages.add_message(self.request, messages.ERROR, 'File upload error')
            return render(self.request, 'air_quality/upload.html', {
                'form': CollectionForm
            })


class ViewCollection(View):
    """Provide temporary development page to view all uploaded SessionDatas."""
    def get(self, request):
        collection_list = models.Collection.objects.all()
        return render(self.request, 'air_quality/view.html', {
            'collection_list': collection_list
        })


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


class SensorViewSet(viewsets.ModelViewSet):
    queryset = models.Sensor.objects.all()
    serializer_class = serializers.SensorSerializer

    def get_queryset(self):
        queryset = models.Sensor.objects.all()
        sensor_name = self.request.query_params.get("name", None)
        if sensor_name:
            queryset = queryset.filter(name=sensor_name)

        return queryset


class CalibrationViewSet(viewsets.ModelViewSet):
    queryset = models.Calibration.objects.all()
    serializer_class = serializers.CalibrationSerializer

    def get_queryset(self):
        queryset = models.Calibration.objects.all()

        return queryset
