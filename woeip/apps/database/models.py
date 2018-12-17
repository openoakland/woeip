from django.contrib.gis.db.models import LineStringField, PointField
from django.contrib.postgres.fields import JSONField
from django.db import models


class Organization(models.Model):
    """An organization, e.g., WOEIP, OpenOakland"""
    name = models.CharField(max_length=256)
    website = models.CharField(max_length=256)
    email = models.CharField(max_length=256)
    contact = models.ForeignKey('Participant',
                                related_name='contact', related_query_name='contact',
                                on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.name} <{self.email}>"


class RoleEnum(models.Model):
    """Create, read, update, delete permissions"""
    name = models.CharField(max_length=256)
    can_create = models.BooleanField()
    can_read = models.BooleanField()
    can_update = models.BooleanField()
    can_delete = models.BooleanField()

    def __str__(self):
        crud = []
        if self.can_create:
            crud.append('create')
        if self.can_read:
            crud.append('read')
        if self.can_update:
            crud.append('update')
        if self.can_delete:
            crud.append('delete')

        crud = '/'.join(crud)

        return f"{self.name} ({crud})"


class Participant(models.Model):
    name = models.CharField(max_length=256)
    email = models.CharField(max_length=256)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, blank=True, null=True)
    role = models.ForeignKey(RoleEnum, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return f"{self.name} <{self.email}> {self.organization} {self.role}"


class RouteEnum(models.Model):
    """Named routes
    """
    name = models.CharField(max_length=256)
    latlon = LineStringField()

    def __str__(self):
        return f"{self.name}"


class Session(models.Model):
    """A single air quality outing. Can link to several SessionData, e.g., raw data files."""
    date_collected = models.DateTimeField(auto_now_add=True)
    route = models.ForeignKey(RouteEnum, on_delete=models.SET_NULL, blank=True, null=True)
    collected_by = models.ForeignKey(Participant, on_delete=models.CASCADE)
    metadata = JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.date_collected} {self.collected_by}"


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
    unit = models.CharField(max_length=256)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.device.name})"


class SessionData(models.Model):
    """The raw data file generated during a session. Assumes one and only one file per sensor,
    although multiple sensors can be linked to one session"""
    uri = models.CharField(max_length=256)
    sensor = models.ForeignKey(Sensor, on_delete=models.SET_NULL, blank=True, null=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    upload_time = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(Participant, on_delete=models.SET_NULL, blank=True, null=True)
    hash = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.session.date_collected} {self.uri}"


class Data(models.Model):
    """A table of all air quality measurements (all sessions). Individual sessions can be extracted
    by filtering on "session"""
    session_data = models.ForeignKey(SessionData, on_delete=models.CASCADE)
    value = models.FloatField()
    time = models.DateTimeField()
    latlon = PointField()
