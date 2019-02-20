# TODO: imports pylint lists as unused: datetime, authenticate, login, User
import logging

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.shortcuts import redirect, render
from django.utils.encoding import force_text

from woeip.apps.air_quality import dustrak, forms, models

logger = logging.getLogger(__name__)


def index(request):
    return render(request, 'index.html')


@login_required
def upload(request):
    """Upload data for a session collected using the Dustrak air quality device and a separate GPS
    log file. Creates a new Session instance, two SessionData instances, and Data instances for
    each sample.
    """
    tz = 'America/Los_Angeles'
    if request.method == 'POST':
        form = forms.DustrakSessionForm(request.POST, request.FILES)
        if form.is_valid():
            # TODO: Outsource this air quality and gps object creation to factory file
            # (Unsure about this)
            # TODO: Script,from a csv, standardized data for dustrak, gps, and any other
            # objects where the values are already known (such as routes)
            try:
                air_quality_contents = force_text(request.FILES['air_quality'].read())
                air_quality_header, air_quality_data = dustrak.load_dustrak(air_quality_contents, tz)
                gps_contents = force_text(request.FILES['gps'].read())

                with transaction.atomic():
                    form.save()
                    air_sensor = dustrak.get_dustrak_sensor(air_quality_header)
                    air_quality = models.SessionData(upload=request.FILES['air_quality'],
                                                     sensor=air_sensor,
                                                     session=form.instance,
                                                     uploaded_by=request.user)
                    gps_sensor = dustrak.get_gps_sensor()
                    gps = models.SessionData(upload=request.FILES['gps'],
                                             sensor=gps_sensor,
                                             session=form.instance,
                                             uploaded_by=request.user)

                    gps_data = dustrak.load_gps(gps_contents)
                    joined_data = dustrak.join(air_quality_data, gps_data)

                    air_quality.save()
                    gps.save()
                    dustrak.save(joined_data, form.instance)

            # TODO: Research possible exceptions. Send specific error messages
            except Exception as e:
                messages.add_message(request, messages.ERROR, f'File upload failed, error: {e}')
                return redirect('upload')

            messages.add_message(request, messages.SUCCESS, 'Files successfully uploaded')
            return redirect('upload')

    else:
        form = forms.DustrakSessionForm(initial={'collected_by': request.user})

    return render(request, 'upload.html',
                  {'user': request.user, 'form': form})
