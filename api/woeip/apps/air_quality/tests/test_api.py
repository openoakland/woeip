import datetime
import logging
import shutil
import tempfile

from django.conf import settings
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from woeip.apps.air_quality import views
from woeip.apps.air_quality.tests import factories

request_factory = APIRequestFactory()


class TestCollection(APITestCase):
    def setUp(self):
        settings._original_media_root = settings.MEDIA_ROOT
        self._temp_media = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self._temp_media

        self.logger = logging.getLogger('django.request')
        self._original_logger_level = self.logger.getEffectiveLevel()
        self.logger.setLevel(logging.ERROR)

        self.collection_file = factories.CollectionFileFactory()
        self.pollutant = factories.PollutantFactory()
        self.n_values = 10
        self.test_values = []
        for _ in range(self.n_values):
            pollutant_value = factories.PollutantValueFactory(
                collection_file=self.collection_file, pollutant=self.pollutant
            )
            self.test_values.append(pollutant_value.value)

    def tearDown(self):
        shutil.rmtree(self._temp_media, ignore_errors=True)
        settings.MEDIA_ROOT = settings._original_media_root
        del settings._original_media_root
        self.logger.setLevel(self._original_logger_level)


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

    def test_create_collection(self):
        """Tests collection create method."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)
        data = {
                "files": [
                    {"file_name": "gps_file.log",
                     "file_data": b"gpsfiledata"},
                    {"file_name": "dustrak_file.csv",
                     "file_data": b"dustrakfiledata"},
                    ],
                "starts_at": starts_at,
                "ends_at": ends_at
            }
        response = self.client.post(
            "/collection", data, format="json")
        assert response.status_code == 201

    def test_create_collection_bad_start(self):
        """Tests that collection creation fails if starts_at is not
        a proper datetime object."""
        starts_at = (2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)
        data = {
                "files": [
                    {"file_name": "gps_file.log",
                     "file_data": b"gpsfiledata"},
                    {"file_name": "dustrak_file.csv",
                     "file_data": b"dustrakfiledata"},
                    ],
                "starts_at": starts_at,
                "ends_at": ends_at
            }
        response = self.client.post(
            "/collection", data, format='json')
        assert response.status_code == 400
        assert response.content.startswith(b'{"starts_at":')


    def test_create_collection_bad_end(self):
        """Tests that collection creation fails if ends_at is not
        a proper datetime object."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = [2019, 1, 1, 14, 15]
        data = {
                "files": [
                    {"file_name": "gps_file.log",
                     "file_data": b"gpsfiledata"},
                    {"file_name": "dustrak_file.csv",
                     "file_data": b"dustrakfiledata"},
                    ],
                "starts_at": starts_at,
                "ends_at": ends_at
            }
        response = self.client.post(
            "/collection", data, format='json')
        assert response.status_code == 400
        assert response.content.startswith(b'{"ends_at":')

    def test_create_collection_bad_files(self):
        """Tests that collection creation fails if files input is incorrect."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)
        files = []
        data = {
                'files': b'bad stuff',
                'starts_at': starts_at,
                'ends_at': ends_at
            },
        response = self.client.post(
            "/collection", data, format='json')
        assert response.status_code == 400
        assert response.content.startswith(b'{"non_field_errors":')

        data = {
                'starts_at': starts_at,
                'ends_at': ends_at
            },
        response = self.client.post(
            "/collection", data, format='json')
        assert response.status_code == 400
        assert response.content.startswith(b'{"non_field_errors":')
