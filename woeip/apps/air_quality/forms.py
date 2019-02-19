## TODO: Linting marked as unused... BaseInlineFormSet, inlineFormSet
from django import forms
from django.forms.models import BaseInlineFormSet, inlineformset_factory

from woeip.apps.air_quality import models


class SessionForm(forms.ModelForm):
    class Meta:
        model = models.Session
        fields = ('collected_by', 'date_collected', 'route')


class DustrakSessionForm(SessionForm):
    air_quality = forms.FileField()
    gps = forms.FileField()

    class Meta(SessionForm.Meta):
        fields = SessionForm.Meta.fields + ('air_quality', 'gps')
