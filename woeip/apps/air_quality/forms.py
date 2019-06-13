from django import forms
from pytz import common_timezones

from woeip.apps.air_quality import models

# TODO: Document refactor of form structure
class SessionDataForm(forms.ModelForm):
    class Meta():
        model = models.SessionData
        fields = ('upload', 'upload_gps')

    def __init__(self, *args, **kwargs):
        # TODO: docstring to explain callout is used to expand drag and drop field size
        super(SessionDataForm, self).__init__(*args, **kwargs)
        self.fields['upload'].widget.attrs.update({
            'class': 'callout primary large text-center'
            })        
        self.fields['upload_gps'].widget.attrs.update({
            'class': 'callout primary large text-center'
            })
