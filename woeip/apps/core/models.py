from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        get_latest_by = 'date_joined'

    email = models.CharField(max_length=256)

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"
