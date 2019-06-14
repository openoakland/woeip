from django import forms

from woeip.apps.air_quality import models


class SessionDataForm(forms.ModelForm):
    """Both an air quality and a gps file are required for initial upload of data"""
    class Meta():
        model = models.SessionData
        fields = ('sensor_file', 'gps_file')

    def __init__(self, *args, **kwargs):
        """Zurb Foundation classes expand the area of the input fields,
        facilitating simple drag-and-drop functionality"""
        super(SessionDataForm, self).__init__(*args, **kwargs)
        for field in ['sensor_file', 'gps_file']:
            self.fields[field].widget.attrs.update({
                'class': 'callout primary large text-center'
                })
