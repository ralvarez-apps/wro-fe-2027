import type { Cite } from '../rules/cite'
import type { Category, MissionNo } from '../rules/scoring'

export type StationId = 'A' | 'C'
export type ProductKind = 'block' | 'cylinder' | 'pyramid'

export interface Pt {
  readonly x: number
  readonly z: number
}

/** Declarative description of one randomised round. The planner turns it into a Plan. */
export interface ScenarioSetup {
  readonly id: string
  readonly title: string
  readonly category: Category
  readonly mission: MissionNo
  readonly start: StationId
  readonly end: StationId
  /** Rack units 1..9 that hold a box on the middle level at the start. */
  readonly rackBoxes: readonly number[]
  /** Units whose box must be retrieved (Senior M1/M2, Advanced M1). */
  readonly requested: readonly number[]
  /** Blocked aisles, 0-based (0 = Aisle 1). Advanced only. */
  readonly blockedAisles: readonly number[]
  /** Advanced M2: product in each of the 4 Workbench boxes. */
  readonly products: readonly ProductKind[]
  /** Dot cards in Order List Areas 1..5 (Senior M2, Advanced M1). */
  readonly orderCards: readonly number[]
}

export interface BoxPose {
  readonly x: number
  readonly z: number
  readonly y: number
  readonly rotY: number
}

export interface BoxSpec {
  readonly id: string
  readonly pose: BoxPose
  readonly product: ProductKind | null
  readonly requested: boolean
  readonly label: string
}

export type SegmentKind = 'move' | 'pick' | 'place' | 'think' | 'read' | 'park'

export interface ScoreEvent {
  readonly label: string
  readonly points: number
  readonly cite: Cite
}

export interface Segment {
  readonly kind: SegmentKind
  readonly title: string
  readonly detail: string
  readonly cite: Cite
  /** Polyline for moves; a single point for in-place actions. */
  readonly path: readonly Pt[]
  readonly heading: number
  readonly durationS: number
  readonly t0: number
  readonly t1: number
  readonly boxId?: string
  /** Where a placed box ends up (place segments). */
  readonly placeAt?: BoxPose
  readonly score: readonly ScoreEvent[]
}

export interface Plan {
  readonly setup: ScenarioSetup
  readonly boxes: readonly BoxSpec[]
  readonly segments: readonly Segment[]
  readonly totalS: number
  /** Points without the Surprise Rule. */
  readonly maxScore: number
  readonly notes: readonly string[]
}
