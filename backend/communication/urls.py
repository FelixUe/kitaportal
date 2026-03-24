from rest_framework.routers import DefaultRouter

from .views import AbholerlaubnisViewSet, AllergieViewSet, KrankmeldungViewSet, NachrichtViewSet

router = DefaultRouter()
router.register("krankmeldungen", KrankmeldungViewSet, basename="krankmeldung")
router.register("abholerlaubnisse", AbholerlaubnisViewSet, basename="abholerlaubnis")
router.register("allergien", AllergieViewSet, basename="allergie")
router.register("nachrichten", NachrichtViewSet, basename="nachricht")

urlpatterns = router.urls
