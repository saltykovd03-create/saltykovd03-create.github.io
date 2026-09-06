#!/bin/bash
# Обновить рабочую копию, которую отдаёт локальный сервер (launchd не может читать Desktop).
set -e
cd "$(dirname "$0")"
DEST="$HOME/Library/Application Support/saltykov-card"
mkdir -p "$DEST"
cp index.html style.css script.js serve.py og.png "$DEST/"
echo "✓ рабочая копия обновлена: $DEST"
cat "$DEST/PUBLIC-URL.txt" 2>/dev/null || grep -o 'https://[a-z0-9-]*-[a-z0-9-]*\.trycloudflare\.com' /tmp/card-tunnel.log | tail -1
