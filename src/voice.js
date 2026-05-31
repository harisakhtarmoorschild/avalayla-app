// ============================================================
// Voice helpers — Web Speech API for STT, speechSynthesis for TTS.
// Both are browser-native, free, and work on iPad Safari 14.5+.
// If STT is unsupported (older browsers), the chat UI falls back to typed input.
// ============================================================

const RecognitionCtor = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export const isSttSupported = () => Boolean(RecognitionCtor);
export const isTtsSupported = () =>
  typeof window !== 'undefined' && Boolean(window.speechSynthesis);

// Some browsers (Safari especially) need a tick before getVoices() returns the list.
// We prime it once on first use.
let cachedVoices = null;
function ensureVoicesLoaded() {
  if (!isTtsSupported()) return [];
  if (cachedVoices && cachedVoices.length) return cachedVoices;
  cachedVoices = window.speechSynthesis.getVoices() || [];
  if (!cachedVoices.length) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    };
  }
  return cachedVoices;
}

function pickVoice(hint = {}) {
  const voices = ensureVoicesLoaded();
  if (!voices.length) return null;
  const lang = hint.lang || 'en-GB';
  const langPrefix = lang.slice(0, 2);
  const matchingLang = voices.filter(v => (v.lang || '').toLowerCase().startsWith(langPrefix));
  const pool = matchingLang.length ? matchingLang : voices;
  const wantsFemale = hint.gender === 'female';
  const wantsMale = hint.gender === 'male';
  const byGender = pool.filter(v => {
    const n = (v.name || '').toLowerCase();
    if (wantsFemale) return /female|samantha|karen|moira|tessa|fiona|martha|kate|emma|serena|kathy/.test(n);
    if (wantsMale)   return /male|daniel|alex|fred|tom|oliver|aaron|arthur|gordon|rishi/.test(n);
    return false;
  });
  return (byGender[0] || pool.find(v => v.lang === lang) || pool[0]) || null;
}

export function createListener({ onResult, onError, onEnd, lang = 'en-GB' } = {}) {
  if (!RecognitionCtor) {
    return {
      start() { onError && onError(new Error('Speech recognition not supported')); },
      stop() {}, abort() {}
    };
  }
  const rec = new RecognitionCtor();
  rec.lang = lang;
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const r0 = e.results && e.results[0];
    if (r0 && r0[0]) onResult && onResult((r0[0].transcript || '').trim());
  };
  rec.onerror = (e) => onError && onError(e.error || e);
  rec.onend = () => onEnd && onEnd();
  return rec;
}

export function speak(text, hint = {}, onEnd) {
  if (!isTtsSupported() || !text) {
    onEnd && setTimeout(onEnd, 0);
    return () => {};
  }
  const synth = window.speechSynthesis;
  ensureVoicesLoaded();
  synth.cancel();
  const u = new SpeechSynthesisUtterance(String(text));
  const voice = pickVoice(hint);
  if (voice) u.voice = voice;
  u.rate = hint.rate || 1.0;
  u.pitch = hint.pitch || 1.0;
  u.lang = hint.lang || 'en-GB';
  u.onend = () => onEnd && onEnd();
  u.onerror = () => onEnd && onEnd();
  synth.speak(u);
  return () => synth.cancel();
}

export function cancelSpeech() {
  if (isTtsSupported()) window.speechSynthesis.cancel();
}

// ============================================================
// Per-mascot persona + voice. The character speaks in role
// during the writing exercise — encouragement, brainstorming,
// spelling help, and rephrasing the prompt.
// ============================================================
export const MASCOT_PERSONAS = {
  Ava: {
    mascotName: 'Pup',
    avatar: '🐶',
    voiceHint: { gender: 'female', rate: 1.08, pitch: 1.25, lang: 'en-GB' },
    systemPrompt:
`You are Ava's puppy friend, called Pup. Ava is 7 years old.
You speak in short, cheerful sentences. Sometimes you say "Woof!" or mention your tail wagging.
You are helping Ava with her writing today.
You can: cheer her on, suggest a story idea or character, help her spell a tricky word, or explain the writing prompt in easier words.
Be warm and never patronising. Keep replies to 1 to 3 short sentences — they will be spoken aloud.
Use simple words a 7-year-old understands.
Never use markdown, asterisks, headings, or bullet points — only plain spoken English.`
  },
  Layla: {
    mascotName: 'Champ',
    avatar: '⚽',
    voiceHint: { gender: 'male', rate: 1.05, pitch: 1.0, lang: 'en-GB' },
    systemPrompt:
`You are Layla's lucky football, called Champ. Layla is 7 years old and loves football.
You speak like an excited but kind sports commentator. You compare good ideas to goals, fair play, and championship moments.
You are helping Layla with her writing today.
You can: cheer her on, suggest a story idea or character, help her spell a tricky word, or explain the writing prompt in easier words.
Be warm and never patronising. Keep replies to 1 to 3 short sentences — they will be spoken aloud.
Use simple words a 7-year-old understands.
Never use markdown, asterisks, headings, or bullet points — only plain spoken English.`
  },
  Shyal: {
    mascotName: 'Dran',
    avatar: '🐉',
    voiceHint: { gender: 'male', rate: 1.0, pitch: 0.9, lang: 'en-GB' },
    systemPrompt:
`You are Shyal's beyblade, called Dran Sword. Shyal is 7 years old and loves Beyblade X.
You speak like a fierce but encouraging senior beyblader. You compare good ideas to brave launches, perfect spins, and stadium battles won.
You are helping Shyal with his writing today.
You can: cheer him on, suggest a story idea or character, help him spell a tricky word, or explain the writing prompt in easier words.
Be warm and never patronising. Keep replies to 1 to 3 short sentences — they will be spoken aloud.
Use simple words a 7-year-old understands.
Never use markdown, asterisks, headings, or bullet points — only plain spoken English.`
  }
};
