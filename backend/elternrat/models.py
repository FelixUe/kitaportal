from django.db import models
from django.contrib.auth.models import User
from kita.models import Kita


class Projekt(models.Model):
    """Ein Elternrat-Projekt (entspricht einem Board)."""
    kita = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="projekte")
    name = models.CharField(max_length=200)
    beschreibung = models.TextField(blank=True)
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Aufgabe(models.Model):
    """Eine Aufgabe auf dem Kanban-Board."""

    class Status(models.TextChoices):
        BACKLOG = "backlog", "Backlog"
        TODO = "todo", "To Do"
        IN_ARBEIT = "in_arbeit", "In Arbeit"
        FERTIG = "fertig", "Fertig"

    class Prioritaet(models.TextChoices):
        HOCH = "hoch", "Hoch"
        MITTEL = "mittel", "Mittel"
        NIEDRIG = "niedrig", "Niedrig"

    projekt = models.ForeignKey(Projekt, on_delete=models.CASCADE, related_name="aufgaben")
    titel = models.CharField(max_length=300)
    beschreibung = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.BACKLOG)
    prioritaet = models.CharField(max_length=10, choices=Prioritaet.choices, default=Prioritaet.MITTEL)
    verantwortlich = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    faellig_am = models.DateField(null=True, blank=True)
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titel
