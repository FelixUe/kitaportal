from django.db import models
from django.contrib.auth.models import User


class Kita(models.Model):
    """Eine Kindertagesstätte."""
    name = models.CharField(max_length=200)
    adresse = models.TextField(blank=True)
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Gruppe(models.Model):
    """Eine Gruppe innerhalb einer Kita (z.B. 'Sonnenvögel')."""
    kita = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="gruppen")
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.kita.name} – {self.name}"


class Kind(models.Model):
    """Ein Kind in der Kita."""
    vorname = models.CharField(max_length=100)
    nachname = models.CharField(max_length=100)
    gruppe = models.ForeignKey(Gruppe, on_delete=models.CASCADE, related_name="kinder")
    geburtsdatum = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.vorname} {self.nachname}"


class Elternteil(models.Model):
    """Verknüpft einen User-Account mit einem oder mehreren Kindern."""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    kinder = models.ManyToManyField(Kind, related_name="eltern")

    def __str__(self):
        return f"Elternteil: {self.user.get_full_name()}"


class AbholPerson(models.Model):
    """Eine Person, die ein Kind abholen darf."""
    kind = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="abholpersonen")
    name = models.CharField(max_length=200)
    beziehung = models.CharField(max_length=100, blank=True)  # z.B. "Oma", "Vater"
    foto_hinterlegt = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.beziehung}) für {self.kind}"
