from django.contrib import admin
from django.urls import include, path

from .apps.air_quality.views import files, index
from .apps.core.views import health

urlpatterns = [
    path('', index, name='index'),
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('files/', files, name='files')
]
