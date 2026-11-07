import { AISLES, FIELD, ROW_Z0, STATIONS, rackUnit } from '../rules/field'
import type { Pt, StationId } from './types'

/** Horizontal lane in front of the Workbench; links all four aisles. */
export const TOP_LANE_Z = 300
export const FRONT_LANE_Z = FIELD.lengthMm - 200

export const ROBOT_START_X = { A: 125, C: FIELD.widthMm - 125 } as const

export interface RouteGraph {
  readonly pos: ReadonlyMap<string, Pt>
  readonly adj: ReadonlyMap<string, readonly { to: string; len: number }[]>
}

export const nodeTop = (lane: number): string => `T${lane}`
export const nodeUnit = (lane: number, index: number): string => `U${lane}_${index}`
export const nodeFront = (lane: number): string => `F${lane}`
export const nodeStationLane = (lane: number): string => `S${lane}`
export const nodeStationPad = (s: StationId): string => `ST_${s}`

const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.z - b.z)

/**
 * Waypoint graph of the warehouse. A blocked aisle loses every segment that reaches the rack
 * zone (z ≥ rack row start); the stretch next to a Charging Station stays usable.
 */
export function buildGraph(blocked: ReadonlySet<number>): RouteGraph {
  const pos = new Map<string, Pt>()
  const adj = new Map<string, { to: string; len: number }[]>()
  const addNode = (id: string, p: Pt): void => {
    pos.set(id, p)
    adj.set(id, [])
  }
  const link = (a: string, b: string): void => {
    const pa = pos.get(a)
    const pb = pos.get(b)
    if (!pa || !pb) throw new Error(`unknown node ${a} or ${b}`)
    const len = dist(pa, pb)
    adj.get(a)?.push({ to: b, len })
    adj.get(b)?.push({ to: a, len })
  }

  for (const a of AISLES) {
    addNode(nodeTop(a.index), { x: a.centerX, z: TOP_LANE_Z })
    for (let k = 0; k < 3; k++) {
      addNode(nodeUnit(a.index, k), { x: a.centerX, z: rackUnit(k + 1).center.z })
    }
    addNode(nodeFront(a.index), { x: a.centerX, z: FRONT_LANE_Z })
  }
  for (const lane of [0, 3]) {
    addNode(nodeStationLane(lane), { x: AISLES[lane]?.centerX ?? 0, z: STATIONS.A.z })
  }
  addNode(nodeStationPad('A'), { x: ROBOT_START_X.A, z: STATIONS.A.z })
  addNode(nodeStationPad('C'), { x: ROBOT_START_X.C, z: STATIONS.C.z })

  link(nodeStationPad('A'), nodeStationLane(0))
  link(nodeStationPad('C'), nodeStationLane(3))

  for (let lane = 0; lane < 4; lane++) {
    if (lane < 3) {
      link(nodeTop(lane), nodeTop(lane + 1))
      link(nodeFront(lane), nodeFront(lane + 1))
    }
    const hasStation = lane === 0 || lane === 3
    if (hasStation) link(nodeTop(lane), nodeStationLane(lane))
    if (blocked.has(lane)) continue
    link(hasStation ? nodeStationLane(lane) : nodeTop(lane), nodeUnit(lane, 0))
    link(nodeUnit(lane, 0), nodeUnit(lane, 1))
    link(nodeUnit(lane, 1), nodeUnit(lane, 2))
    link(nodeUnit(lane, 2), nodeFront(lane))
  }
  // Sanity: the first rack-zone node must lie inside the rack rows.
  if ((pos.get(nodeUnit(0, 0))?.z ?? 0) <= ROW_Z0) throw new Error('unit nodes must be inside the rack zone')
  return { pos, adj }
}

export interface Route {
  readonly goal: string
  readonly points: readonly Pt[]
  readonly length: number
}

/** Dijkstra from `from` to the cheapest of `goals` (each with an extra cost). Null if unreachable. */
export function shortestRoute(
  g: RouteGraph,
  from: string,
  goals: readonly { id: string; extra?: number }[],
): Route | null {
  const best = new Map<string, number>([[from, 0]])
  const prev = new Map<string, string>()
  const done = new Set<string>()
  for (;;) {
    let cur: string | null = null
    let curCost = Infinity
    for (const [id, c] of best) {
      if (!done.has(id) && c < curCost) {
        cur = id
        curCost = c
      }
    }
    if (cur === null) break
    done.add(cur)
    for (const e of g.adj.get(cur) ?? []) {
      const c = curCost + e.len
      if (c < (best.get(e.to) ?? Infinity)) {
        best.set(e.to, c)
        prev.set(e.to, cur)
      }
    }
  }
  let pick: { id: string; total: number } | null = null
  for (const goal of goals) {
    const c = best.get(goal.id)
    if (c === undefined) continue
    const total = c + (goal.extra ?? 0)
    if (!pick || total < pick.total) pick = { id: goal.id, total }
  }
  if (!pick) return null
  const ids = [pick.id]
  for (let n = pick.id; n !== from; ) {
    const p = prev.get(n)
    if (p === undefined) break
    ids.unshift(p)
    n = p
  }
  const points = ids.map((id) => g.pos.get(id)).filter((p): p is Pt => p !== undefined)
  return { goal: pick.id, points, length: best.get(pick.id) ?? 0 }
}

/** Copy of `g` with an extra node `CUR` at `p`, linked to every given node. */
export function withPoint(g: RouteGraph, p: Pt, linkTo: readonly string[]): RouteGraph {
  const pos = new Map(g.pos)
  const adj = new Map<string, { to: string; len: number }[]>()
  for (const [k, v] of g.adj) adj.set(k, [...v])
  pos.set('CUR', p)
  adj.set('CUR', [])
  for (const id of linkTo) {
    const q = pos.get(id)
    if (!q) continue
    const len = dist(p, q)
    adj.get('CUR')?.push({ to: id, len })
    adj.get(id)?.push({ to: 'CUR', len })
  }
  return { pos, adj }
}
