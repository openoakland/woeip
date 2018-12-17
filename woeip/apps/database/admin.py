from django.contrib import admin

from woeip.apps.database.models import (
    Data, Device, Organization, Participant, RoleEnum, RouteEnum, Sensor, Session, SessionData
)

admin.site.register(Organization)
admin.site.register(RoleEnum)
admin.site.register(Participant)
admin.site.register(RouteEnum)
admin.site.register(Session)
admin.site.register(Device)
admin.site.register(Sensor)
admin.site.register(SessionData)
admin.site.register(Data)
