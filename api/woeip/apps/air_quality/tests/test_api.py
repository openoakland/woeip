import datetime
import logging
import random
import shutil
import tempfile

from django.conf import settings
from pathlib import Path
from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from woeip.apps.air_quality import views
from woeip.apps.air_quality.tests import factories


TEST_DATA_DIRECTORY = Path(__file__).parent / "data"
GPS_PATH = TEST_DATA_DIRECTORY / "gps.log"
DUSTRAK_PATH = TEST_DATA_DIRECTORY / "dustrak.csv"
RANDOM_PATH = TEST_DATA_DIRECTORY / "random"


request_factory = APIRequestFactory()


class WoaqAPITestCase(APITestCase):
    def setUp(self):
        settings._original_media_root = settings.MEDIA_ROOT
        self._temp_media = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self._temp_media

        self.logger = logging.getLogger("django.request")
        self._original_logger_level = self.logger.getEffectiveLevel()
        self.logger.setLevel(logging.ERROR)

    def tearDown(self):
        shutil.rmtree(self._temp_media, ignore_errors=True)
        settings.MEDIA_ROOT = settings._original_media_root
        del settings._original_media_root
        self.logger.setLevel(self._original_logger_level)


class TestCollection(WoaqAPITestCase):
    def setUp(self):
        super().setUp()
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

    def test_get_collection_list_date(self):
        request = request_factory.get("/collection?start_date=2014-08-06")
        view = views.CollectionViewSet.as_view({"get": "list"})
        response = view(request)
        assert response.status_code == 200

    def test_get_collection_list_date_error(self):
        request = request_factory.get("/collection?start_date=2014-08")
        view = views.CollectionViewSet.as_view({"get": "list"})
        response = view(request)
        assert response.status_code == 400

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

        with open(GPS_PATH) as gps_file, open(DUSTRAK_PATH) as dustrak_file:
            pollutant = factories.PollutantFactory()

            data = {
                "upload_files": [
                    gps_file,
                    dustrak_file
                ],
                "starts_at": starts_at,
                "ends_at": ends_at,
                "pollutant": pollutant.pk,
            }
            response = self.client.post("/collection", data)
            assert response.status_code == 201

    def test_create_collection_missing_gps(self):
        """Tests collection create method when missing GPS file."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)

        with open(RANDOM_PATH) as random_file, open(DUSTRAK_PATH) as dustrak_file:
            pollutant = factories.PollutantFactory()

            data = {
                "upload_files": [
                    random_file,
                    dustrak_file,
                ],
                "starts_at": starts_at,
                "ends_at": ends_at,
                "pollutant": pollutant.pk,
            }
            response = self.client.post("/collection", data)
            assert response.status_code == 400
            assert response.content.startswith(b'["No GPS file found.')

    def test_create_collection_missing_dustrak(self):
        """Tests collection create method when missing dustrak file."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)

        with open(GPS_PATH) as gps_file, open(RANDOM_PATH) as random_file:
            pollutant = factories.PollutantFactory()

            data = {
                "upload_files": [
                    gps_file,
                    random_file
                ],
                "starts_at": starts_at,
                "ends_at": ends_at,
                "pollutant": pollutant.pk,
            }
            response = self.client.post("/collection", data)
            assert response.status_code == 400
            assert response.content.startswith(b'["No Dustrak file found.')

    def test_create_collection_wrong_number(self):
        """Tests collection create method with wrong number of files."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)

        with open(GPS_PATH) as gps_file, open(DUSTRAK_PATH) as dustrak_file:
            pollutant = factories.PollutantFactory()

            data = {
                "upload_files": [
                    gps_file,
                    gps_file,
                    dustrak_file
                ],
                "starts_at": starts_at,
                "ends_at": ends_at,
                "pollutant": pollutant.pk,
            }
            response = self.client.post("/collection", data, format="json")
            assert response.status_code == 400
            assert b"Please upload exactly 2 files." in response.content

    def test_create_collection_bad_start(self):
        """Tests that collection creation fails if starts_at is not
        a proper datetime object."""
        starts_at = (2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)
        data = {
            "upload_files": [
                {"name": "gps_file.log", "file_data": b"gpsfiledata"},
                {"name": "dustrak_file.csv", "file_data": b"dustrakfiledata"},
            ],
            "starts_at": starts_at,
            "ends_at": ends_at,
        }
        response = self.client.post("/collection", data, format="json")
        assert response.status_code == 400
        assert response.content.startswith(b"""{"starts_at":""")

    def test_create_collection_bad_end(self):
        """Tests that collection creation fails if ends_at is not
        a proper datetime object."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = [2019, 1, 1, 14, 15]
        data = {
            "upload_files": [
                {"name": "gps_file.log", "file_data": b"gpsfiledata"},
                {"name": "dustrak_file.csv", "file_data": b"dustrakfiledata"},
            ],
            "starts_at": starts_at,
            "ends_at": ends_at,
        }
        response = self.client.post("/collection", data, format="json")
        assert response.status_code == 400
        assert response.content.startswith(b"""{"ends_at":""")

    def test_create_collection_bad_files(self):
        """Tests that collection creation fails if files input is incorrect."""
        starts_at = datetime.datetime(2019, 1, 1, 10, 15)
        ends_at = datetime.datetime(2019, 1, 1, 14, 15)
        data = (
            {"upload_files": b"bad stuff", "starts_at": starts_at, "ends_at": ends_at},
        )
        response = self.client.post("/collection", data, format="json")
        assert response.status_code == 400
        assert response.content.startswith(b"""{"non_field_errors":""")

        data = ({"starts_at": starts_at, "ends_at": ends_at},)
        response = self.client.post("/collection", data, format="json")
        assert response.status_code == 400
        assert response.content.startswith(b"""{"non_field_errors":""")


class TestCollectionSequence(WoaqAPITestCase):
    def setUp(self):
        super().setUp()
        starts_at = datetime.datetime(
            random.randint(2000, 2019),
            random.randint(1, 12),
            random.randint(1, 28),
            random.randint(2, 22),
            00,
            00,
            tzinfo=datetime.timezone.utc,
        )
        self.collection = factories.CollectionFactory(starts_at=starts_at)
        minute_interval = random.randint(1, 60)
        self.collection_samedate = factories.CollectionFactory(
            starts_at=self.collection.starts_at
            + datetime.timedelta(minutes=minute_interval)
        )
        day_interval = random.randint(1, 100) * random.choice([-1, 1])
        self.collection_diffdate = factories.CollectionFactory(
            starts_at=self.collection.starts_at + datetime.timedelta(days=day_interval)
        )

    def test_collection_sequence(self):
        request = request_factory.get("/collection")
        view = views.CollectionViewSet.as_view(actions={"get": "sequence"})
        response = view(request, pk=self.collection.pk)
        assert "sequence" in response.data
        assert response.data["sequence"] == 0

        response = view(request, pk=self.collection_samedate.pk)
        assert "sequence" in response.data
        assert response.data["sequence"] == 1

        response = view(request, pk=self.collection_diffdate.pk)
        assert "sequence" in response.data
        assert response.data["sequence"] == 0
