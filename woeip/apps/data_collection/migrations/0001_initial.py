# Generated by Django 2.1.3 on 2018-12-17 00:39

import django.contrib.gis.db.models.fields
import django.contrib.postgres.fields.jsonb
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField()),
                ('time', models.DateTimeField()),
                ('latlon', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('manufacturer', models.CharField(max_length=256)),
                ('serial_number', models.CharField(max_length=256)),
                ('model_number', models.CharField(max_length=256)),
                ('calibration_date', models.DateField()),
                ('firmware_version', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('website', models.CharField(max_length=256)),
                ('email', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('email', models.CharField(max_length=256)),
                ('organization', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='data_collection.Organization')),
            ],
        ),
        migrations.CreateModel(
            name='RoleEnum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('can_create', models.BooleanField()),
                ('can_read', models.BooleanField()),
                ('can_update', models.BooleanField()),
                ('can_delete', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='RouteEnum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('latlon', django.contrib.gis.db.models.fields.LineStringField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Sensor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('unit', models.CharField(max_length=256)),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_collection.Device')),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_collected', models.DateTimeField(auto_now_add=True)),
                ('metadata', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('collected_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_collection.Participant')),
                ('route', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='data_collection.RouteEnum')),
            ],
        ),
        migrations.CreateModel(
            name='SessionData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('uri', models.CharField(max_length=256)),
                ('upload_time', models.DateTimeField(auto_now_add=True)),
                ('hash', models.CharField(max_length=256)),
                ('sensor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='data_collection.Sensor')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_collection.Session')),
                ('uploaded_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='data_collection.Participant')),
            ],
        ),
        migrations.AddField(
            model_name='participant',
            name='role',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='data_collection.RoleEnum'),
        ),
        migrations.AddField(
            model_name='organization',
            name='contact',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='contact', related_query_name='contact', to='data_collection.Participant'),
        ),
        migrations.AddField(
            model_name='data',
            name='session_data',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_collection.SessionData'),
        ),
    ]