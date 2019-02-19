# TODO: imports pylint lists as unused: datetime, authenticate, login, User
import datetime
import logging

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from woeip.apps.air_quality import dustrak, forms, models
from woeip.apps.core.models import User

logger = logging.getLogger(__name__)


def index(request):
    return render(request, 'index.html')


@login_required
def upload(request):
    """Upload data for a session collected using the Dustrak air quality device and a separate GPS
    log file. Creates a new Session instance, two SessionData instances, and Data instances for
    each sample.
    """

    if request.method == 'POST':
        form = forms.DustrakSessionForm(request.POST, request.FILES)
        if form.is_valid():
            # TODO: Outsource this air quality and gps object creation to factory file
            # (Unsure about this)
            form.save()
            # TODO: Script,from a csv, standardized data for dustrak, gps, and any other
            # objects where the values are already known (such as routes)
            try:
                # TODO: Rather than hardcode the value of the Sensors, present it as an option in
                # the form the client sees. However, have it pre-filled with the pre-loaded objects
                # of Dustrak and GPS. This will also achieve the goal of outsourcing some of the
                # view code to other modules. ie) The object call will be done in the form, instead
                air_sensor = models.Sensor.objects.get(name='Dustrak')
                gps_sensor = models.Sensor.objects.get(name='GPS')

                air_quality = models.SessionData(upload=request.FILES['air_quality'],
                                                 sensor=air_sensor,
                                                 session=form.instance,
                                                 uploaded_by=request.user)
                gps = models.SessionData(upload=request.FILES['gps'],
                                         sensor=gps_sensor,
                                         session=form.instance,
                                         uploaded_by=request.user)

                joined_data = dustrak.join(request.FILES['air_quality'].file,
                                           request.FILES['gps'].file)
            # TODO: Research possible exceptions. Send specific error messages
            except Exception as e:
                messages.add_message(request, messages.ERROR, f'File upload failed, error: {e}')
                return redirect('upload')

            air_quality.save()
            gps.save()
            dustrak.save(joined_data, air_quality)

            messages.add_message(request, messages.SUCCESS, 'Files successfully uploaded')
            return redirect('upload')

    else:
        form = forms.DustrakSessionForm(initial={'collected_by': request.user})

    return render(request, 'upload.html',
                  {'user': request.user, 'form': form})
