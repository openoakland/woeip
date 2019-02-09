import datetime
import logging

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, render

from woeip.apps.air_quality import dustrak, forms, models
from woeip.apps.core.models import User

logger = logging.getLogger(__name__)


def index(request):
    return render(request, 'index.html')


def files(request):
    """Upload data for a session collected using the Dustrak air quality device and a separate GPS
    log file. Creates a new Session instance, two SessionData instances, and Data instances for
    each sample.
    """
    if request.user.is_authenticated:
        if request.method == 'POST':
            form = forms.DustrakSessionForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()

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

                try:
                    joined_data = dustrak.join(request.FILES['air_quality'].file,
                                               request.FILES['gps'].file)
                except Exception as e:
                    messages.add_message(request, messages.ERROR, f'File upload failed, error: {e}')
                    return redirect('files')

                air_quality.save()
                gps.save()
                dustrak.save(joined_data, air_quality)

                messages.add_message(request, messages.SUCCESS, 'Files successfully uploaded')
                return redirect('files')

            else:
                messages.add_message(request, messages.ERROR, f'File upload failed, error: {form.errors}')
                return redirect('files')

        else:
            form = forms.DustrakSessionForm(initial={'collected_by': request.user})

            return render(request, 'files.html',
                          {'user': request.user, 'form': form})

    else:
        messages.add_message(request, messages.WARNING, 'Please log in to continue')
        return redirect(f'/accounts/login?next={request.path}')
