import { useApp } from '../state/store'

export function Timeline() {
  const playing = useApp((s) => s.playing)
  const total = useApp((s) => s.plan.totalS)
  const t = useApp((s) => Math.floor(s.t * 10) / 10)
  const rate = useApp((s) => s.rate)
  const { play, pause, restart, seek, setRate } = useApp.getState()
  return (
    <div className="timeline" role="group" aria-label="Playback">
      <button className="primary" onClick={playing ? pause : play} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? '⏸' : '▶'}
      </button>
      <button onClick={restart} aria-label="Restart">
        ⟲
      </button>
      <input
        type="range"
        min={0}
        max={total}
        step={0.05}
        value={t}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Time"
      />
      <span className="clock">
        {t.toFixed(1)} / {total.toFixed(1)} s
      </span>
      <select value={rate} onChange={(e) => setRate(Number(e.target.value))} aria-label="Playback rate">
        {[0.5, 1, 2, 4, 8].map((r) => (
          <option key={r} value={r}>
            {r}×
          </option>
        ))}
      </select>
    </div>
  )
}
