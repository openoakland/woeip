import logging

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.views import View
from rest_framework import generics, viewsets
from rest_framework.decorators import action

from woeip.apps.air_quality.forms import CollectionForm
from woeip.apps.air_quality.models import (
    Collection,
    Pollutant,
    Sensor,
)

from woeip.apps.air_quality.serializers import (
    PollutantSerializer,
    SensorSerializer,
)

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
        collection_list = Collection.objects.all()
        return render(self.request, 'air_quality/view.html', {
            'collection_list': collection_list
        })


class SensorViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer

    def get_queryset(self):
        queryset = Sensor.objects.all()
        sensor_name = self.request.query_params.get("name", None)
        if sensor_name:
            queryset = queryset.filter(name=sensor_name)

        return queryset
