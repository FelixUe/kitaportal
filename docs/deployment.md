# KitaPortal – Deployment-Anleitung

Diese Anleitung richtet sich an Kita-Leitungen ohne IT-Kenntnisse.
Am Ende läuft KitaPortal sicher im Internet – mit eigenem SSL-Zertifikat.

---

## Was du benötigst

| Was | Empfehlung | Kosten |
|-----|-----------|--------|
| Server | Hetzner Cloud CX22 | ~4 €/Monat |
| Domain | beliebiger Anbieter (z.B. Namecheap, Strato, IONOS) | ~10 €/Jahr |
| Zeit | ca. 20 Minuten | |

---

## Schritt 1 – Server bei Hetzner mieten

1. Gehe zu [hetzner.com/cloud](https://www.hetzner.com/cloud) und erstelle ein Konto.
2. Klicke auf **"Add Server"**.
3. Wähle folgende Einstellungen:
   - **Location:** Nürnberg oder Falkenstein (Deutschland)
   - **Image:** Ubuntu 24.04
   - **Type:** CX22 (2 vCPU, 4 GB RAM)
   - **SSH Key:** Entweder einen SSH-Key hinterlegen oder ein Root-Passwort setzen lassen.
4. Klicke auf **"Create & Buy now"**.
5. Notiere dir die **IP-Adresse** des Servers (z.B. `176.12.34.56`).

---

## Schritt 2 – Domain auf den Server zeigen lassen

Bei deinem Domain-Anbieter einen **A-Record** anlegen:

| Typ | Name | Wert |
|-----|------|------|
| A | kita | 176.12.34.56 *(deine Server-IP)* |

> Das Beispiel oben richtet `kita.meinedomain.de` ein.
> Trage deine eigene Server-IP ein.

**Wichtig:** DNS-Änderungen brauchen bis zu 30 Minuten, bis sie weltweit sichtbar sind.
Du kannst auf [dnschecker.org](https://dnschecker.org) prüfen, ob deine Domain schon auf den Server zeigt.

---

## Schritt 3 – Per SSH auf den Server verbinden

**Auf dem Mac oder Linux:**
```bash
ssh root@176.12.34.56
```

**Auf Windows:**
Nutze [PuTTY](https://www.putty.org/) oder die Windows-Eingabeaufforderung:
```
ssh root@176.12.34.56
```

---

## Schritt 4 – KitaPortal installieren (ein Befehl)

Sobald du auf dem Server eingeloggt bist, folgenden Befehl eingeben und Enter drücken:

```bash
curl -fsSL https://raw.githubusercontent.com/FelixUe/kitaportal/main/setup.sh | bash
```

Das Skript führt dich durch die Installation:

1. Es fragt nach deiner **Domain** (z.B. `kita.meinedomain.de`)
2. Es fragt nach deiner **E-Mail-Adresse** (für das SSL-Zertifikat)
3. Es installiert alles automatisch
4. Am Ende kannst du direkt einen **Admin-Benutzer** anlegen

Die gesamte Installation dauert ca. 3–5 Minuten.

---

## Schritt 5 – Einloggen

Nach der Installation öffne deinen Browser und rufe auf:

```
https://kita.meinedomain.de
```

Das SSL-Zertifikat (das "Schloss" in der Adressleiste) wird beim ersten Aufruf
automatisch ausgestellt.

---

## Updates einspielen

Um KitaPortal auf die neueste Version zu aktualisieren:

```bash
cd /opt/kitaportal
git pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.prod exec backend python manage.py migrate
```

---

## Nützliche Befehle

```bash
# Logs in Echtzeit anschauen
docker compose -f /opt/kitaportal/docker-compose.prod.yml --env-file /opt/kitaportal/.env.prod logs -f

# Alle Container neu starten
docker compose -f /opt/kitaportal/docker-compose.prod.yml --env-file /opt/kitaportal/.env.prod restart

# Status der Container prüfen
docker compose -f /opt/kitaportal/docker-compose.prod.yml --env-file /opt/kitaportal/.env.prod ps
```

---

## Manuelle Installation (ohne setup.sh)

Falls du das Skript lieber Schritt für Schritt selbst ausführen möchtest:

```bash
# 1. Docker installieren
curl -fsSL https://get.docker.com | sh

# 2. Repository klonen
git clone https://github.com/FelixUe/kitaportal.git /opt/kitaportal
cd /opt/kitaportal

# 3. Konfiguration anlegen
cp .env.prod.example .env.prod
nano .env.prod   # Werte ausfüllen (Strg+O speichern, Strg+X beenden)

# 4. Starten
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# 5. Datenbank einrichten
docker compose -f docker-compose.prod.yml --env-file .env.prod exec backend python manage.py migrate

# 6. Admin-Benutzer anlegen
docker compose -f docker-compose.prod.yml --env-file .env.prod exec backend python manage.py createsuperuser
```

---

## Fragen oder Probleme?

Schreib uns in den [GitHub Discussions](https://github.com/FelixUe/kitaportal/discussions).
