---
adr: 1
status: accepted
date: 2026-11-07
project: wro-fe-2027
---

# App stack: Vite + TypeScript + React + react-three-fiber

## Context
The app is a study/teaching visualiser for the WRO 2027 Future Engineers Smart Warehouse challenge. It covers Senior and Advanced categories (four missions), shows the field, objects and rule limits, and plays what the robot should do per scenario. It needs scenario pickers, step controls and limit/scoring overlays around a 3D scene. No backend, no team data. Rules values come from the digests in `docs/guides/` and every value cites its PDF page.

## Options considered
- **Vite + TS + plain Three.js** — least surface and framework-free scene; UI panels are hand-built.
- **Vite + TS + React + react-three-fiber** — declarative scene, simple state-driven panels (scenario, step, overlays); adds React and r3f.
- **Other UI frameworks** — no advantage for this scope.

## Decision
Vite + TypeScript (strict) + React + react-three-fiber (with drei as needed). Static build, deployable to any static host. Rules data and scenario logic live in plain TypeScript modules with no React or Three.js imports, so they are unit tested on their own; the r3f layer only renders state.

## Consequences
Rich UI panels and scenario state are easy. Scene performance needs care with React re-renders (keep per-frame animation out of React state). Adds React and r3f dependencies. The `react-architect` skill becomes relevant. Revisit if the scene outgrows r3f.
