// ============================================================
// Voice helpers — Web Speech API for STT, Cartesia + speechSynthesis for TTS.
// Both STT and the TTS fallback are browser-native and work on iPad Safari 14.5+.
// Neural TTS goes through /api/tts (Cartesia Sonic 3).
// ============================================================

const RecognitionCtor = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

export const isSttSupported = () => Boolean(RecognitionCtor);
export const isTtsSupported = () =>
  typeof window !== 'undefined' && Boolean(window.speechSynthesis);

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

// ============================================================
// createListener — wraps Web Speech API SpeechRecognition.
//
// Modes:
//   - Default (continuous: false): legacy single-shot mode. Old call sites
//     pass {onResult}; we adapt by calling onFinalFragment + onEnd.
//   - continuous: true: emits onInterim (live transcript) and onFinalFragment
//     (final chunks). Caller decides when to stop() the listener. Used by
//     the walkie-talkie mic in MascotChat.
// ============================================================
export function createListener({
  onResult,           // legacy: fires once with final transcript
  onInterim,          // new: live partial transcript while speaking
  onFinalFragment,    // new: a finalised chunk (browsers may emit several)
  onError,
  onEnd,
  lang = 'en-GB',
  continuous = false,
  interimResults = false
} = {}) {
  if (!RecognitionCtor) {
    return {
      start() { onError && onError(new Error('Speech recognition not supported')); },
      stop() {}, abort() {}
    };
  }
  const rec = new RecognitionCtor();
  rec.lang = lang;
  rec.continuous = !!continuous;
  rec.interimResults = !!interimResults;
  rec.maxAlternatives = 1;

  let lastFinalEmitted = '';

  rec.onresult = (e) => {
    // Walk every result. Per spec, results have .isFinal flagging finalised
    // segments; interim segments may be appended on each event.
    let interimText = '';
    let finalText = '';
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i];
      const t = (r[0] && r[0].transcript || '').trim();
      if (!t) continue;
      if (r.isFinal) finalText = (finalText + ' ' + t).trim();
      else interimText = (interimText + ' ' + t).trim();
    }
    if (interimText && onInterim) onInterim(interimText);
    if (finalText && finalText !== lastFinalEmitted) {
      lastFinalEmitted = finalText;
      if (onFinalFragment) onFinalFragment(finalText);
      // Legacy single-shot callers expect onResult with the final transcript.
      if (!continuous && onResult) onResult(finalText);
    }
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
    voiceHint: { gender: 'female', rate: 0.9, pitch: 1.2, lang: 'en-GB' },
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
    voiceHint: { gender: 'male', rate: 0.88, pitch: 1.0, lang: 'en-GB' },
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
    voiceHint: { gender: 'male', rate: 0.85, pitch: 0.9, lang: 'en-GB' },
    systemPrompt:
`You are Shyal's beyblade, called Dran Sword. Shyal is 7 years old and loves Beyblade X.
You speak like a fierce but encouraging senior beyblader. You compare good ideas to brave launches, perfect spins, and stadium battles won.
You are helping Shyal with his writing today.
You can: cheer him on, suggest a story idea or character, help him spell a tricky word, or explain the writing prompt in easier words.
Be warm and never patronising. Keep replies to 1 to 3 short sentences — they will be spoken aloud.
Use simple words a 7-year-old understands.
Never use markdown, asterisks, headings, or bullet points — only plain spoken English.`
  },
  Felicity: {
    mascotName: 'Biscuit',
    avatar: '🐕',
    voiceHint: { gender: 'female', rate: 0.9, pitch: 1.2, lang: 'en-GB' },
    systemPrompt:
`You are Felicity's fluffy Bernese mountain dog friend, called Biscuit. Felicity is 7 years old.
You speak in warm, gentle, cheerful sentences. Sometimes you mention your big fluffy paws, your waggy tail, or bounding through mountain meadows.
You are helping Felicity with her writing today.
You can: cheer her on, suggest a story idea or character, help her spell a tricky word, or explain the writing prompt in easier words.
Be warm and never patronising. Keep replies to 1 to 3 short sentences — they will be spoken aloud.
Use simple words a 7-year-old understands.
Never use markdown, asterisks, headings, or bullet points — only plain spoken English.`
  }
};


// ============================================================
// Singleton <audio> element. iPad Safari's autoplay policy ties the
// "user gesture" to the FIRST audio element played on a page. If we
// keep making `new Audio()` for each mascot reply, the gesture lineage
// is lost and later audio is blocked — that's the "voice can be heard
// and then not heard at all" pattern.
//
// Solution: reuse ONE audio element. Set .src to a fresh blob URL on each
// call. The element keeps its user-gesture credential as long as the
// initial play() came from a tap.
// ============================================================
let sharedAudio = null;
function getSharedAudio() {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

let lastBlobUrl = null;

export function stopMascotAudio() {
  if (sharedAudio) {
    try { sharedAudio.pause(); } catch (e) {}
  }
  if (lastBlobUrl) { try { URL.revokeObjectURL(lastBlobUrl); } catch (e) {} lastBlobUrl = null; }
  cancelSpeech();
}

// speakAsMascot — try Cartesia first (via /api/tts proxy), fall back to
// browser speechSynthesis if the server isn't configured or the request fails.
// Returns nothing; caller passes onEnd for completion.
export async function speakAsMascot(text, mascotKey, onEnd) {
  if (!text) { onEnd && setTimeout(onEnd, 0); return; }
  stopMascotAudio();
  const persona = MASCOT_PERSONAS[mascotKey] || MASCOT_PERSONAS.Ava;
  try {
    const r = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mascot: mascotKey })
    });
    if (!r.ok) throw new Error('tts ' + r.status);
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    lastBlobUrl = url;
    const audio = getSharedAudio();
    if (!audio) throw new Error('no audio element');
    audio.onended = () => {
      if (lastBlobUrl === url) { try { URL.revokeObjectURL(url); } catch (e) {} lastBlobUrl = null; }
      onEnd && onEnd();
    };
    audio.onerror = () => {
      if (lastBlobUrl === url) { try { URL.revokeObjectURL(url); } catch (e) {} lastBlobUrl = null; }
      // Fall back to browser TTS so the kid still hears something.
      speak(text, persona.voiceHint, onEnd);
    };
    audio.src = url;
    try {
      await audio.play();
    } catch (e) {
      // Autoplay policy may still reject if no gesture in this task. Fall back.
      speak(text, persona.voiceHint, onEnd);
    }
  } catch (e) {
    speak(text, persona.voiceHint, onEnd);
  }
}
