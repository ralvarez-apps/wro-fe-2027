# wro-fe-2027 — agent guide

Working repo for the WRO 2027 Future Engineers challenge. Source of truth is the two rulebook PDFs, kept locally in the repo root and gitignored (copyrighted by the WRO Association; never commit them). Goal: a Three.js app that visualises the challenge (field, objects, constraints) and what the robot should do in each scenario, with the rule limits made visible. Not in scope: robot firmware, hardware design.

## Commands

- Dev: `pnpm dev` (Vite, http://localhost:5173)
- Build: `pnpm build` (typecheck + static bundle in `dist/`)
- Test: `pnpm test` (vitest, rules and planner logic)
- Lint: `pnpm lint` (tsc strict; no eslint yet)
- Deploy: `pnpm deploy` (build, then Cloudflare Worker static assets at `$SITE_HOST$SITE_PATH`; config in `.env`, see `.env.example`). `pnpm deploy:dry` checks the config only.
- Screenshot smoke: `pnpm build && pnpm preview --port 4173`, then `CHROMIUM_PATH=<chrome> node scripts/screenshot.mjs`

## Layout

- `WRO-2027-Future-Engineers-Game-Rules.pdf`: game rules (13 MB, read by page range, never whole). Local only, gitignored.
- `WRO-2027-Future-Engineers-General-Rules.pdf`: general rules. Local only, gitignored.
- `docs/`: docs-architect tree; `docs/guides/rules-*.md` are the cited rules digests, `docs/adr/` decisions, `docs/backlog/` queue.
- `src/rules/`: field geometry, limits, scoring as typed data, each with a PDF-page `Cite` (kinds: text, figure, derived, assumed).
- `src/scenarios/`: declarative `ScenarioSetup` → `buildPlan` (waypoint graph + Dijkstra) → `stateAt(plan, t)`. Pure TS, no React/Three.
- `src/scene/`: react-three-fiber rendering only; reads `live.current` per frame.
- `src/ui/`, `src/state/`: panels and the zustand store.
- `tests/`: vitest for rules and planner.
- `wrangler.jsonc`, `scripts/deploy.mjs`, `deploy/_headers`: static-assets Worker; the build is emitted to `dist/fe/2027/` because assets are matched by full path.
- `.claude/skills/`, `.rsk/`: managed by `rsk`; do not edit by hand.

## Conventions

- Every rule, dimension or scoring value shown in the app cites its PDF and page. Extract once into a rules digest under `docs/`, then work from the digest, not the PDFs.
- Scenarios are data (declarative config), rendered by the Three.js scene; the rules logic stays separate from rendering so it can be unit tested.
- Units are explicit (mm/cm/s) in names or types.
- Coordinates: mm, origin at the Workbench-wall/left-wall corner, x across the width, z toward the open front, y up. Scene recentres via `toScene`.
- Anything the rulebook does not dimension uses an `assumed` cite and shows up in the UI as such; never present it as a rule.

## Boundaries

- Always: use `token-economy`; read PDFs by page range or extract text to a file first.
- Ask first: deploying to production, adding dependencies, choosing the app stack, installing more skills.
- Never: guess a rule value that is not in the PDFs; mark it as an open question instead.
