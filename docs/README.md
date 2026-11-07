# Documentation

Index and conventions for this folder. One doc type per folder; the folder and the
frontmatter `status` tell you the state.

| Folder | Holds |
|---|---|
| adr/ | Architecture decisions, numbered, immutable once accepted |
| backlog/ | Queue layout: `inbox.md`, `wro-fe-2027.md` (Doing/Next/Later/Someday), `done/` per month |
| ideas/ plans/ designs/ | The path from thought to build |
| reviews/ changes/ | Dated records; never rewritten |
| guides/ methodology/ | Living procedures and working rules. Rules digests (cited, PDF page per fact): [field](guides/rules-field.md), [senior missions](guides/rules-senior-missions.md), [advanced missions](guides/rules-advanced-missions.md), [general](guides/rules-general.md) |
| templates/ archive/ | Doc templates; finished or obsolete docs |

Folders are created lazily, when the first doc exists.

Rules: frontmatter on every doc; relative links; drafts older than 2 months are promoted
or deleted; moving a file changes its state.
Routine: capture daily, triage weekly, prune monthly.
Check: `python3 .claude/skills/docs-architect/scripts/docs_lint.py docs`
