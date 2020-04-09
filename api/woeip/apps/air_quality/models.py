from django.contrib.gis.db.models import PointField
from django.db import models
from woeip.apps.core.models import User


class Device(models.Model):
    """A device is a physical device used for measurement, of e.g.
    location or pollutants. A device may contain multiple sensors.
    """

    name = models.CharField(max_length=256)
    serial = models.CharField(max_length=256)
    firmware = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.name} {self.serial} {self.firmware}"


class Pollutant(models.Model):
    """Pollutants are measured during air quality data collection.
    """

    name = models.CharField(max_length=256)
    description = models.CharField(max_length=1024)

    def __str__(self):
        return self.name


class Sensor(models.Model):
    """A sensor is contained in a device and measures a single pollutant or a
    lonlat location. Multiple sensors may be co-located in a single device.
    """

    name = models.CharField(max_length=256)
    device = models.ForeignKey(Device, null=True, on_delete=models.SET_NULL)
    pollutant = models.ForeignKey(Pollutant, null=True, on_delete=models.SET_NULL)
    unit_choices = (
        ("mg/m3", "mg/m3"),
        ("ppm", "ppm"),
        ("g/m3", "g/m3"),
        ("PM10", "PM10"),
        ("PM2.5", "PM2.5"),
        ("μg/m3", "μg/m3"),
        ("lonlat", "lonlat"),
    )
    unit = models.CharField(
        max_length=256,
        choices=unit_choices,
        help_text="Measurement unit, e.g., mg/m3, ppm, etc.",
    )

    def __str__(self):
        return f"{self.name} ({self.device.name})"


class Calibration(models.Model):
    """A calibration is performed on a sensor by a user.
    """

    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    calibrated_at = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.sensor.name} {self.user.username}: {self.calibrated_at}"


class Collection(models.Model):
    """A collection refers to a single data collection outing. During a
    collection, multiple collection files may be recorded from multiple devices
    and sensors by one or more users.
    """

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()

    def get_sequence(self):
        sequence = (
            Collection.objects.filter(
                starts_at__year=self.starts_at.year,
                starts_at__month=self.starts_at.month,
                starts_at__day=self.starts_at.day,
            )
            .filter(starts_at__lt=self.starts_at)
            .count()
        )
        return sequence


class CollectionFile(models.Model):
    """A collection file refers to a single file recorded during a collection
    that captures data from a single sensor. When the file contents are
    processed, the table is updated with the timestamp and processor version.
    """

    collection = models.ForeignKey(
        Collection, related_name="collection_files", on_delete=models.CASCADE
    )
    sensor = models.ForeignKey(Sensor, null=True, on_delete=models.SET_NULL)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    file = models.FileField(upload_to="data", default="")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processor_version = models.CharField(max_length=256, null=True)
    processed_at = models.DateTimeField(null=True)

    def __str__(self):
        return self.file.name


class TimeGeo(models.Model):
    """Timegeo location datapoints are timestamped lonlat values. Each location
    is extracted from a single collection file.
    """

    collection_file = models.ForeignKey(CollectionFile, on_delete=models.CASCADE)
    location = PointField()
    time = models.DateTimeField()

    def __str__(self):
        return (  # pylint: disable=no-member
            f"{self.time.strftime('%Y-%m-%d %H:%M:%S')} "
            f"({self.location.coords[0]}, {self.location.coords[1]})"
        )


class PollutantValue(models.Model):
    """Pollutant value datapoints are floating point measurements of specific
    pollutants. Each pollutant value is associated with a time_geo value
    (location and timestamp) and is extracted from a single collection file.
    """

    collection_file = models.ForeignKey(CollectionFile, on_delete=models.CASCADE)
    time_geo = models.ForeignKey(TimeGeo, on_delete=models.CASCADE)
    pollutant = models.ForeignKey(
        Pollutant, related_name="pollutant_values", null=True, on_delete=models.SET_NULL
    )
    value = models.FloatField()

    def __str__(self):
        return f"{str(self.time_geo)} " f"{str(self.value)}"
