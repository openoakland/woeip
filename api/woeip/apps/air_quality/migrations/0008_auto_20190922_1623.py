# Generated by Django 2.1.11 on 2019-09-22 16:23
import django.db.models.deletion
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [("air_quality", "0007_auto_20190731_0347")]

    operations = [
        migrations.RemoveField(model_name="collection", name="route"),
        migrations.AlterField(
            model_name="collectionfile",
            name="collection",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="collection_files",
                to="air_quality.Collection",
            ),
        ),
        migrations.AlterField(
            model_name="pollutantvalue",
            name="pollutant",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="pollutant_values",
                to="air_quality.Pollutant",
            ),
        ),
    ]
