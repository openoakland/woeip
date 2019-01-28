import datetime
import logging

from django.contrib.auth import authenticate, login
from django.shortcuts import redirect, render
from woeip.apps.air_quality import dustrak, forms, models
from woeip.apps.core.models import User

logger = logging.getLogger(__name__)


def home(request):
    return render(request, 'air_quality/home.html')


def upload_dustrak(request):
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

                air_quality.save()
                gps.save()

                joined_data = dustrak.join(request.FILES['air_quality'].file,
                                           request.FILES['gps'].file)
                dustrak.save(joined_data, air_quality)

                return render(request, 'air_quality/success_dustrak.html')

            else:
                return render(request, 'air_quality/error_dustrak.html',
                              {'errors': form.errors})

        else:
            form = forms.DustrakSessionForm(initial={'collected_by': request.user})

            return render(request, 'air_quality/upload_dustrak.html',
                          {'user': request.user, 'form': form})

    else:
        return redirect(f'/accounts/login?next={request.path}')
