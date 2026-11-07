import { describe, expect, it } from 'vitest'
import { AISLES, ROW_Z0, ROW_Z1 } from '../src/rules/field'
import { PRESETS, randomSetup } from '../src/scenarios/catalog'
import { buildPlan } from '../src/scenarios/plan'
import { along, stateAt } from '../src/scenarios/playback'
import type { Plan } from '../src/scenarios/types'

function seeded(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const rounds = [
  ...PRESETS.map((p) => p.build()),
  ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((seed) =>
    (['senior', 'advanced'] as const).flatMap((c) =>
      ([1, 2] as const).map((m) => randomSetup(c, m, seeded(seed * 31 + m))),
    ),
  ),
]

/** Points on the route inside a blocked aisle (between the rack row ends). */
function intrusions(plan: Plan): number {
  let n = 0
  for (const seg of plan.segments) {
    if (seg.kind !== 'move') continue
    for (let u = 0; u <= 1; u += 0.02) {
      const p = along(seg.path, u, 0)
      for (const a of plan.setup.blockedAisles) {
        const lane = AISLES[a]
        if (lane && p.z > ROW_Z0 - 1 && p.z < ROW_Z1 + 1 && p.x > lane.x0 && p.x < lane.x1) n++
      }
    }
  }
  return n
}

describe('planner', () => {
  it.each(rounds.map((r, i) => [i, r] as const))('round %i plans without error and scores 100 (+50 surprise = 150)', (_i, setup) => {
    const plan = buildPlan(setup)
    expect(plan.maxScore).toBe(100)
    expect(plan.segments.length).toBeGreaterThan(3)
  })

  it.each(rounds.filter((r) => r.blockedAisles.length > 0).map((r, i) => [i, r] as const))(
    'round %i never enters a blocked aisle',
    (_i, setup) => {
      expect(intrusions(buildPlan(setup))).toBe(0)
    },
  )

  it('ends with every requested box on the Workbench (Senior M1 example)', () => {
    const setup = PRESETS[0]?.build()
    if (!setup) throw new Error('missing preset')
    const plan = buildPlan(setup)
    const end = stateAt(plan, plan.totalS)
    for (const id of setup.requested.map((u) => `rack-${u}`)) {
      const pose = end.boxes.get(id)
      expect(pose?.y).toBe(45)
      expect(pose?.z).toBe(60)
    }
    expect(end.score).toBe(plan.maxScore)
  })

  it('leaves unrequested boxes where they were (Senior M2 example)', () => {
    const setup = PRESETS[1]?.build()
    if (!setup) throw new Error('missing preset')
    const plan = buildPlan(setup)
    const end = stateAt(plan, plan.totalS)
    const stay = setup.rackBoxes.filter((u) => !setup.requested.includes(u))
    for (const u of stay) expect(end.boxes.get(`rack-${u}`)).toEqual(plan.boxes.find((b) => b.id === `rack-${u}`)?.pose)
  })

  it('is deterministic and speed-sensitive', () => {
    const setup = PRESETS[2]?.build()
    if (!setup) throw new Error('missing preset')
    expect(buildPlan(setup, 250).totalS).toBe(buildPlan(setup, 250).totalS)
    expect(buildPlan(setup, 500).totalS).toBeLessThan(buildPlan(setup, 250).totalS)
  })
})
