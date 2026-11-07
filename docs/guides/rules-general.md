---
status: active
project: wro-fe-2027
date: 2026-11-07
related: [plans/2026-11-07-threejs-visualiser.md]
---
# General rules digest

Source: WRO 2027 Future Engineers General Rules, version 2 November 2026 (p.1). Page refs `(p.N)` are PDF pages. Season-specific field, missions and scoring live in the Game Rules, not here.

## Robot size, weight, structure

- Max 50 cm length, 50 cm width, 50 cm height before the run starts; includes all components, attachments and cables (p.8).
- After the run starts the robot may extend/unfold/change dimensions autonomously (p.8).
- Max weight 6.0 kg (p.8).
- Single self-contained mobile robot; must not use field elements for structural support; no mechanisms that bridge/span/cover a substantial part of the field (p.8).
- No flying robots (p.8).
- One registered competition robot per team (p.8). Spare parts and assembled replacement modules allowed if together they are not a second complete/operational robot (p.8).

## Materials, controllers, sensors, software

- Any platform, kit or material; commercial and custom parts (3D-printed, laser-cut, CNC, wood, plastic, metal) (p.7).
- Any type and number of controllers, onboard computers, sensors, cameras, LiDAR, motors, actuators, subject to other technical and safety rules (p.7).
- Any language, framework, computer-vision system or AI model (p.7).
- All computing and electronics needed for a run must be on the robot (p.7).
- Wheels/tracks must not damage the game mat or leave residues (p.9).
- No exposed sharp edges, open flames, hazardous substances (p.8). Damage to field or game objects = disqualification (p.9).

## Power

- Onboard power only; no external cables or connections to outside equipment during a run (p.8).
- Any battery type, brand, count, within organizer safety rules (p.8). Batteries secured, used per manufacturer spec; wiring protected against shorts (p.8).
- Charging/replacement follows organizer procedure (p.8). Charging in quarantine only in supervised areas, no software changes (p.16).

## Safety and control hardware

- Easily accessible physical stop control that stops moving mechanisms without software (p.10).
- Single power switch; single physical Start button on the robot (may be on the main controller) (p.10).
- Judges may inspect for safety and bar the robot until fixed (p.9).

## Autonomy and communication (forbidden)

- Fully autonomous after start; no manual/remote control or human assistance (p.9).
- All processing onboard (p.9).
- No communication with external computers, phones, remotes, networks, cloud, or any outside equipment during a run (p.9).
- Onboard component-to-component links wired only; wireless between onboard parts prohibited in official runs (p.9).
- Allowed: preinstalled software, trained AI models, stored maps, config files prepared beforehand (p.9).
- All equipment stays attached to the robot for the whole run; no leaving sensors, markers, beacons, cables on the field (p.9, p.10).
- After randomization, no entering randomized-setup info by software settings, button combos, sensor inputs or physical reconfiguration (p.10). Robot must detect it autonomously (p.17).
- No visual, acoustic, wireless or other signals to influence the robot during a run (p.10).
- Practice only: laptops via wired or local wireless (Wi-Fi/Bluetooth/radio) for debug/calibration; no Internet; all wireless functions disabled before inspection/quarantine and during runs (p.16).

## Robot attempt procedure

- Start: robot switched off when released from quarantine and brought to field; placed in the Game Rules start position (p.10, p.17).
- Before the start signal the team may switch on via the single power switch; robot then waits stationary (p.10).
- On the judge's start signal one team member presses the single Start button; it must launch the mission directly, with no menu, program selection or parameter input (p.10).
- No adjustments or calibration between quarantine release and run (p.17).
- Team may verify field setup before the run; report concerns before start (p.17).
- Duration: max 3 minutes per official run, Secret Mission attempts included (p.18). Run begins at the start signal (p.18).
- Run ends on: 3 min expiry; team member says "STOP!"; robot completed mission, final stop and team confirms; judge stops it for safety or a rule-defined reason (p.18).
- After time expiry judge tells team to stop; later actions score nothing (p.18). Early end allowed, partial points scored (p.18).
- Touching: after start, no touching robot, field or game objects, except emergency stop for immediate safety risk or with judge permission (p.10).
- Judge may stop a robot for safety; run ends (p.10).
- Repair (p.18-19):
  - Request judge permission; one member removes robot and repairs it off-field; timer keeps running (p.18).
  - May repair or restart; must not change/replace/select program, change mission parameters, enter randomized-setup info, or alter configuration beyond restoring operation (p.18).
  - Game objects are not reset; held objects stay on field, judge places them near the removal position, no points awarded for that (p.18).
  - Robot returns to its original start position and restarts per Chapter 6 procedure (p.18).
  - Max one repair per run (p.19). Score reduced by 50% regardless of repair success (p.19).
  - If time expires during repair the run ends, no restart; score counts conditions met before, with the penalty (p.19).
- After run: robot and objects stay in place until scoring is done; judge records score and time; team member verifies and signs the score sheet; disagreements raised before signing (p.19).
- Run counts: 2 official runs Mission 1, 2 official runs Mission 2 (p.15). Secret Mission: multiple declared attempts in 180 min, each 3 min (p.14, p.18).

## Scoring and penalties

- Overall score weights: Mission 1 30%, Mission 2 30%, Secret Mission 20%, Engineering Documentation 20% (p.15).
- Secret Mission max 100 points (p.15). Engineering Documentation max 100 points (p.13).
- Best result per mission counts: best of Mission 1 runs, best of Mission 2 runs, best Secret attempt (p.19).
- Repair penalty: -50% of the run's total (p.19).
- Damage to field or game objects: disqualification (p.9).
- Each Surprise Rule folds into its mission's scoring (p.14).
- Per-task points are in the Game Rules (p.15, p.19).
- Documentation judged on 5 equal criteria, levels A-D, via repo and docs (details Appendix A, pp.20-27, not digested); format rules pp.10-13 not digested (p.13).

## Tournament procedure (International Events)

- Two days: Day 1 = 2 runs Mission 1 then Secret Mission; Day 2 = 2 runs Mission 2 (p.14). Mission 1, Mission 2 and Secret Mission mandatory (p.14).
- Day 1 schedule (p.15-16): 105 min Mission 1 Surprise Rule announcement and practice; 30 min Round 1; 105 min practice; break; 30 min Round 2; 180 min Secret Mission announce + prep + practice + banked attempts.
- Day 2 schedule (p.16): 105 min Mission 2 Surprise Rule announcement and practice; 30 min Round 1; 135 min practice; break; 30 min Round 2.
- Practice on fields: one team at a time; each attempt max 5 min, then leave and requeue (p.16).
- Inspection at end of each prep/practice period for size, weight, communication, safety; failing robot gets up to 3 min to fix, only one such correction per official run, otherwise skips that run (p.16).
- After inspection the robot is switched off and held in quarantine; no access, changes or calibration without judge permission (p.16).
- Randomization after all robots are in quarantine; same setup for all teams in the same round; may re-randomize for later rounds (p.17).
- Robot released from quarantine only when its team is called (p.17); returned to quarantine/team area afterwards (p.17).
- Secret Mission (p.14, p.17-18):
  - Announced Day 1 after both Mission 1 rounds; not disclosed earlier (p.14).
  - 180 min combined prep, practice and official attempts, starting at announcement (p.14).
  - Quarantine and fixed rounds do not apply between attempts (p.17).
  - Team must declare an attempt before it starts; no retroactive conversion (p.17). Judge checks compliance first (p.17).
  - Result stays valid after later modification or attempts (p.17). No adjustments once an attempt is authorized (p.18).
  - Every team gets at least one attempt; first attempts take priority; no new attempt after the period ends (p.18).
- Same number of runs and equivalent conditions for all teams in an age group (p.14).
- National events may adapt schedule, Surprise Rules and Secret Mission (p.14).

## Ranking and tie-breaks

- Ranked separately for Senior and Advanced (p.19).
- Best Secret Mission attempt is used; equal top score -> shortest elapsed time (p.19).
- Tie-break order (p.19): 1 higher Secret score; 2 shorter Secret time; 3 higher best Mission 2 score; 4 shorter best Mission 2 time; 5 higher best Mission 1 score; 6 shorter best Mission 1 time; 7 higher Engineering Documentation score; 8 higher second-best Mission 2 score; 9 shorter second-best Mission 2 time; 10 higher second-best Mission 1 score; 11 shorter second-best Mission 1 time.
- Still tied after all criteria: share the same position (p.19).

## Rule hierarchy

- Two documents: General Rules (framework) and Game Rules (season missions, field, scoring) (p.6).
- Order (p.7): I General Rules; II Game Rules, which win where they explicitly set a different requirement for a mission or game element; III official Q&A may clarify, supplement or override either document; IV judges apply and interpret.
- Official Q&A is binding (p.6). Updates may be published in-season; teams must check latest versions (p.6).
- Uncovered situations: judges decide from the rules, fair play and challenge intent; judges have final authority, reviewable on new information (p.7).
- International events use WRO rules; national organizers may adapt with advance notice (p.6-7).

## Documentation format (one line)

Public GitHub repo with full code and README, public Engineering Documentation in English, link submitted at least 20 days before an international event; scored 100 points = 20% of overall (p.11-13).

## Robot limits as data

| Limit | Value | Unit | Page |
|---|---|---|---|
| Max length | 50 | cm | 8 |
| Max width | 50 | cm | 8 |
| Max height (before start) | 50 | cm | 8 |
| Max weight | 6.0 | kg | 8 |
| Robots per team | 1 | robot | 8 |
| Run duration | 3 | min | 18 |
| Repairs per run | 1 | count | 19 |
| Repair score penalty | 50 | % | 19 |
| Inspection fix time (once per run) | 3 | min | 16 |
| Practice attempt on field | 5 | min | 16 |
| Official runs Mission 1 / Mission 2 | 2 / 2 | runs | 15 |
| Secret Mission window | 180 | min | 14 |
| Secret Mission max score | 100 | points | 15 |
| Weights M1 / M2 / Secret / Docs | 30 / 30 / 20 / 20 | % | 15 |
| Start buttons / power switches | 1 / 1 | count | 10 |
| Onboard-to-external comms in run | 0 (forbidden) | n/a | 9 |
| Onboard wireless in run | 0 (forbidden) | n/a | 9 |
| Flight | forbidden | n/a | 8 |

## Open questions

- Rule 6.19 cites "Chapters 10 and 12" for scoring/penalties after a safety stop; the document has no Chapter 12 (p.10). Safety-stop scoring is only described in Chapter 10 (p.18).
- Dimension rule (5.6) says "before the start of an official run"; measured pose (folded, at start position) vs. Game Rules start-area limits is not stated here (p.8).
- No numeric limits on battery voltage/capacity, motor count, or sensor count; "organizer safety requirements" are not given in this PDF (p.8).
- Rule 9.4 says the Surprise Rule is announced on the morning of the competition day; 8.10 says before the first practice period of the mission (p.14-15). Treated as compatible; not confirmed.
- Practice durations differ (Day 1 second practice 105 min, Day 2 135 min); no reason given (p.15-16).
- Emergency-stop touch: "immediate safety risk" is undefined; consequence for score of an emergency stop beyond ending the run is not stated (p.10).
- Pages 20-27 (documentation rubric) were skimmed only; no robot limits found there.
