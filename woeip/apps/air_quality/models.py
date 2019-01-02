import os.path as op

from django.contrib.gis.db.models import LineStringField, PointField
from django.db import models

from woeip.apps.core.models import User


class Route(models.Model):
    name = models.CharField(max_length=256, unique=True)
    path = LineStringField()

    def __str__(self):
        return self.name


class Device(models.Model):
    name = models.CharField(max_length=256)
    manufacturer = models.CharField(max_length=256)
    serial_number = models.CharField(max_length=256)
    model_number = models.CharField(max_length=256)
    calibration_date = models.DateField()
    firmware_version = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.name} {self.model_number} {self.serial_number}"


class Sensor(models.Model):
    """A sensor is something that measures something, i.e., it produces a single measurement value
    at a time.
    """
    name = models.CharField(max_length=256)
    unit = models.CharField(max_length=256,
                            help_text="Measurement unit, e.g., mg/m3, ppm, etc.")
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.device.name})"


class Session(models.Model):
    """A single air quality outing. Can link to several SessionData, e.g., raw data files."""
    date_collected = models.DateTimeField()
    route = models.ForeignKey(Route, on_delete=models.SET_NULL, blank=True, null=True)
    collected_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.date_collected} {self.collected_by}"


class SessionData(models.Model):
    """The raw data file generated during a session. Assumes one and only one file per sensor,
    although multiple sensors can be linked to one session"""
    upload = models.FileField(upload_to='session_data/')
    sensor = models.ForeignKey(Sensor, on_delete=models.SET_NULL, blank=True, null=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    upload_time = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        unique_together = ('sensor', 'session')

    def __str__(self):
        name = op.basename(self.upload.name)
        return f"{self.session.date_collected} {name}"


class Data(models.Model):
    """A table of all air quality measurements (all sessions). Individual sessions can be extracted
    by filtering on "session"""
    session_data = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    value = models.FloatField()
    time = models.DateTimeField()
    latlon = PointField()
