import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("kita", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Gruppe.mitarbeiter M2M
        migrations.AddField(
            model_name="gruppe",
            name="mitarbeiter",
            field=models.ManyToManyField(
                blank=True,
                related_name="gruppen",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Mitarbeiter*innen",
            ),
        ),
        # Kind.elternteile M2M
        migrations.AddField(
            model_name="kind",
            name="elternteile",
            field=models.ManyToManyField(
                blank=True,
                related_name="kinder",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Elternteile",
            ),
        ),
        # AbholPerson.telefon
        migrations.AddField(
            model_name="abholperson",
            name="telefon",
            field=models.CharField(blank=True, max_length=50),
        ),
        # BenutzerProfil
        migrations.CreateModel(
            name="BenutzerProfil",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("rollen", models.JSONField(
                    default=list,
                    help_text='Liste von Rollenwerten, z.B. ["elternteil", "er_mitglied"]',
                )),
                ("benutzer", models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="profil",
                    to=settings.AUTH_USER_MODEL,
                )),
                ("kita", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="profile",
                    to="kita.kita",
                )),
            ],
            options={
                "verbose_name": "Benutzerprofil",
                "verbose_name_plural": "Benutzerprofile",
            },
        ),
        # EinladungsCode
        migrations.CreateModel(
            name="EinladungsCode",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(blank=True, max_length=20, unique=True)),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
                ("gueltig_bis", models.DateTimeField(blank=True, null=True)),
                ("max_verwendungen", models.PositiveIntegerField(
                    default=0,
                    help_text="0 = unbegrenzt",
                )),
                ("verwendungen", models.PositiveIntegerField(default=0)),
                ("aktiv", models.BooleanField(default=True)),
                ("erstellt_von", models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="erstellte_codes",
                    to=settings.AUTH_USER_MODEL,
                )),
                ("gruppe", models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="einladungscodes",
                    to="kita.gruppe",
                )),
                ("kita", models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="einladungscodes",
                    to="kita.kita",
                )),
            ],
            options={
                "verbose_name": "Einladungscode",
                "verbose_name_plural": "Einladungscodes",
                "ordering": ["-erstellt_am"],
            },
        ),
    ]
