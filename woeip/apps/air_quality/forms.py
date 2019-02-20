from django import forms

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
