from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from .apps.air_quality import views
from .apps.core import views as core_views
from .apps.core.views import health

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'devices', views.DeviceViewSet)
router.register(r'sensors', views.SensorViewSet)
router.register(r'calibrations', views.CalibrationViewSet)
router.register(r'users', core_views.UserViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('view/', views.ViewCollection.as_view(), name='view'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('health/', health, name='health'),
]
