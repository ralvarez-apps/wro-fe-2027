import { type Cite, game } from './cite'

export type Category = 'senior' | 'advanced'
export type MissionNo = 1 | 2

/** Points per scoring event. Surprise Rule (+50) is not modelled: its content is not in the rulebook. */
export interface ScoreTable {
  readonly leaveStart: number
  readonly removed: number
  readonly unrequestedStay: number
  readonly emptyStay: number
  readonly workbenchZone: number
  readonly storageZone: number
  readonly delivery: number
  readonly park: number
  readonly cite: Cite
}

export const SURPRISE_POINTS = 50
export const MAX_SCORE = 150

const table = (t: Omit<ScoreTable, 'cite'>, page: number): ScoreTable => ({ ...t, cite: game(page) })

const SENIOR_M1 = table(
  { leaveStart: 5, removed: 3, unrequestedStay: 0, emptyStay: 0, workbenchZone: 10, storageZone: 10, delivery: 10, park: 10 },
  16,
)
const SENIOR_M2 = table(
  { leaveStart: 1, removed: 3, unrequestedStay: 1, emptyStay: 0, workbenchZone: 10, storageZone: 10, delivery: 10, park: 10 },
  20,
)
const ADVANCED_M1 = table(
  { leaveStart: 1, removed: 3, unrequestedStay: 1, emptyStay: 0, workbenchZone: 10, storageZone: 10, delivery: 10, park: 10 },
  24,
)
const ADVANCED_M2 = table(
  { leaveStart: 1, removed: 0, unrequestedStay: 0, emptyStay: 3, workbenchZone: 10, storageZone: 10, delivery: 15, park: 10 },
  29,
)

export function scoreTable(category: Category, mission: MissionNo): ScoreTable {
  if (category === 'senior') return mission === 1 ? SENIOR_M1 : SENIOR_M2
  return mission === 1 ? ADVANCED_M1 : ADVANCED_M2
}
