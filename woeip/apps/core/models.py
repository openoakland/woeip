from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        get_latest_by = 'date_joined'
