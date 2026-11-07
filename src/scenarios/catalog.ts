import { RACK_UNITS } from '../rules/field'
import type { Category, MissionNo } from '../rules/scoring'
import type { ProductKind, ScenarioSetup, StationId } from './types'

/** Aisle pairs the rules allow: Aisle 2 forces Aisle 4, Aisle 3 forces Aisle 1 (Game Rules p.22). */
export const BLOCKED_PAIRS: Readonly<Record<'2+4' | '3+1', readonly number[]>> = {
  '2+4': [1, 3],
  '3+1': [2, 0],
}

export const ALL_UNITS = RACK_UNITS.map((u) => u.id)

export interface Preset {
  readonly label: string
  readonly category: Category
  readonly mission: MissionNo
  readonly build: () => ScenarioSetup
}

const base = {
  end: 'A' as StationId,
  blockedAisles: [] as number[],
  products: [] as ProductKind[],
  orderCards: [] as number[],
}

/** Examples taken from the rulebook figures. */
export const PRESETS: readonly Preset[] = [
  {
    label: 'Senior · M1 Rack Clearance (racks 2, 3, 4, 7, 9)',
    category: 'senior',
    mission: 1,
    build: () => ({
      ...base,
      id: 'senior-m1-example',
      title: 'Senior M1 — Rack Clearance',
      category: 'senior',
      mission: 1,
      start: 'A',
      end: 'C',
      rackBoxes: [2, 3, 4, 7, 9],
      requested: [2, 3, 4, 7, 9],
    }),
  },
  {
    label: 'Senior · M2 Order Picking (cards 7, 6, 4, 8, 2)',
    category: 'senior',
    mission: 2,
    build: () => ({
      ...base,
      id: 'senior-m2-example',
      title: 'Senior M2 — Order Picking',
      category: 'senior',
      mission: 2,
      start: 'C',
      end: 'A',
      rackBoxes: ALL_UNITS,
      requested: [7, 6, 4, 8, 2],
      orderCards: [7, 6, 4, 8, 2],
    }),
  },
  {
    label: 'Advanced · M1 Route Replanning (Aisles 2+4 blocked)',
    category: 'advanced',
    mission: 1,
    build: () => ({
      ...base,
      id: 'advanced-m1-2-4',
      title: 'Advanced M1 — Route Replanning',
      category: 'advanced',
      mission: 1,
      start: 'A',
      end: 'C',
      rackBoxes: ALL_UNITS,
      requested: [7, 6, 4, 8, 2],
      orderCards: [7, 6, 4, 8, 2],
      blockedAisles: BLOCKED_PAIRS['2+4'],
    }),
  },
  {
    label: 'Advanced · M1 Route Replanning (Aisles 3+1 blocked)',
    category: 'advanced',
    mission: 1,
    build: () => ({
      ...base,
      id: 'advanced-m1-3-1',
      title: 'Advanced M1 — Route Replanning',
      category: 'advanced',
      mission: 1,
      start: 'C',
      end: 'A',
      rackBoxes: ALL_UNITS,
      requested: [1, 3, 5, 6, 9],
      orderCards: [1, 3, 5, 6, 9],
      blockedAisles: BLOCKED_PAIRS['3+1'],
    }),
  },
  {
    label: 'Advanced · M2 Product Classification (Aisles 3+1 blocked)',
    category: 'advanced',
    mission: 2,
    build: () => ({
      ...base,
      id: 'advanced-m2-example',
      title: 'Advanced M2 — Product Classification',
      category: 'advanced',
      mission: 2,
      start: 'A',
      end: 'C',
      rackBoxes: [2, 6, 7],
      requested: [],
      products: ['pyramid', 'cylinder', 'pyramid', 'block'],
      blockedAisles: BLOCKED_PAIRS['3+1'],
    }),
  },
]

// ── Random setups that follow the rulebook's randomisation rules ─────────────

function pick<T>(items: readonly T[], rnd: () => number): T {
  const v = items[Math.floor(rnd() * items.length)]
  if (v === undefined) throw new Error('empty list')
  return v
}

function sample(units: readonly number[], n: number, rnd: () => number): number[] {
  const pool = [...units]
  const out: number[] = []
  while (out.length < n && pool.length > 0) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0] ?? 0)
  return out
}

export function randomSetup(category: Category, mission: MissionNo, rnd: () => number = Math.random): ScenarioSetup {
  const start = pick<StationId>(['A', 'C'], rnd)
  const end = pick<StationId>(['A', 'C'], rnd)
  const blockedAisles = category === 'advanced' ? [...BLOCKED_PAIRS[pick(['2+4', '3+1'] as const, rnd)]] : []
  const title = `${category === 'senior' ? 'Senior' : 'Advanced'} M${mission} — random round`
  const common = { ...base, id: `${category}-m${mission}-random`, title, category, mission, start, end, blockedAisles }

  if (category === 'advanced' && mission === 2) {
    const kinds: ProductKind[] = ['block', 'block', 'cylinder', 'cylinder', 'pyramid', 'pyramid']
    const products = sample(kinds.map((_, i) => i), 4, rnd).map((i) => kinds[i] ?? 'block')
    // One empty rack box per row, unit within the row at random.
    const rackBoxes = [0, 1, 2].map((row) => row * 3 + 1 + Math.floor(rnd() * 3))
    return { ...common, rackBoxes, requested: [], products }
  }
  if (category === 'senior' && mission === 1) {
    const chosen = sample(ALL_UNITS, 5, rnd).sort((a, b) => a - b)
    return { ...common, rackBoxes: chosen, requested: chosen }
  }
  const cards = sample(ALL_UNITS, 5, rnd)
  return { ...common, rackBoxes: ALL_UNITS, requested: cards, orderCards: cards }
}
