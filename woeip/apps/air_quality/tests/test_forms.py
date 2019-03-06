import os

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.utils import timezone

from woeip.apps.air_quality import forms, models
from woeip.apps.air_quality.tests import factories

TEST_DATA = os.path.join(os.path.dirname(__file__), 'data')


def get_filefield(filepath):
    fullpath = os.path.join(TEST_DATA, filepath)
    with open(fullpath, 'rb') as f:
        return SimpleUploadedFile(filepath, f.read())


class DustrakFormTest(TestCase):

    def test_DustrakForm_valid(self):
        user = get_user_model().objects.first()
        route = models.Route.objects.first()
        session = factories.SessionFactory.create(
            collected_by=user,
            date_collected=timezone.now(),
            route=route)
        gps = get_filefield('gps.log')
        air_quality = get_filefield('dustrak.csv')
        form = forms.DustrakSessionForm(
            data={'collected_by': session.collected_by,
                  'date_collected': session.date_collected,
                  'route': session.route,
                  'timezone': timezone.get_default_timezone()},
            files={'air_quality': air_quality,
                   'gps': gps})
        self.assertTrue(form.is_valid())

    # Invalid Form Data
    def test_DustrakFrorm_invalid(self):
        user = get_user_model().objects.first()
        route = models.Route.objects.first()
        form = forms.DustrakSessionForm(
            data={'collected_by': user,
                  'date_collected': timezone.now(),
                  'route': route,
                  'timezone': timezone.get_default_timezone()},
            files={'air_quality': '',
                   'gps': ''})
        self.assertFalse(form.is_valid())
