# wro-fe-2027 — agent guide

Working repo for the WRO 2027 Future Engineers challenge. Source of truth is the two rulebook PDFs in the repo root. Goal: a Three.js app that visualises the challenge (field, objects, constraints) and what the robot should do in each scenario, with the rule limits made visible. Not in scope: robot firmware, hardware design.

## Commands

- Build: TBD (app not scaffolded yet)
- Test: TBD
- Lint: TBD

## Layout

- `WRO-2027-Future-Engineers-Game-Rules.pdf`: game rules (13 MB, read by page range, never whole).
- `WRO-2027-Future-Engineers-General-Rules.pdf`: general rules.
- `docs/`: to be scaffolded with the `docs-architect` skill (rules digest, ADRs, plans).
- `.claude/skills/`, `.rsk/`: managed by `rsk`; do not edit by hand.

## Conventions

- Every rule, dimension or scoring value shown in the app cites its PDF and page. Extract once into a rules digest under `docs/`, then work from the digest, not the PDFs.
- Scenarios are data (declarative config), rendered by the Three.js scene; the rules logic stays separate from rendering so it can be unit tested.
- Units are explicit (mm/cm/s) in names or types.

## Boundaries

- Always: use `token-economy`; read PDFs by page range or extract text to a file first.
- Ask first: adding dependencies, choosing the app stack, installing more skills.
- Never: guess a rule value that is not in the PDFs; mark it as an open question instead.
