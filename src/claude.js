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

/* --- Spelling-focused fallback hint (offline, no AI call) ---
   Picks the most useful orthographic clue we can detect from the word. */
const RHYMES = {
  'cat': 'hat', 'bat': 'cat', 'rat': 'cat', 'hat': 'cat',
  'tree': 'bee', 'bee': 'see', 'see': 'bee',
  'night': 'light', 'light': 'night', 'fight': 'night', 'right': 'light',
  'ball': 'tall', 'tall': 'ball', 'call': 'ball',
  'king': 'ring', 'ring': 'king', 'sing': 'king', 'thing': 'ring',
  'day': 'play', 'way': 'day', 'play': 'day', 'say': 'day',
  'sun': 'fun', 'fun': 'sun', 'run': 'sun',
  'dog': 'fog', 'log': 'dog', 'frog': 'dog',
};
function spellingFallbackHint(word) {
  const w = String(word || '').toLowerCase();
  if (!w) return 'Listen carefully to each sound.';
  // Double letters
  for (let i = 0; i < w.length - 1; i++) {
    if (w[i] === w[i+1] && /[a-z]/.test(w[i])) return `Has a double "${w[i]}".`;
  }
  // Silent letters
  if (/^kn/.test(w)) return 'Starts with a silent "k".';
  if (/^wr/.test(w)) return 'Starts with a silent "w".';
  if (/^ps/.test(w)) return 'Starts with a silent "p".';
  if (/mb$/.test(w)) return 'Ends with a silent "b".';
  if (/ght/.test(w)) return 'Contains a silent "gh".';
  // Common patterns
  if (/tion$/.test(w)) return 'Ends with "tion" (sounds like "shun").';
  if (/sion$/.test(w)) return 'Ends with "sion".';
  if (/ough/.test(w)) return 'Contains a tricky "ough".';
  if (/^th/.test(w)) return 'Starts with "th".';
  if (/^sh/.test(w)) return 'Starts with "sh".';
  if (/^ch/.test(w)) return 'Starts with "ch".';
  if (/ph/.test(w)) return 'Contains "ph" (sounds like "f").';
  if (/ei/.test(w)) return 'Watch out for the "ei" in the middle.';
  if (/ie/.test(w)) return 'Watch out for the "ie" in the middle.';
  // Count syllables (rough estimate via vowel groups)
  const syl = (w.match(/[aeiouy]+/g) || []).length;
  if (syl >= 3) return `Has ${syl} syllables — break it into bits.`;
  // Rhyme if we know one
  if (RHYMES[w]) return `Rhymes with "${RHYMES[w]}".`;
  // Last resort — a letter count + first letter
  return `Starts with "${w[0]}" and has ${w.length} letters.`;
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
`You are a warm, encouraging primary-school teacher marking 7-year-old ${childName}'s creative writing. Give SHORT, KIND, CHILD-FRIENDLY feedback a 7-year-old can actually read and understand.

The prompt was: "${prompt}"
They were asked to write at least 10 sentences.

Their writing:
"""
${childResponse}
"""

Respond with ONLY valid JSON in this exact shape (no markdown, no commentary):
{
  "grade": <number 1-10>,
  "praise": "<ONE warm sentence about something specific they did well, with a quote from their writing>",
  "suggestion": "<ONE child-friendly, pertinent suggestion — simple language, one clear thing to try next time, with a tiny rewritten example from their own words>",
  "idea": "<ONE sentence suggesting what could happen next in their story>",
  "cheer": "<ONE short enthusiastic closing line>"
}

RULES:
- TOTAL feedback should read as 3-4 short lines when shown together.
- Use simple words a 7-year-old reads easily (avoid: "narrative", "descriptive", "construct", "varied").
- Praise should quote something they actually wrote.
- Suggestion should be ONE specific, concrete thing (not a list). Examples of good suggestions:
  * "Try adding a colour word — 'The cat jumped on the fence' → 'The fluffy black cat jumped on the wooden fence.'"
  * "Try joining two ideas with 'because' — 'I was happy because the sun came out.'"
  * "Try a more exciting word instead of 'said' — 'whispered', 'shouted', 'giggled'."
- NO bullet lists, NO headings, NO multiple sub-points. Just the four JSON fields, each a single sentence.

Grading rubric (be generous — kids should feel proud):
- 10 = wonderful: vivid, 10+ sentences, mostly tidy, creative
- 8-9 = really good: solid length, clear ideas
- 6-7 = good effort: some good bits, room to grow
- 4-5 = needs more work: short or unclear
- 1-3 = very short or blank

Tone: like a beloved teacher talking to a 7-year-old. Warm. Specific. Never patronising.`,
        700);

      const parsed = extractJSON(text);
      if (parsed && typeof parsed.grade === 'number') {
        parsed.grade = Math.max(1, Math.min(10, Math.round(parsed.grade)));
        // Defensive defaults for any missing fields
        if (typeof parsed.praise !== 'string') parsed.praise = '';
        if (typeof parsed.suggestion !== 'string') parsed.suggestion = '';
        if (typeof parsed.idea !== 'string') parsed.idea = '';
        if (typeof parsed.cheer !== 'string') parsed.cheer = '';
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
       SPELLING HINT — spelling-focused clue (NOT about meaning)
       Focus: rhymes, letter patterns, tricky bits, syllable count,
       silent letters, double letters. NOT definitions.
       ========================================================= */
    if (task === 'spelling-hint') {
      const { word } = payload || {};
      if (!word) return res.status(400).json({ error: 'Missing word' });

      const text = await callClaude(apiKey,
`A 7-year-old is about to spell the word "${word}". Give them ONE helpful SPELLING hint — NOT a definition, NOT a meaning, NOT a sentence using the word. Focus on HOW the word is spelled.

Good hint types (pick whichever fits best for "${word}"):
- Rhyme hint: "Rhymes with <common easy word>"
- Letter pattern hint: "Has a silent 'k' at the start" or "Has a double 'l' in the middle" or "Ends with 'tion'"
- Syllable hint: "Three syllables: break it into smaller bits"
- Tricky-bit hint: "Watch out for the 'ei' in the middle" or "The 'ph' sounds like 'f'"
- Starter hint: "Starts with 'th'" or "Starts with two letters that are the same"

Do NOT:
- Define the word
- Say what it means
- Use the word in a sentence (even with blanks)
- Spell the whole word out
- Describe the category (e.g. "it's an animal")

Just one short, punchy spelling clue. Under 12 words.

Respond with ONLY valid JSON:
{"hint": "<one short spelling-focused clue>"}`,
        180);

      const parsed = extractJSON(text);
      if (parsed && parsed.hint) {
        // Defensive: strip the word itself if the model accidentally included it
        parsed.hint = parsed.hint.replace(new RegExp(word, 'gi'), '___');
        return res.status(200).json(parsed);
      }
      // Pattern-based fallback (no AI) — pick the most useful spelling clue we can spot
      const fallback = spellingFallbackHint(word);
      return res.status(200).json({ hint: fallback });
    }

    /* =========================================================
       MATHS EXPLANATION — full step-by-step working
       ========================================================= */
    if (task === 'math-explain') {
      const { question, correct, given, childName = 'you' } = payload || {};
      if (!question || correct === undefined) return res.status(400).json({ error: 'Missing' });

      const text = await callClaude(apiKey,
`A 7-year-old (${childName}) tried to solve the maths problem: ${question}
They answered: ${given}
The correct answer is: ${correct}

Teach them how to work it out from scratch with a clear step-by-step method. Use simple language. Be warm, patient, and encouraging.

Respond with ONLY valid JSON in this exact shape (no markdown):
{
  "opening": "<one warm, encouraging sentence acknowledging it's tricky>",
  "steps": [
    "<Step 1: simple sentence showing the first thing to do, can use arithmetic notation like '5 + 3 = 8'>",
    "<Step 2: next concrete step>",
    "<Step 3: next step>",
    "<Step 4 if needed, otherwise short final step>"
  ],
  "whyWrong": "<one sentence gently explaining the small mistake in their answer ${given}, if possible, otherwise 'Easy mistake to make!'>",
  "tip": "<one quick memory trick or pattern they can use next time (e.g. 'For doubling, add the number to itself' or 'For 9-times table, the digits always add to 9')>",
  "finalAnswer": "<the answer, clearly stated — e.g. 'So the answer is 42.'>"
}

Step requirements:
- 3-5 steps maximum.
- Each step should be short and concrete with actual numbers.
- Show the full method, not just the answer.
- For two-digit addition, show partitioning (tens + tens, ones + ones).
- For multiplication, show it as repeated addition OR use known facts.
- For word problems, identify what's being asked first.
- For fractions, use a visual metaphor (pizza slices, bars of chocolate).`,
        800);

      const parsed = extractJSON(text);
      if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return res.status(200).json(parsed);
      }
      // Fallback if parsing fails
      return res.status(200).json({
        opening: 'That was a tricky one!',
        steps: [`The question was ${question}`, `The answer is ${correct}`, `Try working it out step by step next time.`],
        whyWrong: `You said ${given} but the answer is ${correct}. Keep trying!`,
        tip: 'Take your time and work it out slowly.',
        finalAnswer: `So the answer is ${correct}.`
      });
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

    /* =========================================================
       v3: READING/LESSON - generate full subject lesson for a day
       ========================================================= */
    if (task === 'generate-lesson') {
      const { subject, day, topic, brief, targetYear } = payload || {};
      if (!subject || !day || !topic) return res.status(400).json({ error: 'Missing subject/day/topic' });

      const subjectDescriptor =
        subject === 'history'   ? 'UK primary/lower-secondary history' :
        subject === 'geography' ? 'UK primary/lower-secondary geography' :
        subject === 'science'   ? 'UK primary/lower-secondary science (National Curriculum aligned)' :
        subject;

      const yr = targetYear || 4;
      const hasVideo = (day % 2 === 1); // odd days have BBC Bitesize link

      const text = await callClaude(apiKey,
`You are writing a single ${subjectDescriptor} lesson for a 7-year-old child working at approximately UK Year ${yr}.

TOPIC for this lesson: "${topic}"
${brief ? `Guidance: ${brief}` : ''}

REQUIREMENTS:
- Write an "intro" — 1-2 sentences to hook the child into the lesson.
- Write EXACTLY 6 slides. Each slide has a "title" (3-6 words), a "text" body (3-5 sentences, packed with 1-2 specific, memorable facts a child can tell their friends), and an "imageQuery" (2-5 word search term for a photo illustrating the slide — e.g. "erupting volcano lava" or "taj mahal india").
- Write EXACTLY 10 multiple-choice quiz questions. Each has a "q", 4 "options", a "correct" 0-based index, and a "cheer" — one warm enthusiastic sentence to show when they get it right.
- Mix question difficulty: some recall, some comprehension, some applied.
- Tone: warm, curious, like a favourite primary teacher. No scary or upsetting details. Age-appropriate throughout.
- "bitesizeQuery" should be a 2-4 word search term suitable for finding this topic on BBC Bitesize (e.g. "ancient egypt pyramids" or "water cycle ks2").

Respond with ONLY valid JSON (no markdown, no commentary):
{
  "title": "<lesson title, matches or shortens the topic>",
  "intro": "<1-2 hook sentences>",
  "slides": [
    {"title": "<slide 1 title>", "text": "<slide 1 body>", "imageQuery": "<search term>"},
    {"title": "<slide 2 title>", "text": "<slide 2 body>", "imageQuery": "<search term>"},
    {"title": "<slide 3 title>", "text": "<slide 3 body>", "imageQuery": "<search term>"},
    {"title": "<slide 4 title>", "text": "<slide 4 body>", "imageQuery": "<search term>"},
    {"title": "<slide 5 title>", "text": "<slide 5 body>", "imageQuery": "<search term>"},
    {"title": "<slide 6 title>", "text": "<slide 6 body>", "imageQuery": "<search term>"}
  ],
  "questions": [
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 0, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 1, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 2, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 3, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 0, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 1, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 2, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 3, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 0, "cheer": "<warm cheer>"},
    {"q": "<question>", "options": ["<A>", "<B>", "<C>", "<D>"], "correct": 1, "cheer": "<warm cheer>"}
  ],
  "hasVideo": ${hasVideo},
  "bitesizeQuery": "<bbc bitesize search term>"
}`,
        3500);

      const parsed = extractJSON(text);
      if (parsed && parsed.slides && Array.isArray(parsed.slides) && parsed.slides.length >= 4 &&
          parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length >= 6) {
        // sanitize each question correct index
        parsed.questions = parsed.questions.map(q => ({
          ...q,
          correct: typeof q.correct === 'number' ? Math.max(0, Math.min(3, q.correct)) : 0,
          cheer: q.cheer || 'Well done!'
        }));
        if (typeof parsed.hasVideo !== 'boolean') parsed.hasVideo = hasVideo;
        if (!parsed.bitesizeQuery) parsed.bitesizeQuery = topic;
        return res.status(200).json(parsed);
      }
      return res.status(502).json({ error: 'Lesson generation failed', raw: text.slice(0,200) });
    }

    return res.status(400).json({ error: 'Unknown task' });
  } catch (e) {
    console.error('AI endpoint error:', e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
