# Generated by Django 2.1.11 on 2019-09-18 06:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('air_quality', '0007_auto_20190731_0347'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='collection',
            name='route',
        ),
    ]