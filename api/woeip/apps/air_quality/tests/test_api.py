import pytest
from rest_framework.test import APIRequestFactory

from woeip.apps.air_quality import views
from woeip.apps.air_quality.tests import factories

request_factory = APIRequestFactory()


@pytest.mark.django_db
def test_collection_list():
    collection_file = factories.CollectionFileFactory()
    pollutant = factories.PollutantFactory()

    n_values = 10
    stored_values = []
    for i in range(n_values):
        pollutant_value = factories.PollutantValueFactory(
            collection_file=collection_file,
            pollutant=pollutant,
        )
        stored_values.append(pollutant_value.value)

    request = request_factory.get("collection")

    view = views.CollectionViewSet.as_view({"get": "list"})
    response = view(request)
    assert response.status_code == 200
