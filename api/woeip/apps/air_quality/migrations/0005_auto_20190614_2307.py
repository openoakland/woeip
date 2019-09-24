# Generated by Django 2.1.7 on 2019-06-14 23:07
from django.db import migrations
from django.db import models


class Migration(migrations.Migration):

    dependencies = [("air_quality", "0004_auto_20190613_0043")]

    operations = [
        migrations.RemoveField(model_name="sessiondata", name="upload"),
        migrations.RemoveField(model_name="sessiondata", name="upload_gps"),
        migrations.AddField(
            model_name="sessiondata",
            name="gps_file",
            field=models.FileField(default="", upload_to="gps_files"),
        ),
        migrations.AddField(
            model_name="sessiondata",
            name="sensor_file",
            field=models.FileField(default="", upload_to="sensor_files"),
        ),
    ]
