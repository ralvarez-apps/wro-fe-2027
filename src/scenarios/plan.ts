import { type Cite, game } from '../rules/cite'
import {
  FIELD,
  RACK,
  RACK_UNITS,
  STATIONS,
  WORKBENCH,
  WORKBENCH_CENTER_X,
  rackUnit,
} from '../rules/field'
import { type ScoreTable, scoreTable } from '../rules/scoring'
import {
  type RouteGraph,
  TOP_LANE_Z,
  buildGraph,
  nodeStationPad,
  nodeTop,
  nodeUnit,
  shortestRoute,
  withPoint,
} from './graph'
import type { BoxPose, BoxSpec, Plan, Pt, ScenarioSetup, ScoreEvent, Segment, SegmentKind } from './types'

/** Illustrative, not from the rules. */
export const DEFAULT_SPEED_MM_S = 250
export const ROBOT_BODY = { widthMm: 260, depthMm: 260, heightMm: 150 } as const
const T_THINK = 1.5
const T_READ = 2
const T_GRIP = 2
const T_PARK = 1

const TOP_NODES = [0, 1, 2, 3].map(nodeTop)
const H_LEFT = Math.PI / 2 // facing +x
const H_RIGHT = -Math.PI / 2 // facing -x
const H_WORKBENCH = Math.PI // facing -z (toward the Workbench wall)

const headingOf = (a: Pt, b: Pt): number => Math.atan2(b.x - a.x, b.z - a.z)
const lengthOf = (pts: readonly Pt[]): number =>
  pts.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - (pts[i]?.x ?? p.x), p.z - (pts[i]?.z ?? p.z)), 0)

interface Extra {
  boxId?: string
  placeAt?: BoxPose
  score?: readonly ScoreEvent[]
  heading?: number
}

class Builder {
  readonly segs: Segment[] = []
  pos: Pt
  heading: number
  t = 0
  constructor(
    start: Pt,
    heading: number,
    private readonly speed: number,
  ) {
    this.pos = start
    this.heading = heading
  }

  move(points: readonly Pt[], title: string, detail: string, cite: Cite, extra: Extra = {}): void {
    const path = [this.pos, ...points.filter((p, i) => i > 0 || Math.hypot(p.x - this.pos.x, p.z - this.pos.z) > 1)]
    const len = lengthOf(path)
    const last = path[path.length - 1] ?? this.pos
    let heading = this.heading
    for (let i = path.length - 1; i > 0; i--) {
      const a = path[i - 1]
      const b = path[i]
      if (a && b && Math.hypot(b.x - a.x, b.z - a.z) > 1) {
        heading = headingOf(a, b)
        break
      }
    }
    this.add('move', title, detail, cite, path, heading, Math.max(0.4, len / this.speed), extra)
    this.pos = last
    this.heading = heading
  }

  action(kind: SegmentKind, title: string, detail: string, cite: Cite, durationS: number, extra: Extra = {}): void {
    const heading = extra.heading ?? this.heading
    this.add(kind, title, detail, cite, [this.pos], heading, durationS, extra)
    this.heading = heading
  }

  private add(
    kind: SegmentKind,
    title: string,
    detail: string,
    cite: Cite,
    path: readonly Pt[],
    heading: number,
    durationS: number,
    extra: Extra,
  ): void {
    const seg: Segment = {
      kind,
      title,
      detail,
      cite,
      path,
      heading,
      durationS,
      t0: this.t,
      t1: this.t + durationS,
      score: extra.score ?? [],
      ...(extra.boxId !== undefined ? { boxId: extra.boxId } : {}),
      ...(extra.placeAt !== undefined ? { placeAt: extra.placeAt } : {}),
    }
    this.segs.push(seg)
    this.t = seg.t1
  }
}

const pts = (n: number, label: string, points: number, cite: Cite): ScoreEvent[] =>
  points > 0 ? [{ label: n === 1 ? label : `${label} ×${n}`, points: points * n, cite }] : []

function rackPose(unit: number): BoxPose {
  const u = rackUnit(unit)
  return { x: u.center.x, z: u.center.z, y: RACK.middleLevelTopMm, rotY: 0 }
}

function benchSlots(n: number, spacing: number): number[] {
  return Array.from({ length: n }, (_, i) => WORKBENCH_CENTER_X + (i - (n - 1) / 2) * spacing)
}

function benchPose(x: number): BoxPose {
  return { x, z: WORKBENCH.depthMm / 2, y: WORKBENCH.heightMm, rotY: Math.PI / 2 }
}

/** Lanes (aisle indices) from which a rack unit can be served: the two aisles beside its row, if open. */
function accessLanes(unit: number, blocked: ReadonlySet<number>): number[] {
  const row = rackUnit(unit).row
  return [row, row + 1].filter((l) => !blocked.has(l))
}

function cheapest(g: RouteGraph, from: string, unit: number, blocked: ReadonlySet<number>) {
  const idx = rackUnit(unit).index
  const goals = accessLanes(unit, blocked).map((l) => ({ id: nodeUnit(l, idx) }))
  return shortestRoute(g, from, goals)
}

function laneOfNode(id: string): number {
  return Number(id.slice(1).split('_')[0])
}

export function buildPlan(setup: ScenarioSetup, speedMmS: number = DEFAULT_SPEED_MM_S): Plan {
  return setup.category === 'advanced' && setup.mission === 2
    ? planClassification(setup, speedMmS)
    : planRetrieval(setup, speedMmS)
}

const stationStart = (s: ScenarioSetup): Pt => ({
  x: s.start === 'A' ? 125 : FIELD.widthMm - 125,
  z: STATIONS[s.start].z,
})

function finish(
  setup: ScenarioSetup,
  boxes: BoxSpec[],
  b: Builder,
  notes: string[],
): Plan {
  const segments = b.segs
  const maxScore = segments.reduce((s, seg) => s + seg.score.reduce((a, e) => a + e.points, 0), 0)
  return { setup, boxes, segments, totalS: b.t, maxScore, notes }
}

const COMMON_NOTES = [
  'Robot speed and grip/read times are illustrative; the rules only fix the 180 s run limit.',
  'Surprise Rule (+50) is not modelled: its content is not in the rulebooks.',
  'Charging-station, zone, order-area and cone-square positions are assumptions (not dimensioned).',
  'Crossing the open front gap in front of a blocked aisle is assumed allowed; entering the aisle is not.',
]

// ── Senior M1/M2 and Advanced M1: retrieve requested boxes to the Workbench ──

function planRetrieval(setup: ScenarioSetup, speed: number): Plan {
  const table: ScoreTable = scoreTable(setup.category, setup.mission)
  const blocked = new Set(setup.blockedAisles)
  const base = buildGraph(blocked)
  const taskCite = game(setup.category === 'senior' ? (setup.mission === 1 ? 16 : 19) : 23)

  const boxes: BoxSpec[] = setup.rackBoxes.map((u) => ({
    id: `rack-${u}`,
    pose: rackPose(u),
    product: null,
    requested: setup.requested.includes(u),
    label: `Rack ${u}`,
  }))

  const b = new Builder(stationStart(setup), H_WORKBENCH, speed)
  const padId = nodeStationPad(setup.start)
  const laneId = `S${setup.start === 'A' ? 0 : 3}`
  const startRoute = shortestRoute(base, padId, [{ id: laneId }])
  b.move(startRoute?.points ?? [], 'Leave the starting Charging Station', 'The whole robot must clear the station.', table.cite, {
    score: pts(1, 'Robot completely left the station', table.leaveStart, table.cite),
  })

  const hasCards = setup.orderCards.length > 0
  if (hasCards) {
    const clusters = [
      { x: 320, name: 'areas 1–3', side: 0, cards: setup.orderCards.slice(0, 3) },
      { x: 1966, name: 'areas 4–5', side: 3, cards: setup.orderCards.slice(3) },
    ]
    if (setup.start === 'C') clusters.reverse()
    clusters.forEach((c, i) => {
      const r = i === 0 ? shortestRoute(base, laneId, [{ id: nodeTop(c.side) }]) : null
      b.move(
        [...(r?.points ?? []), { x: c.x, z: TOP_LANE_Z }],
        `Go to Order List ${c.name}`,
        'Cards sit face up in areas 1–5; area 6 stays empty.',
        game(18),
      )
      b.action('read', `Read ${c.name}`, 'Dot patterns map to rack numbers (Figure 14).', game(18), T_READ, { heading: H_WORKBENCH })
    })
    b.action('think', `Requested racks: ${[...setup.requested].sort((x, y) => x - y).join(', ')}`, 'Mapped from the five dot cards.', game(18), T_THINK)
  } else {
    b.action('think', 'Locate the five boxes', 'The robot must find which racks hold a box; nothing is told to it.', taskCite, T_THINK)
  }
  if (setup.blockedAisles.length > 0) {
    b.action(
      'think',
      `Detect blocked aisles: ${setup.blockedAisles.map((a) => a + 1).join(' and ')}`,
      'Two cones in each blocked aisle. No entering, no touching racks from that side.',
      game(23),
      T_THINK,
    )
    b.action('think', 'Select an alternative route', 'Every rack row stays reachable from one side.', game(22), T_THINK)
  }

  // Remaining requested units, greedy nearest-first (any order is allowed).
  let g: RouteGraph = hasCards ? withPoint(base, b.pos, TOP_NODES) : base
  let from = hasCards ? 'CUR' : laneId
  const pending = [...setup.requested]
  const slots = benchSlots(setup.requested.length, 120)
  let delivered = 0
  while (pending.length > 0) {
    let bestUnit = -1
    let bestRoute: ReturnType<typeof cheapest> = null
    for (const u of pending) {
      const r = cheapest(g, from, u, blocked)
      if (r && (!bestRoute || r.length < bestRoute.length)) {
        bestRoute = r
        bestUnit = u
      }
    }
    if (!bestRoute) throw new Error('no open aisle reaches the requested rack units')
    pending.splice(pending.indexOf(bestUnit), 1)
    const lane = laneOfNode(bestRoute.goal)
    const row = rackUnit(bestUnit).row
    b.move(bestRoute.points, `Drive to rack ${bestUnit} via Aisle ${lane + 1}`, 'Stay in open aisles; do not touch the cones.', taskCite)
    const boxId = `rack-${bestUnit}`
    b.action('pick', `Take the box from rack ${bestUnit}`, 'Lift it off the middle level without moving the rack.', taskCite, T_GRIP, {
      boxId,
      heading: lane === row ? H_LEFT : H_RIGHT,
      score: pts(1, `Box removed from rack ${bestUnit}`, table.removed, table.cite),
    })
    const slotX = slots[delivered] ?? WORKBENCH_CENTER_X
    const routeBack = shortestRoute(
      base,
      bestRoute.goal,
      TOP_NODES.map((id) => ({ id, extra: Math.abs((base.pos.get(id)?.x ?? 0) - slotX) })),
    )
    b.move([...(routeBack?.points ?? []), { x: slotX, z: TOP_LANE_Z }], 'Carry the box to the Workbench', 'Transport it to the front of the Workbench.', taskCite, { boxId })
    const first = delivered === 0
    b.action('place', 'Place the box on the Workbench', 'Fully released on the upper surface, nothing supporting it.', taskCite, T_GRIP, {
      boxId,
      heading: H_WORKBENCH,
      placeAt: benchPose(slotX),
      score: [
        ...pts(1, 'Box completely on the Workbench', table.delivery, table.cite),
        ...(first ? pts(1, 'A box inside the Workbench Zone', table.workbenchZone, table.cite) : []),
        ...(first ? pts(1, 'A box outside the Storage Zone', table.storageZone, table.cite) : []),
      ],
    })
    delivered++
    g = withPoint(base, b.pos, TOP_NODES)
    from = 'CUR'
  }

  const end = shortestRoute(g, from, [{ id: nodeStationPad(setup.end) }])
  const stay = setup.rackBoxes.length - setup.requested.length
  b.move(end?.points ?? [], `Return to Charging Station ${setup.end}`, 'Either station is valid, not necessarily the one it started from.', taskCite)
  b.action('park', 'Park', 'Stopped with any part of the robot over the yellow pad.', table.cite, T_PARK, {
    heading: H_WORKBENCH,
    score: [
      ...pts(1, 'Robot parked at a Charging Station', table.park, table.cite),
      ...(stay > 0 ? pts(stay, 'Unrequested box left in place', table.unrequestedStay, table.cite) : []),
    ],
  })
  return finish(setup, boxes, b, [...COMMON_NOTES])
}

// ── Advanced M2: classify products and shelve boxes in the right rack row ────

const ROW_OF_PRODUCT = { block: 0, cylinder: 1, pyramid: 2 } as const
const PRODUCT_LABEL = { block: 'rectangular block', cylinder: 'cylinder', pyramid: 'pyramid' } as const

function planClassification(setup: ScenarioSetup, speed: number): Plan {
  const table = scoreTable('advanced', 2)
  const blocked = new Set(setup.blockedAisles)
  const base = buildGraph(blocked)
  const cite = game(28)
  const slots = benchSlots(setup.products.length, 160)

  const boxes: BoxSpec[] = [
    ...setup.products.map<BoxSpec>((p, i) => ({
      id: `bench-${i}`,
      pose: benchPose(slots[i] ?? WORKBENCH_CENTER_X),
      product: p,
      requested: true,
      label: `Box ${i + 1} (${PRODUCT_LABEL[p]})`,
    })),
    ...setup.rackBoxes.map<BoxSpec>((u) => ({
      id: `rack-${u}`,
      pose: rackPose(u),
      product: null,
      requested: false,
      label: `Empty box, rack ${u}`,
    })),
  ]

  const b = new Builder(stationStart(setup), H_WORKBENCH, speed)
  const laneId = `S${setup.start === 'A' ? 0 : 3}`
  const startRoute = shortestRoute(base, nodeStationPad(setup.start), [{ id: laneId }])
  b.move(startRoute?.points ?? [], 'Leave the starting Charging Station', 'The whole robot must clear the station.', table.cite, {
    score: pts(1, 'Robot completely left the station', table.leaveStart, table.cite),
  })
  b.action('think', 'Detect blocked aisles', 'Cones close two aisles; the robot must find out by itself.', game(23), T_THINK)
  b.action('think', 'Select an alternative route', 'Plan around the cones.', game(23), T_THINK)

  // Free rack units per row, filled in order.
  const free: Record<number, number[]> = { 0: [], 1: [], 2: [] }
  for (const u of RACK_UNITS) if (!setup.rackBoxes.includes(u.id)) free[u.row]?.push(u.id)

  let g: RouteGraph = base
  let from = laneId
  let placed = 0
  for (let i = 0; i < setup.products.length; i++) {
    const product = setup.products[i]
    if (!product) continue
    const slotX = slots[i] ?? WORKBENCH_CENTER_X
    const toBench = shortestRoute(
      g,
      from,
      TOP_NODES.map((id) => ({ id, extra: Math.abs((base.pos.get(id)?.x ?? 0) - slotX) })),
    )
    b.move([...(toBench?.points ?? []), { x: slotX, z: TOP_LANE_Z }], `Go to Box ${i + 1}`, 'Workbench boxes hold the products.', cite)
    b.action('think', `Identify Box ${i + 1}: ${PRODUCT_LABEL[product]}`, 'Block → racks 1–3, cylinder → 4–6, pyramid → 7–9.', cite, T_THINK)
    const boxId = `bench-${i}`
    b.action('pick', `Take Box ${i + 1} from the Workbench`, 'Only boxes resting directly on the Workbench can be taken.', cite, T_GRIP, { boxId, heading: H_WORKBENCH })

    const row = ROW_OF_PRODUCT[product]
    const target = free[row]?.shift()
    if (target === undefined) throw new Error(`no free rack unit in row ${row + 1}`)
    const gHere = withPoint(base, b.pos, TOP_NODES)
    const r = cheapest(gHere, 'CUR', target, blocked)
    if (!r) throw new Error('no open aisle reaches the target rack')
    const lane = laneOfNode(r.goal)
    b.move(r.points, `Carry Box ${i + 1} to rack row ${row + 1} (unit ${target})`, `Reach it from Aisle ${lane + 1}, the open side.`, cite, { boxId })
    const first = placed === 0
    b.action('place', `Place Box ${i + 1} on the middle level of rack ${target}`, 'Fully supported by the level, product still inside.', cite, T_GRIP, {
      boxId,
      heading: lane === row ? H_LEFT : H_RIGHT,
      placeAt: rackPose(target),
      score: [
        ...pts(1, 'Box completely on the correct rack', table.delivery, table.cite),
        ...(first ? pts(1, 'A product box outside the Workbench Zone', table.workbenchZone, table.cite) : []),
        ...(first ? pts(1, 'A product box inside the Storage Zone', table.storageZone, table.cite) : []),
      ],
    })
    placed++
    g = base
    from = r.goal
  }

  const back = shortestRoute(base, from, [{ id: nodeStationPad(setup.end) }])
  b.move(back?.points ?? [], `Return to Charging Station ${setup.end}`, 'Either station is valid.', cite)
  b.action('park', 'Park', 'Leave the three boxes that were already on the racks untouched.', table.cite, T_PARK, {
    heading: H_WORKBENCH,
    score: [
      ...pts(1, 'Robot parked at a Charging Station', table.park, table.cite),
      ...pts(setup.rackBoxes.length, 'Empty rack box left in place', table.emptyStay, table.cite),
    ],
  })
  return finish(setup, boxes, b, [...COMMON_NOTES, 'Box order and unit assignment within a row are the planner’s choice.'])
}

