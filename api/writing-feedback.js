// Serverless function that proxies requests to the Anthropic API.
// The API key is read from Vercel's environment variables (never exposed to the browser).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { prompt, response: childResponse } = req.body || {};
  if (!prompt || !childResponse) {
    return res.status(400).json({ error: 'Missing prompt or response' });
  }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content:
`You are a warm, encouraging teacher for a 7-year-old.
The writing prompt was: "${prompt}"
The child's response:
"""
${childResponse}
"""
Grade out of 10 — be kind and generous, rewarding effort, creativity, capital letters, full stops, and trying their best (10 = excellent, 7 = good, 5 = okay). Then give ONE short specific piece of praise and ONE gentle, specific suggestion for next time.
Respond with ONLY valid JSON, no markdown, no other text:
{"grade": <number 1-10>, "praise": "<one short warm sentence>", "suggestion": "<one short gentle sentence>"}`
        }]
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('Anthropic API error:', r.status, errText);
      return res.status(502).json({ error: 'Upstream error', status: r.status });
    }

    const data = await r.json();
    const text = (data.content || []).map(c => c.text || '').join('');
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (typeof parsed.grade === 'number') {
        parsed.grade = Math.max(1, Math.min(10, Math.round(parsed.grade)));
        return res.status(200).json(parsed);
      }
    }
    return res.status(200).json({ grade: null });
  } catch (e) {
    console.error('Proxy error', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
