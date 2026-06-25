#!/usr/bin/env bash
#
# SCGE - Setup e execução em um único comando.
# Uso (Linux/Ubuntu):  bash start.sh
#
# O script instala as dependências do backend e do frontend, gera o build
# do frontend e sobe a aplicação completa em http://localhost:8000
# (a API e a interface são servidas pela mesma porta).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

info() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31mERRO: %s\033[0m\n' "$1" >&2; exit 1; }

# --- Verificação de pré-requisitos -----------------------------------------
command -v python3 >/dev/null 2>&1 || fail "Python 3 não encontrado. Instale com: sudo apt install -y python3 python3-venv python3-pip"
command -v node    >/dev/null 2>&1 || fail "Node.js não encontrado. Instale o Node 18+ (https://nodejs.org)."
command -v npm     >/dev/null 2>&1 || fail "npm não encontrado. Instale o Node.js (inclui o npm)."

python3 -m venv --help >/dev/null 2>&1 || fail "Módulo venv ausente. Instale com: sudo apt install -y python3-venv"

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
info "Iniciando o SCGE em http://localhost:8000"
printf '    Login padrão: admin@scge.com / admin@123\n'
printf '    Pressione CTRL+C para encerrar.\n'

cd "$ROOT_DIR/backend"
exec python -m uvicorn app:app --host 0.0.0.0 --port 8000
