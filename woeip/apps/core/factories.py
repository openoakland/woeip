import factory

from woeip.apps.core.models import User


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

    name = factory.Faker('name')
    email = factory.Faker('email')
