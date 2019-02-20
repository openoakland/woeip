from django import forms

from woeip.apps.air_quality import models


# TODO: Include Sensor fields that are seen by client when uploading the files.
# 1) It is more transparent to the user what data is being loaded and why.
# 2) It is easier to generalize the website, once other sensors are available.
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
        fields = SessionForm.Meta.fields + ('air_quality', 'gps')
