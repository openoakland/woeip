from django.contrib import admin
from django.urls import include, path

from .apps.air_quality.views import upload
from .apps.core.views import health

urlpatterns = [
    path('', upload, name='upload'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
]
