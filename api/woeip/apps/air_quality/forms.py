from django import forms
from woeip.apps.air_quality import models


class CollectionForm(forms.ModelForm):
    """Both an air quality and a gps file are required for the new collection."""

    class Meta:
        model = models.Collection
        fields = ("starts_at", "ends_at")
