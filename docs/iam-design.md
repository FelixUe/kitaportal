# IAM-Design – KitaPortal

Dieses Dokument beschreibt das vollständige Rollen- und Rechtesystem (Identity & Access Management) für KitaPortal. Es dient als verbindliche Grundlage für alle Backend- und Frontend-Implementierungen.

---

## 1. Rollen

### 1.1 Elternteil
Die Standardrolle für alle Erziehungsberechtigten.

- Sieht ausschließlich die eigenen Kinder (verknüpft über `Kind.elternteile`)
- Kann Krankmeldungen für eigene Kinder einreichen
- Kann Abholerlaubnisse für eigene Kinder erteilen
- Kann Allergien und Unverträglichkeiten für eigene Kinder pflegen
- Kann Nachrichten an die Gruppe(n) der eigenen Kinder senden
- Kann Vorschläge im Elternrat einreichen (Karten erstellen), aber keine fremden Karten bearbeiten oder löschen

### 1.2 Gruppenmitarbeiter\*in
Erzieher\*innen und pädagogisches Fachpersonal, einer oder mehreren Gruppen zugewiesen.

- Sieht alle Kinder der eigenen zugewiesenen Gruppe(n)
- Kann Krankmeldungen der eigenen Gruppe(n) einsehen und bestätigen
- Sieht alle Abholerlaubnisse des heutigen Tages für die eigene Gruppe
- Sieht alle Allergien und Unverträglichkeiten der Kinder in der eigenen Gruppe
- Kann Nachrichten an Eltern der eigenen Gruppe senden
- Kann das Küchen-Handout für die eigene Gruppe anzeigen
- Kein Zugriff auf andere Gruppen, keine Benutzerverwaltung

### 1.3 Kita-Leitung
Vollzugriff auf alle Daten der Kita.

- Sieht alle Gruppen, alle Kinder, alle Krankmeldungen, alle Abholerlaubnisse und alle Allergien
- Kann Benutzer anlegen, bearbeiten, deaktivieren und Rollen zuweisen
- Sieht Statistiken und Auswertungen (z.B. Krankenquote, häufigste Symptome)
- Kann das vollständige Küchen-Handout aller Gruppen exportieren
- Hat vollen Zugriff auf alle Nachrichten-Threads
- Hat Lesezugriff auf das Elternrat-Board

### 1.4 Elternrat-Mitglied
Ergänzungsrolle zu Elternteil (wird zusätzlich vergeben).

- Kann das vollständige Elternrat-Board (alle Spalten und Karten) lesen
- Kann Kommentare zu bestehenden Karten hinzufügen
- Kann eigene Karten in allen Spalten erstellen

### 1.5 Elternrat-Admin
Ergänzungsrolle zu Elternrat-Mitglied (wird zusätzlich vergeben).

- Kann beliebige Karten erstellen, bearbeiten und löschen
- Kann Karten zwischen Spalten verschieben (Status ändern)
- Kann Sprints/Projekte anlegen und abschließen
- Kann andere Benutzer als Elternrat-Mitglied hinzufügen oder entfernen

---

## 2. Berechtigungsmatrix

| Feature | Elternteil | Gruppenm.\* | Kita-Leitung | ER-Mitglied | ER-Admin |
|---|---|---|---|---|---|
| **Krankmeldung** | | | | | |
| – Erstellen (eigene Kinder) | Schreiben | — | — | Schreiben | Schreiben |
| – Lesen (eigene Kinder) | Lesen | — | — | Lesen | Lesen |
| – Lesen (Gruppe) | — | Lesen | Lesen | — | — |
| – Bestätigen | — | Schreiben | Schreiben | — | — |
| – Alle lesen | — | — | Admin | — | — |
| **Abholung** | | | | | |
| – Erlaubnis erteilen (eigene Kinder) | Schreiben | — | — | Schreiben | Schreiben |
| – Abholpersonen verwalten (eigene Kinder) | Schreiben | — | — | Schreiben | Schreiben |
| – Heutige Erlaubnisse (Gruppe) | — | Lesen | Lesen | — | — |
| – Alle Erlaubnisse | — | — | Admin | — | — |
| **Allergien** | | | | | |
| – Erstellen/Bearbeiten (eigene Kinder) | Schreiben | — | — | Schreiben | Schreiben |
| – Lesen (eigene Kinder) | Lesen | — | — | Lesen | Lesen |
| – Lesen (Gruppe) | — | Lesen | Lesen | — | — |
| – Alle lesen | — | — | Admin | — | — |
| **Nachrichten** | | | | | |
| – Senden (an eigene Gruppe) | Schreiben | Schreiben | Schreiben | Schreiben | Schreiben |
| – Lesen (eigene Threads) | Lesen | Lesen | Admin | Lesen | Lesen |
| – Alle Threads lesen | — | — | Admin | — | — |
| **Elternrat-Board** | | | | | |
| – Eigene Karten erstellen | Schreiben | — | — | Schreiben | Schreiben |
| – Board lesen | — | — | Lesen | Lesen | Lesen |
| – Beliebige Karten bearbeiten/löschen | — | — | — | — | Admin |
| – Status/Spalte ändern | — | — | — | — | Admin |
| – Sprints verwalten | — | — | — | — | Admin |
| – Kommentieren | — | — | — | Schreiben | Schreiben |
| **Küchen-Handout** | | | | | |
| – Eigene Gruppe anzeigen | — | Lesen | Lesen | — | — |
| – Alle Gruppen exportieren | — | — | Admin | — | — |
| **Benutzerverwaltung** | | | | | |
| – Eigenes Profil bearbeiten | Schreiben | Schreiben | Schreiben | Schreiben | Schreiben |
| – Benutzer anlegen/deaktivieren | — | — | Admin | — | — |
| – Rollen zuweisen | — | — | Admin | — | Admin\*\* |

> \* Gruppenmitarbeiter\*in
> \*\* Elternrat-Admin kann nur die Rollen ER-Mitglied und ER-Admin vergeben

---

## 3. Küchen-Handout

### 3.1 Beschreibung
Eine druckoptimierte Ansicht aller aktiven Allergien und Unverträglichkeiten, gruppiert nach Schweregrad. Gedacht für das Küchenpersonal, damit dieses beim Zubereiten von Mahlzeiten den Überblick behält.

### 3.2 Aufbau der Ansicht

```
KÜCHEN-HANDOUT – Kita Sonnenschein
Stand: 24. März 2026 – automatisch aktualisiert

── SCHWEREGRAD: HOCH ─────────────────────────────────────
  Kind: Lena Müller (Gruppe: Sonnenkäfer)
  Allergie: Erdnüsse
  Auslöser: Erdnussbutter, Gemischte Nüsse, Manche Backwaren
  Notfall: Epipen im Rucksack. Bei Reaktion sofort Notarzt rufen.

── SCHWEREGRAD: MITTEL ───────────────────────────────────
  Kind: Felix Müller (Gruppe: Regenbogenfische)
  Allergie: Laktose
  Auslöser: Kuhmilch, Käse, Butter, Joghurt
  Hinweis: Laktosefreie Alternativen sind verträglich.

── SCHWEREGRAD: BEOBACHTEN ───────────────────────────────
  Kind: Felix Müller (Gruppe: Regenbogenfische)
  Allergie: Heuschnupfen (saisonal)
  Auslöser: Gräserpollen, Frühlingspollen
```

### 3.3 Filteroptionen
- Nach Gruppe filtern (für Gruppenmitarbeiter\*innen automatisch vorgewählt)
- Druckansicht via `window.print()` mit `@media print` CSS (kein serverseitiger PDF-Export)
- Zeitstempel „Stand: …" wird bei jedem Laden aktualisiert

### 3.4 Automatische Aktualisierung
- Die Ansicht liest direkt aus dem `Allergie`-Modell
- Kein manueller Export-Schritt nötig
- Soft-Delete: Gelöschte Allergien erscheinen nicht mehr, bleiben aber in der DB für Audit-Log

---

## 4. Backend-Anforderungen

### 4.1 Modell-Änderungen

#### Neue Felder an bestehenden Modellen

**`kita/models.py` – `Gruppe`**
```python
mitarbeiter = models.ManyToManyField(
    settings.AUTH_USER_MODEL,
    related_name="gruppen",
    blank=True,
)
```

**`kita/models.py` – `Kind`**
```python
elternteile = models.ManyToManyField(
    settings.AUTH_USER_MODEL,
    related_name="kinder",
    blank=True,
)
```

#### Neues Modell: Rollen-Konstanten

```python
# kita/models.py

class Rolle(models.TextChoices):
    ELTERNTEIL   = "elternteil",        "Elternteil"
    GRUPPENM     = "gruppenmitarbeiter", "Gruppenmitarbeiter*in"
    LEITUNG      = "leitung",           "Kita-Leitung"
    ER_MITGLIED  = "er_mitglied",       "Elternrat-Mitglied"
    ER_ADMIN     = "er_admin",          "Elternrat-Admin"
```

#### Neues Modell: BenutzerProfil (mehrere Rollen als JSON-Liste)

**Entscheidung: Ein Benutzer kann mehrere Rollen gleichzeitig haben** (z.B. Elternteil + ER-Mitglied). Rollen werden als JSON-Liste gespeichert.

```python
class BenutzerProfil(models.Model):
    benutzer = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profil",
    )
    kita  = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="profile")
    rollen = models.JSONField(default=list)
    # Beispiel: ["elternteil", "er_mitglied"]

    class Meta:
        verbose_name = "Benutzerprofil"
        verbose_name_plural = "Benutzerprofile"

    def hat_rolle(self, *rollen):
        """Gibt True zurück wenn der Benutzer mindestens eine der angegebenen Rollen hat."""
        return any(r in self.rollen for r in rollen)
```

#### Neues Modell: EinladungsCode

**Entscheidung: Self-Registration via Einladungscode.** Die Kita-Leitung generiert Codes pro Gruppe. Eltern registrieren sich selbst mit diesem Code.

```python
import secrets

class EinladungsCode(models.Model):
    kita              = models.ForeignKey(Kita, on_delete=models.CASCADE, related_name="einladungscodes")
    gruppe            = models.ForeignKey(Gruppe, on_delete=models.SET_NULL, null=True, blank=True,
                                          related_name="einladungscodes")
    code              = models.CharField(max_length=20, unique=True)
    erstellt_von      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                           null=True, related_name="erstellte_codes")
    erstellt_am       = models.DateTimeField(auto_now_add=True)
    gueltig_bis       = models.DateTimeField(null=True, blank=True)
    max_verwendungen  = models.PositiveIntegerField(default=0)   # 0 = unbegrenzt
    aktiv             = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Einladungscode"
        verbose_name_plural = "Einladungscodes"

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = secrets.token_urlsafe(8).upper()[:10]
        super().save(*args, **kwargs)

    def ist_gueltig(self):
        from django.utils import timezone
        if not self.aktiv:
            return False
        if self.gueltig_bis and timezone.now() > self.gueltig_bis:
            return False
        return True
```

Registrierungsflow:
1. Kita-Leitung erstellt `EinladungsCode` für eine Gruppe im Admin oder via API
2. Code wird per Aushang oder E-Mail weitergegeben
3. Elternteil öffnet `/registrieren?code=ABCD1234`
4. Nach erfolgreicher Registrierung: `BenutzerProfil` mit Rolle `elternteil` und Kita aus Code anlegen

#### Änderungen an `communication/models.py`

**`Allergie`** – Soft-Delete hinzufügen:
```python
geloescht_am = models.DateTimeField(null=True, blank=True)

def loeschen(self):
    from django.utils import timezone
    self.geloescht_am = timezone.now()
    self.save()
```

#### Änderungen an `elternrat/models.py`

**`Aufgabe`** – Kommentare als eigenes Modell:
```python
class Kommentar(models.Model):
    aufgabe  = models.ForeignKey(Aufgabe, on_delete=models.CASCADE, related_name="kommentare")
    autor    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text     = models.TextField()
    erstellt = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["erstellt"]
```

---

### 4.2 Neue API-Endpunkte

#### Registrierung mit Einladungscode

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `POST` | `/api/auth/registrieren/` | Registrierung mit `code`, `email`, `password` |
| `GET` | `/api/auth/code-pruefen/?code=XYZ` | Code-Gültigkeit prüfen (zeigt Kita/Gruppe an) |

#### Benutzerverwaltung (nur Kita-Leitung)

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/benutzer/` | Alle Benutzer der Kita auflisten |
| `PATCH` | `/api/benutzer/{id}/` | Rollen oder Profil ändern |
| `POST` | `/api/benutzer/{id}/deaktivieren/` | Benutzer deaktivieren |
| `GET` | `/api/einladungscodes/` | Codes der eigenen Kita |
| `POST` | `/api/einladungscodes/` | Neuen Code generieren |
| `DELETE` | `/api/einladungscodes/{id}/` | Code deaktivieren |

#### Küchen-Handout

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/kueche/handout/` | Alle aktiven Allergien, sortiert nach Schweregrad |
| `GET` | `/api/kueche/handout/?gruppe={id}` | Gefiltert nach Gruppe |

#### Elternrat-Kommentare

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/elternrat/aufgaben/{id}/kommentare/` | Kommentare einer Aufgabe |
| `POST` | `/api/elternrat/aufgaben/{id}/kommentare/` | Kommentar hinzufügen |
| `DELETE` | `/api/elternrat/kommentare/{id}/` | Eigenen Kommentar löschen |

#### Profil

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/profil/` | Eigenes Profil und Rollen abrufen |
| `PATCH` | `/api/profil/` | Eigenes Profil bearbeiten |

---

### 4.3 DRF Permission Classes

Alle Permissions erben von `BasePermission`. Rollen werden aus `request.user.profil.rollen` (JSON-Liste) gelesen.

```python
# kitaportal/permissions.py

def _hat_rolle(user, *rollen):
    """Hilfsfunktion: True wenn der User mindestens eine der Rollen hat."""
    profil = getattr(user, "profil", None)
    if not profil:
        return False
    return any(r in (profil.rollen or []) for r in rollen)


class IstElternteil(BasePermission):
    """Jeder eingeloggte Benutzer mit einem Profil."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated
                    and hasattr(request.user, "profil"))

    def has_object_permission(self, request, view, obj):
        kind = obj if isinstance(obj, Kind) else getattr(obj, "kind", None)
        if kind is None:
            return False
        return request.user in kind.elternteile.all()


class IstGruppenmitarbeiter(BasePermission):
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.GRUPPENM, Rolle.LEITUNG)

    def has_object_permission(self, request, view, obj):
        gruppe = getattr(obj, "gruppe", None) or getattr(getattr(obj, "kind", None), "gruppe", None)
        if gruppe is None:
            return _hat_rolle(request.user, Rolle.LEITUNG)
        return (request.user in gruppe.mitarbeiter.all()
                or _hat_rolle(request.user, Rolle.LEITUNG))


class IstKitaLeitung(BasePermission):
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.LEITUNG)


class IstElternratMitglied(BasePermission):
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.ER_MITGLIED, Rolle.ER_ADMIN, Rolle.LEITUNG)


class IstElternratAdmin(BasePermission):
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.ER_ADMIN, Rolle.LEITUNG)


class EigentuemerOderLeitung(BasePermission):
    """Objekte nur vom Eigentümer oder der Leitung schreibbar."""
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return (getattr(obj, "autor", None) == request.user
                or getattr(obj, "gemeldet_von", None) == request.user
                or _hat_rolle(request.user, Rolle.LEITUNG))
```

#### Anwendungsbeispiel: KrankmeldungViewSet

```python
class KrankmeldungViewSet(viewsets.ModelViewSet):
    serializer_class = KrankmeldungSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ("update", "partial_update"):
            return [IsAuthenticated(), IstGruppenmitarbeiter()]
        if self.action == "destroy":
            return [IsAuthenticated(), IstKitaLeitung()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if _hat_rolle(user, Rolle.LEITUNG):
            return Krankmeldung.objects.all()
        if _hat_rolle(user, Rolle.GRUPPENM):
            return Krankmeldung.objects.filter(kind__gruppe__in=user.gruppen.all())
        return Krankmeldung.objects.filter(kind__elternteile=user)

    def perform_create(self, serializer):
        serializer.save(gemeldet_von=self.request.user)
```

---

### 4.4 Django Admin

- `BenutzerProfil` inline in der User-Admin-Ansicht
- `Gruppe.mitarbeiter` als `filter_horizontal`
- `Kind.elternteile` als `filter_horizontal`
- `EinladungsCode` mit `list_display = ["code", "gruppe", "aktiv", "gueltig_bis"]`
- Readonly-Felder: `erstellt_am`, `geloescht_am`

---

### 4.5 Migrationsplan

1. **Migration kita/0002**: `BenutzerProfil`, `EinladungsCode`, `Gruppe.mitarbeiter` M2M, `Kind.elternteile` M2M
2. **Migration communication/0002**: `Allergie.geloescht_am` hinzufügen
3. **Migration elternrat/0002**: `Kommentar`-Modell anlegen
4. **Datenmigration**: Bestehende Test-User mit Standardrollen `["elternteil"]` versehen

---

### 4.6 Authentifizierung

Bleibt unverändert: Django Allauth + DRF Token Auth.

Zusätzlich:
- Registrierungs-Endpunkt validiert `EinladungsCode` und legt `BenutzerProfil` an
- Login-Endpunkt gibt neben Token auch `rollen` (Liste) und `kita_id` zurück
- Frontend speichert `rollen` im `localStorage` und nutzt sie für conditional rendering
- **Sicherheitsprinzip:** Frontend versteckt nur UI-Elemente — die eigentliche Durchsetzung passiert **ausschließlich im Backend**

---

## 5. Entschiedene Fragen

| # | Frage | Entscheidung |
|---|---|---|
| 1 | Kann ein Benutzer mehrere Rollen haben? | **Ja** – Rollen als JSON-Liste im `BenutzerProfil.rollen` Feld |
| 2 | Küchen-Handout Export-Methode? | **Browser-Print** via `window.print()` + `@media print` CSS – kein WeasyPrint |
| 3 | Wie werden neue Benutzer eingeladen? | **Self-Registration via Einladungscode** – Kita-Leitung generiert Code pro Gruppe, Eltern registrieren sich selbst |
| 4 | Rolle im Token oder aus DB lesen? | **Aus der DB lesen** – aktuell bleiben, Token-Invalidierung einfacher |
| 5 | Schreibrecht Gruppenm.\* auf Allergien? | **Nein** – vorerst nur Kita-Leitung und Elternteil |
