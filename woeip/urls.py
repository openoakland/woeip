from django.contrib import admin
from django.urls import include, path

from .apps.air_quality.views import index, upload
from .apps.core.views import health

urlpatterns = [
    path('', index, name='index'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('files/upload/', upload, name='upload'),
    path('health/', health, name='health'),
]
