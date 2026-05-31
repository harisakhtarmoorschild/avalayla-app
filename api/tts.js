// ============================================================
// ElevenLabs text-to-speech proxy.
//
// The browser POSTs { text, mascot } here; we forward to ElevenLabs
// using a server-side API key and return MP3 audio.
//
// If ELEVENLABS_API_KEY isn't configured, we return 503 so the client
// falls back to browser speechSynthesis. That means the app keeps
// working even before the env var is set in Vercel.
// ============================================================

const MODEL = 'eleven_turbo_v2_5';

// Voice IDs from the ElevenLabs public voice library. Each is hand-picked
// to fit the mascot's personality.
const MASCOT_VOICES = {
  // Pup (Ava's puppy): Lily — warm, young, British female. Bubbly enough to suit a friendly puppy.
  Ava:   { voiceId: 'pFZP5JQG7iQjIQuC4Bku', stability: 0.45, similarity: 0.75, style: 0.6 },
  // Champ (Layla's football): Liam — articulate young male. Easy to push energetic for sports commentary.
  Layla: { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', stability: 0.35, similarity: 0.75, style: 0.7 },
  // Dran (Shyal's beyblade): Daniel — calm, deep British male. Fits a fierce-but-encouraging mentor.
  Shyal: { voiceId: 'onwK4e9ZLuTAKqWW03F9', stability: 0.55, similarity: 0.75, style: 0.4 }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'ElevenLabs not configured — falling back to browser TTS' });
  }

  const { text, mascot } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing text' });

  // Hard caps so a runaway prompt can't burn the character quota.
  const safeText = text.slice(0, 800);

  const cfg = MASCOT_VOICES[mascot] || MASCOT_VOICES.Ava;

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: safeText,
        model_id: MODEL,
        voice_settings: {
          stability: cfg.stability,
          similarity_boost: cfg.similarity,
          style: cfg.style,
          use_speaker_boost: true
        }
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('ElevenLabs error:', r.status, errText);
      return res.status(502).json({ error: `TTS failed: ${r.status}` });
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buf.length);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buf);
  } catch (e) {
    console.error('TTS endpoint error:', e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
