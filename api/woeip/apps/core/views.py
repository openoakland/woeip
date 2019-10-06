# pylint: disable=too-many-ancestors
from rest_framework import viewsets
from woeip.apps.core import models
from woeip.apps.core import serializers


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        queryset = models.User.objects.all()

        return queryset
