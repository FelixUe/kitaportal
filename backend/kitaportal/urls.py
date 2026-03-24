from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("admin/", admin.site.urls),
    # Token-Login: POST /api/auth/token/ mit username + password → gibt Token zurück
    path("api/auth/token/", obtain_auth_token, name="api-token-auth"),
    # Allauth-URLs (Registrierung, Passwort zurücksetzen, etc.)
    path("api/auth/", include("allauth.urls")),
]
