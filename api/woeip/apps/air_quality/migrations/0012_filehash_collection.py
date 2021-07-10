# Generated by Django 3.1.8 on 2021-06-27 23:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('air_quality', '0011_filehash'),
    ]

    operations = [
        migrations.AddField(
            model_name='filehash',
            name='collection',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='file_hashes', to='air_quality.collection'),
            preserve_default=False,
        ),
    ]
