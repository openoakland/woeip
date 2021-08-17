from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from woeip.apps.core.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm


admin.site.register(User, UserAdmin)
