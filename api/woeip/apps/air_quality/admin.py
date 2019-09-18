from django.contrib import admin

from woeip.apps.air_quality.models import (
    Calibration, Collection, CollectionFile, Device, Pollutant, PollutantValue, Sensor, TimeGeo
)

admin.site.register(Calibration)
admin.site.register(Collection)
admin.site.register(CollectionFile)
admin.site.register(Device)
admin.site.register(Pollutant)
admin.site.register(PollutantValue)
admin.site.register(Sensor)
admin.site.register(TimeGeo)
