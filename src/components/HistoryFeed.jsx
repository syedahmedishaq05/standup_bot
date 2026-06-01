import styles from './HistoryFeed.module.css'

function formatTs(ts) {
  const d = new Date(ts)
  return (
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

export default function HistoryFeed({ history, onDelete, onClearAll, supabaseEnabled }) {
  return (
    <section className={styles.section} aria-label="Standup history">
      <div className={styles.header}>
        <span className={styles.title}>History</span>
        <span className={styles.badge}>{history.length}</span>
        {supabaseEnabled && (
          <span className={styles.dbPill} title="Synced to Supabase">
            <i className="ti ti-database" aria-hidden="true" /> Supabase
          </span>
        )}
        {history.length > 0 && (
          <button className={styles.clearAll} onClick={onClearAll}>
            <i className="ti ti-trash" /> clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.empty} role="status">
          <i className="ti ti-clock-hour-3" aria-hidden="true" />
          <p>No standups yet — submit your first one above</p>
        </div>
      ) : (
        history.map(entry => (
          <div key={entry.id} className={styles.item}>
            <div className={styles.meta}>
              <i className="ti ti-calendar-event" aria-hidden="true" style={{ fontSize: 13 }} />
              <span className={styles.ts}>{formatTs(entry.timestamp)}</span>
            </div>
            <pre className={styles.text}>{entry.summary}</pre>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(entry.id)}
              aria-label="Delete this standup"
            >
              <i className="ti ti-trash" />
            </button>
          </div>
        ))
      )}
    </section>
  )
}
