import { type Cite, formatCite } from '../rules/cite'
import { ENTITY_FACTS } from '../rules/field'
import { RUN_TIME_S, ROBOT_LIMITS } from '../rules/limits'
import { SURPRISE_POINTS } from '../rules/scoring'
import { stateAt } from '../scenarios/playback'
import { useApp } from '../state/store'

export function CiteChip({ cite }: { cite: Cite }) {
  return <span className={`chip chip-${cite.kind}`}>{formatCite(cite)}</span>
}

function Budget() {
  const total = useApp((s) => s.plan.totalS)
  const pct = Math.min(100, (total / RUN_TIME_S) * 100)
  const over = total > RUN_TIME_S
  return (
    <section>
      <h3>Run time budget</h3>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={RUN_TIME_S} aria-valuenow={Math.round(total)}>
        <div className={over ? 'fill over' : 'fill'} style={{ width: `${pct}%` }} />
      </div>
      <p className={over ? 'warn' : 'hint'}>
        {total.toFixed(0)} s of {RUN_TIME_S} s (3 min per run, General Rules p.18)
        {over ? ' — over the limit: the run would be stopped. Raise the robot speed.' : ''}
      </p>
    </section>
  )
}

function Score() {
  const plan = useApp((s) => s.plan)
  const t = useApp((s) => Math.floor(s.t * 5) / 5)
  const st = stateAt(plan, t)
  const earned = plan.segments.filter((_, i) => i <= st.segmentIndex && t >= (plan.segments[i]?.t1 ?? Infinity)).flatMap((s) => s.score)
  return (
    <section>
      <h3>
        Score <span className="big">{st.score}</span> / {plan.maxScore}
      </h3>
      <p className="hint">+{SURPRISE_POINTS} Surprise Rule not modelled (150 total). A repair would halve the score.</p>
      <ul className="events">
        {earned.map((e, i) => (
          <li key={i}>
            +{e.points} {e.label} <CiteChip cite={e.cite} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function Steps() {
  const plan = useApp((s) => s.plan)
  const idx = useApp((s) => stateAt(s.plan, s.t).segmentIndex)
  const seek = useApp((s) => s.seek)
  return (
    <section>
      <h3>What the robot does</h3>
      <ol className="steps">
        {plan.segments.map((seg, i) => (
          <li key={i} className={i === idx ? 'active' : i < idx ? 'past' : ''}>
            <button onClick={() => seek(seg.t0 + 0.001)}>
              <span className="kind">{seg.kind}</span> {seg.title}
              <span className="time">{seg.t0.toFixed(0)}s</span>
            </button>
            {i === idx && (
              <p className="detail">
                {seg.detail} <CiteChip cite={seg.cite} />
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

function Selected() {
  const sel = useApp((s) => s.selected)
  if (!sel) return <p className="hint">Click anything in the scene to see the rule behind it.</p>
  if (sel === 'robot')
    return (
      <section>
        <h3>Robot limits</h3>
        <p className="hint">The model drawn here is 260 × 260 × 150 mm and only illustrative.</p>
        <table>
          <tbody>
            {ROBOT_LIMITS.map((l) => (
              <tr key={l.label}>
                <td>{l.label}</td>
                <td>
                  {l.value} {l.unit}
                </td>
                <td>
                  <CiteChip cite={l.cite} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )
  const entity = ENTITY_FACTS[sel]
  return (
    <section>
      <h3>{entity.title}</h3>
      <table>
        <tbody>
          {entity.facts.map((f) => (
            <tr key={f.label}>
              <td>{f.label}</td>
              <td>{f.value}</td>
              <td>
                <CiteChip cite={f.cite} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function Info() {
  const notes = useApp((s) => s.plan.notes)
  return (
    <aside className="panel right" aria-label="Rules and steps">
      <Selected />
      <Budget />
      <Score />
      <Steps />
      <section>
        <h3>Assumptions</h3>
        <ul className="notes">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
