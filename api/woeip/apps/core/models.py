from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name)

        user.set_password(password)
        user.save()

        return user

class User(AbstractBaseUser, PermissionsMixin):
    # first_name = models.CharField(
    #     _('first name'),
    #     max_length=30,
    #     blank=True,
    # )
    # last_name = models.CharField(
    #     _('last name'),
    #     max_length=150,
    #     blank=True,
    # )
    # is_staff = models.BooleanField(
    #     _('staff status'),
    #     default=False,
    #     help_text=_(
    #         'Designates whether the user can log into '
    #         'this admin site.'
    #     ),
    # )
    # is_active = models.BooleanField(
    #     _('active'),
    #     default=True,
    #     help_text=_(
    #         'Designates whether this user should be '
    #         'treated as active. Unselect this instead '
    #         'of deleting accounts.'
    #     ),
    # )
    # date_joined = models.DateTimeField(
    #     _('date joined'),
    #     default=timezone.now,
    # )

    # # Additional fields

    objects = UserAccountManager()
    USERNAME_FIELD = 'email'

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    REQUIRED_FIELDS = ['name']

    def get_full_name(self): 
        return self.name
    
    def get_short_name(self):
        return self.name

    def __str__(self):
        return self.email
