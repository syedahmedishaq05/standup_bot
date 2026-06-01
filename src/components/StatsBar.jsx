import styles from './StatsBar.module.css'

export default function StatsBar({ history }) {
  if (!history.length) return null

  const total = history.length

  const noBlockerWords = new Set(['none', 'no blockers', 'n/a', 'nil', 'nothing', 'nope', '-', ''])
  const withBlockers = history.filter(
    h => !noBlockerWords.has((h.blockers || '').trim().toLowerCase())
  ).length

  // Day streak
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const activeDays = new Set(
    history.map(h => { const d = new Date(h.timestamp); d.setHours(0,0,0,0); return d.getTime() })
  )
  let streak = 0
  for (let i = 0; i < 60; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    if (activeDays.has(d.getTime())) streak++
    else if (i > 0) break
  }

  const chips = [
    { val: total,        label: 'Standups',   icon: 'ti-writing' },
    { val: streak,       label: 'Day Streak', icon: 'ti-flame' },
    { val: withBlockers, label: 'Blockers',   icon: 'ti-alert-triangle' },
  ]

  return (
    <div className={styles.row} role="region" aria-label="Stats">
      {chips.map(({ val, label, icon }) => (
        <div key={label} className={styles.chip}>
          <div className={styles.val}>{val}</div>
          <div className={styles.label}>
            <i className={`ti ${icon}`} aria-hidden="true" /> {label}
          </div>
        </div>
      ))}
    </div>
  )
}
