#!/usr/bin/env bash
# Build and (re)start the game in Docker.
# The build checks every question in the bank first and stops if one is broken.
#   ./deploy.sh              -> http://localhost:10360
#   MBT_PORT=8080 ./deploy.sh -> http://localhost:8080
set -euo pipefail
cd "$(dirname "$0")"

docker compose up -d --build
echo
echo "Math Brain Test is running at http://localhost:${MBT_PORT:-10360}"
echo "Stop it with: docker compose down"
