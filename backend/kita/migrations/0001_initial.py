import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Kita",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("adresse", models.TextField(blank=True)),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Gruppe",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100)),
                ("kita", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="gruppen", to="kita.kita")),
            ],
        ),
        migrations.CreateModel(
            name="Kind",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("vorname", models.CharField(max_length=100)),
                ("nachname", models.CharField(max_length=100)),
                ("geburtsdatum", models.DateField(blank=True, null=True)),
                ("gruppe", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="kinder", to="kita.gruppe")),
            ],
        ),
        migrations.CreateModel(
            name="Elternteil",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ("kinder", models.ManyToManyField(related_name="eltern", to="kita.kind")),
            ],
        ),
        migrations.CreateModel(
            name="AbholPerson",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("beziehung", models.CharField(blank=True, max_length=100)),
                ("foto_hinterlegt", models.BooleanField(default=False)),
                ("kind", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="abholpersonen", to="kita.kind")),
            ],
        ),
    ]
