from rest_framework.permissions import BasePermission, SAFE_METHODS

from kita.models import Kind, Rolle


def _hat_rolle(user, *rollen):
    """True wenn der User mindestens eine der angegebenen Rollen hat."""
    profil = getattr(user, "profil", None)
    if not profil:
        return False
    return any(r in (profil.rollen or []) for r in rollen)


class IstElternteil(BasePermission):
    """
    Zugriff für jeden eingeloggten Benutzer mit Profil.
    Object-Level: nur eigene Kinder bzw. Objekte mit eigenem Kind.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "profil")
        )

    def has_object_permission(self, request, view, obj):
        kind = obj if isinstance(obj, Kind) else getattr(obj, "kind", None)
        if kind is None:
            return False
        return request.user in kind.elternteile.all()


class IstGruppenmitarbeiter(BasePermission):
    """
    Zugriff für Gruppenmitarbeiter*innen und Kita-Leitung.
    Object-Level: nur eigene zugewiesene Gruppe(n), Leitung sieht alles.
    """
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.GRUPPENM, Rolle.LEITUNG)

    def has_object_permission(self, request, view, obj):
        if _hat_rolle(request.user, Rolle.LEITUNG):
            return True
        gruppe = (
            getattr(obj, "gruppe", None)
            or getattr(getattr(obj, "kind", None), "gruppe", None)
        )
        if gruppe is None:
            return False
        return request.user in gruppe.mitarbeiter.all()


class IstKitaLeitung(BasePermission):
    """Zugriff ausschließlich für Kita-Leitung."""
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.LEITUNG)


class IstElternratMitglied(BasePermission):
    """Zugriff für ER-Mitglied, ER-Admin und Kita-Leitung."""
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.ER_MITGLIED, Rolle.ER_ADMIN, Rolle.LEITUNG)


class IstElternratAdmin(BasePermission):
    """Zugriff für ER-Admin und Kita-Leitung."""
    def has_permission(self, request, view):
        return _hat_rolle(request.user, Rolle.ER_ADMIN, Rolle.LEITUNG)


class EigentuemerOderLeitung(BasePermission):
    """
    Lesezugriff für alle; Schreibzugriff nur für den Eigentümer des Objekts
    oder die Kita-Leitung.
    Unterstützt Felder: .gemeldet_von, .erteilt_von, .absender, .autor
    """
    _EIGENTUEMERFELDER = ("gemeldet_von", "erteilt_von", "absender", "autor")

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if _hat_rolle(request.user, Rolle.LEITUNG):
            return True
        for feld in self._EIGENTUEMERFELDER:
            if getattr(obj, feld, None) == request.user:
                return True
        return False
