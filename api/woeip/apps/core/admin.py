from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from woeip.apps.core.models import User
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

class UserAdmin(BaseUserAdmin):
    # add_form =  UserCreationForm
    model = User

    list_display = ('first_name', 'last_name', 'email', 'is_staff')
    list_filter = ('is_staff',)

    fieldsets = (
        (None, {'fields': ('first_name','last_name','email','password')}),

        ('Permissions', {'fields': ('is_staff',)}),
    )

    search_fields =  ('first_name', 'last_name', 'email')
    ordering = ('last_name','email')

    filter_horizontal = ()

admin.site.register(User, UserAdmin)
