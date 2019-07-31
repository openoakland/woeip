from django.contrib import admin

from woeip.apps.air_quality.models import (
	Device,
	Pollutant,
	Sensor,
	Calibration,
	Collection,
	CollectionFile,
)


admin.site.register(Device)
admin.site.register(Pollutant)
admin.site.register(Sensor)
admin.site.register(Calibration)
admin.site.register(Collection)
admin.site.register(CollectionFile)
