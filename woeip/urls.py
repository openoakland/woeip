from django.contrib import admin
from django.urls import include, path

from .apps.air_quality import views
from .apps.core.views import health

urlpatterns = [
    path('', views.index, name='index'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('files/upload/', views.upload, name='upload'),
    path('health/', health, name='health'),
    path('session/<int:pk>/', views.SessionView.as_view(), name='session'),
]
