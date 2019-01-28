from django.contrib import admin
from django.urls import path, include

from .apps.core.views import health
from .apps.air_quality.views import home, upload_dustrak


urlpatterns = [
	path('', home, name='home'),
    path('health/', health, name='health'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('upload_dustrak/', upload_dustrak, name='upload_dustrak')
]
