#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://localhost:3000}"

echo "Checking cache headers for: $BASE"
echo

echo "== / (home) =="
curl -sI "$BASE/" | grep -iE "HTTP/|cache-control" || true
echo

echo "== /eventos (listing) =="
curl -sI "$BASE/eventos" | grep -iE "HTTP/|cache-control" || true
echo

echo "== /api/healthz =="
curl -sI "$BASE/api/healthz" | grep -iE "HTTP/|cache-control" || true
echo

echo "== /api/v1/leads (should be no-store) =="
curl -sI "$BASE/api/v1/leads" | grep -iE "HTTP/|cache-control" || true
echo
