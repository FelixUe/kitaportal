# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KitaPortal is an open-source, GDPR-compliant web app for German daycare centers (Kitas), replacing WhatsApp groups and paper forms with a self-hostable platform. Currently in alpha.

## Repository Layout

All application code lives under `kitaportal/`:

```
kitaportal/
├── backend/        # Django REST API (Python 3.12)
├── frontend/       # React + Vite SPA
├── docs/           # Deployment and privacy docs
└── docker-compose.yml
```

## Development Commands

### Backend

```bash
cd kitaportal/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver          # http://localhost:8000
```

### Frontend

```bash
cd kitaportal/frontend
npm install
npm run dev        # http://localhost:5173
npm run lint       # ESLint
npm run build      # production build
```

### Docker (full stack)

```bash
cd kitaportal
cp .env.example .env   # fill in DB_PASSWORD, SECRET_KEY, DOMAIN, API_URL
docker compose up -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

## Architecture

### Backend Django Apps

The Django project is named `kitaportal` (wsgi: `kitaportal.wsgi:application`). Three apps:

- **`kita`** — core domain models: `Kita`, `Gruppe`, `Kind`, `Elternteil`, `AbholPerson`. Everything else references these.
- **`communication`** — parent-facing actions: `Krankmeldung` (sick reports with symptom choices), `Abholerlaubnis` (daily pickup permissions), `Allergie` (allergies with severity), `Nachricht` (messages to a Gruppe).
- **`elternrat`** — parent council board: `Projekt` (board per Kita) and `Aufgabe` (Kanban tasks with status/priority).

Auth uses Django Allauth + DRF token auth. Token is stored in `localStorage` and sent as `Authorization: Token <token>` by the axios client.

### Frontend API Layer

`src/api/client.js` — axios instance pointing at `VITE_API_URL` (default: `http://localhost:8000/api`), with a request interceptor that attaches the auth token from localStorage.

`src/api/` — one file per domain (e.g., `abholung.js`, `krankmeldung.js`) that export typed API calls using the shared client.

## Code Style

- Python: **Black** for formatting
- JS/React: **Prettier** + **ESLint**
- Commits: **Conventional Commits** (`feat:`, `fix:`, `docs:`, ...)
