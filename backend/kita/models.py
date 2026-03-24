import secrets

from django.conf import settings
from django.db import models
from django.utils import timezone


class Rolle(models.TextChoices):
    ELTERNTEIL  = "elternteil",        "Elternteil"
    GRUPPENM    = "gruppenmitarbeiter", "Gruppenmitarbeiter*in"
    LEITUNG     = "leitung",           "Kita-Leitung"
    ER_MITGLIED = "er_mitglied",       "Elternrat-Mitglied"
    ER_ADMIN    = "er_admin",          "Elternrat-Admin"


class Kita(models.Model):
    """Eine Kindertagesstätte."""
    name        = models.CharField(max_length=200)
    adresse     = models.TextField(blank=True)
    erstellt_am = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Gruppe(models.Model):
    """Eine Gruppe innerhalb einer Kita (z.B. 'Sonnenvögel')."""
    kita        = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="gruppen")
    name        = models.CharField(max_length=100)
    mitarbeiter = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="gruppen",
        blank=True,
        verbose_name="Mitarbeiter*innen",
    )

    def __str__(self):
        return f"{self.kita.name} – {self.name}"


class Kind(models.Model):
    """Ein Kind in der Kita."""
    vorname      = models.CharField(max_length=100)
    nachname     = models.CharField(max_length=100)
    gruppe       = models.ForeignKey(Gruppe, on_delete=models.CASCADE, related_name="kinder")
    geburtsdatum = models.DateField(null=True, blank=True)
    elternteile  = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="kinder",
        blank=True,
        verbose_name="Elternteile",
    )

    def __str__(self):
        return f"{self.vorname} {self.nachname}"


class Elternteil(models.Model):
    """Legacy-Verknüpfung User ↔ Kind. Wird durch Kind.elternteile abgelöst."""
    user   = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    kinder = models.ManyToManyField(Kind, related_name="eltern")

    def __str__(self):
        return f"Elternteil: {self.user.get_full_name()}"


class AbholPerson(models.Model):
    """Eine Person, die ein Kind abholen darf."""
    kind            = models.ForeignKey(Kind, on_delete=models.CASCADE, related_name="abholpersonen")
    name            = models.CharField(max_length=200)
    beziehung       = models.CharField(max_length=100, blank=True)
    telefon         = models.CharField(max_length=50, blank=True)
    foto_hinterlegt = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.beziehung}) für {self.kind}"


class BenutzerProfil(models.Model):
    """Profil mit Rollen für jeden User. Rollen als JSON-Liste gespeichert."""
    benutzer = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profil",
    )
    kita  = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="profile")
    rollen = models.JSONField(
        default=list,
        help_text='Liste von Rollenwerten, z.B. ["elternteil", "er_mitglied"]',
    )

    class Meta:
        verbose_name = "Benutzerprofil"
        verbose_name_plural = "Benutzerprofile"

    def hat_rolle(self, *rollen):
        """True wenn der Benutzer mindestens eine der angegebenen Rollen hat."""
        return any(r in (self.rollen or []) for r in rollen)

    def __str__(self):
        return f"{self.benutzer.get_full_name() or self.benutzer.email} ({', '.join(self.rollen)})"


class EinladungsCode(models.Model):
    """Einmaliger oder mehrfach verwendbarer Code zur Selbstregistrierung."""
    kita             = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="einladungscodes")
    gruppe           = models.ForeignKey(
        Gruppe, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="einladungscodes",
    )
    code             = models.CharField(max_length=20, unique=True, blank=True)
    erstellt_von     = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name="erstellte_codes",
    )
    erstellt_am      = models.DateTimeField(auto_now_add=True)
    gueltig_bis      = models.DateTimeField(null=True, blank=True)
    max_verwendungen = models.PositiveIntegerField(
        default=0,
        help_text="0 = unbegrenzt",
    )
    verwendungen     = models.PositiveIntegerField(default=0)
    aktiv            = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Einladungscode"
        verbose_name_plural = "Einladungscodes"
        ordering = ["-erstellt_am"]

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = secrets.token_urlsafe(8).upper()[:10]
        super().save(*args, **kwargs)

    def ist_gueltig(self):
        if not self.aktiv:
            return False
        if self.gueltig_bis and timezone.now() > self.gueltig_bis:
            return False
        if self.max_verwendungen > 0 and self.verwendungen >= self.max_verwendungen:
            return False
        return True

    def __str__(self):
        gruppe = self.gruppe.name if self.gruppe else "Alle Gruppen"
        return f"{self.code} – {gruppe} ({'aktiv' if self.aktiv else 'inaktiv'})"
