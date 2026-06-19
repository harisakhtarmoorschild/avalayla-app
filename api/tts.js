// ============================================================
// Cartesia Sonic text-to-speech proxy.
//
// The browser POSTs { text, mascot } here; we forward to Cartesia
// using a server-side API key and return WAV audio.
//
// If CARTESIA_API_KEY isn't configured, we return 503 so the client
// falls back to browser speechSynthesis. That means the app keeps
// working even before the env var is set in Vercel.
//
// To swap a voice: open https://play.cartesia.ai, find a voice you like,
// copy its UUID, and paste it into MASCOT_VOICES below. All voices work
// with sonic-3 regardless of accent in the voice name.
// ============================================================

const MODEL = 'sonic-3';
const CARTESIA_VERSION = '2025-04-16';

// Voice IDs from the Cartesia public voice library, hand-picked per mascot.
// Speed: -1.0 to 1.0 (negative = slower). Emotion via SSML in transcript if needed.
const MASCOT_VOICES = {
  // Pup (Ava's puppy): Tessa — expressive young female, "Emotive" tagged. Bright & enthusiastic.
  Ava:   { voiceId: '6ccbfb76-1fc6-48f7-b71d-91ac6298247b', speed: -0.15 },
  // Champ (Layla's football): Kyle — expressive young male, "Emotive" tagged. Upbeat sports-commentary energy.
  Layla: { voiceId: 'c961b81c-a935-4c17-bfb3-ba2239de8c2f', speed: -0.1 },
  // Dran (Shyal's beyblade): Kiefer — calm American male voice-agent voice. Steady "fierce mentor" tone.
  // Swap for a deeper British voice once you find one you like in the Cartesia playground.
  Shyal: { voiceId: '228fca29-3a0a-435c-8728-5cb483251068', speed: -0.2 },
  // Biscuit (Felicity's Bernese dog): Tessa — same bright young female voice as Pup. Warm & gentle.
  Felicity: { voiceId: '6ccbfb76-1fc6-48f7-b71d-91ac6298247b', speed: -0.15 }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Cartesia not configured — falling back to browser TTS' });
  }

  const { text, mascot } = req.body || {};
  if (!text || typeof text !== 'string') return res.status(400).json({ error: 'Missing text' });

  // Hard cap so a runaway prompt can't burn the character quota.
  const safeText = text.slice(0, 4000);

  const cfg = MASCOT_VOICES[mascot] || MASCOT_VOICES.Ava;

  try {
    const r = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'Cartesia-Version': CARTESIA_VERSION,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript: safeText,
        model_id: MODEL,
        voice: { mode: 'id', id: cfg.voiceId, __experimental_controls: { speed: cfg.speed } },
        language: 'en',
        output_format: {
          container: 'wav',
          encoding: 'pcm_s16le',
          sample_rate: 24000
        }
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('Cartesia error:', r.status, errText);
      return res.status(502).json({ error: `TTS failed: ${r.status}` });
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', buf.length);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(buf);
  } catch (e) {
    console.error('TTS endpoint error:', e);
    return res.status(500).json({ error: String(e.message || e) });
  }
}
