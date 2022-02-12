from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView
from rest_framework import routers

from .apps.air_quality import views
from .apps.core import views as core_views
from .swagger import urlpatterns as swagger_urlpatterns

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"calibrations", views.CalibrationViewSet)
router.register(r"collection", views.CollectionViewSet)
router.register(r"collection_files", views.CollectionFileViewSet)
router.register(r"devices", views.DeviceViewSet)
router.register(r"pollutant", views.PollutantViewSet)
router.register(r"pollutant_values", views.PollutantValueViewSet)
router.register(r"sensors", views.SensorViewSet)
router.register(r"timegeo", views.TimeGeoViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", admin.site.urls),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
]

urlpatterns += swagger_urlpatterns
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
