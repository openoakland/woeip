import pytest
from rest_framework.test import APIRequestFactory

from woeip.apps.air_quality import views
from woeip.apps.air_quality.tests import factories

request_factory = APIRequestFactory()


@pytest.mark.django_db
def test_collection():
    collection_file = factories.CollectionFileFactory()
    pollutant = factories.PollutantFactory()

    n_values = 10
    test_values = []
    for _ in range(n_values):
        pollutant_value = factories.PollutantValueFactory(
            collection_file=collection_file,
            pollutant=pollutant,
        )
        test_values.append(pollutant_value.value)

    request = request_factory.get("/collection")
    view = views.CollectionViewSet.as_view({"get": "list"})
    response = view(request)
    assert response.status_code == 200

    request = request_factory.get("/collection")
    view = views.CollectionViewSet.as_view(actions={"get": "retrieve"})
    response = view(request, pk=collection_file.collection.pk)
    assert response.status_code == 200

    request = request_factory.get("/collection")
    view = views.CollectionViewSet.as_view(actions={"get": "data"})
    response = view(request, pk=collection_file.collection.pk)
    assert response.status_code == 200

    stored_values = response.data["pollutant_values"]
    for (test_value, stored_value) in zip(test_values, stored_values):
        assert test_value == stored_value["value"]
