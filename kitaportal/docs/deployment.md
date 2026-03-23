# Deployment – KitaPortal selbst hosten

## Was du brauchst

- Einen Server (empfohlen: [Hetzner Cloud](https://www.hetzner.com/cloud), CX21, ~5€/Monat)
- Eine Domain (optional, aber empfohlen)
- Ca. 30 Minuten Zeit

## Schritt 1 – Server einrichten

```bash
# Als root auf dem neuen Server:
apt update && apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com | sh
```

## Schritt 2 – Coolify installieren (empfohlen)

[Coolify](https://coolify.io) ist ein kostenloses Open-Source-Tool,
das das Deployment per Klick ermöglicht.

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Danach erreichst du Coolify unter `http://DEINE-IP:8000`.

## Schritt 3 – KitaPortal hinzufügen

1. In Coolify einloggen
2. "New Resource" → "Docker Compose"
3. GitHub-URL: `https://github.com/DEIN-USERNAME/kitaportal`
4. Umgebungsvariablen aus `.env.example` eintragen
5. Deploy klicken

## Manuelles Deployment (ohne Coolify)

```bash
git clone https://github.com/DEIN-USERNAME/kitaportal.git
cd kitaportal
cp .env.example .env
# .env mit echten Werten befüllen (nano .env)

docker compose up -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

Die App läuft dann auf Port 3000 (Frontend) und 8000 (API).

## Updates einspielen

```bash
git pull
docker compose up -d --build
docker compose exec backend python manage.py migrate
```

## Fragen?

→ [GitHub Discussions](../../discussions)
