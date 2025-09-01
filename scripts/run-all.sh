#!/usr/bin/env bash
set -e
npm run seed
npm run build
echo "[OK] Built. View with: npm start (Codespaces will auto-forward port 8080)"
