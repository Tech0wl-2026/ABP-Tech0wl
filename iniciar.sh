#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v docker >/dev/null || { printf '%s\n' 'Instale e abra o Docker antes de continuar.'; exit 1; }
docker compose version >/dev/null
docker info >/dev/null
umask 077
if [ ! -f .env ]; then cp .env.example .env; fi
if ! grep -Eq '^JWT_SECRET=[^[:space:]]{32,}' .env; then
  abp_jwt=$(od -An -N32 -tx1 /dev/urandom | tr -d ' \n')
  abp_env_tmp=$(mktemp .env.tmp.XXXXXX)
  trap 'rm -f "$abp_env_tmp"' EXIT
  awk '!/^JWT_SECRET=/' .env > "$abp_env_tmp"
  printf '\nJWT_SECRET=%s\n' "$abp_jwt" >> "$abp_env_tmp"
  mv "$abp_env_tmp" .env
  trap - EXIT
fi
docker compose config --quiet
docker compose up --build -d --wait --wait-timeout 180
printf '%s\n' 'Projeto pronto. Site: http://localhost:8080 | API: http://localhost:3001/api/saude' 'Se alterou as portas no .env, utilize os valores configurados.' 'Para encerrar, rode: docker compose down'
