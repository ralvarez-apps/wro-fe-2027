import { RACK_UNITS } from '../rules/field'
import type { Category, MissionNo } from '../rules/scoring'
import { ALL_UNITS, BLOCKED_PAIRS, PRESETS, randomSetup } from '../scenarios/catalog'
import type { ProductKind, ScenarioSetup, StationId } from '../scenarios/types'
import { type Overlays, type ViewMode, useApp } from '../state/store'

const PRODUCTS: readonly ProductKind[] = ['block', 'cylinder', 'pyramid']

/** Keep exactly `n` selected: picking a new one drops the oldest. */
function togglePick(current: readonly number[], unit: number, n: number): number[] {
  if (current.includes(unit)) return current.length > n ? current.filter((u) => u !== unit) : [...current]
  const next = [...current, unit]
  return next.length > n ? next.slice(next.length - n) : next
}

export function Controls() {
  const setup = useApp((s) => s.setup)
  const speed = useApp((s) => s.speedMmS)
  const overlays = useApp((s) => s.overlays)
  const view = useApp((s) => s.view)
  const { setSetup, setSpeed, toggleOverlay, setView } = useApp.getState()

  const patch = (p: Partial<ScenarioSetup>): void => setSetup({ ...setup, ...p })
  const adv = setup.category === 'advanced'
  const classification = adv && setup.mission === 2
  const blockedKey = setup.blockedAisles.includes(1) ? '2+4' : '3+1'

  const setRequested = (units: number[]): void => {
    if (setup.category === 'senior' && setup.mission === 1) patch({ requested: units, rackBoxes: units })
    else patch({ requested: units, orderCards: units })
  }

  return (
    <aside className="panel left" aria-label="Scenario controls">
      <h2>Scenario</h2>
      <label className="field">
        <span>Rulebook example</span>
        <select
          value=""
          onChange={(e) => {
            const p = PRESETS[Number(e.target.value)]
            if (p) setSetup(p.build())
          }}
        >
          <option value="" disabled>
            Load an example…
          </option>
          {PRESETS.map((p, i) => (
            <option key={p.label} value={i}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <div className="row">
        {(['senior', 'advanced'] as Category[]).map((c) => (
          <button key={c} className={setup.category === c ? 'on' : ''} onClick={() => setSetup(randomSetup(c, setup.mission))}>
            {c === 'senior' ? 'Senior' : 'Advanced'}
          </button>
        ))}
      </div>
      <div className="row">
        {([1, 2] as MissionNo[]).map((m) => (
          <button key={m} className={setup.mission === m ? 'on' : ''} onClick={() => setSetup(randomSetup(setup.category, m))}>
            Mission {m}
          </button>
        ))}
      </div>
      <button className="primary" onClick={() => setSetup(randomSetup(setup.category, setup.mission))}>
        🎲 New random round
      </button>

      <h3>Start / end station</h3>
      <div className="row">
        {(['A', 'C'] as StationId[]).map((s) => (
          <button key={`s${s}`} className={setup.start === s ? 'on' : ''} onClick={() => patch({ start: s })}>
            Start {s}
          </button>
        ))}
        {(['A', 'C'] as StationId[]).map((s) => (
          <button key={`e${s}`} className={setup.end === s ? 'on' : ''} onClick={() => patch({ end: s })}>
            End {s}
          </button>
        ))}
      </div>

      {adv && (
        <>
          <h3>Blocked aisles</h3>
          <div className="row">
            {(Object.keys(BLOCKED_PAIRS) as (keyof typeof BLOCKED_PAIRS)[]).map((k) => (
              <button key={k} className={blockedKey === k ? 'on' : ''} onClick={() => patch({ blockedAisles: [...BLOCKED_PAIRS[k]] })}>
                Aisles {k.replace('+', ' + ')}
              </button>
            ))}
          </div>
          <p className="hint">Aisle 2 forces Aisle 4; Aisle 3 forces Aisle 1 (Game Rules p.22).</p>
        </>
      )}

      {!classification && (
        <>
          <h3>{setup.category === 'senior' && setup.mission === 1 ? 'Racks holding a box (pick 5)' : 'Dot cards drawn (pick 5)'}</h3>
          <div className="grid9">
            {ALL_UNITS.map((u) => (
              <button
                key={u}
                className={setup.requested.includes(u) ? 'on' : ''}
                onClick={() => setRequested(togglePick(setup.requested, u, 5))}
                aria-pressed={setup.requested.includes(u)}
              >
                {u}
              </button>
            ))}
          </div>
        </>
      )}

      {classification && (
        <>
          <h3>Products in Boxes 1–4</h3>
          {setup.products.map((p, i) => (
            <label key={i} className="field inline">
              <span>Box {i + 1}</span>
              <select
                value={p}
                onChange={(e) => patch({ products: setup.products.map((q, j) => (j === i ? (e.target.value as ProductKind) : q)) })}
              >
                {PRODUCTS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
          ))}
          <p className="hint">Each type may appear at most twice (Game Rules p.26).</p>
          <h3>Pre-placed empty boxes (one per row)</h3>
          {[0, 1, 2].map((row) => (
            <div key={row} className="row">
              <span className="rowlabel">Row {row + 1}</span>
              {RACK_UNITS.filter((u) => u.row === row).map((u) => (
                <button
                  key={u.id}
                  className={setup.rackBoxes.includes(u.id) ? 'on' : ''}
                  onClick={() => patch({ rackBoxes: [...setup.rackBoxes.filter((x) => RACK_UNITS[x - 1]?.row !== row), u.id].sort((a, b) => a - b) })}
                >
                  {u.id}
                </button>
              ))}
            </div>
          ))}
        </>
      )}

      <h3>Robot speed (illustrative)</h3>
      <label className="field">
        <span>{speed} mm/s</span>
        <input type="range" min={100} max={600} step={25} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
      </label>

      <h3>View</h3>
      <div className="row">
        {(['angled', 'top'] as ViewMode[]).map((v) => (
          <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
            {v}
          </button>
        ))}
      </div>

      <h3>Overlays</h3>
      {(
        [
          ['zones', 'Zones'],
          ['aisles', 'Aisles'],
          ['labels', 'Labels'],
          ['path', 'Planned route'],
          ['limit', 'Robot size limit (500 mm)'],
          ['xray', 'See through racks'],
        ] as [keyof Overlays, string][]
      ).map(([k, label]) => (
        <label key={k} className="check">
          <input type="checkbox" checked={overlays[k]} onChange={() => toggleOverlay(k)} /> {label}
        </label>
      ))}
    </aside>
  )
}
