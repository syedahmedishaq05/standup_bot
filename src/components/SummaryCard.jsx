import { useState } from 'react'
import styles from './SummaryCard.module.css'

export default function SummaryCard({ summary }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  if (!summary) return null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <i className="ti ti-sparkles" aria-hidden="true" />
        <span>AI Summary</span>
        <button className={styles.copyBtn} onClick={copy}>
          <i className={`ti ${copied ? 'ti-check' : 'ti-copy'}`} aria-hidden="true" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={styles.content}>{summary}</pre>
    </div>
  )
}
