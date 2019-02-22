from django import forms
from pytz import common_timezones

from woeip.apps.air_quality import models


class SessionForm(forms.ModelForm):
    class Meta:
        model = models.Session
        fields = ('collected_by', 'date_collected', 'route')


class DustrakSessionForm(SessionForm):
    air_quality = forms.FileField()
    gps = forms.FileField()
    timezone = forms.ChoiceField(choices=[(x, x) for x in common_timezones], initial='America/Los_Angeles')

    class Meta(SessionForm.Meta):
        fields = SessionForm.Meta.fields + ('air_quality', 'gps', 'timezone')
