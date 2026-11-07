---
status: active
project: wro-fe-2027
date: 2026-11-07
related: [backlog/wro-fe-2027.md, adr/0001-app-stack-vite-react-r3f.md]
---

# Three.js visualiser for WRO 2027 Future Engineers

## Scope
In: a Three.js app that shows the field, objects and constraints from the two rulebook PDFs, and animates what the robot should do per scenario, with rule limits made visible. Every value cites PDF + page.
Out: robot firmware, hardware design.

Decided 2026-11-07: study/teaching tool; Senior and Advanced in v1; static site, no backend; stack per [ADR 0001](../adr/0001-app-stack-vite-react-r3f.md).

## Phases
1. Rules digest — extract both PDFs to text, write a cited digest under `docs/` (field, objects, scoring, limits, scenarios, open questions).
2. Design — app stack ADR, scenario data schema, scene/rules-logic split.
3. Scaffold — app, build/test/lint commands, fill them into `AGENTS.md`.
4. Static scene — field and objects from the digest.
5. Scenarios — declarative scenario configs plus robot path playback and limit overlays.
6. Verification — unit tests for rules logic, Playwright screenshots of the scene.

## Exit criteria
- [x] v1 built: all four missions playable; rules logic tested separately from rendering.
- [ ] Each rule or value shown in the app has a PDF page citation.
- [ ] Every scenario in the rulebooks is playable.
- [ ] Rules logic is tested separately from rendering.
