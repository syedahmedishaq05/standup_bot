import { useState, useEffect } from 'react'
import StandupForm  from './components/StandupForm'
import SummaryCard  from './components/SummaryCard'
import StatsBar     from './components/StatsBar'
import HistoryFeed  from './components/HistoryFeed'
import { formatStandup } from './lib/anthropic'
import {
  saveToSupabase,
  fetchFromSupabase,
  deleteFromSupabase,
  supabaseEnabled,
} from './lib/supabase'
import { localLoad, localSave, localDelete } from './lib/storage'
import styles from './App.module.css'

export default function App() {
  const [history, setHistory] = useState([])
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState(supabaseEnabled ? 'loading' : 'local')

  // Load history on mount
  useEffect(() => {
    async function load() {
      if (supabaseEnabled) {
        try {
          const rows = await fetchFromSupabase()
          setHistory(rows)
          setDbStatus('supabase')
        } catch {
          setHistory(localLoad())
          setDbStatus('local')
        }
      } else {
        setHistory(localLoad())
        setDbStatus('local')
      }
    }
    load()
  }, [])

  async function handleSubmit({ apiKey, didYesterday, doToday, blockers }) {
    setLoading(true)
    setSummary('')
    try {
      const result = await formatStandup({ apiKey, didYesterday, doToday, blockers })
      setSummary(result)

      const entry = {
        id:           Date.now(),
        timestamp:    Date.now(),
        didYesterday,
        doToday,
        blockers,
        summary:      result,
      }

      if (supabaseEnabled && dbStatus === 'supabase') {
        try {
          const saved = await saveToSupabase(entry)
          entry.id = saved.id
        } catch {
          // fallback silently to localStorage
        }
      }

      const next = [entry, ...history]
      setHistory(next)
      localSave(next)          // always keep local copy
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (supabaseEnabled && dbStatus === 'supabase') {
      try { await deleteFromSupabase(id) } catch {}
    }
    const next = localDelete(id)
    setHistory(next)
  }

  function handleClearAll() {
    if (!window.confirm('Clear all standup history? This cannot be undone.')) return
    setHistory([])
    localSave([])
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.dot} aria-hidden="true" />
          <h1 className={styles.title}>Standup Bot</h1>
          <span className={styles.dateBadge}>{today}</span>
          {dbStatus === 'supabase' && (
            <span className={styles.dbBadge} title="Connected to Supabase MCP">
              <i className="ti ti-database" aria-hidden="true" /> Supabase
            </span>
          )}
        </header>

        <StatsBar history={history} />

        <StandupForm onSubmit={handleSubmit} loading={loading} />

        <SummaryCard summary={summary} />

        <HistoryFeed
          history={history}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          supabaseEnabled={dbStatus === 'supabase'}
        />
      </div>
    </main>
  )
}
