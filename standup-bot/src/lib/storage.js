const KEY = 'standup_history_v3'

export function localLoad() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function localSave(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
}

export function localDelete(id) {
  const items = localLoad().filter(i => i.id !== id)
  localSave(items)
  return items
}
