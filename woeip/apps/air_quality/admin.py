from django.contrib import admin

from woeip.apps.air_quality.models import Data, Device, Route, Sensor, Session, SessionData

admin.site.register(Route)
admin.site.register(Session)
admin.site.register(Device)
admin.site.register(Sensor)
admin.site.register(SessionData)
admin.site.register(Data)
