# Apartment Walkthrough Demo

A 116-second 3D apartment walkthrough built with React, Three.js, React Three Fiber, and Editframe project tooling.

The scene translates a 3-bedroom floor plan into a walkable apartment with walls, balconies, room connections, furniture, PBR-style materials, room labels, and a timed camera path through the foyer, dining, living room, balcony, kitchen, bedrooms, bathrooms, and master balcony.

## Quick Start

```bash
npm install
npm start
```

The default browser route plays the walkthrough preview. Top-down and fixed-time debug views are available through query parameters.

## Render

```bash
npm run render
```

The render script starts a local Vite server, records the WebGL canvas route, and saves the export to `output/demo.mp4`.

The script uses a direct canvas recording path because browser-cloned WebGL composition capture can miss the active Three.js camera buffer on this scene. For a slower but more frame-accurate capture, set `EXPORT_MANUAL_FRAMES=1`.

## Useful Options

```bash
EXPORT_WIDTH=1920 EXPORT_HEIGHT=1080 npm run render
EXPORT_DURATION_SECONDS=15 npm run render
EXPORT_OUTPUT=output/preview.mp4 npm run render
```

See [CREDITS.md](CREDITS.md) for asset notes.
