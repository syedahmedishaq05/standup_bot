import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase is optional — app works without it (falls back to localStorage)
export const supabase = url && key && url !== 'https://your-project.supabase.co'
  ? createClient(url, key)
  : null

export const supabaseEnabled = !!supabase

// ── Schema (run once in Supabase SQL editor) ──────────────────
// CREATE TABLE standups (
//   id          bigserial PRIMARY KEY,
//   created_at  timestamptz DEFAULT now(),
//   did_yesterday text,
//   do_today    text,
//   blockers    text,
//   summary     text NOT NULL
// );
// ALTER TABLE standups ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public read/write" ON standups FOR ALL USING (true) WITH CHECK (true);

export async function saveToSupabase(entry) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('standups')
    .insert({
      did_yesterday: entry.didYesterday,
      do_today:      entry.doToday,
      blockers:      entry.blockers,
      summary:       entry.summary,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchFromSupabase() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('standups')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data.map(row => ({
    id:           row.id,
    timestamp:    new Date(row.created_at).getTime(),
    didYesterday: row.did_yesterday,
    doToday:      row.do_today,
    blockers:     row.blockers,
    summary:      row.summary,
  }))
}

export async function deleteFromSupabase(id) {
  if (!supabase) return
  const { error } = await supabase.from('standups').delete().eq('id', id)
  if (error) throw error
}
