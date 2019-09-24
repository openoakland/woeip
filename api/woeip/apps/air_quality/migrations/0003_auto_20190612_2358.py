# Generated by Django 2.1.7 on 2019-06-12 23:58
import django.db.models.deletion
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [("air_quality", "0002_sessiondata_upload_gps")]

    operations = [
        migrations.AlterField(
            model_name="sessiondata",
            name="session",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="air_quality.Session",
            ),
        )
    ]
