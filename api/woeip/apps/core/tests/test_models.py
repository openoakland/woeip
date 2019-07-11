from django.contrib.auth import get_user_model

from .. import models

User = get_user_model()


def test_custom_user_model_configured():
    assert User == models.User


def test_create_custom_user(admin_user):
    # This test creates an admin user and, more importantly, verifies
    # the database is configured correctly for testing.
    assert admin_user.is_authenticated
