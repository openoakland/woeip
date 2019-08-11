from django.contrib import admin
from django.urls import include, path

from .apps.air_quality import views
from .apps.core.views import health

urlpatterns = [
    path('', views.Upload.as_view(), name='upload'),
    path('view/', views.ViewCollection.as_view(), name='view'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
]
