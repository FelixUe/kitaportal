# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Django REST API + React/Vite SPA for German daycare centers (Kitas). Three Django apps:

- **`kita`** — core models: `Kita`, `Gruppe`, `Kind`, `Elternteil`, `AbholPerson`
- **`communication`** — parent actions: `Krankmeldung`, `Abholerlaubnis`, `Allergie`, `Nachricht`
- **`elternrat`** — parent council: `Projekt` (board) and `Aufgabe` (Kanban tasks)

Auth: Django Allauth + DRF token auth. Token stored in `localStorage`, sent as `Authorization: Token <token>`.

## Key Files

- `backend/kitaportal/` — Django project settings/urls/wsgi
- `frontend/src/api/client.js` — axios instance with auth interceptor
- `frontend/src/api/` — one file per domain (`krankmeldung.js`, `abholung.js`, …)
- `frontend/src/pages/` — one component per page, co-located `.module.css`
- `frontend/src/App.jsx` — router and nav

## Commands

```bash
# Backend
cd backend && source venv/bin/activate
python manage.py runserver       # http://localhost:8000
python manage.py migrate
python manage.py test <app>

# Frontend
cd frontend
bun install
bun run dev      # http://localhost:5173
bun run lint
bun run build

# Docker
docker compose up -d
docker compose exec backend python manage.py migrate
```

## Gotchas

- **Backend is models-only** — no views/serializers/urls exist yet. Work order: model → serializer → viewset → URL → admin.
- **German naming** — domain vars, labels, and comments are intentionally German (`kind`, `abwesend_ab`, etc.). Follow this.
- **Vite proxy** — `/api/*` proxies to `localhost:8000` in dev; `VITE_API_URL` overrides for production.
- **Config** — backend uses `python-decouple` for env vars (`DATABASE_URL`, `SECRET_KEY`, `ALLOWED_HOSTS`).
