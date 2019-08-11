from django.contrib import admin

from woeip.apps.air_quality.models import Calibration, Collection, CollectionFile, Device, Pollutant, Sensor

admin.site.register(Device)
admin.site.register(Pollutant)
admin.site.register(Sensor)
admin.site.register(Calibration)
admin.site.register(Collection)
admin.site.register(CollectionFile)
