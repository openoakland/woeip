from django import forms
from pytz import common_timezones

from woeip.apps.air_quality import models


class SessionDataForm(forms.ModelForm):
    class Meta():
        model = models.SessionData
        fields = ('upload', 'upload_gps')

    def __init__(self, *args, **kwargs):
        super(SessionDataForm, self).__init__(*args, **kwargs)
        self.fields['upload'].widget.attrs.update({
            'class': 'callout primary large text-center',
            'text': 'drop here'
            })        
        self.fields['upload_gps'].widget.attrs.update({
            'class': 'callout primary large text-center'
            })
