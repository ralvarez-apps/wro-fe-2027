---
status: active
project: wro-fe-2027
date: 2026-11-07
related: [plans/2026-11-07-threejs-visualiser.md]
---

# Senior missions digest

Source: WRO 2027 Future Engineers Game Rules, pp.15-20. Page cites in `(p.N)`.

## Senior Mission 1 - Rack Clearance

### Field setup and randomization
- Five empty open boxes at randomly selected storage locations (p.15).
- Five of nine Rack units randomly selected before each round (p.15).
- One open box on the middle level of each selected Rack unit, standard placement per Section 2.7.1 (p.15).
- Nine dot cards from Mission 2 may be used for the randomization (p.15).
- Remaining four Rack units and the Workbench are empty (p.15).
- Rack numbering is Figure 14 (p.15). Example selection: Racks 2, 3, 4, 7, 9 (p.15).
- Fig 14 layout: 3 Rack rows x 3 units. Row A = 1-2-3, row B = 4-5-6, row C = 7-8-9; numbers run along each row from the Workbench end (1, 4, 7) to the open front end (3, 6, 9); row 1-3 is nearest Charging Station A (left), row 7-9 nearest the hazard-striped right wall (p.15, fig; reading from the isometric view, the Workbench end is where the FUTURE ENGINEERS logo is). Same orientation holds in Advanced Fig 25 (rows labelled Rectangular block / Cylinder / Pyramid, p.27).
- Example boxes sit on the middle of the three levels of Racks 2, 3, 4, 7, 9 (fig, p.15); the middle level is level 2 (top surface 225 mm above floor, see rules-field.md).
- Time limit per official run: 3 minutes, Secret Mission attempts included (General Rules p.18; see rules-general.md).
- Same randomized setup for all teams in the same round; judges verify box Rack and orientation before each run (p.15).
- Possible configurations: any 5-subset of Racks 1-9 (the 5-of-9 selection, p.15). Count 126 = C(9,5) is derived, not stated.

### Tasks (ordered)
1. Team picks either Charging Station as start; robot positioned per Section 2.8 (p.15).
2. Robot started, then acts autonomously (p.15).
3. Navigate through the Smart Warehouse field (p.16).
4. Locate the five boxes (p.16).
5. Remove them from the Racks (p.16).
6. Transport them to the Workbench (p.16).
7. Place them on the upper surface of the Workbench (p.16).
8. Return to either Charging Station (p.16).
- Boxes may be retrieved and transported in any order (p.16).
- End Charging Station need not equal the start one (p.16).

### Scoring (max 150, p.16)
| Item | Pts each | Total |
|---|---|---|
| Robot completely leaves starting Charging Station | 5 | 5 |
| Box removed from a Rack | 3 | 15 |
| At least one box completely inside Workbench Zone (even if not upright) | 10 | 10 |
| At least one box completely outside Storage Zone (even if not upright) | 10 | 10 |
| Box completely placed on Workbench | 10 | 50 |
| Box partially placed on Workbench | 5 | 25 |
| Box placed upright anywhere on game mat | 2 | 10 |
| Robot successfully parked at a Charging Station (awarded only if at least one point scored in the tasks above) | 10 | 10 |
| Surprise Rule | 50 | 50 |

- Repair actions (robot taken out of the field, even if unsuccessful): total round divided by factor 2 (p.16).

### Box placement conditions
- Completely on Workbench: box upright, entire base resting directly on the Workbench upper surface, 10 pts (p.17).
- Partially on Workbench: upright, part of base on the Workbench upper surface, rest beyond its edge, 5 pts (p.17).
- Upright on floor: base on the game mat, 2 pts (p.17).
- Box must be fully released and stay in position with no support or stabilization from the robot (p.17).
- Tilted, on side or upside down: no placement points, on Workbench or floor (p.17).
- Stacked boxes: only a box resting directly on the Workbench may score; a box on top of another scores nothing (p.17).
- Figure 15 example: boxes 1 and 3 completely on Workbench (10 each); 2 and 4 partial (5 each); 5 upright on floor (2); 6 and 7 score 0 (p.17).

## Senior Mission 2 - Order Picking

### Field setup and randomization
- One empty open box on the middle Rack level of each of the nine Rack units, standard placement per Section 2.7.1 (p.17).
- Five cards with order list info placed in the Order List Areas on the game mat, indicating which five boxes to collect (p.17).
- Randomization procedure (p.18):
  1. Nine dot cards (Rack units 1-9) shuffled, face down.
  2. One judge draws five cards without replacement.
  3. The five cards are placed face up in Order List Areas 1-5, one per area; Area 6 stays empty.
  4. Dot patterns correspond to Rack numbering in Figure 14.
  5. Boxes in the five selected Racks form the order to collect.
- Remaining four boxes must remain on their original Racks (p.18).
- Same order list for all teams in the same round (p.18).
- Judges verify before each run: one box on the middle level of every Rack; all boxes positioned per Section 2.7.1; five selected Dot Cards face up in Areas 1-5 (p.18).
- Dot cards: nine in total (Figure 16), each 120 mm x 80 mm; print files in Appendix B (p.18).
- Example (Figure 17): drawn cards 7, 6, 4, 8, 2 in Areas 1-5, next to the Workbench; Area 6 always empty (p.18).
- Figure 18 shows the matching setup: requested boxes with green circles, others with black circles (p.19).
- Possible configurations: any 5-subset of Racks 1-9, plus an assignment of the five cards to Areas 1-5 (draw order, p.18). Counts are derived, not stated.

### Tasks (ordered, p.19)
1. Team picks either Charging Station as start; positioned per Section 2.8 (p.19).
2. Robot started, then acts autonomously (p.19).
3. Navigate to the Order List Areas.
4. Read the order list.
5. Identify the five requested Rack units.
6. Navigate through the Smart Warehouse field.
7. Retrieve only the requested boxes from the Racks.
8. Transport them to the Workbench.
9. Place them on the upper surface of the Workbench.
10. Return to either Charging Station.
- Any retrieval order; end Charging Station need not equal the start one (p.19).
- Forbidden: manually entering the selected Rack unit numbers or any order list info into the robot after randomization is complete (p.19).

### Scoring (max 150, p.20)
| Item | Pts each | Total |
|---|---|---|
| Robot completely leaves starting Charging Station | 1 | 1 |
| Requested box removed from a Rack | 3 | 15 |
| Unrequested box remains in original Rack position* | 1 | 4 |
| At least one requested box completely inside Workbench Zone (even if not upright) | 10 | 10 |
| At least one requested box completely outside Storage Zone (even if not upright) | 10 | 10 |
| Requested box completely placed on Workbench | 10 | 50 |
| Requested box partially placed on Workbench | 5 | 25 |
| Requested box placed upright anywhere on game mat | 2 | 10 |
| Robot successfully parked at a Charging Station (awarded only if at least one point scored in the tasks above) | 10 | 10 |
| Surprise Rule | 50 | 50 |

- *Unrequested-box points only if the robot removed at least one requested box from a Rack (p.20).
- Repair actions (robot taken out of field, even if unsuccessful): total round divided by factor 2 (p.20).
- Box placement conditions are stated under Mission 1 (p.17); Mission 2 table applies them to requested boxes (p.20).

## Senior overall scoring (p.20)
| Component | Max pts | % |
|---|---|---|
| Senior Mission 1 - Rack Clearance | 150 | 30% |
| Senior Mission 2 - Order Picking | 150 | 30% |
| Secret Mission | 100 | 20% |
| Engineering Documentation | 100 | 20% |
| Total | 500 | 100% |

## Scenarios to animate

Common: start at either Charging Station (p.15, p.19); finish at either Charging Station (p.16, p.19).

1. M1, any Rack subset S of 5 (example S = {2,3,4,7,9}, p.15):
   leave start station -> navigate warehouse -> locate boxes in S -> remove each from its Rack -> carry to Workbench -> place upright on Workbench upper surface (full release, no robot support) -> repeat in any order until five delivered -> park at a Charging Station (p.15-17).
2. M1 partial/fallback outcomes to show scoring: box partially on Workbench (5), upright on floor (2), tilted/stacked (0) (p.17).
3. M2, order cards C in Areas 1-5 (example 7, 6, 4, 8, 2, p.18):
   leave start station -> go to Order List Areas -> read cards -> map dot patterns to Rack numbers (Figure 14) -> navigate warehouse -> retrieve only the Racks in C, leaving the other four boxes in place -> carry to Workbench -> place on upper surface -> park at a Charging Station (p.18-19).
4. Start station variants: either Charging Station (p.15, p.19); end station may differ (p.16, p.19).

## Scoring and limits as data

| Key | M1 | M2 | Cite |
|---|---|---|---|
| leaveStart | 5 | 1 | p.16, p.20 |
| boxRemoved (each, max 5) | 3 | 3 (requested) | p.16, p.20 |
| unrequestedStay (each, total 4) | n/a | 1* | p.20 |
| inWorkbenchZone | 10 | 10 | p.16, p.20 |
| outStorageZone | 10 | 10 | p.16, p.20 |
| boxOnWorkbench full (each) | 10 | 10 | p.16, p.20 |
| boxOnWorkbench partial (each) | 5 | 5 | p.16, p.20 |
| boxUprightFloor (each) | 2 | 2 | p.16, p.20 |
| parked | 10 | 10 | p.16, p.20 |
| surprise | 50 | 50 | p.16, p.20 |
| repairPenalty | round / 2 | round / 2 | p.16, p.20 |
| maxScore | 150 | 150 | p.16, p.20 |
| boxesInvolved | 5 of 9 Racks | 5 of 9 Racks | p.15, p.17 |
| dotCardSize | n/a | 120 mm x 80 mm | p.18 |
| orderListAreas | n/a | 6 (1-5 used, 6 empty) | p.18 |

## Open questions
- Surprise Rule content is not defined in the Game Rules PDF (only 50 pts, p.16, p.20); announced by organisers per General Rules p.14-15.
- Secret Mission contents not on pp.15-20.
- Mission 1 box orientation: only "correct orientation" and standard placement (upright, open side up, Section 2.7.1, p.11) are stated; nothing finer.
- Mission 2: card placement order in Areas 1-5 is by draw order, but whether the order matters for scoring is not stated.
