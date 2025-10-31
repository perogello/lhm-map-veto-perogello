# CS2 Map Veto HUD (for Lexogrine HUD Manager)

Мини‑HUD для ленты **пиков/банов карт** в CS2. Работает внутри **Lexogrine HUD Manager (LHM)** и читает его матч‑данные (вето, команды, логотипы).


## Быстрый старт
```bash
# установка
npm install

# сборка и упаковка
npm run build
npm run pack
# получится архив HUD (обычно veto-hud.zip) — импортируйте его в LHM (HUDs → Import)
```

## Обновление изображений карт (из официальных источников)
В репозитории есть простой скрипт.

Запустите:
```bash
npm run get-maps   # скачает /public/maps/de_*.png с Valve Dev Wiki
```
HUD уже умеет подхватывать .png (сделал fallback jpg → png).
Если какой‑то карты нет — просто положите её изображение вручную в `public/maps/`.

## Где лежат файлы
```
public/
└─ maps/
   ├─ de_mirage.png | .jpg
   ├─ de_nuke.jpg
   └─ default.png      # плейсхолдер для пустых слотов (idle)

src/
├─ global-reset.css    # (необязательно) сброс отступов/рамок под 1920×1080
└─ HUD/
   └─ VetoStrip/
      ├─ VetoStrip.tsx
      └─ vetostrip.scss
```


## Лицензия
MIT (или укажите свою).
