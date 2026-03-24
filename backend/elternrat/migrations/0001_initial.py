import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("kita", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Projekt",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=200)),
                ("beschreibung", models.TextField(blank=True)),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
                ("kita", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="projekte", to="kita.kita")),
            ],
        ),
        migrations.CreateModel(
            name="Aufgabe",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("titel", models.CharField(max_length=300)),
                ("beschreibung", models.TextField(blank=True)),
                ("status", models.CharField(
                    choices=[("backlog", "Backlog"), ("todo", "To Do"), ("in_arbeit", "In Arbeit"), ("fertig", "Fertig")],
                    default="backlog",
                    max_length=20,
                )),
                ("prioritaet", models.CharField(
                    choices=[("hoch", "Hoch"), ("mittel", "Mittel"), ("niedrig", "Niedrig")],
                    default="mittel",
                    max_length=10,
                )),
                ("faellig_am", models.DateField(blank=True, null=True)),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
                ("projekt", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="aufgaben", to="elternrat.projekt")),
                ("verantwortlich", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
