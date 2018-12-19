from django.contrib import admin

from woeip.apps.air_quality.models import Data, Device, Organization, Participant, Route, Sensor, Session, SessionData

admin.site.register(Organization)
admin.site.register(Participant)
admin.site.register(Route)
admin.site.register(Session)
admin.site.register(Device)
admin.site.register(Sensor)
admin.site.register(SessionData)
admin.site.register(Data)
