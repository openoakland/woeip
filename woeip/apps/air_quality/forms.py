# TODO: Linting marked as unused... BaseInlineFormSet, inlineFormSet
from django import forms
from django.forms.models import BaseInlineFormSet, inlineformset_factory

from woeip.apps.air_quality import models


class SessionForm(forms.ModelForm):
    class Meta:
        model = models.Session
        # TODO: On the client side, create an inteface to guide the user to the
        # correct date format
        fields = ('collected_by', 'date_collected', 'route')


class DustrakSessionForm(SessionForm):
    air_quality = forms.FileField()
    gps = forms.FileField()

    class Meta(SessionForm.Meta):
        # TODO: Advise on the client side that the devices are automatically set
        # to GPS and Dustrak.
        fields = SessionForm.Meta.fields + ('air_quality', 'gps')
