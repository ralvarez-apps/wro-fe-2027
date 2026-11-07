import type { BoxPose, Plan, Pt, Segment } from './types'
import { ROBOT_BODY } from './plan'

export interface RobotPose {
  readonly x: number
  readonly z: number
  readonly heading: number
}

export interface PlaybackState {
  readonly robot: RobotPose
  readonly boxes: ReadonlyMap<string, BoxPose>
  readonly holding: string | null
  readonly segmentIndex: number
  readonly score: number
}

const lerp = (a: number, b: number, u: number): number => a + (b - a) * u
const lerpAngle = (a: number, b: number, u: number): number => {
  let d = (b - a) % (2 * Math.PI)
  if (d > Math.PI) d -= 2 * Math.PI
  if (d < -Math.PI) d += 2 * Math.PI
  return a + d * u
}
const lerpPose = (a: BoxPose, b: BoxPose, u: number): BoxPose => ({
  x: lerp(a.x, b.x, u),
  z: lerp(a.z, b.z, u),
  y: lerp(a.y, b.y, u),
  rotY: lerpAngle(a.rotY, b.rotY, u),
})

export function heldPose(r: RobotPose): BoxPose {
  return { x: r.x, z: r.z, y: ROBOT_BODY.heightMm, rotY: r.heading }
}

/** Point and heading at fraction `u` of a polyline's length. */
export function along(path: readonly Pt[], u: number, fallbackHeading: number): RobotPose {
  const first = path[0]
  if (!first) return { x: 0, z: 0, heading: fallbackHeading }
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    if (a && b) total += Math.hypot(b.x - a.x, b.z - a.z)
  }
  if (total < 1e-6) return { x: first.x, z: first.z, heading: fallbackHeading }
  let remaining = Math.min(Math.max(u, 0), 1) * total
  let heading = fallbackHeading
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]
    const b = path[i]
    if (!a || !b) continue
    const len = Math.hypot(b.x - a.x, b.z - a.z)
    if (len < 1e-6) continue
    heading = Math.atan2(b.x - a.x, b.z - a.z)
    if (remaining <= len) {
      const k = remaining / len
      return { x: lerp(a.x, b.x, k), z: lerp(a.z, b.z, k), heading }
    }
    remaining -= len
  }
  const last = path[path.length - 1] ?? first
  return { x: last.x, z: last.z, heading }
}

export function robotAt(seg: Segment, t: number): RobotPose {
  const u = seg.durationS > 0 ? (t - seg.t0) / seg.durationS : 1
  return seg.kind === 'move' ? along(seg.path, u, seg.heading) : along(seg.path, 1, seg.heading)
}

/** Pure function of the plan and time: robot pose, box poses and score. Used by the scene and tests. */
export function stateAt(plan: Plan, tRaw: number): PlaybackState {
  const t = Math.min(Math.max(tRaw, 0), plan.totalS)
  const boxes = new Map<string, BoxPose>(plan.boxes.map((b) => [b.id, b.pose]))
  const first = plan.segments[0]
  let robot: RobotPose = first
    ? { x: first.path[0]?.x ?? 0, z: first.path[0]?.z ?? 0, heading: first.heading }
    : { x: 0, z: 0, heading: 0 }
  let holding: string | null = null
  let score = 0
  let segmentIndex = 0

  for (let i = 0; i < plan.segments.length; i++) {
    const seg = plan.segments[i]
    if (!seg) continue
    if (t < seg.t0) break
    segmentIndex = i
    const done = t >= seg.t1
    const u = done || seg.durationS <= 0 ? 1 : (t - seg.t0) / seg.durationS
    robot = seg.kind === 'move' ? along(seg.path, u, seg.heading) : along(seg.path, 1, seg.heading)

    if (seg.kind === 'pick' && seg.boxId) {
      const from = boxes.get(seg.boxId)
      if (from) boxes.set(seg.boxId, lerpPose(from, heldPose(robot), u))
      if (done) holding = seg.boxId
    } else if (seg.kind === 'place' && seg.boxId && seg.placeAt) {
      boxes.set(seg.boxId, lerpPose(heldPose(robot), seg.placeAt, u))
      if (done) holding = null
    }
    if (holding) boxes.set(holding, heldPose(robot))
    if (done) for (const e of seg.score) score += e.points
  }
  return { robot, boxes, holding, segmentIndex, score }
}
