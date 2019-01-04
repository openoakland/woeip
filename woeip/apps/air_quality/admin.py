from django.contrib import admin

from woeip.apps.air_quality.models import Data, Device, Route, Sensor, Session, SessionData


class SessionDataAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'modified', )


admin.site.register(Route)
admin.site.register(Session)
admin.site.register(Device)
admin.site.register(Sensor)
admin.site.register(SessionData, SessionDataAdmin)
admin.site.register(Data)
