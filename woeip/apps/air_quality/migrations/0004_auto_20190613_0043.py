# Generated by Django 2.1.7 on 2019-06-13 00:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('air_quality', '0003_auto_20190612_2358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sessiondata',
            name='upload_gps',
            field=models.FileField(default='', upload_to='session_gps_data'),
        ),
    ]