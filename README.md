# Thunder Unicorn 13 — NPM source split

Mechanically split from the supplied single-file HTML into an NPM/Vite source tree.

## Environment
- Node.js 18.20.8 compatible
- Vite 6.4.3

## Run
```powershell
npm install
npm run dev
```

## Build to ./release/index.html
```powershell
npm run release
```

## Structure
- `index.html` — page/UI shell
- `src/style.css` — original CSS
- `src/core.js` — canvas, resize, constants, utilities
- `src/state.js` — game state and object arrays
- `src/game/entities.js` — cloud/unicorn/background generation
- `src/game/weapon.js` — charging, firing, arrows
- `src/game/collision.js` — collision and rescue rules
- `src/game/weather.js` — rain/rainbow
- `src/game/effects.js` — particles/impact effects
- `src/game/update.js` — moving objects and assistance timer
- `src/render.js` — canvas rendering
- `src/input.js` — pointer/touch/keyboard input
- `src/audio/audio.js` — thunder sound
- `src/ui/ui.js` — HUD/start/restart
- `src/ui/debug.js` — debug switches
- `src/main.js` — initialization and main loop

This stage intentionally avoids gameplay redesign or optimization; the goal is source separation first.
