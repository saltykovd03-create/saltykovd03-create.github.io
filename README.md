# Визитка Дмитрия Салтыкова — сайт

Статика по плейбуку sites-playbook: `index.html` + `style.css` + `script.js`, без сборки.
GSAP ScrollTrigger с cdnjs для стопки карточек, шрифты Google Fonts (Geologica / Golos Text / IBM Plex Mono).

## Публичный адрес

**https://saltykovd03-create.github.io/** — GitHub Pages из репозитория `saltykovd03-create/saltykovd03-create.github.io`
(личный аккаунт). Публикация: `git add <файлы> && git commit && git push`, сайт обновляется за минуту.
Шрифты и GSAP лежат внутри (`fonts/`, `js/`): Cloudflare и Google из России открываются не всегда.

## Локальное превью (запасной туннель)

Тот же контур, что у Посновой и Высоты29: локальный сервер на порту 8031 из рабочей копии
`~/Library/Application Support/saltykov-card` (launchd не может читать Desktop), cloudflared quick tunnel,
сторож раз в минуту. Плисты в `launchd/`, уже поставлены в `~/Library/LaunchAgents`.

```
./push.sh                      # скопировать правки в рабочую копию и напечатать публичный адрес
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/card-tunnel.log | tail -1
```

**Адрес меняется при перезапуске туннеля** (перезагрузка Мака, долгий сон). Для рассылки нужен
постоянный домен: Cloudflare Pages или любой шаред-хостинг, три файла + og.png.

## Правки

- Версии `?v=` у style.css и script.js бить при каждой правке.
- `og.png` — превью для Telegram, снимается с первого экрана: `python3 og.py` при живом сервере.
  В `<meta property="og:image">` абсолютный адрес, при смене домена обновить.
- Контакты: t.me/shabb1on и tel:+79027045877, все кнопки ведут туда напрямую.
- Аналитики нет: перед первой рассылкой поставить счётчик Метрики и цели на клики по Telegram.

## Проверка

`python3 shots.py` в scratchpad снимает десктоп 1440×900 и iPhone 13 по всей длине, аккордеон и вкладки.
