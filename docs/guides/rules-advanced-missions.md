---
status: active
project: wro-fe-2027
date: 2026-11-07
related: [plans/2026-11-07-threejs-visualiser.md]
---

# Advanced missions digest

Source: WRO 2027 Future Engineers Game Rules, pp.21-32 (Section 4 and appendices). Sections 2.x and 3.x are referenced by the rules but not covered here.

## Advanced Mission 1 - Route Replanning

Builds on Senior Mission 2 - Order Picking, plus two closed aisles (p.21).

### Field setup and randomization

- Field setup and order list randomization of Section 3.2.1 (Senior Mission 2) apply (p.21).
- Before each round, two warehouse aisles are randomly selected and closed with maintenance cones (p.21). Aisle numbering is Figure 19 (p.21).
- Maintenance Cone: height 120 mm, base 85 x 85 mm, orange (HEX #FFBD3B) with two white stripes (p.21, p.22). Quantity 4, approx. 47 gr (p.32).
- First blocked aisle: Aisle 2 or Aisle 3, random (p.22).
- Second blocked aisle is forced so every Rack row stays accessible from at least one side (p.22):
  - Aisle 2 selected, so Aisle 4 also blocked (p.22).
  - Aisle 3 selected, so Aisle 1 also blocked (p.22).
- Two cones per blocked aisle, within the dashed orange squares on the game mat, four cones total (p.22).
- Starting Charging Station: left or right, random; robot must start from it (p.23).
- Robot placed per Section 2.8 (p.23).

### Mission tasks (ordered)

After start, robot must autonomously (p.23):
1. Navigate to the Order List Areas.
2. Read the order list.
3. Identify the five requested Rack units.
4. Detect the two blocked warehouse aisles.
5. Select an alternative route.
6. Navigate through the Smart Warehouse field.
7. Retrieve only the requested boxes from the Racks.
8. Transport them to the Workbench.
9. Place them on the upper surface of the Workbench.
10. Return to either Charging Station.

### Constraints and penalties

- No passing through a blocked aisle; no interacting with Rack units from the blocked side. Also applies to Aisles 1 and 4 even if there seems to be enough space (p.23).
- No passing over cones; no intentionally moving them (p.23).
- Touching a cone is allowed if the cone stays upright and at least part of it stays within or touching its dashed orange square (p.23).
- Judge stops the run immediately if the robot enters a blocked aisle, passes over a cone, knocks over a cone, or moves a cone completely outside its square. A fallen cone ends the run even if it is within or touching its square. Score is taken from robot and object positions at that moment (p.23).
- Boxes may be retrieved and transported in any order (p.23).
- End Charging Station need not equal the start one (p.23).
- Order list and blocked aisle configuration must not be entered manually after randomization; the robot must obtain all information itself (p.23).

### Scoring (max 150)

| Item | Points each | Total available | Page |
|---|---|---|---|
| Robot completely leaves starting Charging Station | 1 | 1 | p.24 |
| Requested box removed from a Rack | 3 | 15 | p.24 |
| Unrequested box remains in original position on Rack (only if at least one requested box was removed) | 1 | 4 | p.24 |
| At least one requested box completely inside Workbench Zone (even if not upright) | 10 | 10 | p.24 |
| At least one requested box completely outside Storage Zone (even if not upright) | 10 | 10 | p.24 |
| Requested box completely placed on Workbench | 10 | 50 | p.24 |
| Requested box partially placed on Workbench | 5 | 25 | p.24 |
| Requested box placed upright anywhere on game mat | 2 | 10 | p.24 |
| Robot successfully parked at a Charging Station (only if at least 1 point scored in mission tasks above) | 10 | 10 | p.24 |
| Surprise Rule | 50 | 50 | p.24 |
| Repairing actions (robot taken out of field, even if unsuccessful) | total round divided by factor 2 | - | p.24 |

Box placement scoring conditions of Section 3.1.3 also apply (p.24).

## Advanced Mission 2 - Product Classification

Four non-empty boxes on the Workbench, each holding a product; robot identifies the products and delivers boxes to the correct Rack rows while avoiding the cones (p.25).

### Field setup and randomization

- Workbench: four empty boxes upright on the upper surface, open side up, in a single row; 80 mm between adjacent boxes; 10 mm clearance from front and rear Workbench edges; Box 1 to Box 4 left to right (p.25, Figure 22).
- Products: 3D-printed, silver (HEX #E6E6E6): 2 cylinders, 2 pyramids, 2 rectangular blocks, six objects total (p.25). Weights approx. 13 gr, 8 gr, 16 gr respectively (p.32).
- Product placement: 4 of the 6 objects selected, one per box; the randomization fixes both which objects and which box. Each type may appear 0, 1 or 2 times (p.26).
- Each product is placed approximately at box centre, orientation as in Figure 24, resting completely on the box bottom (p.26).
- Example Figure 24: Box 1 pyramid, Box 2 cylinder, Box 3 pyramid, Box 4 rectangular block (p.26).
- Empty boxes on racks: three, on the middle levels, one per Rack row; the Rack unit within each row is random (p.26):
  - one in Rack units 1-3 (p.26)
  - one in Rack units 4-6 (p.26)
  - one in Rack units 7-9 (p.26)
- Rack boxes use the standard placement of Section 2.7.1; other Rack units stay empty (p.26). Example: Rack units 2, 6, 7 (p.26, Figure 25).
- Blocked aisles and starting Charging Station: same procedures as Section 4.1.1; cones placed; robot at selected station per Section 2.8 (p.27).

### Mission tasks (ordered)

Target mapping, on the unoccupied middle level (p.27):
- Rectangular block box goes to one of Rack units 1-3 (p.27).
- Cylinder box goes to one of Rack units 4-6 (p.27).
- Pyramid box goes to one of Rack units 7-9 (p.27).

After start, robot must autonomously (p.28):
1. Navigate to the Workbench.
2. Identify the product in each box.
3. Remove the boxes from the Workbench.
4. Detect the blocked warehouse aisles.
5. Select an alternative route.
6. Transport each box to the corresponding Rack row.
7. Place each box on the middle level of an unoccupied Rack unit in the correct row.
8. Leave the three boxes initially on the racks in their original positions.
9. Avoid moving the cones.
10. Return to either Charging Station.

### Constraints

- Blocked aisle rules of Section 4.1.2 apply (p.28).
- Any order for identify, retrieve, transport, place (p.28).
- Two boxes with the same product type must fill the two available Rack units of that row (p.28).
- Scoring for Rack placement: box upright, fully released, resting directly on the correct Rack level, product still inside. Completely placed means entire base supported by the Rack level; partially placed means only part of the base supported (p.28).
- End Charging Station need not equal the start one (p.28).
- No manual entry of product configuration, rack box positions, blocked aisle configuration or starting station after randomization (p.28).

### Scoring (max 150)

| Item | Points each | Total available | Page |
|---|---|---|---|
| Robot completely leaves starting Charging Station | 1 | 1 | p.29 |
| Empty box remains in original position on Rack (only if at least one product box placed at least partially on correct Rack row and level) | 3 | 9 | p.29 |
| At least one product box completely outside Workbench Zone (product inside) | 10 | 10 | p.29 |
| At least one product box completely inside Storage Zone (product inside) | 10 | 10 | p.29 |
| Box completely placed on correct Rack row and level | 15 | 60 | p.29 |
| Box partially placed on correct Rack row and level | 10 | 40 | p.29 |
| Box placed upright anywhere on game mat | 5 | 20 | p.29 |
| Robot successfully parked at a Charging Station (only if at least 1 point scored above) | 10 | 10 | p.29 |
| Surprise Rule | 50 | 50 | p.29 |
| Repairing actions (robot taken out of field, even if unsuccessful) | total round divided by factor 2 | - | p.29 |

The product must remain inside the box in all delivery cases (p.29).

## Advanced overall scoring (p.29)

| Component | Max | Share |
|---|---|---|
| Advanced Mission 1 | 150 | 30% |
| Advanced Mission 2 | 150 | 30% |
| Secret Mission | 100 | 20% |
| Engineering Documentation | 100 | 20% |
| Total | 500 | 100% |

## Field construction (Appendix A, pp.30-31)

- Two RoboMission tables side by side, long sides aligned; each internal area approx. 2362 mm x 1143 mm (p.30).
- Smart Warehouse playing area: length 2362 mm, width 2286 mm (p.30).
- Tables turned upside down, outer edges aligned, rigidly joined, level, with no significant gap, ridge or height difference (p.30).
- New border frame: clear internal area exactly 2362 mm x 2286 mm; walls extend 100 mm above the playing surface; frame stable; mat flat and fully supported (p.31).

## Game objects (Appendix B, p.32)

| Object | Weight (approx.) | Colors | Qty | Group |
|---|---|---|---|---|
| Rack Row | no restriction | Black and Red (#CE4A4A) | 3 | Senior / Advanced |
| Workbench | no restriction | Black | 1 | Senior / Advanced |
| Open Box | ~63 gr | Green (#00D072) | 9 | Senior / Advanced |
| Maintenance Cone | ~47 gr | Orange (#FFBD3B) and White | 4 | Advanced |
| Cylinder | ~13 gr | Silver (#E6E6E6) | 2 | Advanced |
| Pyramid | ~8 gr | Silver (#E6E6E6) | 2 | Advanced |
| Rectangular block | ~16 gr | Silver (#E6E6E6) | 2 | Advanced |

## Scenarios to animate

Mission 1 variants (blocked aisles x start station; order list per Section 3.2.1, not in scope):
1. Aisle 2 + Aisle 4 blocked, start left station (p.22, p.23).
2. Aisle 2 + Aisle 4 blocked, start right station (p.22, p.23).
3. Aisle 3 + Aisle 1 blocked, start left station (p.22, p.23).
4. Aisle 3 + Aisle 1 blocked, start right station (p.22, p.23).

Each of the four: leave start station, go to Order List Areas, read list, pick five requested Rack units, detect blocked aisles (4 cones), plan route avoiding blocked aisles and not touching Rack units from the blocked side, remove requested boxes, deliver to Workbench upper surface, park at either Charging Station (p.23).

Failure variants to show: enters blocked aisle, passes over cone, knocks over cone, moves cone fully out of its square, each ending the run (p.23). Tolerated: touching an upright cone still partly in its square (p.23).

Mission 2: same 4 aisle/station combos (p.27) crossed with random product layout (4 of 6 objects into Boxes 1-4, p.26) and random Rack-box positions (one per row, 3 x 3 = 27 combinations; the count is derived from p.26: 3 choices per row). Action sequence per run (p.28):
1. Leave station, go to Workbench.
2. Identify product in Box 1-4.
3. Take each box; route around cones to the target row (block 1-3, cylinder 4-6, pyramid 7-9) (p.27).
4. Place on the middle level of the unoccupied Rack unit in that row; the two same-type boxes fill the row's two free units (p.28).
5. Leave the 3 pre-placed rack boxes untouched (p.28).
6. Park at either station (p.28).

## Scoring and limits as data

| Key | M1 | M2 | Page |
|---|---|---|---|
| leave_station | 1 | 1 | p.24, p.29 |
| rack_removal_or_empty_kept | 3 each, max 15 (requested removed) ; 1 each, max 4 (unrequested kept) | 3 each, max 9 (empty kept) | p.24, p.29 |
| workbench_zone_bonus | 10 | 10 | p.24, p.29 |
| storage_zone_bonus | 10 | 10 | p.24, p.29 |
| delivery_full | 10 each, max 50 (Workbench) | 15 each, max 60 (Rack row/level) | p.24, p.29 |
| delivery_partial | 5 each, max 25 | 10 each, max 40 | p.24, p.29 |
| delivery_upright_on_mat | 2 each, max 10 | 5 each, max 20 | p.24, p.29 |
| park | 10 | 10 | p.24, p.29 |
| surprise | 50 | 50 | p.24, p.29 |
| repair_penalty | round total / 2 | round total / 2 | p.24, p.29 |
| max_score | 150 | 150 | p.24, p.29 |
| cone | 120 mm high, 85 x 85 mm base | same | p.21 |
| cones_total | 4 (2 per blocked aisle) | 4 | p.22, p.27 |
| box_row_gap | - | 80 mm between boxes, 10 mm front/rear clearance | p.25 |
| field | 2362 mm x 2286 mm, walls 100 mm | same | p.30, p.31 |
| time_limit | not stated in pp.21-32 | not stated | - |

## Open questions

- Time limit per round is not stated on pp.21-32; check Section 2.x / general rules.
- Figure 19 (aisle numbering), Figure 21 and Figure 25 layouts were not read as images; the geometry of Aisles 1-4 and the dashed squares, and the Rack unit numbering orientation (p.21, p.22, p.27), need a figure check.
- Order list randomization (five requested Rack units, Order List Areas) is defined in Section 3.2.1, outside the scope pp.21-32.
- Section 2.8 (start position requirements), 2.7.1 (standard box placement) and 3.1.3 (box placement scoring) are referenced, not defined, in this range (p.23, p.26, p.24).
- Workbench Zone and Storage Zone definitions and positions are not given in pp.21-32.
- Surprise Rule content is not described on pp.21-32 (p.24, p.29).
- M1 "Requested box removed from a Rack": 5 boxes x 3 = 15; "unrequested box" max 4 implies 4 unrequested boxes (inferred from the table totals, p.24).
- M2 lists "Requested Box Delivery" totals of 60 / 40 / 20, i.e. 4 boxes; per-box points are 15 / 10 / 5 (p.29).
- Whether the robot can rely on knowing the Rack-box position ordering of M2's example (Rack units 2, 6, 7) is figure-only (p.26).
- Whether the same aisle pair rule (Section 4.1.1) allows the cone squares to differ in M2 is not stated; the text only says the same procedures apply (p.27).
