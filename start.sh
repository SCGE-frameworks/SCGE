#!/usr/bin/env bash
#
# SCGE - Setup e execução em um único comando.
# Uso (Linux/Ubuntu):  bash start.sh
#
# O script instala TUDO automaticamente (Node.js e Python, se faltarem),
# instala as dependências do backend e do frontend, gera o build do frontend
# e sobe a aplicação completa em http://localhost:8000
# (a API e a interface são servidas pela mesma porta).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

info() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m%s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31mERRO: %s\033[0m\n' "$1" >&2; exit 1; }

# Link clicável no terminal (OSC 8 — VS Code, Windows Terminal, GNOME Terminal, etc.)
link() {
  local url="$1"
  local label="${2:-$url}"
  printf '  \033]8;;%s\033\\%s\033]8;;\033\\\n' "$url" "$label"
}

# --- Helper de sudo (funciona com ou sem sudo disponível) ------------------
SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  fi
fi

APT_UPDATED=0
apt_update_once() {
  if [ "$APT_UPDATED" -eq 0 ]; then
    $SUDO apt-get update -y
    APT_UPDATED=1
  fi
}

# --- Instalação automática de pré-requisitos (Debian/Ubuntu) ---------------
ensure_python() {
  if command -v python3 >/dev/null 2>&1 && python3 -m venv --help >/dev/null 2>&1; then
    return
  fi

  info "Instalando Python 3 (+venv/pip)"
  command -v apt-get >/dev/null 2>&1 || fail "Python 3 não encontrado e este sistema não usa apt. Instale Python 3.11+ manualmente."
  apt_update_once
  $SUDO apt-get install -y python3 python3-venv python3-pip
}

ensure_node() {
  if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    return
  fi

  info "Instalando Node.js 20 (via NodeSource)"
  command -v apt-get >/dev/null 2>&1 || fail "Node.js não encontrado e este sistema não usa apt. Instale o Node 18+ manualmente (https://nodejs.org)."

  if ! command -v curl >/dev/null 2>&1; then
    apt_update_once
    $SUDO apt-get install -y curl
  fi

  curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO -E bash -
  $SUDO apt-get install -y nodejs
}

ensure_python
ensure_node

command -v python3 >/dev/null 2>&1 || fail "Falha ao preparar o Python 3."
command -v node    >/dev/null 2>&1 || fail "Falha ao preparar o Node.js."
command -v npm     >/dev/null 2>&1 || fail "Falha ao preparar o npm."

info "Pré-requisitos prontos: $(python3 --version) | node $(node --version)"

# --- Backend ---------------------------------------------------------------
info "Configurando o backend (ambiente virtual + dependências)"
cd "$ROOT_DIR/backend"

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

if [ ! -f .env ]; then
  cp .env.example .env
  info "Arquivo backend/.env criado a partir do .env.example"
fi

# --- Frontend --------------------------------------------------------------
info "Instalando dependências do frontend"
cd "$ROOT_DIR/frontend"
npm install --no-audit --no-fund

info "Gerando o build do frontend"
# URL vazia => o frontend chama a API na mesma origem do backend.
VITE_API_URL="" npm run build

# --- Execução --------------------------------------------------------------
printf '\n\033[1;32m════════════════════════════════════════════════════════\033[0m\n'
printf '\033[1;32m  SCGE pronto! Clique nos links abaixo para acessar:\033[0m\n'
printf '\033[1;32m════════════════════════════════════════════════════════\033[0m\n\n'

printf '  \033[1mSistema (interface):\033[0m\n'
link "http://localhost:8000" "http://localhost:8000"

printf '\n  \033[1mAPI (Swagger):\033[0m\n'
link "http://localhost:8000/docs" "http://localhost:8000/docs"

printf '\n  \033[1mLogin padrão:\033[0m admin@scge.com / admin@123\n'
printf '  \033[1mEncerrar:\033[0m CTRL+C\n\n'

cd "$ROOT_DIR/backend"
exec python -m uvicorn app:app --host 0.0.0.0 --port 8000
