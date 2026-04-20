// Universal AI endpoint. All AI-powered features route through here.
// The API key lives only on the server — never sent to the browser.

const MODEL = 'claude-sonnet-4-5';

async function callClaude(apiKey, prompt, maxTokens = 600) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Claude ${r.status}: ${t}`);
  }
  const data = await r.json();
  return (data.content || []).map(c => c.text || '').join('');
}

function extractJSON(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]); } catch (e) { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const { task, payload } = req.body || {};
  if (!task) return res.status(400).json({ error: 'Missing task' });

  try {
    /* =========================================================
       WRITING FEEDBACK — comprehensive, encouraging, with ideas
       ========================================================= */
    if (task === 'writing-feedback') {
      const { prompt, response: childResponse, childName = 'you' } = payload || {};
      if (!prompt || !childResponse) return res.status(400).json({ error: 'Missing prompt/response' });

      const text = await callClaude(apiKey,
`You are a warm, encouraging primary-school teacher marking 7-year-old ${childName}'s creative writing.

The prompt was: "${prompt}"
They were asked to write at least 10 sentences.

Their writing:
"""
${childResponse}
"""

Respond with ONLY valid JSON in this exact shape (no markdown, no commentary):
{
  "grade": <number 1-10>,
  "praise": "<warm specific sentence about what they did well>",
  "strengths": ["<specific strength>", "<another strength>", "<another strength>"],
  "suggestion": "<one gentle, specific suggestion they can try next time>",
  "ideas": ["<a specific sentence or idea they could add>", "<another specific idea>"],
  "cheer": "<one enthusiastic line to end on>"
}

Grading rubric (be generous but honest — kids should feel proud):
- 10 = wonderful: vivid, 10+ sentences, capitals/full stops mostly right, creative ideas
- 8-9 = really good: solid length, mostly tidy writing, clear ideas
- 6-7 = good effort: tried hard, some good bits, room to grow
- 4-5 = needs more work: short or unclear but shows some effort
- 1-3 = very short or blank

Tone: like a beloved teacher. Specific. Warm. Never patronising. Reference real things they wrote.`,
        800);

      const parsed = extractJSON(text);
      if (parsed && typeof parsed.grade === 'number') {
        parsed.grade = Math.max(1, Math.min(10, Math.round(parsed.grade)));
        return res.status(200).json(parsed);
      }
      return res.status(200).json({ grade: null });
    }

    /* =========================================================
       SPELLING MEMORY TIP — for a word they got wrong
       ========================================================= */
    if (task === 'spelling-tip') {
      const { word, wrongAnswer, childName = 'you' } = payload || {};
      if (!word) return res.status(400).json({ error: 'Missing word' });

      const text = await callClaude(apiKey,
`You are a fun, kind spelling coach for 7-year-old ${childName}.
They tried to spell "${word}" and wrote "${wrongAnswer || '(nothing)'}".

Give ONE short, memorable tip to help them remember the correct spelling. Options (pick whichever fits best):
- A mnemonic (e.g. "because: Big Elephants Can Always Understand Small Elephants")
- A word-within-word trick (e.g. "there has HERE inside it")
- A rhyme or pattern (e.g. "i before e except after c")
- A syllable break (e.g. "re-mem-ber: three beats")

Respond with ONLY valid JSON (no markdown):
{
  "tip": "<one sentence, warm and fun, age 7>",
  "correct": "${word}"
}`,
        200);

      const parsed = extractJSON(text);
      if (parsed && parsed.tip) return res.status(200).json(parsed);
      return res.status(200).json({ tip: `Try breaking "${word}" into smaller parts and saying each one out loud!`, correct: word });
    }

    /* =========================================================
       MATHS EXPLANATION — for a wrong answer
       ========================================================= */
    if (task === 'math-explain') {
      const { question, correct, given, childName = 'you' } = payload || {};
      if (!question || correct === undefined) return res.status(400).json({ error: 'Missing' });

      const text = await callClaude(apiKey,
`A 7-year-old (${childName}) tried to solve ${question} and answered ${given}.
The correct answer is ${correct}.

Give ONE short, warm explanation of how to work it out. Be kid-friendly. 1-2 sentences maximum.

Respond with ONLY valid JSON:
{"explanation": "<one or two simple sentences>"}`,
        200);

      const parsed = extractJSON(text);
      if (parsed && parsed.explanation) return res.status(200).json(parsed);
      return res.status(200).json({ explanation: `The answer is ${correct}. Try working it out step by step!` });
    }

    /* =========================================================
       READING: generate story + comprehension quiz for a day
       ========================================================= */
    if (task === 'generate-story') {
      const { day } = payload || {};
      if (!day) return res.status(400).json({ error: 'Missing day' });

      const themes = [
        'a friendly dragon who can\'t breathe fire',
        'a girl who discovers her cat can talk only on Tuesdays',
        'a lost puppy finding its way home through a big city',
        'two sisters who build a raft to explore a pond',
        'a tiny robot that helps a grandmother in her garden',
        'a boy who wakes up able to understand birds',
        'a magical library where books come to life at midnight',
        'a football team with a very unusual goalkeeper',
        'a cloud that follows one child around',
        'a grandma\'s secret recipe brought to life',
        'a shell that plays songs from the sea',
        'a lonely scarecrow who makes a new friend',
        'a balloon that takes a child on an adventure',
        'a paintbrush that paints real things',
        'a tortoise who enters a race',
        'a star that falls into a back garden',
        'a bus driver who knows everyone\'s name',
        'a treehouse with a surprise door',
        'a pair of wellies that love puddles',
        'a forgetful wizard\'s apprentice'
      ];
      const theme = themes[(day - 1) % themes.length];
      const difficulty = day <= 20 ? 'easy' : day <= 40 ? 'medium' : 'slightly challenging';

      const text = await callClaude(apiKey,
`Write a short story for a 7-year-old. About 300 words. Reading level: ${difficulty}.
Theme: ${theme}.

Requirements:
- Warm, age-appropriate, no scary or upsetting content
- Clear beginning, middle, end
- Some character names, a bit of dialogue
- Ends with a gentle lesson or happy feeling (not preachy)

Then write EXACTLY 4 comprehension questions — multiple choice, 4 options each, one correct.
Questions should test understanding, not just recall. Mix: 1 literal, 2 inferential, 1 about main idea or feeling.

Respond with ONLY valid JSON (no markdown):
{
  "title": "<short title>",
  "story": "<the story, ~300 words, use \\n for paragraph breaks>",
  "questions": [
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 0},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 2},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 1},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 3}
  ]
}`,
        1800);

      const parsed = extractJSON(text);
      if (parsed && parsed.story && Array.isArray(parsed.questions) && parsed.questions.length === 4) {
        return res.status(200).json(parsed);
      }
      return res.status(502).json({ error: 'Story generation failed' });
    }

    return res.status(400).json({ error: 'Unknown task' });
  } catch (e) {
    console.error('AI endpoint error:', e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
