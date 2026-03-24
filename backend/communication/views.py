from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from kita.models import Rolle
from kitaportal.permissions import (
    EigentuemerOderLeitung,
    IstGruppenmitarbeiter,
    IstKitaLeitung,
    _hat_rolle,
)

from .models import Abholerlaubnis, Allergie, Krankmeldung, Nachricht
from .serializers import (
    AbholerlaubnisSerializer,
    AllergieSerializer,
    KrankmeldungSerializer,
    NachrichtSerializer,
)


class KrankmeldungViewSet(viewsets.ModelViewSet):
    serializer_class = KrankmeldungSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ("update", "partial_update"):
            # Bestätigen: Gruppenmitarbeiter*in oder Leitung
            return [IsAuthenticated(), IstGruppenmitarbeiter()]
        if self.action == "destroy":
            return [IsAuthenticated(), IstKitaLeitung()]
        # list, retrieve: gefiltert per get_queryset
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if _hat_rolle(user, Rolle.LEITUNG):
            return Krankmeldung.objects.all().select_related("kind__gruppe")
        if _hat_rolle(user, Rolle.GRUPPENM):
            return (
                Krankmeldung.objects
                .filter(kind__gruppe__in=user.gruppen.all())
                .select_related("kind__gruppe")
            )
        # Elternteil: nur eigene Kinder
        return Krankmeldung.objects.filter(kind__elternteile=user).select_related("kind")

    def perform_create(self, serializer):
        serializer.save(gemeldet_von=self.request.user)

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IstGruppenmitarbeiter])
    def bestaetigen(self, request, pk=None):
        """Krankmeldung als bestätigt markieren."""
        krankmeldung = self.get_object()
        krankmeldung.bestaetigt = True
        krankmeldung.save(update_fields=["bestaetigt"])
        return Response(self.get_serializer(krankmeldung).data)


class AbholerlaubnisViewSet(viewsets.ModelViewSet):
    serializer_class = AbholerlaubnisSerializer

    def get_permissions(self):
        if self.action == "create":
            return [IsAuthenticated()]
        if self.action in ("update", "partial_update", "destroy"):
            return [IsAuthenticated(), EigentuemerOderLeitung()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if _hat_rolle(user, Rolle.LEITUNG):
            return Abholerlaubnis.objects.all().select_related("kind__gruppe")
        if _hat_rolle(user, Rolle.GRUPPENM):
            from django.utils import timezone
            heute = timezone.localdate()
            return (
                Abholerlaubnis.objects
                .filter(kind__gruppe__in=user.gruppen.all(), datum=heute)
                .select_related("kind__gruppe")
            )
        return Abholerlaubnis.objects.filter(kind__elternteile=user).select_related("kind")

    def perform_create(self, serializer):
        serializer.save(erteilt_von=self.request.user)


class AllergieViewSet(viewsets.ModelViewSet):
    serializer_class = AllergieSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAuthenticated()]
        if self.action == "destroy":
            # Soft-delete: Elternteil (eigene) oder Leitung
            return [IsAuthenticated(), EigentuemerOderLeitung()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        # Immer nur nicht-gelöschte Einträge
        qs = Allergie.objects.filter(geloescht_am__isnull=True).select_related("kind__gruppe")
        if _hat_rolle(user, Rolle.LEITUNG):
            return qs
        if _hat_rolle(user, Rolle.GRUPPENM):
            return qs.filter(kind__gruppe__in=user.gruppen.all())
        return qs.filter(kind__elternteile=user)

    def perform_destroy(self, instance):
        # Soft-delete statt hartem Löschen
        instance.loeschen()


class NachrichtViewSet(viewsets.ModelViewSet):
    serializer_class = NachrichtSerializer
    http_method_names = ["get", "post", "head", "options"]  # kein PUT/PATCH/DELETE

    def get_permissions(self):
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if _hat_rolle(user, Rolle.LEITUNG):
            return Nachricht.objects.all().select_related("absender", "empfaenger_gruppe")
        if _hat_rolle(user, Rolle.GRUPPENM):
            return (
                Nachricht.objects
                .filter(empfaenger_gruppe__in=user.gruppen.all())
                .select_related("absender", "empfaenger_gruppe")
            )
        # Elternteil: eigene gesendeten + Nachrichten an eigene Gruppen
        eigene_gruppen = (
            user.kinder.values_list("gruppe", flat=True)
            if hasattr(user, "kinder") else []
        )
        return (
            Nachricht.objects
            .filter(
                absender=user
            ) | Nachricht.objects.filter(
                empfaenger_gruppe__in=eigene_gruppen
            )
        ).distinct().select_related("absender", "empfaenger_gruppe")

    def perform_create(self, serializer):
        serializer.save(absender=self.request.user)
