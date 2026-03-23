# 🌻 KitaPortal

**Die offene, gemeinnützige Plattform für Kitas – statt WhatsApp-Chaos.**

KitaPortal ersetzt Zettelwirtschaft, WhatsApp-Gruppen und veraltete Software durch eine einfache, datenschutzkonforme Web-App – kostenlos, open source, selbst hostbar.

> Gebaut von Eltern, für Eltern und Erzieher·innen. Kein Konzern. Keine Werbung. Keine versteckten Kosten.

---

## Das Problem

In deutschen Kitas läuft Kommunikation heute so:

- 📱 Krankmeldungen per WhatsApp an die Erzieherin
- 📄 Abholerlaubnisse auf Papierzetteln
- 📋 Allergielisten in Excel-Dateien, die niemand aktuell hält
- 💬 Elternrat-Koordination über mehrere private Chats
- 🗓️ Terminankündigungen per Aushang oder E-Mail-Verteiler

Das ist fehleranfällig, nicht DSGVO-konform und frustrierend für alle Beteiligten.

## Die Lösung

KitaPortal ist eine schlanke Web-App, die alle typischen Kommunikations- und Verwaltungsaufgaben einer Kita an einem Ort bündelt – einfach zu bedienen, sicher, und für jede Kita kostenlos einsetzbar.

---

## Features (MVP)

### Für Eltern
- 🤒 **Krankmeldung** – Kind in 30 Sekunden abmelden, mit Symptomen und Rückkehrdatum
- 👋 **Abholerlaubnis** – einmalig Personen hinterlegen, tagesweise freigeben
- 🌿 **Allergien & Unverträglichkeiten** – strukturiert hinterlegen, für Erzieher·innen einsehbar
- 💬 **Sichere Nachrichten** – direkte Kommunikation mit der Gruppe, kein WhatsApp
- 📦 **Spendenangebote** – Spielzeug, Bücher, Bastelmaterial anbieten und koordinieren
- 📢 **Neuigkeiten** – Ankündigungen, Termine, Veranstaltungen auf einen Blick

### Für Erzieher·innen
- 📋 Tagesübersicht: wer ist da, wer krank, wer wird wann abgeholt
- ✅ Bestätigung von Meldungen mit einem Klick
- 📝 Gruppenübergreifende Kommunikation mit Eltern

### Für den Elternrat
- 🗂️ **Agiles Board** – Projekte, Aufgaben, Verantwortlichkeiten (Kanban)
- 📄 Protokolle und Dokumente teilen
- 🗳️ Einfache Abstimmungen

---

## Designprinzipien

1. **Einfachheit vor Features** – wenn eine Erzieherin nach 5 Minuten nicht klarkommt, haben wir versagt
2. **Mobile first** – Eltern nutzen ihr Handy, nicht den Laptop
3. **Datenschutz by default** – keine Daten an Dritte, DSGVO-konform von Anfang an
4. **Selbst hostbar** – jede Kita kann ihre eigene Instanz betreiben, ein Klick genügt
5. **Open source, immer** – der Code ist öffentlich, auditierbar, veränderbar

---

## Tech Stack

| Bereich | Technologie | Warum |
|---|---|---|
| Frontend | React + Vite | Weit verbreitet, gute Mobile-Unterstützung |
| Backend | Python / Django | Klare Struktur, starkes Ökosystem |
| Datenbank | PostgreSQL | Zuverlässig, DSGVO-freundlich |
| Auth | Django Allauth | Bewährt, unterstützt SSO |
| Hosting | Docker + Coolify | 1-Click-Deploy auf eigenem Server |
| E-Mail | SMTP (selbst konfigurierbar) | Kein Lock-in |

---

## Schnellstart (für Entwickler·innen)

```bash
# Repository klonen
git clone https://github.com/DEIN-USERNAME/kitaportal.git
cd kitaportal

# Backend starten
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend starten (neues Terminal)
cd frontend
npm install
npm run dev
```

Die App ist dann erreichbar unter `http://localhost:5173`.

---

## Deployment (für Kitas – ohne IT-Kenntnisse)

KitaPortal kann mit einem Klick auf einem eigenen Server deployed werden:

1. Server mieten (z.B. Hetzner Cloud, ab ~5€/Monat)
2. [Coolify](https://coolify.io) installieren (kostenlos, open source)
3. KitaPortal als App hinzufügen – fertig

Eine ausführliche Anleitung findest du in [`docs/deployment.md`](docs/deployment.md).

> 💡 In Zukunft planen wir einen **gehosteten Dienst** für Kitas, die keinen eigenen Server betreiben wollen – gemeinnützig, zu Selbstkosten.

---

## Projektstruktur

```
kitaportal/
├── frontend/          # React App
│   ├── src/
│   │   ├── pages/     # Hauptseiten (Dashboard, Krankmeldung, ...)
│   │   ├── components/# Wiederverwendbare UI-Komponenten
│   │   └── api/       # API-Client
├── backend/           # Django REST API
│   ├── kita/          # Kern-App (Gruppen, Kinder, Nutzer)
│   ├── communication/ # Nachrichten, Meldungen
│   └── elternrat/     # Board, Aufgaben, Protokolle
├── docs/              # Dokumentation
│   ├── deployment.md
│   ├── datenschutz.md
│   └── contributing.md
└── docker-compose.yml # Für einfaches Deployment
```

---

## Mitmachen

KitaPortal lebt von der Community. Wir freuen uns über:

- 🐛 **Bug Reports** – etwas funktioniert nicht? [Issue erstellen](../../issues/new?template=bug.md)
- 💡 **Feature-Ideen** – was fehlt? [Diskussion starten](../../discussions)
- 👩‍💻 **Code** – schau in die [offenen Issues](../../issues) und leg los
- 🎨 **Design** – Figma-Datei kommt bald
- 📖 **Dokumentation** – auch kleine Verbesserungen helfen
- 🌍 **Übersetzungen** – Mehrsprachigkeit ist geplant

Lies bitte zuerst [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Good First Issues

Wir kennzeichnen Einstiegs-freundliche Issues mit dem Label `good first issue`.

---

## Datenschutz & Sicherheit

- Alle Daten liegen auf dem Server der Kita – kein Cloud-Anbieter hat Zugriff
- Ende-zu-Ende-Verschlüsselung für Nachrichten (geplant)
- DSGVO-Konformität ist keine Nachbetrachtung, sondern Kernprinzip
- Regelmäßige Security-Audits durch die Community

Sicherheitslücken bitte **nicht** als öffentliches Issue melden – stattdessen an: security@kitaportal.org

---

## Lizenz

[AGPL-3.0](LICENSE) – du kannst den Code frei nutzen, verändern und weitergeben. Änderungen müssen ebenfalls open source bleiben. Kommerzielle Nutzung ohne Rücksprache ist nicht erlaubt.

---

## Status

🚧 **Alpha – in aktiver Entwicklung**

| Modul | Status |
|---|---|
| Krankmeldung | ✅ MVP fertig |
| Abholerlaubnis | ✅ MVP fertig |
| Allergien | ✅ MVP fertig |
| Nachrichten | 🔨 In Entwicklung |
| Elternrat-Board | 🔨 In Entwicklung |
| Backend API | 📋 Geplant |
| Deployment-Guide | 📋 Geplant |
| Mehrsprachigkeit | 📋 Geplant |

---

## Kontakt & Community

- 💬 Diskussionen: [GitHub Discussions](../../discussions)
- 📧 E-Mail: hallo@kitaportal.org
- 🤝 Initiiert in Zusammenarbeit mit der [AWO](https://www.awo.org)

---

<p align="center">
  Gebaut mit ❤️ von Eltern, für Eltern.<br>
  <strong>Keine Werbung. Kein Konzern. Kein Bullshit.</strong>
</p>
