#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://localhost:3000}"

echo "== / =="
curl -sI "$BASE/" | grep -i cache-control || true
echo

echo "== /eventos =="
curl -sI "$BASE/eventos" | grep -i cache-control || true
echo

echo "== /api/healthz =="
curl -sI "$BASE/api/healthz" | grep -i cache-control || true
echo
