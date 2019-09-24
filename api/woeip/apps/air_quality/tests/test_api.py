from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from woeip.apps.air_quality import views
from woeip.apps.air_quality.tests import factories

request_factory = APIRequestFactory()


class TestCollection(APITestCase):
    def setUp(self):
        self.collection_file = factories.CollectionFileFactory()
        self.pollutant = factories.PollutantFactory()
        self.n_values = 10
        self.test_values = []
        for _ in range(self.n_values):
            pollutant_value = factories.PollutantValueFactory(
                collection_file=self.collection_file, pollutant=self.pollutant
            )
            self.test_values.append(pollutant_value.value)

    def test_get_collection_list(self):  # pylint: disable=no-self-use
        request = request_factory.get("/collection")
        view = views.CollectionViewSet.as_view({"get": "list"})
        response = view(request)
        assert response.status_code == 200

    def test_get_collection_retrieve(self):
        request = request_factory.get("/collection")
        view = views.CollectionViewSet.as_view(actions={"get": "retrieve"})
        response = view(request, pk=self.collection_file.collection.pk)
        assert response.status_code == 200

    def test_get_collection_data(self):
        request = request_factory.get("/collection")
        view = views.CollectionViewSet.as_view(actions={"get": "data"})
        response = view(request, pk=self.collection_file.collection.pk)
        assert response.status_code == 200
        stored_values = [pv["value"] for pv in response.data["pollutant_values"]]
        assert stored_values == self.test_values
