#!/bin/bash
# Сторож туннеля. Раз в минуту: если cloudflared потерял соединение (после сна Мака
# quick tunnel не восстанавливается сам, а старое имя умирает) — перезапускаем задание.
# Текущий адрес всегда лежит в PUBLIC-URL.txt рядом с рабочей копией.
LOG=/tmp/card-tunnel.log
OUT="$HOME/Library/Application Support/saltykov-card/PUBLIC-URL.txt"
LABEL=com.dmitrii.card-tunnel

url=$(grep -o 'https://[a-z0-9-]*-[a-z0-9-]*\.trycloudflare\.com' "$LOG" 2>/dev/null | tail -1)
code=000
[ -n "$url" ] && code=$(curl -s -o /dev/null -m 12 -w '%{http_code}' "$url/" 2>/dev/null)

if [ "$code" = "200" ]; then
  [ -f "$OUT" ] && [ "$(cat "$OUT")" = "$url" ] || echo "$url" > "$OUT"
  exit 0
fi

# локальный сервер должен быть жив, иначе перезапуск туннеля бессмыслен
if ! curl -s -o /dev/null -m 5 http://127.0.0.1:8031/; then
  launchctl kickstart -k "gui/$(id -u)/com.dmitrii.card-preview" 2>/dev/null
  sleep 3
fi

echo "$(date '+%F %T') туннель мёртв ($code), перезапуск" >> /tmp/card-watchdog.log
launchctl kickstart -k "gui/$(id -u)/$LABEL" 2>/dev/null
sleep 15
url=$(grep -o 'https://[a-z0-9-]*-[a-z0-9-]*\.trycloudflare\.com' "$LOG" 2>/dev/null | tail -1)
[ -n "$url" ] && echo "$url" > "$OUT" && echo "$(date '+%F %T') новый адрес $url" >> /tmp/card-watchdog.log
