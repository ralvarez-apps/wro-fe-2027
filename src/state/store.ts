import { create } from 'zustand'
import type { EntityKey } from '../rules/field'
import { PRESETS } from '../scenarios/catalog'
import { DEFAULT_SPEED_MM_S, buildPlan } from '../scenarios/plan'
import { type PlaybackState, stateAt } from '../scenarios/playback'
import type { Plan, ScenarioSetup } from '../scenarios/types'

export type SelectionKey = EntityKey | null
export type ViewMode = 'angled' | 'top' | 'follow'

export interface Overlays {
  zones: boolean
  aisles: boolean
  labels: boolean
  path: boolean
  limit: boolean
  xray: boolean
}

interface AppState {
  setup: ScenarioSetup
  speedMmS: number
  plan: Plan
  t: number
  playing: boolean
  rate: number
  view: ViewMode
  overlays: Overlays
  selected: SelectionKey
  setSetup: (s: ScenarioSetup) => void
  setSpeed: (v: number) => void
  setRate: (v: number) => void
  setView: (v: ViewMode) => void
  toggleOverlay: (k: keyof Overlays) => void
  select: (k: SelectionKey) => void
  play: () => void
  pause: () => void
  restart: () => void
  seek: (t: number) => void
  tick: (dtS: number) => void
}

const firstPreset = PRESETS[0]
if (!firstPreset) throw new Error('no presets')
const initialSetup = firstPreset.build()

export const useApp = create<AppState>((set, get) => ({
  setup: initialSetup,
  speedMmS: DEFAULT_SPEED_MM_S,
  plan: buildPlan(initialSetup, DEFAULT_SPEED_MM_S),
  t: 0,
  playing: false,
  rate: 1,
  view: 'angled',
  overlays: { zones: true, aisles: true, labels: true, path: true, limit: false, xray: true },
  selected: null,
  setSetup: (setup) => set({ setup, plan: buildPlan(setup, get().speedMmS), t: 0, playing: false }),
  setSpeed: (speedMmS) => {
    const { setup, plan, t } = get()
    const next = buildPlan(setup, speedMmS)
    const keep = plan.totalS > 0 ? t / plan.totalS : 0
    set({ speedMmS, plan: next, t: keep * next.totalS })
  },
  setRate: (rate) => set({ rate }),
  setView: (view) => set({ view }),
  toggleOverlay: (k) => set((s) => ({ overlays: { ...s.overlays, [k]: !s.overlays[k] } })),
  select: (selected) => set({ selected }),
  play: () => set((s) => ({ playing: true, t: s.t >= s.plan.totalS ? 0 : s.t })),
  pause: () => set({ playing: false }),
  restart: () => set({ t: 0, playing: true }),
  seek: (t) => set((s) => ({ t: Math.min(Math.max(t, 0), s.plan.totalS) })),
  tick: (dtS) => {
    const s = get()
    if (!s.playing) return
    const t = s.t + dtS * s.rate
    if (t >= s.plan.totalS) set({ t: s.plan.totalS, playing: false })
    else set({ t })
  },
}))

/** Shared per-frame result so the scene reads one computed state instead of recomputing per object. */
export const live: { current: PlaybackState } = { current: stateAt(useApp.getState().plan, 0) }

export function refreshLive(): PlaybackState {
  const { plan, t } = useApp.getState()
  live.current = stateAt(plan, t)
  return live.current
}
