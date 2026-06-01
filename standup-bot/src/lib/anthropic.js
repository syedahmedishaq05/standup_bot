const SYSTEM_PROMPT = `You are a concise standup formatter for software engineering teams.
Take the user's raw standup notes and reformat them into a clean, professional standup update.

Use EXACTLY this format — no extra text, no preamble, no sign-off:

✅ Yesterday
• [what was done, one clear sentence per bullet]

🔜 Today
• [what will be done, one clear sentence per bullet]

🚧 Blockers
• [blocker, or "No blockers" as the single bullet if none]

Rules:
- Keep each bullet to one sentence
- Do not add any text outside the three sections
- If input is vague, infer reasonably but stay concise`

export async function formatStandup({ apiKey, didYesterday, doToday, blockers }) {
  const userContent =
    `Yesterday: ${didYesterday || 'Nothing specified'}\n` +
    `Today: ${doToday      || 'Nothing specified'}\n` +
    `Blockers: ${blockers  || 'None'}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.find(b => b.type === 'text')?.text?.trim()
  if (!text) throw new Error('Empty response from AI')
  return text
}
