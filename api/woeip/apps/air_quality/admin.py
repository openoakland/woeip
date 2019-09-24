from django.contrib import admin
from woeip.apps.air_quality.models import Calibration
from woeip.apps.air_quality.models import Collection
from woeip.apps.air_quality.models import CollectionFile
from woeip.apps.air_quality.models import Device
from woeip.apps.air_quality.models import Pollutant
from woeip.apps.air_quality.models import PollutantValue
from woeip.apps.air_quality.models import Sensor
from woeip.apps.air_quality.models import TimeGeo

admin.site.register(Calibration)
admin.site.register(Collection)
admin.site.register(CollectionFile)
admin.site.register(Device)
admin.site.register(Pollutant)
admin.site.register(PollutantValue)
admin.site.register(Sensor)
admin.site.register(TimeGeo)
