from rest_framework import serializers

from .models import Allergie, Abholerlaubnis, Krankmeldung, Nachricht


class KrankmeldungSerializer(serializers.ModelSerializer):
    gemeldet_von = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Krankmeldung
        fields = [
            "id", "kind", "gemeldet_von", "abwesend_ab", "abwesend_bis",
            "symptome", "hinweis", "bestaetigt", "erstellt_am",
        ]
        read_only_fields = ["id", "bestaetigt", "erstellt_am"]


class AbholerlaubnisSerializer(serializers.ModelSerializer):
    erteilt_von = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Abholerlaubnis
        fields = [
            "id", "kind", "erteilt_von", "abholperson_name",
            "datum", "uhrzeit_ungefaehr", "hinweis", "erstellt_am",
        ]
        read_only_fields = ["id", "erstellt_am"]


class AllergieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergie
        fields = [
            "id", "kind", "bezeichnung", "schweregrad",
            "ausloser", "notfallhinweis", "hinweis",
        ]
        read_only_fields = ["id"]

    def get_queryset(self):
        return Allergie.objects.filter(geloescht_am__isnull=True)


class NachrichtSerializer(serializers.ModelSerializer):
    absender = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Nachricht
        fields = [
            "id", "absender", "empfaenger_gruppe",
            "betreff", "inhalt", "erstellt_am", "gelesen",
        ]
        read_only_fields = ["id", "erstellt_am", "gelesen"]
