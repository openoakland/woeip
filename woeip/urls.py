from django.contrib import admin
from django.urls import path, include

from .apps.core.views import health
from .apps.air_quality.views import index, files


urlpatterns = [
	path('', index, name='index'),
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('files/', files, name='files')
]
