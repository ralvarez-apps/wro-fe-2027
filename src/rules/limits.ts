import { type Cite, general } from './cite'

export interface Limit {
  readonly label: string
  readonly value: number
  readonly unit: string
  readonly cite: Cite
}

export const ROBOT_MAX_MM = 500 // 50 cm length, width and height before the run starts
export const RUN_TIME_S = 180

export const ROBOT_LIMITS: readonly Limit[] = [
  { label: 'Max length', value: 500, unit: 'mm', cite: general(8) },
  { label: 'Max width', value: 500, unit: 'mm', cite: general(8) },
  { label: 'Max height (before start)', value: 500, unit: 'mm', cite: general(8) },
  { label: 'Max weight', value: 6, unit: 'kg', cite: general(8) },
  { label: 'Run duration', value: RUN_TIME_S, unit: 's', cite: general(18) },
  { label: 'Repair score penalty', value: 50, unit: '%', cite: general(19) },
]
