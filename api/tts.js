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
  Shyal: { voiceId: '228fca29-3a0a-435c-8728-5cb483251068', speed: -0.2 }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey)
