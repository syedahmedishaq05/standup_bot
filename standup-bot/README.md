# Smart Daily Standup Bot

A React + Vite app that formats your daily standup notes using the Anthropic Claude API, with optional Supabase MCP persistence.

---

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

Open http://localhost:5173

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...        # required
VITE_SUPABASE_URL=https://xxx.supabase.co # optional (bonus)
VITE_SUPABASE_ANON_KEY=eyJ...            # optional (bonus)
```

> **Never commit `.env` to git.** It's already in `.gitignore`.

---

## Supabase Setup (Bonus MCP Feature)

1. Create a free project at https://supabase.com
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE standups (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz DEFAULT now(),
  did_yesterday text,
  do_today    text,
  blockers    text,
  summary     text NOT NULL
);

ALTER TABLE standups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read/write"
  ON standups FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. Copy your **Project URL** and **anon key** from Project Settings → API into `.env`
4. The app auto-detects Supabase and shows a green "Supabase" badge in the header

Without Supabase configured, the app falls back to `localStorage` seamlessly.

---

## Features

- AI-powered standup formatting via Claude Sonnet
- Three-field input: Yesterday / Today / Blockers
- Copy-to-clipboard on AI summary
- Persistent history feed (Supabase or localStorage)
- Stats: total standups, day streak, blocker count
- Dark mode auto-detected from OS preference
- API key stored in `sessionStorage` only — never persisted to disk

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | CSS Modules |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Database (bonus) | Supabase (PostgreSQL) |
| Fonts | Syne + DM Mono (Google Fonts) |
| Icons | Tabler Icons |

---

## Deploy to Netlify (one step)

```bash
npm run build
# drag the /dist folder to https://app.netlify.com/drop
```

Or connect your GitHub repo in Netlify and set env vars in Site Settings → Environment Variables.

---

## Project Structure

```
src/
  components/
    StandupForm.jsx      # Input form + API key field
    StandupForm.module.css
    SummaryCard.jsx      # AI result display
    SummaryCard.module.css
    StatsBar.jsx         # Standup / streak / blocker counts
    StatsBar.module.css
    HistoryFeed.jsx      # Scrollable history list
    HistoryFeed.module.css
  lib/
    anthropic.js         # Claude API call + system prompt
    supabase.js          # Supabase client + CRUD helpers
    storage.js           # localStorage fallback
  App.jsx                # Orchestrates state + data flow
  App.module.css
  index.css              # Global CSS variables + reset
  main.jsx               # React entry point
```

---

## AI Tool Used

This project was scaffolded and developed using **Claude Code** (Anthropic's agentic CLI coding tool), demonstrating:
- Prompt-driven component generation
- Iterative refinement of the system prompt for standup formatting
- MCP server integration for Supabase persistence
