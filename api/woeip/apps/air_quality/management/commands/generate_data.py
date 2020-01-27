import datetime
from django.core.management.base import BaseCommand, CommandError

from woeip.apps.air_quality.tests import factories


class Command(BaseCommand):
    help = "Generate mock air quality data."

    def add_arguments(self, parser):
        parser.add_argument(
            "--collections",
            default=3,
            type=int,
            help="number of collections to generate",
        )
        parser.add_argument(
            "--observations",
            default=120,
            type=int,
            help="number of observations per collection to generate",
        )
        pass

    def handle(self, *args, **options):
        self.stdout.write(
            f"Starting to generate {options['observations']} mock observations "
            f"for {options['collections']} collections."
        )

        for i in range(options["collections"]):
            collection_file = factories.CollectionFileFactory()
            pollutant = factories.PollutantFactory()

            # Create series of TimeGeo incrementing by 1 second
            initial_time_geo = factories.TimeGeoFactory(collection_file=collection_file)
            time_geo_series = [initial_time_geo] + [
                factories.TimeGeoFactory(
                    collection_file=collection_file,
                    time=initial_time_geo.time + datetime.timedelta(seconds=j + 1),
                )
                for j in range(options["observations"] - 1)
            ]

            # Generate pollutant values for each TimeGeo
            [
                factories.PollutantValueFactory(
                    collection_file=collection_file,
                    pollutant=pollutant,
                    time_geo=time_geo,
                )
                for time_geo in time_geo_series
            ]

            self.stdout.write(
                f"Generated {len(time_geo_series)} observations "
                f"for collection: {str(collection_file)}, pollutant: {str(pollutant)}."
            )

        self.stdout.write(
            f"Done generating data for {options['collections']} collections."
        )
