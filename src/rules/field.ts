import { type Cite, type Fact, assumed, game } from './cite'

// All lengths in millimetres. Coordinate system: origin at the corner where the
// left wall meets the Workbench wall; x runs across the field (width), z runs from
// the Workbench wall toward the open front end (length). y is up.

export const FIELD = { lengthMm: 2362, widthMm: 2286, wallHeightMm: 100 } as const

export const RACK = {
  depthMm: 120,
  heightMm: 315,
  uprightMm: 15,
  innerWidthMm: 300,
  unitsPerRow: 3,
  rows: 3,
  rowLengthMm: 960,
  /** Top surface height of levels 1..3 above the floor. */
  levelTopMm: [135, 225, 315],
  middleLevelTopMm: 225,
} as const

/** Gaps across the field: wall→row1, row1→row2, row2→row3, row3→wall. */
export const AISLE_GAPS_MM = [563, 400, 400, 563] as const
export const FRONT_GAP_MM = 400

export const WORKBENCH = { lengthMm: 720, depthMm: 120, heightMm: 45 } as const
export const BOX = { lengthMm: 100, depthMm: 80, heightMm: 50 } as const
export const CONE = { heightMm: 120, baseMm: 85 } as const
export const ORDER_AREA = { widthMm: 120, depthMm: 80 } as const
export const STATION_PAD_MM = 100

export const COLORS = {
  rackBody: '#000000',
  rackFace: '#CE4A4A',
  workbench: '#000000',
  box: '#00D072',
  cone: '#FFBD3B',
  product: '#E6E6E6',
} as const

/** x of the left edge of rack row `row` (0..2). Row depth is along x. */
export const rowX0 = (row: number): number =>
  AISLE_GAPS_MM[0] + row * (RACK.depthMm + (AISLE_GAPS_MM[1] ?? 400))

/** Rows start this far from the Workbench wall. Derived: length − 400 front gap − 960 row. */
export const ROW_Z0 = FIELD.lengthMm - FRONT_GAP_MM - RACK.rowLengthMm
export const ROW_Z1 = ROW_Z0 + RACK.rowLengthMm

export interface RackUnit {
  readonly id: number // 1..9, numbered from the Workbench end, row by row
  readonly row: number // 0..2
  readonly index: number // 0..2 along the row
  readonly center: { readonly x: number; readonly z: number }
}

export const RACK_UNITS: readonly RackUnit[] = Array.from({ length: 9 }, (_, i) => {
  const row = Math.floor(i / 3)
  const index = i % 3
  return {
    id: i + 1,
    row,
    index,
    center: {
      x: rowX0(row) + RACK.depthMm / 2,
      z: ROW_Z0 + RACK.uprightMm + index * (RACK.innerWidthMm + RACK.uprightMm) + RACK.innerWidthMm / 2,
    },
  }
})

export function rackUnit(id: number): RackUnit {
  const u = RACK_UNITS[id - 1]
  if (!u) throw new RangeError(`rack unit ${id} out of range 1..9`)
  return u
}

export interface Aisle {
  readonly index: number // 0..3  (Aisle 1..4)
  readonly x0: number
  readonly x1: number
  readonly centerX: number
}

export const AISLES: readonly Aisle[] = AISLE_GAPS_MM.map((gap, i) => {
  const x0 = i === 0 ? 0 : rowX0(i - 1) + RACK.depthMm
  const x1 = x0 + gap
  return { index: i, x0, x1, centerX: (x0 + x1) / 2 }
})

export function aisle(index: number): Aisle {
  const a = AISLES[index]
  if (!a) throw new RangeError(`aisle ${index} out of range 0..3`)
  return a
}

// ── Assumed placements (not dimensioned in the rulebook figures) ─────────────

export const WORKBENCH_X0 = (FIELD.widthMm - WORKBENCH.lengthMm) / 2
export const WORKBENCH_CENTER_X = FIELD.widthMm / 2

export const WORKBENCH_ZONE = { x0: 700, x1: 1586, z0: 0, z1: 320 } as const
/** Dashed storage-zone line sits at about the Workbench end of the rack rows. */
export const STORAGE_LINE_Z = ROW_Z0

export const STATION_CENTER_Z = Math.round(FIELD.lengthMm / 3)
export const STATIONS = {
  A: { x: STATION_PAD_MM / 2, z: STATION_CENTER_Z, side: 'left' as const },
  C: { x: FIELD.widthMm - STATION_PAD_MM / 2, z: STATION_CENTER_Z, side: 'right' as const },
}

export const ORDER_AREAS = [160, 320, 480, 1806, 1966, 2126].map((x, i) => ({
  number: i + 1,
  x,
  z: ORDER_AREA.depthMm / 2,
}))

export interface ConeSquare {
  readonly aisle: number
  readonly x: number
  readonly z: number
}
/** Two squares per aisle: near the Workbench end and near the open front end. */
export const coneSquares = (aisleIndex: number): readonly ConeSquare[] => {
  const x = aisle(aisleIndex).centerX
  return [
    { aisle: aisleIndex, x, z: ROW_Z0 + 60 },
    { aisle: aisleIndex, x, z: ROW_Z1 - 60 },
  ]
}

// ── Provenance shown when an object is clicked ───────────────────────────────

const f = (label: string, value: string, cite: Cite): Fact => ({ label, value, cite })

export type EntityKey =
  | 'field'
  | 'rack'
  | 'workbench'
  | 'box'
  | 'station'
  | 'orderArea'
  | 'workbenchZone'
  | 'storageZone'
  | 'cone'
  | 'robot'
  | 'aisle'

export const ENTITY_FACTS: Record<Exclude<EntityKey, 'robot'>, { title: string; facts: readonly Fact[] }> = {
  field: {
    title: 'Game field',
    facts: [
      f('Size', '2362 × 2286 mm', game(7)),
      f('Border walls', '100 mm high, white', game(7)),
      f('Floor markings', 'decorative only, never navigation aids', game(5)),
      f('Wall thickness', 'not specified', assumed),
    ],
  },
  rack: {
    title: 'Rack unit / row',
    facts: [
      f('Row', '3 units, 960 mm long, 3 rows', game(9, 'figure')),
      f('Depth × height', '120 × 315 mm', game(9, 'figure')),
      f('Level tops', '135 / 225 / 315 mm above floor', game(9, 'figure')),
      f('Inner width', '300 mm (outer 330 mm)', game(9, 'figure')),
      f('Colours', 'black body, red #CE4A4A front/back', game(10)),
      f('Row start from Workbench wall', `${ROW_Z0} mm = 2362 − 400 − 960`, game(8, 'derived')),
      f('Unit numbering', '1–9 from the Workbench end, row by row', game(15, 'figure')),
    ],
  },
  workbench: {
    title: 'Workbench',
    facts: [
      f('Size', '720 × 120 × 45 mm, black', game(10)),
      f('Position', 'against the top wall, centred between side walls', game(8, 'figure')),
    ],
  },
  box: {
    title: 'Open box',
    facts: [
      f('Size', '100 × 80 × 50 mm, green #00D072, open top', game(11)),
      f('Standard rack placement', 'upright, centred, 10 mm front/rear gap', game(11)),
      f('Level used by missions', 'middle level (top surface 225 mm)', game(15, 'figure')),
      f('Max boxes in a mission', '9', game(10)),
    ],
  },
  station: {
    title: 'Charging Station',
    facts: [
      f('Count', '2 (left A, right C), flat yellow pad ~100 mm', game(12, 'figure')),
      f('Exact position along the wall', 'about a third of the way down', assumed),
      f('Start rule', 'robot covers as much yellow as it can', game(12)),
      f('Park rule', 'stopped with any projection overlapping yellow', game(13)),
    ],
  },
  orderArea: {
    title: 'Order List Area',
    facts: [
      f('Count / size', '6 areas, 120 × 80 mm', game(14)),
      f('Layout', '1–3 left of the Workbench Zone, 4–6 right', game(14, 'figure')),
      f('Exact coordinates', 'not dimensioned', assumed),
    ],
  },
  workbenchZone: {
    title: 'Workbench Zone',
    facts: [
      f('Scoring', 'at least one box completely inside: +10', game(13)),
      f('Extent', 'wider than the Workbench, in front of it; not dimensioned', assumed),
    ],
  },
  storageZone: {
    title: 'Storage Zone',
    facts: [
      f('Scoring', 'contains the rack rows; a box completely outside scores +10', game(14)),
      f('Boundary line', 'dashed blue, at about the Workbench end of the rows', assumed),
    ],
  },
  cone: {
    title: 'Maintenance cone',
    facts: [
      f('Size', '120 mm high, 85 × 85 mm base, orange #FFBD3B', game(21)),
      f('Quantity', '4, two per blocked aisle, inside dashed orange squares', game(22)),
      f('Touching', 'allowed only if it stays upright and in/touching its square', game(23)),
      f('Fall, leave square, drive over, enter blocked aisle', 'judge stops the run', game(23)),
      f('Exact square positions', 'near the aisle ends; not dimensioned', assumed),
    ],
  },
  aisle: {
    title: 'Aisle',
    facts: [
      f('Widths', 'Aisle 1/4: 563 mm; Aisle 2/3: 400 mm', game(8, 'figure')),
      f('Numbering', 'Aisle 1 (left) to 4 (right), Workbench at top', game(21, 'figure')),
    ],
  },
}
