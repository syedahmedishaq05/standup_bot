import { useState } from 'react'
import styles from './StandupForm.module.css'

export default function StandupForm({ onSubmit, loading }) {
  const [fields, setFields] = useState({ didYesterday: '', doToday: '', blockers: '' })
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('standup_key') || '')
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit() {
    setError('')
    if (!apiKey.trim()) { setError('Enter your Anthropic API key.'); return }
    if (!fields.didYesterday.trim() && !fields.doToday.trim()) {
      setError('Fill in at least "Yesterday" and "Today".'); return
    }
    sessionStorage.setItem('standup_key', apiKey.trim())
    try {
      await onSubmit({ apiKey: apiKey.trim(), ...fields })
      setFields({ didYesterday: '', doToday: '', blockers: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  function handleClear() {
    setFields({ didYesterday: '', doToday: '', blockers: '' })
    setError('')
  }

  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>
        <i className="ti ti-writing" aria-hidden="true" /> today's standup
      </p>

      {/* API Key */}
      <div className={styles.keyRow}>
        <input
          type={showKey ? 'text' : 'password'}
          className={styles.keyInput}
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-ant-… (Anthropic API key)"
          autoComplete="off"
        />
        <button className={styles.eyeBtn} onClick={() => setShowKey(v => !v)} title="Toggle visibility">
          <i className={`ti ${showKey ? 'ti-eye-off' : 'ti-eye'}`} />
        </button>
      </div>

      {/* Fields */}
      {[
        { id: 'didYesterday', icon: 'ti-check',          label: 'What I did yesterday',  ph: 'Fixed login bug, reviewed 3 PRs, deployed auth service…' },
        { id: 'doToday',      icon: 'ti-arrow-right',    label: "What I'll do today",     ph: 'Implement dashboard charts, write unit tests for payments…' },
        { id: 'blockers',     icon: 'ti-alert-triangle', label: 'Blockers',               ph: 'Waiting on API keys from DevOps… (or leave blank)' },
      ].map(({ id, icon, label, ph }) => (
        <div key={id} className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor={id}>
            <i className={`ti ${icon}`} aria-hidden="true" /> {label}
          </label>
          <textarea
            id={id}
            className={styles.textarea}
            value={fields[id]}
            onChange={set(id)}
            placeholder={ph}
            rows={2}
          />
        </div>
      ))}

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
          {loading
            ? <><span className={styles.spinner} /> Formatting…</>
            : <><i className="ti ti-sparkles" aria-hidden="true" /> Format with AI</>
          }
        </button>
        <button className={styles.btnSecondary} onClick={handleClear} disabled={loading}>
          <i className="ti ti-eraser" aria-hidden="true" /> Clear
        </button>
      </div>

      {error && (
        <div className={styles.error} role="alert">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
