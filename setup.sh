#!/bin/bash
# KitaPortal – Installations-Skript
# Ausführen als root auf einem frischen Ubuntu-Server:
#   curl -fsSL https://raw.githubusercontent.com/FelixUe/kitaportal/main/setup.sh | bash
set -euo pipefail

REPO_URL="https://github.com/FelixUe/kitaportal.git"
INSTALL_DIR="/opt/kitaportal"

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

print_step() {
  echo ""
  echo -e "${BOLD}${GREEN}==> $1${NC}"
}

print_warn() {
  echo -e "${YELLOW}HINWEIS: $1${NC}"
}

print_error() {
  echo -e "${RED}FEHLER: $1${NC}"
}

# ── Voraussetzungen prüfen ────────────────────────────────────────────────────

if [ "$EUID" -ne 0 ]; then
  print_error "Bitte als root ausführen: sudo bash setup.sh"
  exit 1
fi

if ! grep -qiE "ubuntu|debian" /etc/os-release 2>/dev/null; then
  print_warn "Dieses Skript wurde für Ubuntu/Debian entwickelt. Andere Systeme werden nicht offiziell unterstützt."
fi

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       KitaPortal – Installations-Setup       ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo "Dieses Skript installiert KitaPortal auf diesem Server."
echo "Es werden Docker, die App und ein SSL-Zertifikat eingerichtet."
echo ""

# ── Schritt 1: System aktualisieren ──────────────────────────────────────────

print_step "Schritt 1/6: System wird aktualisiert..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq git curl openssl

# ── Schritt 2: Docker installieren ───────────────────────────────────────────

print_step "Schritt 2/6: Docker wird installiert..."
if command -v docker &>/dev/null; then
  echo "  Docker ist bereits installiert ($(docker --version))."
else
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo "  Docker wurde erfolgreich installiert."
fi

# ── Schritt 3: Repository klonen ─────────────────────────────────────────────

print_step "Schritt 3/6: KitaPortal wird heruntergeladen..."
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "  Vorhandene Installation gefunden – wird aktualisiert..."
  git -C "$INSTALL_DIR" pull --quiet
else
  git clone --quiet "$REPO_URL" "$INSTALL_DIR"
  echo "  KitaPortal wurde nach $INSTALL_DIR heruntergeladen."
fi

# ── Schritt 4: Konfiguration ─────────────────────────────────────────────────

print_step "Schritt 4/6: Konfiguration"
echo ""
echo "Bitte die folgenden Angaben machen:"
echo "(Die Domain muss bereits auf die IP dieses Servers zeigen,"
echo " damit das SSL-Zertifikat automatisch ausgestellt werden kann.)"
echo ""

read -rp "  Domain (z.B. kita.meinedomain.de): " DOMAIN
while [[ -z "$DOMAIN" ]]; do
  print_warn "Domain darf nicht leer sein."
  read -rp "  Domain (z.B. kita.meinedomain.de): " DOMAIN
done

read -rp "  E-Mail-Adresse (für SSL-Benachrichtigungen): " ADMIN_EMAIL
while [[ -z "$ADMIN_EMAIL" || ! "$ADMIN_EMAIL" =~ "@" ]]; do
  print_warn "Bitte eine gültige E-Mail-Adresse eingeben."
  read -rp "  E-Mail-Adresse: " ADMIN_EMAIL
done

# Geheimnisse generieren
SECRET_KEY=$(openssl rand -base64 48 | tr -d '\n/+=' | head -c 50)
DB_PASSWORD=$(openssl rand -hex 24)

# .env.prod schreiben
ENV_FILE="$INSTALL_DIR/.env.prod"
cat > "$ENV_FILE" <<EOF
# Automatisch generiert von setup.sh am $(date)
DOMAIN=${DOMAIN}
ADMIN_EMAIL=${ADMIN_EMAIL}
SECRET_KEY=${SECRET_KEY}
DB_PASSWORD=${DB_PASSWORD}
EOF
chmod 600 "$ENV_FILE"
echo "  Konfiguration gespeichert in $ENV_FILE"

# ── Schritt 5: Container starten ─────────────────────────────────────────────

print_step "Schritt 5/6: KitaPortal wird gestartet (kann 2-3 Minuten dauern)..."
cd "$INSTALL_DIR"
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

# ── Schritt 6: Datenbank migrieren ───────────────────────────────────────────

print_step "Schritt 6/6: Datenbank wird eingerichtet..."
echo "  Warte auf Start der Datenbank..."

MIGRATED=false
for i in $(seq 1 20); do
  if docker compose -f docker-compose.prod.yml --env-file .env.prod \
      exec -T backend python manage.py migrate --no-input 2>&1; then
    MIGRATED=true
    break
  fi
  echo "  Warte... ($i/20)"
  sleep 6
done

if [ "$MIGRATED" = false ]; then
  print_warn "Migration konnte nicht automatisch ausgeführt werden."
  echo "  Bitte später manuell ausführen:"
  echo "    cd $INSTALL_DIR"
  echo "    docker compose -f docker-compose.prod.yml --env-file .env.prod exec backend python manage.py migrate"
fi

# ── Fertig ───────────────────────────────────────────────────────────────────

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║          Installation erfolgreich!           ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  KitaPortal ist erreichbar unter: ${BOLD}https://${DOMAIN}${NC}"
echo ""
echo "  Das SSL-Zertifikat wird beim ersten Aufruf automatisch"
echo "  ausgestellt (dauert ca. 30 Sekunden)."
echo ""

# Admin-Benutzer anlegen
echo -e "${BOLD}Admin-Benutzer anlegen${NC}"
echo "Damit du dich in KitaPortal einloggen kannst, wird ein"
echo "Administrator-Konto benötigt."
echo ""
read -rp "Jetzt einen Admin-Benutzer anlegen? [J/n]: " CREATE_ADMIN
if [[ "$CREATE_ADMIN" != "n" && "$CREATE_ADMIN" != "N" ]]; then
  docker compose -f docker-compose.prod.yml --env-file .env.prod \
    exec backend python manage.py createsuperuser
fi

echo ""
echo "Nützliche Befehle:"
echo "  Logs anzeigen:  docker compose -f $INSTALL_DIR/docker-compose.prod.yml --env-file $INSTALL_DIR/.env.prod logs -f"
echo "  Neustart:       docker compose -f $INSTALL_DIR/docker-compose.prod.yml --env-file $INSTALL_DIR/.env.prod restart"
echo "  Update:         cd $INSTALL_DIR && git pull && docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build"
echo ""
echo "Bei Fragen: https://github.com/FelixUe/kitaportal/discussions"
