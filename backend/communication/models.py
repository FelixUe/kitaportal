from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from kita.models import Kind, Gruppe


class Krankmeldung(models.Model):
    """Ein Kind wird für einen Zeitraum abgemeldet."""

    class Symptom(models.TextChoices):
        FIEBER = "fieber", "Fieber"
        ERKAELTUNG = "erkaeltung", "Erkältung"
        UEBELKEIT = "uebelkeit", "Übelkeit"
        KOPFSCHMERZEN = "kopfschmerzen", "Kopfschmerzen"
        MAGEN_DARM = "magen_darm", "Magen-Darm"
        HUSTEN = "husten", "Husten"
        ARZTTERMIN = "arzttermin", "Arzttermin"
        SONSTIGES = "sonstiges", "Sonstiges"

    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="krankmeldungen")
    gemeldet_von = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    abwesend_ab = models.DateField()
    abwesend_bis = models.DateField(null=True, blank=True)
    symptome = models.JSONField(default=list)  # Liste von Symptom-Werten
    hinweis = models.TextField(blank=True)
    erstellt_am = models.DateTimeField(auto_now_add=True)
    bestaetigt = models.BooleanField(default=False)

    def __str__(self):
        return f"Krankmeldung {self.kind} ab {self.abwesend_ab}"


class Abholerlaubnis(models.Model):
    """Einmalige Abholerlaubnis für eine bestimmte Person an einem Tag."""
    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="abholerlaubnisse")
    erteilt_von = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    abholperson_name = models.CharField(max_length=200)
    datum = models.DateField()
    uhrzeit_ungefaehr = models.TimeField(null=True, blank=True)
    hinweis = models.TextField(blank=True)
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.abholperson_name} holt {self.kind} am {self.datum}"


class Allergie(models.Model):
    """Allergie oder Unverträglichkeit eines Kindes."""

    class Schweregrad(models.TextChoices):
        HOCH = "hoch", "Hoch"
        MITTEL = "mittel", "Mittel"
        BEOBACHTEN = "beobachten", "Beobachten"

    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="allergien")
    bezeichnung = models.CharField(max_length=200)
    schweregrad = models.CharField(max_length=20, choices=Schweregrad.choices)
    ausloser = models.JSONField(default=list)  # Liste von Auslösern
    notfallhinweis = models.TextField(blank=True)
    hinweis        = models.TextField(blank=True)
    geloescht_am   = models.DateTimeField(null=True, blank=True)

    def loeschen(self):
        self.geloescht_am = timezone.now()
        self.save(update_fields=["geloescht_am"])

    def __str__(self):
        return f"{self.bezeichnung} ({self.schweregrad}) – {self.kind}"


class Nachricht(models.Model):
    """Direkte Nachricht zwischen Elternteil und Kita."""
    absender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="gesendete_nachrichten")
    empfaenger_gruppe = models.ForeignKey(Gruppe, on_delete=models.CASCADE, null=True, blank=True)
    betreff = models.CharField(max_length=300, blank=True)
    inhalt = models.TextField()
    erstellt_am = models.DateTimeField(auto_now_add=True)
    gelesen = models.BooleanField(default=False)

    def __str__(self):
        return f"Nachricht von {self.absender} – {self.betreff}"
