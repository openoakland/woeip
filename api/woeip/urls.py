from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from .apps.air_quality import views
from .apps.core import views as core_views
from .apps.core.views import health

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'calibrations', views.CalibrationViewSet)
router.register(r'collection', views.CollectionViewSet)
router.register(r'collection_files', views.CollectionFileViewSet)
router.register(r'devices', views.DeviceViewSet)
router.register(r'pollutant', views.PollutantViewSet)
router.register(r'pollutant_values', views.PollutantValueViewSet)
router.register(r'sensors', views.SensorViewSet)
router.register(r'timegeo', views.TimeGeoViewSet)
router.register(r'users', core_views.UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
