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
            name="Krankmeldung",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("abwesend_ab", models.DateField()),
                ("abwesend_bis", models.DateField(blank=True, null=True)),
                ("symptome", models.JSONField(default=list)),
                ("hinweis", models.TextField(blank=True)),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
                ("bestaetigt", models.BooleanField(default=False)),
                ("kind", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="krankmeldungen", to="kita.kind")),
                ("gemeldet_von", models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Abholerlaubnis",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("abholperson_name", models.CharField(max_length=200)),
                ("datum", models.DateField()),
                ("uhrzeit_ungefaehr", models.TimeField(blank=True, null=True)),
                ("hinweis", models.TextField(blank=True)),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
                ("kind", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="abholerlaubnisse", to="kita.kind")),
                ("erteilt_von", models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Allergie",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("bezeichnung", models.CharField(max_length=200)),
                ("schweregrad", models.CharField(
                    choices=[("hoch", "Hoch"), ("mittel", "Mittel"), ("beobachten", "Beobachten")],
                    max_length=20,
                )),
                ("ausloser", models.JSONField(default=list)),
                ("notfallhinweis", models.TextField(blank=True)),
                ("hinweis", models.TextField(blank=True)),
                ("kind", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="allergien", to="kita.kind")),
            ],
        ),
        migrations.CreateModel(
            name="Nachricht",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("betreff", models.CharField(blank=True, max_length=300)),
                ("inhalt", models.TextField()),
                ("erstellt_am", models.DateTimeField(auto_now_add=True)),
                ("gelesen", models.BooleanField(default=False)),
                ("absender", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="gesendete_nachrichten", to=settings.AUTH_USER_MODEL)),
                ("empfaenger_gruppe", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to="kita.gruppe")),
            ],
        ),
    ]
