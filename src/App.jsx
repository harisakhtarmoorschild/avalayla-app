import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Volume2, Check, X, Trophy, Sparkles, BookOpen, Calculator, PenTool, ArrowLeft,
  Crown, Heart, RefreshCw, Send, ChevronRight, Play, Pause, RotateCcw, Star,
  Headphones, Medal, Globe, Beaker, Landmark, Film, Brain, Lock, Flame, TrendingUp, Settings
} from 'lucide-react';
import {
  loadProgress, saveProgress, subscribeProgress, getCachedStory, cacheStory,
  getCachedLesson, cacheLesson,
  saveInProgress, loadInProgress, clearInProgress, loadAllInProgress,
  cleanProgress
} from './firebase.js';
import {
  TOTAL_DAYS, SPELLING_BANK, VOCAB_BANK, WRITING_PROMPTS, FALLBACK_STORIES,
  lessonSubjectForDate, lessonSubjectForDay, SUBJECT_META, lessonTopicFor, hardcodedLessonFor,
  lessonBriefFor, targetYearFor
} from './content.js';
import { getVerbalQuestionsForDay, getNonVerbalQuestionsForDay } from './content-reasoning.js';
import { sfx, primeAudio } from './sounds.js';
import LessonAnimation from './animations.jsx';

const NAMES = ['Ava', 'Layla', 'Salahuddin'];
const SISTER_NAMES = ['Ava', 'Layla'];

/* ============================================================
   THEMES — three distinct worlds
   ============================================================ */
const THEME = {
  Ava: {
    name: 'Ava',
    emoji: '🐶',
    mascotEmoji: '🐶',
    worldName: 'Pawsome Academy',
    tagline: 'Time to sparkle, superstar!',
    bgClass: 'ava-bg',
    cardClass: 'ava-card',
    gradient: 'ava-gradient',
    gradientSoft: 'ava-gradient-soft',
    text: 'ava-text',
    accent: 'ava-accent',
    pill: 'ava-pill',
    pattern: 'ava-pattern',
    font: 'font-script',
    decor: ['🎀', '💖', '✨', '🌸', '🦴', '🐾'],
    correctLine: ['Pawsome!', 'Star pupil!', 'Sparkle on!', 'Dazzling!', 'Woof-tastic!'],
    wrongLine: ['Good try!', 'Nearly there!', 'Keep going!', 'You can do it!'],
    decorBg: ['🎀','💖','✨','🌸'],
    tokens: { '--theme-border': '#f9a8d4', '--theme-border-strong': '#ec4899', '--theme-input-bg': '#fff5f9' }
  },
  Layla: {
    name: 'Layla',
    emoji: '⚽',
    mascotEmoji: '⚽',
    worldName: 'Champions League',
    tagline: 'Kickoff, champion!',
    bgClass: 'layla-bg',
    cardClass: 'layla-card',
    gradient: 'layla-gradient',
    gradientSoft: 'layla-gradient-soft',
    text: 'layla-text',
    accent: 'layla-accent',
    pill: 'layla-pill',
    pattern: 'layla-pattern',
    font: 'font-sport',
    decor: ['🏆', '⚽', '🥅', '🎯', '⭐', '🏟️'],
    correctLine: ['GOAL!', 'Top bins!', 'Back of the net!', 'Championship form!', 'Full points!'],
    wrongLine: ['Close one!', 'Unlucky!', 'Next time!', 'Keep pushing!'],
    decorBg: ['🏆','⚽','🥅','⭐'],
    tokens: { '--theme-border': '#86efac', '--theme-border-strong': '#16a34a', '--theme-input-bg': '#f0fdf4' }
  },
  Salahuddin: {
    name: 'Salahuddin',
    emoji: '🦖',
    mascotEmoji: '🦖',
    worldName: 'Dino Discovery',
    tagline: 'ROAR into action, explorer!',
    bgClass: 'salah-bg',
    cardClass: 'salah-card',
    gradient: 'salah-gradient',
    gradientSoft: 'salah-gradient-soft',
    text: 'salah-text',
    accent: 'salah-accent',
    pill: 'salah-pill',
    pattern: 'salah-pattern',
    font: 'font-display',
    decor: ['🦖', '🦕', '🌋', '🦴', '🌿', '🥚'],
    correctLine: ['ROAR-some!', 'T-rex-cellent!', 'Dino-mite!', 'Prehistoric power!', 'Fossil find!'],
    wrongLine: ['Keep hunting!', 'Try again, explorer!', 'Nearly unearthed!', 'Dig deeper!'],
    decorBg: ['🦖','🦕','🌋','🦴'],
    tokens: { '--theme-border': '#fdba74', '--theme-border-strong': '#ea580c', '--theme-input-bg': '#fff7ed' }
  }
};

/* ============================================================
   UTILITIES
   ============================================================ */
function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* --------- Content selection --------- */
const DEDUPED_SPELLING = [...new Set(SPELLING_BANK)];

// Split the deduped bank into 4 equal tiers so difficulty still progresses.
// Each tier gets its own slice, and we use a sliding window across days so
// words don't repeat within any single tier (15 consecutive days) and ideally
// not across the whole 60-day course if the bank is large enough.
// tierOffset: -1 = easier, 0 = normal, +1 = harder. Invisible to the user.
function getSpellingWords(day, tierOffset = 0) {
  const N = DEDUPED_SPELLING.length;
  const tierSize = Math.floor(N / 4);
  const daysPerTier = Math.ceil(TOTAL_DAYS / 4); // 15
  const baseTier = Math.min(3, Math.floor((day - 1) / daysPerTier));
  const tier = Math.max(0, Math.min(3, baseTier + tierOffset));
  const dayInTier = (day - 1) % daysPerTier; // 0..14

  // Tier window in the bank
  const tierStart = tier * tierSize;
  const tierEnd = tier === 3 ? N : tierStart + tierSize;
  const tierWords = DEDUPED_SPELLING.slice(tierStart, tierEnd);

  // Deterministically shuffle this tier using a seed unique to this tier
  const tierShuffled = shuffle([...tierWords], mulberry32(1000 + tier));

  // Sliding window of 10 words per day — wraps around if tier has fewer than 150 words
  const perDay = 10;
  const start = (dayInTier * perDay) % tierShuffled.length;
  const result = [];
  for (let i = 0; i < perDay; i++) {
    result.push(tierShuffled[(start + i) % tierShuffled.length]);
  }

  // Secondary day-level shuffle so order isn't monotonic
  return shuffle(result, mulberry32(day * 17 + 3));
}

/* For vocab: 10 words, each with meaning Q + usage Q = 20 questions */
function getVocabForDay(day) {
  const rand = mulberry32(day * 31 + 7);
  const selected = shuffle(VOCAB_BANK, rand).slice(0, 10);
  return selected.map((entry, idx) => {
    const drand = mulberry32(day * 31 + idx * 11 + 13);
    const others = VOCAB_BANK.filter(v => v.w !== entry.w);
    // meaning question
    const meaningDistractors = shuffle(others, drand).slice(0, 3).map(v => v.d);
    const meaningOptions = shuffle([entry.d, ...meaningDistractors], drand);
    // usage: blank sentence, choose the word that fits
    const wordDistractors = shuffle(others, drand).slice(3, 6).map(v => v.w);
    const usageOptions = shuffle([entry.w, ...wordDistractors], drand);
    return {
      word: entry.w,
      definition: entry.d,
      sentence: entry.s,
      meaningOptions,
      meaningCorrect: meaningOptions.indexOf(entry.d),
      usageOptions,
      usageCorrect: usageOptions.indexOf(entry.w)
    };
  });
}

function getWritingPrompt(day) { return WRITING_PROMPTS[(day - 1) % WRITING_PROMPTS.length]; }

function getMathProblems(day, tierOffset = 0) {
  const rand = mulberry32(day * 41 + 5);
  const problems = [];
  const baseTier = Math.min(3, Math.floor((day - 1) / Math.ceil(TOTAL_DAYS / 4)));
  const tier = Math.max(0, Math.min(3, baseTier + tierOffset));
  const types = ['×', '+', '−', '÷'];
  for (let i = 0; i < 10; i++) {
    const type = types[i % 4];
    let a, b, answer, question;
    if (type === '×') {
      a = 2 + Math.floor(rand() * 11); b = 2 + Math.floor(rand() * 11);
      answer = a * b; question = `${a} × ${b}`;
    } else if (type === '+') {
      const max = 20 + tier * 40;
      a = 10 + Math.floor(rand() * max); b = 10 + Math.floor(rand() * max);
      answer = a + b; question = `${a} + ${b}`;
    } else if (type === '−') {
      const max = 20 + tier * 40;
      a = 25 + Math.floor(rand() * max); b = 5 + Math.floor(rand() * (a - 5));
      answer = a - b; question = `${a} − ${b}`;
    } else {
      const divisor = 2 + Math.floor(rand() * (6 + tier));
      const quotient = 2 + Math.floor(rand() * (9 + tier * 2));
      a = divisor * quotient; b = divisor;
      answer = quotient; question = `${a} ÷ ${b}`;
    }
    problems.push({ question, answer });
  }
  return shuffle(problems, rand);
}

/* --------- Speech --------- */

// Pick the best available voice once and memoise, because getVoices() is slow
// and voice list changes across platforms. Prefer high-quality UK female voices.
let _cachedVoice = null;
let _cachedSpellingVoice = null;
let _cachedNarrationVoice = null;

// Voice names commonly shipped as female on iOS / macOS / Windows / Chrome.
// Used as a fallback gender detector (speechSynthesis doesn't expose gender).
const FEMALE_VOICE_NAMES = /(samantha|karen|serena|moira|kate|martha|nicky|fiona|tessa|victoria|allison|ava|susan|zoe|zira|hazel|catherine|linda|heather|kimberly|elsa|libby|sonia|aria|jenny|emma|nora|clara|amy|natasha|olivia|joanna|salli|ivy|kendra|kimberly|female)/i;
const MALE_VOICE_NAMES = /(daniel|oliver|arthur|george|reed|fred|alex|aaron|tom|david|mark|ralph|james|male)/i;

function scoreVoice(v, opts = {}) {
  // Higher score = better. Negative = disqualified.
  if (!v || !v.lang) return -Infinity;
  let score = 0;
  // Must be English
  if (!/^en/i.test(v.lang)) return -Infinity;

  // Language preference: en-GB > en-US > en-AU > other
  if (/en.?GB/i.test(v.lang)) score += 30;
  else if (/en.?US/i.test(v.lang)) score += 20;
  else if (/en.?AU/i.test(v.lang)) score += 15;
  else score += 5;

  // Quality hints in the name
  if (/premium|enhanced/i.test(v.name)) score += 50;
  if (/siri/i.test(v.name)) score += 40;
  if (/natural|neural|online/i.test(v.name)) score += 35;
  if (/google uk/i.test(v.name)) score += 25;
  if (/google us/i.test(v.name)) score += 15;

  // Strongly penalise low-quality compact voices
  if (/compact/i.test(v.name)) score -= 30;

  // Gender preference: strongly prefer female, penalise obvious male
  if (FEMALE_VOICE_NAMES.test(v.name)) score += 40;
  if (MALE_VOICE_NAMES.test(v.name)) score -= 100; // effectively excludes
  if (/female/i.test(v.name)) score += 30;
  if (/male/i.test(v.name) && !/female/i.test(v.name)) score -= 100;

  // If it's a default platform voice, slight boost
  if (v.default) score += 2;

  // For spelling: extra boost to voices known to be very clear/articulate
  if (opts.crispForSpelling) {
    if (/^(samantha|karen|serena|kate)/i.test(v.name)) score += 25;
    if (/en.?US/i.test(v.lang)) score += 10;
  }

  // For narration (story reading): extra boost to voices known to be
  // natural-sounding for flowing prose. Siri, Samantha, Karen, Serena,
  // Jenny/Aria/Emma on Windows. Avoid anything "Compact".
  if (opts.narration) {
    if (/siri/i.test(v.name)) score += 30;
    if (/^(samantha|karen|serena|moira|fiona|tessa)/i.test(v.name)) score += 25;
    if (/^(jenny|aria|emma|nora|libby|sonia)/i.test(v.name)) score += 20; // Windows neural
    if (/natural|neural/i.test(v.name)) score += 20; // double-up on top of base +35
    if (/compact|compressed/i.test(v.name)) score -= 60; // force skip
  }

  return score;
}

function pickBestVoice(opts = {}) {
  if (opts.crispForSpelling && _cachedSpellingVoice) return _cachedSpellingVoice;
  if (opts.narration && _cachedNarrationVoice) return _cachedNarrationVoice;
  if (!opts.crispForSpelling && !opts.narration && _cachedVoice) return _cachedVoice;
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  let best = null, bestScore = -Infinity;
  for (const v of voices) {
    const s = scoreVoice(v, opts);
    if (s > bestScore) { bestScore = s; best = v; }
  }
  if (opts.crispForSpelling) _cachedSpellingVoice = best;
  else if (opts.narration) _cachedNarrationVoice = best;
  else _cachedVoice = best;
  return best;
}

// Prime voices on load — browsers often load the voice list asynchronously
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    _cachedVoice = null; _cachedSpellingVoice = null; _cachedNarrationVoice = null;
  };
  setTimeout(() => {
    pickBestVoice();
    pickBestVoice({ crispForSpelling: true });
    pickBestVoice({ narration: true });
  }, 0);
}

function speak(text, opts = {}) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    // More natural defaults — slightly slower, gentle pitch
    u.rate = opts.rate ?? 0.92;
    u.pitch = opts.pitch ?? 1.02;
    u.volume = 1;
    const v = pickBestVoice({ crispForSpelling: opts.crispForSpelling, narration: opts.narration });
    if (v) u.voice = v;
    if (opts.onend) u.onend = opts.onend;
    if (opts.onboundary) u.onboundary = opts.onboundary;
    if (opts.onstart) u.onstart = opts.onstart;
    if (opts.onerror) u.onerror = opts.onerror;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return u;
  } catch (e) {}
}

// Dedicated speaker for spelling test words — clearer, sharper, slightly slower.
// Two passes: the word → small pause → the word again, so kids have time to hear it.
function speakWord(word) {
  if (!word) return;
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const mkUtterance = (text, delayMs = 0) => {
      setTimeout(() => {
        if (!window.speechSynthesis) return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.78;     // slower — give each syllable room
        u.pitch = 1.08;    // slightly higher — brighter, clearer for kids
        u.volume = 1;
        const v = pickBestVoice({ crispForSpelling: true });
        if (v) u.voice = v;
        window.speechSynthesis.speak(u);
      }, delayMs);
    };
    // Say the word twice, so if a child misses the first pass they catch the second.
    mkUtterance(word, 0);
    mkUtterance(word, 1400);
  } catch (e) {}
}
function stopSpeaking() { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} }

/* --------- API helpers --------- */
async function aiCall(task, payload) {
  try {
    const r = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, payload })
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.error(`AI ${task} failed:`, e);
    return null;
  }
}

function heuristicWritingFeedback(text) {
  const t = (text || '').trim();
  const words = t ? t.split(/\s+/).length : 0;
  const sentences = t.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const capStart = sentences.filter(s => /^[A-Z]/.test(s.trim())).length;
  const hasPunct = /[.!?]/.test(t);
  let grade = 3;
  if (words >= 20) grade += 1; if (words >= 40) grade += 1; if (words >= 60) grade += 1; if (words >= 90) grade += 1;
  if (sentences.length >= 8) grade += 1; if (sentences.length >= 10) grade += 1;
  if (hasPunct) grade += 1; if (capStart >= 5) grade += 1;
  grade = Math.max(1, Math.min(10, grade));
  return {
    grade,
    praise: words > 30 ? 'You wrote a lovely amount — well done for sharing your thoughts so clearly!' : 'Thank you for writing — you made a great start!',
    strengths: ['You made an effort to share your ideas', 'Keep going with your writing every day', 'You\'re building a good writing habit'],
    suggestion: sentences.length < 10
      ? 'Try to write at least 10 full sentences, each starting with a capital letter and ending with a full stop.'
      : 'Try adding sparkly describing words (like enormous, glittering, peculiar) to bring your writing to life.',
    ideas: ['Describe a small detail like a smell or a sound', 'Use a simile: "as X as Y"'],
    cheer: 'You are doing brilliantly — keep it up!'
  };
}

/* --------- Firebase helpers --------- */
function getLocalUser() { try { return localStorage.getItem('current-user'); } catch (e) { return null; } }
function setLocalUser(name) { try { if (name) localStorage.setItem('current-user', name); else localStorage.removeItem('current-user'); } catch (e) {} }

/* ============================================================
   MASCOT COMPONENTS (simple SVG)
   ============================================================ */
function AvaMascot({ mood = 'idle', size = 120 }) {
  const tail = mood === 'happy' ? 'tail-wag' : mood === 'sad' ? '' : '';
  const bounce = mood === 'happy' ? 'bounce-in' : '';
  return (
    <svg viewBox="0 0 140 130" width={size} height={size * 130 / 140} className={bounce}>
      {/* Tail */}
      <g className={tail}>
        <path d="M 30 75 Q 10 65 15 45" stroke="#fbbf24" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      {/* Body */}
      <ellipse cx="70" cy="85" rx="40" ry="30" fill="#fde68a" />
      <ellipse cx="70" cy="88" rx="32" ry="22" fill="#fef3c7" />
      {/* Head */}
      <circle cx="70" cy="50" r="32" fill="#fde68a" />
      <ellipse cx="70" cy="56" rx="22" ry="16" fill="#fef3c7" />
      {/* Ears */}
      <ellipse cx="45" cy="35" rx="10" ry="16" fill="#fbbf24" transform="rotate(-25, 45, 35)" />
      <ellipse cx="95" cy="35" rx="10" ry="16" fill="#fbbf24" transform="rotate(25, 95, 35)" />
      {/* Bow on right ear */}
      <g transform="translate(95, 30)">
        <path d="M -7 0 L 0 -3 L 7 0 L 0 3 Z" fill="#f472b6" />
        <circle cx="0" cy="0" r="2" fill="#ec4899" />
      </g>
      {/* Eyes */}
      {mood === 'sad' ? (
        <>
          <path d="M 58 48 Q 58 44 62 44 Q 66 44 66 48" stroke="#1f2937" strokeWidth="2.5" fill="none" />
          <path d="M 74 48 Q 74 44 78 44 Q 82 44 82 48" stroke="#1f2937" strokeWidth="2.5" fill="none" />
        </>
      ) : (
        <>
          <circle cx="62" cy="50" r="4" fill="#1f2937" />
          <circle cx="78" cy="50" r="4" fill="#1f2937" />
          <circle cx="63" cy="49" r="1.3" fill="white" />
          <circle cx="79" cy="49" r="1.3" fill="white" />
        </>
      )}
      {/* Nose */}
      <ellipse cx="70" cy="60" rx="4" ry="3" fill="#1f2937" />
      {/* Mouth */}
      {mood === 'happy' ? (
        <path d="M 62 66 Q 70 74 78 66" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : mood === 'sad' ? (
        <path d="M 62 70 Q 70 64 78 70" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 66 66 L 70 70 L 74 66" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {/* Sparkles */}
      <text x="20" y="25" fontSize="14" className="sparkle">✨</text>
      <text x="115" y="20" fontSize="12" className="sparkle" style={{animationDelay: '0.7s'}}>✨</text>
    </svg>
  );
}

function LaylaMascot({ mood = 'idle', size = 120 }) {
  const bounce = mood === 'happy' ? 'bounce-in' : '';
  const keepy = mood === 'idle' ? 'keepy-uppy' : '';
  return (
    <svg viewBox="0 0 140 130" width={size} height={size * 130 / 140} className={bounce}>
      {/* Ground line / pitch */}
      <line x1="15" y1="115" x2="125" y2="115" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
      {/* Ball body */}
      <g className={keepy} style={{transformOrigin:'70px 70px'}}>
        <circle cx="70" cy="70" r="40" fill="white" stroke="#1f2937" strokeWidth="2" />
        {/* Pentagons pattern */}
        <polygon points="70,40 82,50 78,65 62,65 58,50" fill="#1f2937" />
        <polygon points="40,65 50,58 60,65 56,78 44,78" fill="#1f2937" />
        <polygon points="100,65 90,58 80,65 84,78 96,78" fill="#1f2937" />
        <polygon points="60,90 70,85 80,90 75,100 65,100" fill="#1f2937" />
        {/* Face */}
        {mood === 'sad' ? (
          <>
            <path d="M 58 60 Q 58 56 62 56 Q 66 56 66 60" stroke="white" strokeWidth="2" fill="none" />
            <path d="M 74 60 Q 74 56 78 56 Q 82 56 82 60" stroke="white" strokeWidth="2" fill="none" />
            <path d="M 60 80 Q 70 74 80 80" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="62" cy="58" r="3" fill="white" />
            <circle cx="78" cy="58" r="3" fill="white" />
            <circle cx="63" cy="57" r="1" fill="#1f2937" />
            <circle cx="79" cy="57" r="1" fill="#1f2937" />
            {mood === 'happy' ? (
              <path d="M 58 76 Q 70 86 82 76" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 62 78 L 78 78" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </>
        )}
      </g>
      {/* Goal post shadow */}
      <text x="105" y="28" fontSize="20">🥅</text>
    </svg>
  );
}

function SalahuddinMascot({ mood = 'idle', size = 120 }) {
  const bounce = mood === 'happy' ? 'bounce-in' : '';
  const sway = mood === 'idle' ? 'floaty' : '';
  return (
    <svg viewBox="0 0 140 130" width={size} height={size * 130 / 140} className={bounce}>
      {/* Ground */}
      <line x1="15" y1="118" x2="125" y2="118" stroke="#a16207" strokeWidth="2" strokeDasharray="5 3" opacity="0.5" />
      <g className={sway} style={{transformOrigin:'70px 90px'}}>
        {/* Tail */}
        <path d="M 35 95 Q 18 80 20 65 Q 28 70 38 85 Z" fill="#16a34a" stroke="#166534" strokeWidth="2" />
        {/* Body */}
        <ellipse cx="65" cy="88" rx="30" ry="22" fill="#22c55e" stroke="#166534" strokeWidth="2" />
        {/* Back spikes */}
        <polygon points="50,70 55,60 60,70" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
        <polygon points="65,66 70,55 75,66" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
        <polygon points="80,70 85,60 90,70" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
        {/* Legs */}
        <rect x="50" y="104" width="8" height="14" rx="2" fill="#16a34a" stroke="#166534" strokeWidth="1.5" />
        <rect x="72" y="104" width="8" height="14" rx="2" fill="#16a34a" stroke="#166534" strokeWidth="1.5" />
        {/* Head */}
        <ellipse cx="95" cy="65" rx="22" ry="18" fill="#22c55e" stroke="#166534" strokeWidth="2" />
        {/* Mouth + teeth */}
        {mood === 'happy' ? (
          <>
            <path d="M 80 68 Q 95 80 108 68" stroke="#166534" strokeWidth="2" fill="#fef3c7" strokeLinecap="round" />
            <polygon points="86,70 88,76 90,70" fill="white" />
            <polygon points="95,72 97,78 99,72" fill="white" />
            <polygon points="102,70 104,76 106,70" fill="white" />
          </>
        ) : mood === 'sad' ? (
          <path d="M 82 74 Q 95 68 106 74" stroke="#166534" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <>
            <path d="M 82 70 Q 95 75 108 70" stroke="#166534" strokeWidth="2" fill="#fef3c7" strokeLinecap="round" />
            <polygon points="88,72 90,76 92,72" fill="white" />
            <polygon points="100,72 102,76 104,72" fill="white" />
          </>
        )}
        {/* Eye */}
        <circle cx="98" cy="58" r="4" fill="white" />
        <circle cx="99" cy="58" r="2" fill="#1f2937" />
        {/* Nostril */}
        <circle cx="114" cy="62" r="1.5" fill="#166534" />
      </g>
      {/* Volcano on horizon */}
      <text x="18" y="28" fontSize="18">🌋</text>
    </svg>
  );
}

function Mascot({ who, mood, size }) {
  if (who === 'Ava') return <AvaMascot mood={mood} size={size} />;
  if (who === 'Layla') return <LaylaMascot mood={mood} size={size} />;
  if (who === 'Salahuddin') return <SalahuddinMascot mood={mood} size={size} />;
  return <AvaMascot mood={mood} size={size} />;
}

/* ============================================================
   CONFETTI
   ============================================================ */
function Confetti({ count = 50, avaTheme }) {
  const colors = avaTheme
    ? ['#f472b6', '#ec4899', '#fbbf24', '#fde68a', '#fbcfe8', '#fb7185']
    : ['#22c55e', '#10b981', '#fbbf24', '#0ea5e9', '#a7f3d0', '#fde047'];
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.8, color: colors[i % colors.length],
    rot: Math.random() * 360, size: 10 + Math.random() * 8
  }));
  return (
    <>
      {pieces.map((p, i) => (
        <div key={i} className="confetti-piece" style={{
          left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`,
          transform: `rotate(${p.rot}deg)`, width: `${p.size}px`, height: `${p.size * 1.4}px`
        }} />
      ))}
    </>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('home');
  const [progress, setProgress] = useState({ Ava: {}, Layla: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs = [];
    (async () => {
      const savedUser = getLocalUser();
      if (savedUser && NAMES.includes(savedUser)) setUser(savedUser);
      const loaded = await Promise.all(NAMES.map(n => loadProgress(n)));
      const initial = {};
      NAMES.forEach((n, i) => { initial[n] = loaded[i] || {}; });
      setProgress(initial);
      setLoading(false);
      NAMES.forEach(n => {
        unsubs.push(subscribeProgress(n, (d) => setProgress(p => ({ ...p, [n]: d || {} }))));
      });
      if (window.speechSynthesis) window.speechSynthesis.getVoices();
    })();
    return () => { unsubs.forEach(u => u && u()); };
  }, []);

  function chooseUser(name) {
    primeAudio(); sfx.pop();
    setUser(name); setLocalUser(name);
  }
  function switchUser() {
    setUser(null); setScreen('home'); setLocalUser(null); stopSpeaking();
  }

  async function saveActivity(day, activity, score, meta = {}) {
    const key = `day${day}`;
    const current = progress[user][key] || {};
    const updatedDay = { ...current, [activity]: score, [`${activity}_meta`]: meta, ts: Date.now() };
    const updated = { ...progress[user], [key]: updatedDay };
    setProgress(p => ({ ...p, [user]: updated }));
    await saveProgress(user, { [key]: updatedDay });
  }

  const isDayComplete = (name, d) => {
    const p = progress[name]?.[`day${d}`];
    return p && p.spelling !== undefined && p.vocab !== undefined && p.writing !== undefined && p.math !== undefined && p.reading !== undefined && p.puzzles !== undefined;
  };
  // Day progression rules:
  // - Ava and Layla progress together — Day N+1 unlocks only when BOTH finish Day N
  //   (they compete side-by-side, so staying in sync matters for them)
  // - Salahuddin progresses independently — his Day N+1 unlocks when HE finishes Day N
  //   (so if he loses interest, he never holds back the sisters, and they never hold him back)
  const currentDay = useMemo(() => {
    if (!user) return 1;
    let d = 1;
    if (user === 'Salahuddin') {
      while (d < TOTAL_DAYS && isDayComplete(user, d)) d++;
    } else {
      while (d < TOTAL_DAYS && isDayComplete('Ava', d) && isDayComplete('Layla', d)) d++;
    }
    return d;
  // eslint-disable-next-line
  }, [progress, user]);

  // Apply theme CSS vars
  useEffect(() => {
    if (!user) return;
    const t = THEME[user].tokens;
    Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [user]);

  if (loading) {
    return (
      <div className="font-body min-h-screen w-full flex items-center justify-center ava-bg">
        <div className="text-center">
          <div className="text-7xl mb-6 floaty">✨</div>
          <div className="font-display text-3xl text-purple-700">Loading your adventure…</div>
        </div>
      </div>
    );
  }

  if (!user) return <ProfileSelection onSelect={chooseUser} progress={progress} />;

  const sharedProps = { user, progress, currentDay, setScreen, saveActivity, switchUser, isDayComplete };
  const theme = THEME[user];

  return (
    <div className={`font-body ${theme.bgClass} min-h-screen`}>
      {screen === 'home' && <Home {...sharedProps} />}
      {screen === 'spelling' && <SpellingActivity {...sharedProps} />}
      {screen === 'vocab'    && <VocabActivity {...sharedProps} />}
      {screen === 'writing'  && <WritingActivity {...sharedProps} />}
      {screen === 'math'     && <MathActivity {...sharedProps} />}
      {screen === 'reading'  && <ReadingActivity {...sharedProps} />}
      {screen === 'puzzles'  && <PuzzleActivity {...sharedProps} />}
      {screen === 'lesson-history'   && <LessonActivity key="lh" subject="history"   {...sharedProps} />}
      {screen === 'lesson-geography' && <LessonActivity key="lg" subject="geography" {...sharedProps} />}
      {screen === 'lesson-science'   && <LessonActivity key="ls" subject="science"   {...sharedProps} />}
      {screen === 'leaderboard' && <Leaderboard {...sharedProps} />}
      {screen === 'scoreboard' && <Leaderboard {...sharedProps} />}
      {screen === 'dayDone' && <DayCompleteScreen {...sharedProps} />}
    </div>
  );
}

/* ============================================================
   PROFILE SELECTION
   ============================================================ */
function ProfileSelection({ onSelect, progress }) {
  const [tapCount, setTapCount] = useState(0);
  const [showPin, setShowPin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const tapTimerRef = useRef(null);

  // Triple-tap on the title opens the parent PIN entry
  function handleTitleTap() {
    setTapCount(c => c + 1);
    clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 900);
    if (tapCount + 1 >= 3) {
      setTapCount(0);
      clearTimeout(tapTimerRef.current);
      setShowPin(true);
      setPinInput('');
      setPinError(false);
    }
  }

  function submitPin() {
    const savedPin = (typeof window !== 'undefined' && localStorage.getItem('parentPin')) || '0000';
    if (pinInput === savedPin) {
      setShowPin(false);
      setShowDashboard(true);
      setPinInput('');
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1500);
    }
  }

  if (showDashboard) {
    return <ParentDashboard progress={progress} onBack={() => setShowDashboard(false)} />;
  }

  return (
    <div className="font-body min-h-screen w-full ava-bg flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 pop-in">
        <div className="text-6xl mb-2 floaty" onClick={handleTitleTap}>🐶 ⚽ 🦖</div>
        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight cursor-pointer select-none" onClick={handleTitleTap}>
          <span className="ava-text">Ava</span>
          <span className="text-gray-400">, </span>
          <span className="layla-text">Layla</span>
          <span className="text-gray-400"> &amp; </span>
          <span className="salah-text">Salahuddin</span>
        </h1>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-purple-700 mt-1">Learn Together!</h2>
        <p className="mt-4 text-lg text-gray-600 font-medium">Who's playing today?</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        {NAMES.map((n) => {
          const t = THEME[n];
          const totalPts = totalPoints(progress[n]);
          return (
            <button key={n} onClick={() => onSelect(n)}
              className={`pressable kid-shadow rounded-[2rem] p-8 ${t.gradient} text-white text-left relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20">
                {t.decorBg.map((d, i) => (
                  <span key={i} className="absolute text-5xl" style={{
                    left: `${15 + i * 22}%`, top: `${10 + (i % 2) * 60}%`, transform: `rotate(${i * 15}deg)`
                  }}>{d}</span>
                ))}
              </div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <Mascot who={n} mood="idle" size={90} />
                </div>
                <div className={`${t.font} text-5xl font-bold drop-shadow`}>{n}</div>
                <div className="text-white/90 mt-2 text-lg font-medium">{t.worldName}</div>
                <div className="mt-4 text-white/90 text-base"><span className="font-bold text-xl">{totalPts}</span> points so far</div>
                <div className="mt-2 text-white/90 font-semibold">Tap to start →</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* PIN entry modal */}
      {showPin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setShowPin(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full kid-shadow" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-gray-800">Parent Dashboard</div>
                <div className="text-sm text-gray-500">Enter 4-digit PIN</div>
              </div>
            </div>
            <input type="password" inputMode="numeric" maxLength={4} autoFocus
              value={pinInput}
              onChange={e => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(false); }}
              onKeyDown={e => e.key === 'Enter' && submitPin()}
              className={`w-full p-4 rounded-xl border-4 text-center font-display text-3xl tracking-widest ${pinError ? 'border-rose-400 bg-rose-50' : 'border-indigo-200'}`}
              placeholder="••••" />
            {pinError && <div className="text-rose-600 text-sm mt-2 text-center">Incorrect PIN</div>}
            <div className="text-xs text-gray-400 mt-2 text-center">Default PIN is 0000. You can change it in the dashboard.</div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowPin(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold pressable">Cancel</button>
              <button onClick={submitPin} className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold pressable">Enter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PARENT DASHBOARD — hidden behind triple-tap + PIN on title
   ============================================================ */
function ParentDashboard({ progress, onBack }) {
  const [pinChanging, setPinChanging] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);
  const [cleaningFor, setCleaningFor] = useState(null); // name being cleaned or null
  const [cleanResult, setCleanResult] = useState(null);  // { name, removedKeys, fixedValues } or null

  const TODAY_ACTIVITIES = ['spelling','vocab','writing','math','reading','puzzles'];
  const SUBJECT_ACTIVITIES = ['history','geography','science'];
  const MAX = { spelling:10, vocab:20, writing:10, math:10, reading:4, puzzles:10, history:10, geography:10, science:10 };

  function savePin() {
    if (newPin.length !== 4) return;
    localStorage.setItem('parentPin', newPin);
    setPinSaved(true);
    setTimeout(() => { setPinSaved(false); setPinChanging(false); setNewPin(''); }, 1500);
  }

  function getStatsFor(userProgress) {
    if (!userProgress) return { total: 0, days: 0, streak: 0, byActivity: {}, weakest: null, strongest: null, currentDay: 1, tiers: {} };
    let total = 0;
    let days = 0;
    const byActivity = {};
    TODAY_ACTIVITIES.concat(SUBJECT_ACTIVITIES).forEach(a => byActivity[a] = { points: 0, attempts: 0, avgPct: 0 });
    for (const key in userProgress) {
      if (!isDayKey(key)) continue;
      const day = userProgress[key];
      if (!day || typeof day !== 'object') continue;
      let dayComplete = true;
      TODAY_ACTIVITIES.forEach(a => {
        if (day[a] !== undefined) {
          const v = num(day[a]);
          byActivity[a].points += v;
          byActivity[a].attempts += 1;
          total += v;
        } else dayComplete = false;
      });
      SUBJECT_ACTIVITIES.forEach(a => {
        if (day[a] !== undefined) {
          const v = num(day[a]);
          byActivity[a].points += v;
          byActivity[a].attempts += 1;
          total += v;
        }
      });
      if (dayComplete) days++;
    }
    // Compute average %
    Object.keys(byActivity).forEach(a => {
      const b = byActivity[a];
      b.avgPct = b.attempts > 0 ? Math.round((b.points / (b.attempts * MAX[a])) * 100) : 0;
    });
    // Weakest & strongest (of base 6, where attempted)
    const attempted = TODAY_ACTIVITIES.filter(a => byActivity[a].attempts > 0);
    const weakest = attempted.length ? attempted.reduce((min, a) => byActivity[a].avgPct < byActivity[min].avgPct ? a : min, attempted[0]) : null;
    const strongest = attempted.length ? attempted.reduce((max, a) => byActivity[a].avgPct > byActivity[max].avgPct ? a : max, attempted[0]) : null;
    // Current day
    let currentDay = 1;
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      const day = userProgress[`day${d}`];
      if (!day) break;
      if (!TODAY_ACTIVITIES.every(a => day[a] !== undefined)) break;
      currentDay = d + 1;
    }
    const streak = calcStreak(userProgress, currentDay);
    // Tier offsets (what adaptive difficulty is currently doing)
    const tiers = {};
    ['spelling','math','puzzles'].forEach(a => { tiers[a] = tierOffsetFor(userProgress, a, currentDay); });
    return { total, days, streak, byActivity, weakest, strongest, currentDay, tiers };
  }

  const stats = {};
  NAMES.forEach(n => { stats[n] = getStatsFor(progress[n]); });

  const activityMeta = {
    spelling:  { label: 'Spelling',   emoji: '🔊' },
    vocab:     { label: 'Vocabulary', emoji: '📚' },
    writing:   { label: 'Writing',    emoji: '✏️' },
    math:      { label: 'Maths',      emoji: '🧮' },
    reading:   { label: 'Reading',    emoji: '📖' },
    puzzles:   { label: 'Puzzles',    emoji: '🧠' },
    history:   { label: 'History',    emoji: '🏛️' },
    geography: { label: 'Geography',  emoji: '🌍' },
    science:   { label: 'Science',    emoji: '🔬' }
  };
  function tierLabel(offset) {
    if (offset === 1) return '↑ Stretching harder';
    if (offset === -1) return '↓ Easing off';
    return '– On level';
  }
  function tierColor(offset) {
    if (offset === 1) return 'text-emerald-600';
    if (offset === -1) return 'text-amber-600';
    return 'text-gray-500';
  }

  return (
    <div className="font-body min-h-screen w-full bg-gray-50 p-5 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="font-display text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="w-7 h-7 text-indigo-600" /> Parent Dashboard
          </div>
          <button onClick={() => setPinChanging(true)} className="text-sm bg-white kid-shadow rounded-xl px-3 py-2 text-gray-600 font-semibold">Change PIN</button>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {NAMES.map(n => {
            const t = THEME[n];
            const s = stats[n];
            return (
              <div key={n} className="bg-white kid-shadow rounded-[1.5rem] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Mascot who={n} mood="idle" size={44} />
                  <div>
                    <div className={`${t.font} text-xl font-bold ${t.text}`}>{n}</div>
                    <div className="text-xs text-gray-500">{t.worldName}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <div className="text-xs text-gray-500">Points</div>
                    <div className="font-display text-xl font-bold text-gray-800">{s.total}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <div className="text-xs text-gray-500">Days</div>
                    <div className="font-display text-xl font-bold text-gray-800">{s.days}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <div className="text-xs text-gray-500">Streak</div>
                    <div className="font-display text-xl font-bold text-orange-600 flex items-center justify-center gap-1">{s.streak > 0 && <Flame className="w-4 h-4" />}{s.streak}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">Currently on <span className="font-bold text-gray-700">Day {s.currentDay}</span></div>
                {s.strongest && (
                  <div className="text-sm mb-1">
                    <span className="text-gray-500">Strongest: </span>
                    <span className="font-semibold text-emerald-700">{activityMeta[s.strongest].emoji} {activityMeta[s.strongest].label}</span>
                    <span className="text-gray-400 text-xs ml-1">({s.byActivity[s.strongest].avgPct}%)</span>
                  </div>
                )}
                {s.weakest && s.weakest !== s.strongest && (
                  <div className="text-sm mb-1">
                    <span className="text-gray-500">Needs work: </span>
                    <span className="font-semibold text-rose-700">{activityMeta[s.weakest].emoji} {activityMeta[s.weakest].label}</span>
                    <span className="text-gray-400 text-xs ml-1">({s.byActivity[s.weakest].avgPct}%)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Per-activity averages table */}
        <div className="bg-white kid-shadow rounded-[1.5rem] p-5 md:p-6 mb-6">
          <div className="font-display text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Average scores by activity
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500">
                  <th className="text-left py-2 pr-4 font-semibold">Activity</th>
                  {NAMES.map(n => <th key={n} className="text-center py-2 px-2 font-semibold">{THEME[n].emoji} {n}</th>)}
                </tr>
              </thead>
              <tbody>
                {['spelling','vocab','writing','math','reading','puzzles','history','geography','science'].map(a => (
                  <tr key={a} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-semibold text-gray-700">{activityMeta[a].emoji} {activityMeta[a].label}</td>
                    {NAMES.map(n => {
                      const b = stats[n].byActivity[a];
                      if (!b || b.attempts === 0) return <td key={n} className="text-center py-2 px-2 text-gray-300">—</td>;
                      const pct = b.avgPct;
                      const cls = pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-600';
                      return (
                        <td key={n} className={`text-center py-2 px-2 font-bold ${cls}`}>
                          {pct}% <span className="text-gray-400 font-normal text-xs">({b.attempts})</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-400 mt-2">Bracketed number = attempts. Green 80%+ · amber 50-79% · red under 50%.</div>
        </div>

        {/* Adaptive difficulty status */}
        <div className="bg-white kid-shadow rounded-[1.5rem] p-5 md:p-6 mb-6">
          <div className="font-display text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Adaptive difficulty
          </div>
          <div className="text-xs text-gray-500 mb-3">Difficulty adjusts automatically based on last 3 days' scores (invisible to the kids). 80%+ moves up, under 40% moves down.</div>
          <div className="grid md:grid-cols-3 gap-4">
            {NAMES.map(n => (
              <div key={n} className="bg-gray-50 rounded-xl p-3">
                <div className="font-bold text-gray-700 mb-2">{THEME[n].emoji} {n}</div>
                {['spelling','math','puzzles'].map(a => (
                  <div key={a} className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-500">{activityMeta[a].emoji} {activityMeta[a].label}</span>
                    <span className={`font-semibold ${tierColor(stats[n].tiers[a])}`}>{tierLabel(stats[n].tiers[a])}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Data cleanup — removes legacy corrupted entries from Firestore */}
        <div className="bg-white kid-shadow rounded-[1.5rem] p-5 md:p-6 mb-6">
          <div className="font-display text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            🧹 Data cleanup
          </div>
          <div className="text-xs text-gray-500 mb-3">If a child's leaderboard or profile shows "[object Object]" or weird numbers, their progress record has legacy garbage from an earlier bug. Tap below to scrub it. <strong>Real scores are preserved</strong> — only invalid entries are removed.</div>
          <div className="grid md:grid-cols-3 gap-3">
            {NAMES.map(n => (
              <button key={n} disabled={cleaningFor === n}
                onClick={async () => {
                  if (!confirm(`Clean ${n}'s data? Real scores are kept; only corrupted entries will be removed. This cannot be undone.`)) return;
                  setCleaningFor(n);
                  setCleanResult(null);
                  const r = await cleanProgress(n);
                  setCleaningFor(null);
                  setCleanResult({ name: n, ...r });
                }}
                className="pressable bg-gray-50 hover:bg-gray-100 rounded-xl p-3 text-sm font-semibold border border-gray-200 disabled:opacity-50">
                {cleaningFor === n ? 'Cleaning…' : `Clean ${n}'s data`}
              </button>
            ))}
          </div>
          {cleanResult && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-900">
              {cleanResult.error ? (
                <span>⚠️ Error: {cleanResult.error}</span>
              ) : (
                <>
                  ✅ Cleaned {cleanResult.name}'s data.
                  {cleanResult.removedKeys && cleanResult.removedKeys.length > 0 && (
                    <> Removed {cleanResult.removedKeys.length} bad key{cleanResult.removedKeys.length > 1 ? 's' : ''} <span className="text-emerald-700 font-mono text-xs">({cleanResult.removedKeys.join(', ')})</span>.</>
                  )}
                  {cleanResult.fixedValues > 0 && <> Fixed {cleanResult.fixedValues} invalid value{cleanResult.fixedValues > 1 ? 's' : ''}.</>}
                  {(!cleanResult.removedKeys || cleanResult.removedKeys.length === 0) && !cleanResult.fixedValues && <> Nothing to clean — record was already healthy.</>}
                  {' '}Refresh the app on their iPad to see the corrected view.
                </>
              )}
            </div>
          )}
        </div>

        {/* Change PIN modal */}
        {pinChanging && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" onClick={() => setPinChanging(false)}>
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full kid-shadow" onClick={e => e.stopPropagation()}>
              <div className="font-display text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><Lock className="w-5 h-5" /> Change PIN</div>
              {pinSaved ? (
                <div className="text-center py-6">
                  <Check className="w-12 h-12 text-emerald-600 mx-auto" />
                  <div className="font-display text-lg text-emerald-700 mt-2">PIN updated!</div>
                </div>
              ) : (
                <>
                  <input type="password" inputMode="numeric" maxLength={4} autoFocus
                    value={newPin}
                    onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-4 rounded-xl border-4 border-indigo-200 text-center font-display text-3xl tracking-widest"
                    placeholder="••••" />
                  <div className="text-xs text-gray-400 mt-2">Enter a new 4-digit PIN.</div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setPinChanging(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold pressable">Cancel</button>
                    <button onClick={savePin} disabled={newPin.length !== 4} className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold pressable disabled:opacity-40">Save</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Robust day-key check: only include keys that match /^day\d+$/ exactly.
// Ignore legacy garbage like 'dayhistory', 'inProgress', etc.
function isDayKey(k) {
  return /^day\d+$/.test(k);
}
// Coerce any stored score to a sane number. Handles legacy corruption where
// an activity field might accidentally be an object.
function num(v) {
  if (typeof v === 'number' && !isNaN(v)) return v;
  if (typeof v === 'string') { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
  return 0;
}

function totalPoints(userProgress) {
  if (!userProgress) return 0;
  let t = 0;
  for (const k in userProgress) {
    if (!isDayKey(k)) continue;
    const d = userProgress[k]; if (!d || typeof d !== 'object') continue;
    t += num(d.spelling) + num(d.vocab) + num(d.writing) + num(d.math) + num(d.reading) + num(d.puzzles);
  }
  return t;
}
function dayPoints(dayObj, activities) {
  if (!dayObj) return 0;
  return activities.reduce((s, a) => s + num(dayObj[a.id]), 0);
}

/* ------ Adaptive difficulty ------
   Look at the last 3 completed days' scores for this subject and compute a
   tier offset of -1, 0, or +1. Invisible to the kids — the getter functions
   in content.js use this offset to pick harder or easier content.
   Rule: average >= 80% over last 3 attempts → +1, <= 40% → -1, else 0.
*/
const ACTIVITY_MAX = { spelling: 10, vocab: 20, writing: 10, math: 10, reading: 4, puzzles: 10, history: 10, geography: 10, science: 10 };

function tierOffsetFor(userProgress, activityId, currentDay) {
  if (!userProgress) return 0;
  const scores = [];
  for (let d = currentDay - 1; d >= 1 && scores.length < 3; d--) {
    const day = userProgress[`day${d}`];
    if (day && day[activityId] !== undefined) {
      const max = ACTIVITY_MAX[activityId] || 10;
      scores.push(day[activityId] / max);
    }
  }
  if (scores.length < 2) return 0; // need at least 2 prior data points to adapt
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (avg >= 0.8) return 1;
  if (avg <= 0.4) return -1;
  return 0;
}

/* ------ Streak calculation ------
   Consecutive days ending at (currentDay - 1) where user completed all base activities.
*/
const BASE_ACTIVITIES = ['spelling','vocab','writing','math','reading','puzzles'];
function calcStreak(userProgress, currentDay) {
  if (!userProgress) return 0;
  let streak = 0;
  for (let d = currentDay - 1; d >= 1; d--) {
    const day = userProgress[`day${d}`];
    if (!day) break;
    const allDone = BASE_ACTIVITIES.every(id => day[id] !== undefined);
    if (!allDone) break;
    streak++;
  }
  return streak;
}

/* ============================================================
   HOME
   ============================================================ */
function Home({ user, progress, currentDay, setScreen, switchUser, isDayComplete }) {
  const me = THEME[user];
  // Only Ava/Layla have a "sister" relationship. Salahuddin is solo on home view.
  const sister = user === 'Ava' ? 'Layla' : user === 'Layla' ? 'Ava' : null;
  const them = sister ? THEME[sister] : null;
  const dayKey = `day${currentDay}`;
  const myDay = progress[user][dayKey] || {};
  const sisDay = sister ? (progress[sister][dayKey] || {}) : {};

  // v3.2: in-progress state for paused badge
  const [inProgress, setInProgress] = useState({});
  useEffect(() => {
    let cancelled = false;
    loadAllInProgress(user).then(data => { if (!cancelled) setInProgress(data || {}); });
    return () => { cancelled = true; };
  }, [user, currentDay]);

  // Map activity id -> in-progress entry. Note lesson activities are stored
  // under keys like 'lesson-history', 'lesson-geography', 'lesson-science'.
  function pausedFor(activityId) {
    const key = (activityId === 'history' || activityId === 'geography' || activityId === 'science')
      ? `lesson-${activityId}` : activityId;
    const entry = inProgress[key];
    if (entry && entry.day === currentDay) return entry;
    return null;
  }

  // v3: today's subject (null on Sunday)
  const todaySubject = lessonSubjectForDay(currentDay);
  const subjectMeta = todaySubject ? SUBJECT_META[todaySubject] : null;
  const todayTopic = todaySubject ? lessonTopicFor(todaySubject, currentDay) : null;

  const baseActivities = [
    { id: 'spelling', label: 'Spelling',   icon: Volume2,    emoji: '🔊', color: 'from-amber-300 to-orange-400',  outOf: 10 },
    { id: 'vocab',    label: 'Vocabulary', icon: BookOpen,   emoji: '📚', color: 'from-sky-300 to-indigo-400',    outOf: 20 },
    { id: 'writing',  label: 'Writing',    icon: PenTool,    emoji: '✏️', color: 'from-emerald-300 to-green-500', outOf: 10 },
    { id: 'math',     label: 'Maths',      icon: Calculator, emoji: '🧮', color: 'from-violet-300 to-purple-500', outOf: 10 },
    { id: 'reading',  label: 'Reading',    icon: Headphones, emoji: '📖', color: 'from-rose-300 to-red-400',      outOf: 4  },
    { id: 'puzzles',  label: 'Puzzles',    icon: Brain,      emoji: '🧠', color: 'from-indigo-400 to-fuchsia-500', outOf: 10 }
  ];

  // Add today's subject lesson card if not Sunday
  const subjectColorMap = {
    history:   { grad: 'from-amber-500 to-orange-700',   icon: Landmark, desc: todayTopic },
    geography: { grad: 'from-sky-500 to-cyan-700',       icon: Globe,    desc: todayTopic },
    science:   { grad: 'from-violet-500 to-fuchsia-700', icon: Beaker,   desc: todayTopic }
  };
  const activities = todaySubject
    ? [...baseActivities, {
        id: todaySubject,
        label: subjectMeta.name,
        icon: subjectColorMap[todaySubject].icon,
        emoji: subjectMeta.emoji,
        color: subjectColorMap[todaySubject].grad,
        outOf: 10,
        desc: todayTopic
      }]
    : baseActivities;

  const totalPossibleToday = activities.reduce((s, a) => s + a.outOf, 0);
  const myTotalToday = activities.reduce((s, a) => s + (myDay[a.id] || 0), 0);
  const sisTotalToday = sister ? activities.reduce((s, a) => s + (sisDay[a.id] || 0), 0) : 0;
  const myAllDone = isDayComplete(user, currentDay);
  const sisAllDone = sister ? isDayComplete(sister, currentDay) : false;

  // Trophy cabinet — one trophy per fully completed day
  const myCompleted = [];
  for (let d = 1; d < currentDay; d++) if (isDayComplete(user, d)) myCompleted.push(d);

  // Streak — consecutive days ending yesterday
  const streak = useMemo(() => calcStreak(progress[user], currentDay), [progress, user, currentDay]);

  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pop-in">
        <div className="flex items-center gap-4">
          <div className={`rounded-full ${me.gradient} p-1 kid-shadow`}>
            <div className="bg-white rounded-full p-1"><Mascot who={user} mood="idle" size={64} /></div>
          </div>
          <div>
            <div className={`${me.font} text-3xl md:text-5xl font-bold ${me.text}`}>Hi {user}!</div>
            <div className="text-gray-500 text-sm md:text-base font-medium">{me.worldName} · {me.tagline}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { sfx.pop(); setScreen('scoreboard'); }} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
            <Trophy className="w-5 h-5 text-amber-500" /> <span className="hidden sm:inline">Scores</span>
          </button>
          <button onClick={switchUser} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 text-gray-700 font-semibold">Switch</button>
        </div>
      </div>

      {/* Day banner with themed decorations */}
      <div className={`relative overflow-hidden rounded-[2rem] p-6 md:p-8 kid-shadow ${me.gradient} ${me.pattern} text-white mb-6`}>
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className={`${me.font} text-sm md:text-base uppercase tracking-widest opacity-95`}>
              {user === 'Ava' ? 'Today at Pawsome Academy' : user === 'Layla' ? "Today's Match" : "Today's Dig Site"}
            </div>
            <div className="font-display text-5xl md:text-6xl font-bold mt-1">Day {currentDay}</div>
            <div className="opacity-90 mt-1">of {TOTAL_DAYS}</div>
            {todaySubject && (
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-2xl px-3 py-1.5 text-sm font-semibold">
                <span>{subjectMeta.emoji}</span>
                <span>Today's subject: {subjectMeta.name}</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm uppercase tracking-widest opacity-90 font-display">Today's points</div>
            <div className="font-display text-5xl md:text-6xl font-bold">{myTotalToday}<span className="text-2xl opacity-75">/{totalPossibleToday}</span></div>
            {streak >= 2 && (
              <div className="mt-2 inline-flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-sm font-bold">
                <Flame className="w-4 h-4" /> {streak} day streak!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sister strip — only shown for Ava & Layla (they see each other) */}
      {sister && (
        <div className="rounded-3xl p-5 bg-white kid-shadow mb-6">
          <div className="flex items-center gap-4">
            <Mascot who={sister} mood="idle" size={54} />
            <div className="flex-1">
              <div className="font-display text-lg text-gray-800">
                {sister}'s Day {currentDay}: <span className={`font-bold ${them.text}`}>{sisTotalToday} points</span>
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                {activities.map(a => (
                  <span key={a.id} className="flex items-center gap-1">
                    <span>{a.emoji}</span>
                    {sisDay[a.id] !== undefined
                      ? <span className="text-emerald-600 font-semibold">{sisDay[a.id]}/{a.outOf}</span>
                      : <span className="text-gray-400">—</span>}
                  </span>
                ))}
              </div>
            </div>
            {sisAllDone && <div className="text-2xl">✅</div>}
          </div>
        </div>
      )}

      {/* Leaderboard button — visible to all, so everyone can see how everyone's doing */}
      <button onClick={() => { sfx.pop(); setScreen('leaderboard'); }}
        className="w-full rounded-3xl p-4 bg-gradient-to-r from-amber-400 via-pink-400 to-violet-500 text-white kid-shadow mb-6 pressable flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div className="text-left">
            <div className="font-display text-lg font-bold">Leaderboard</div>
            <div className="text-sm opacity-90">See how everyone's doing</div>
          </div>
        </div>
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Activities */}
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {activities.map((a, idx) => {
          const done = myDay[a.id] !== undefined;
          const paused = !done && pausedFor(a.id);
          const Icon = a.icon;
          const screenKey = (a.id === 'history' || a.id === 'geography' || a.id === 'science')
            ? `lesson-${a.id}` : a.id;
          return (
            <button key={a.id} onClick={() => { sfx.pop(); setScreen(screenKey); }}
              className={`pressable group kid-shadow rounded-[1.75rem] p-6 bg-gradient-to-br ${a.color} text-white text-left relative overflow-hidden`}
              style={{ animation: `pop-in .35s ${idx*60}ms both cubic-bezier(.34,1.56,.64,1)` }}>
              <div className="absolute -bottom-6 -right-6 text-[7rem] opacity-15 select-none">{a.emoji}</div>
              {paused && (
                <div className="absolute top-3 left-3 bg-white/95 text-amber-700 rounded-full px-3 py-1 text-xs font-display font-bold flex items-center gap-1 shadow-lg">
                  ⏸ Paused — tap to resume
                </div>
              )}
              <div className="relative flex items-start justify-between">
                <div className={paused ? 'mt-6' : ''}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center"><Icon className="w-6 h-6" /></div>
                    <span className="text-3xl">{a.emoji}</span>
                  </div>
                  <div className="font-display text-2xl font-bold">{a.label}</div>
                  <div className="opacity-90 text-sm mt-1">
                    {a.id === 'spelling' && '10 words spoken aloud'}
                    {a.id === 'vocab'    && '10 words · meaning + usage'}
                    {a.id === 'writing'  && 'Write 10 sentences'}
                    {a.id === 'math'     && '10 mixed questions'}
                    {a.id === 'reading'  && '3-min story + quiz'}
                    {(a.id === 'history' || a.id === 'geography' || a.id === 'science') && (a.desc || `${a.label} lesson`)}
                  </div>
                </div>
                {done ? (
                  <div className="bg-white/25 rounded-2xl px-3 py-2 flex items-center gap-1 font-bold"><Check className="w-5 h-5" /> {myDay[a.id]}/{a.outOf}</div>
                ) : (<ChevronRight className="w-8 h-8 opacity-80" />)}
              </div>
            </button>
          );
        })}
        {/* Day finish / waiting */}
        {myAllDone && (
          <button onClick={() => { sfx.fanfare(); setScreen('dayDone'); }}
            className="pressable kid-shadow rounded-[1.75rem] p-6 bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-500 text-white text-left relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 text-[7rem] opacity-20 select-none">🏆</div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center"><Trophy className="w-6 h-6" /></div>
                <span className="text-3xl">🎉</span>
              </div>
              <div className="font-display text-2xl font-bold">Day Complete!</div>
              <div className="opacity-90 text-sm mt-1">Tap to see your celebration</div>
            </div>
          </button>
        )}
      </div>

      {/* Trophy cabinet */}
      {myCompleted.length > 0 && (
        <div className="rounded-3xl p-5 bg-white kid-shadow mb-6">
          <div className={`font-display text-lg font-bold ${me.text} mb-3 flex items-center gap-2`}>
            <Medal className="w-5 h-5" /> {user === 'Ava' ? 'Your sparkle collection' : user === 'Layla' ? 'Your trophy cabinet' : 'Your fossil collection'}
            <span className="text-gray-500 text-sm font-medium ml-auto">{myCompleted.length} day{myCompleted.length === 1 ? '' : 's'} done</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(TOTAL_DAYS, Math.max(currentDay + 1, 12)) }).map((_, i) => {
              const d = i + 1;
              const earned = myCompleted.includes(d);
              return (
                <div key={d} className={`trophy-slot ${earned ? 'earned' : ''}`} title={`Day ${d}`}>
                  {earned ? (user === 'Ava' ? '💖' : user === 'Layla' ? '🏆' : '🦴') : <span className="text-gray-300 text-xs">{d}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer status — depends on pairing rule */}
      <div className="rounded-3xl p-5 bg-white kid-shadow text-center">
        {!myAllDone && (<div className="font-display text-xl text-gray-700">Finish all {activities.length} activities to unlock Day {currentDay + 1}! 🚀</div>)}
        {/* Sisters wait for each other */}
        {sister && myAllDone && !sisAllDone && (<div className="font-display text-xl text-gray-700">Amazing work, {user}! 🎉 Waiting for <span className={them.text}>{sister}</span> to finish Day {currentDay}…</div>)}
        {sister && myAllDone && sisAllDone && currentDay < TOTAL_DAYS && (<div className="font-display text-xl text-emerald-600">You both finished Day {currentDay}! Day {currentDay + 1} is unlocking… 🎊</div>)}
        {sister && currentDay >= TOTAL_DAYS && myAllDone && sisAllDone && (<div className="font-display text-2xl text-purple-700">🏆 You completed all {TOTAL_DAYS} days! You're superstars! 🏆</div>)}
        {/* Salahuddin goes solo */}
        {!sister && myAllDone && currentDay < TOTAL_DAYS && (<div className="font-display text-xl text-emerald-600">Day {currentDay} complete! 🎉 Day {currentDay + 1} is unlocking…</div>)}
        {!sister && currentDay >= TOTAL_DAYS && myAllDone && (<div className="font-display text-2xl text-purple-700">🏆 You completed all {TOTAL_DAYS} days! You're a superstar! 🏆</div>)}
      </div>
    </div>
  );
}

/* ============================================================
   SHARED — Activity shell
   ============================================================ */
function ActivityShell({ user, title, emoji, color, onBack, onSaveExit, step, total, children }) {
  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5 gap-2">
        <button onClick={onBack} className="pressable bg-white kid-shadow rounded-2xl px-3 py-3 flex items-center gap-2 text-gray-700 font-semibold">
          <ArrowLeft className="w-5 h-5" /> <span className="hidden sm:inline">Home</span>
        </button>
        <div className={`px-3 md:px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white font-display font-bold flex items-center gap-2 shadow-lg text-sm md:text-base`}>
          <span className="text-2xl">{emoji}</span> {title}
        </div>
        {onSaveExit ? (
          <button onClick={onSaveExit} className="pressable bg-emerald-50 kid-shadow rounded-2xl px-3 py-3 flex items-center gap-2 text-emerald-700 font-semibold border-2 border-emerald-100" title="Save progress and go home">
            💾 <span className="hidden sm:inline">Save & exit</span>
          </button>
        ) : (
          <div className="w-[44px] md:w-[130px]" />
        )}
      </div>
      {typeof step === 'number' && typeof total === 'number' && (
        <div className="mb-5">
          <div className="flex justify-between text-sm text-gray-500 mb-1 font-semibold">
            <span>{Math.min(step + 1, total)} of {total}</span>
            <span>{Math.round((step / total) * 100)}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden kid-shadow">
            <div className={`h-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${(step / total) * 100}%` }} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

/* ============================================================
   RESUME PROMPT — shown on activity entry if saved state exists
   ============================================================ */
function ResumePrompt({ user, title, emoji, color, savedAt, stepInfo, onResume, onStartOver, onBack }) {
  const when = savedAt ? new Date(savedAt) : null;
  const whenTxt = when ? when.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'earlier';
  return (
    <ActivityShell user={user} title={title} emoji={emoji} color={color} onBack={onBack}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 text-center pop-in">
        <div className="text-6xl mb-3">⏸️</div>
        <div className="font-display text-2xl md:text-3xl text-gray-800 mb-2">You were partway through this!</div>
        <div className="text-gray-500 mb-5">Paused {whenTxt}{stepInfo ? ` · ${stepInfo}` : ''}</div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onResume} className={`pressable px-8 py-3 rounded-2xl bg-gradient-to-r ${color} text-white font-display font-bold text-lg kid-shadow`}>
            Continue from where I left off →
          </button>
          <button onClick={onStartOver} className="pressable px-6 py-3 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 font-display font-semibold">
            Start over
          </button>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   SAVE-AND-RESUME HOOK
   Used by each activity: checks for saved state on mount, offers resume,
   returns helpers to save-and-exit and to clear on completion.
   ============================================================ */
function useResumable(activity, user, currentDay) {
  const [phase, setPhase] = useState('loading'); // loading | prompt | ready
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadInProgress(user, activity).then(data => {
      if (cancelled) return;
      if (data && data.day === currentDay && data.state) {
        setSaved(data);
        setPhase('prompt');
      } else {
        // Saved state is stale (different day) — clear it silently
        if (data) clearInProgress(user, activity);
        setPhase('ready');
      }
    });
    return () => { cancelled = true; };
  }, [activity, user, currentDay]);

  function save(state) {
    return saveInProgress(user, activity, { day: currentDay, state });
  }
  function clear() {
    return clearInProgress(user, activity);
  }
  function resume() { setPhase('ready'); }
  function startOver() { clearInProgress(user, activity); setSaved(null); setPhase('ready'); }

  return { phase, saved, save, clear, resume, startOver };
}
/* ============================================================
   SPELLING — hint button + memory tips + type-3-times learning loop
   ============================================================ */
function SpellingActivity({ user, progress, currentDay, saveActivity, setScreen }) {
  const userProgress = progress[user] || {};
  const tierOffset = useMemo(() => tierOffsetFor(userProgress, 'spelling', currentDay), [userProgress, currentDay]);
  const words = useMemo(() => getSpellingWords(currentDay, tierOffset), [currentDay, tierOffset]);
  const theme = THEME[user];
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [tipsByWord, setTipsByWord] = useState({});
  // Hints
  const [hint, setHint] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  // Learn phase: when child gets a word wrong, they must type it correctly 3 times
  const [learnMode, setLearnMode] = useState(false);
  const [learnWord, setLearnWord] = useState('');
  const [learnInput, setLearnInput] = useState('');
  const [learnCorrectCount, setLearnCorrectCount] = useState(0);
  const [learnShake, setLearnShake] = useState(false);
  // Feedback flash after each answer before moving on
  const [lastResult, setLastResult] = useState(null); // {word, correct}
  const inputRef = useRef(null);
  const learnInputRef = useRef(null);

  // Save & resume
  const R = useResumable('spelling', user, currentDay);

  // When user chooses "Continue" on the resume prompt, hydrate state
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && step === 0 && results.length === 0) {
      const s = R.saved.state;
      if (Array.isArray(s.results)) setResults(s.results);
      if (typeof s.step === 'number') setStep(s.step);
      if (typeof s.input === 'string') setInput(s.input);
      if (s.tipsByWord) setTipsByWord(s.tipsByWord);
    }
  // eslint-disable-next-line
  }, [R.phase]);

  function saveAndExit() {
    sfx.pop();
    R.save({ step, input, results, tipsByWord });
    setScreen('home');
  }

  useEffect(() => { const t = setTimeout(() => speakWord(words[step]), 400); return () => clearTimeout(t); }, [R.phase]);
  useEffect(() => {
    if (!done && !learnMode && !lastResult) { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 100); return () => clearTimeout(t); }
    if (learnMode) { const t = setTimeout(() => learnInputRef.current && learnInputRef.current.focus(), 100); return () => clearTimeout(t); }
  }, [step, done, learnMode, lastResult]);

  // Reset hint when moving to next word
  useEffect(() => { setHint(''); setHintVisible(false); }, [step]);

  async function fetchHint() {
    const word = words[step];
    if (hint) { setHintVisible(true); return; }
    setHintLoading(true);
    const res = await aiCall('spelling-hint', { word });
    setHintLoading(false);
    if (res && res.hint) { setHint(res.hint); setHintVisible(true); }
    else { setHint(`Starts with "${word[0]}" and has ${word.length} letters.`); setHintVisible(true); }
  }

  function advanceOrFinish(newResults) {
    if (step + 1 >= words.length) {
      const score = newResults.filter(r => r.correct).length;
      saveActivity(currentDay, 'spelling', score, { words: newResults });
      R.clear();
      setDone(true);
      if (score === 10) sfx.celebration(); else sfx.fanfare();
    } else {
      setStep(step + 1);
      setInput('');
      setTimeout(() => speakWord(words[step + 1]), 300);
    }
  }

  async function submitAnswer(e) {
    e && e.preventDefault();
    const word = words[step];
    const correct = input.trim().toLowerCase() === word.toLowerCase();
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...results, { word, answer: input.trim(), correct }];
    setResults(newResults);
    setLastResult({ word, attempt: input.trim(), correct });

    // Fire memory tip for wrong answers (keeps flow fast, shown later in summary)
    if (!correct) {
      aiCall('spelling-tip', { word, wrongAnswer: input.trim(), childName: user }).then(res => {
        if (res && res.tip) setTipsByWord(t => ({ ...t, [word]: res.tip }));
      });
      // Show the feedback card with LEARN button
    } else {
      // Correct — advance after a short pause
      setTimeout(() => { setLastResult(null); advanceOrFinish(newResults); }, 900);
    }
  }

  function beginLearnPhase() {
    sfx.pop();
    setLearnWord(lastResult.word);
    setLearnInput('');
    setLearnCorrectCount(0);
    setLearnMode(true);
    setLastResult(null);
    setTimeout(() => speakWord(lastResult.word), 200);
  }

  function submitLearn(e) {
    e && e.preventDefault();
    const correct = learnInput.trim().toLowerCase() === learnWord.toLowerCase();
    if (correct) {
      sfx.ding();
      const newCount = learnCorrectCount + 1;
      setLearnCorrectCount(newCount);
      setLearnInput('');
      if (newCount >= 3) {
        // Done learning — advance
        setTimeout(() => {
          setLearnMode(false);
          setLearnWord('');
          setLearnCorrectCount(0);
          advanceOrFinish(results);
        }, 700);
      } else {
        setTimeout(() => speakWord(learnWord), 200);
      }
    } else {
      sfx.aww();
      setLearnShake(true);
      setTimeout(() => setLearnShake(false), 500);
      setLearnInput('');
    }
  }

  // ---- SAVE-RESUME PROMPT ----
  if (R.phase === 'loading') {
    return (
      <ActivityShell user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500" onBack={() => setScreen('home')}>
        <div className="bg-white kid-shadow rounded-[2rem] p-10 text-center"><div className="text-5xl mb-3 floaty">🔊</div><div className="text-gray-500">Loading…</div></div>
      </ActivityShell>
    );
  }
  if (R.phase === 'prompt' && R.saved) {
    const saved = R.saved;
    const stepInfo = saved.state && typeof saved.state.step === 'number'
      ? `On word ${Math.min(saved.state.step + 1, words.length)} of ${words.length}` : null;
    return (
      <ResumePrompt user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500"
        savedAt={saved.savedAt} stepInfo={stepInfo}
        onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />
    );
  }

  // ---- RESULTS SCREEN ----
  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
      <ActivityShell user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500" onBack={() => setScreen('home')}>
        <ResultsCard
          theme={theme}
          color="from-amber-300 to-orange-500"
          title="Spelling finished!" score={score} total={10}
          items={results.map(r => ({
            ok: r.correct,
            label: r.correct
              ? <span className="font-semibold">{r.word}</span>
              : <span>
                  <s className="opacity-70">{r.answer || '(blank)'}</s> → <b>{r.word}</b>
                  {tipsByWord[r.word] && <div className="text-sm text-gray-600 mt-1 italic">💡 {tipsByWord[r.word]}</div>}
                </span>
          }))}
          onDone={() => setScreen('home')}
        />
      </ActivityShell>
    );
  }

  // ---- LEARN PHASE (type 3 times after a mistake) ----
  if (learnMode) {
    const progress = (learnCorrectCount / 3) * 100;
    return (
      <ActivityShell user={user} title="Let's learn it!" emoji="✍️" color="from-amber-400 to-orange-500"
        onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={step} total={words.length}>
        <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 text-center pop-in">
          <div className="text-5xl mb-3">✨</div>
          <div className="font-display text-2xl md:text-3xl text-gray-800 mb-2">Let's remember this word</div>
          <div className="text-gray-500 mb-6">Type it correctly <b>3 times</b> so it sticks 🧠</div>

          {/* The correct word displayed big */}
          <div className="inline-block bg-gradient-to-br from-amber-100 to-orange-100 px-6 py-4 rounded-2xl mb-3 kid-shadow">
            <div className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-1">The correct spelling</div>
            <div className="font-display text-4xl md:text-5xl font-bold text-amber-900 tracking-wide">{learnWord}</div>
          </div>

          <div className="mb-4 flex justify-center">
            <button onClick={() => { sfx.pop(); speakWord(learnWord); }} className="pressable bg-amber-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Hear it
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-3 mb-5">
            {[0,1,2].map(i => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                i < learnCorrectCount ? 'bg-emerald-500 text-white scale-110' : 'bg-gray-200 text-gray-400'
              }`}>
                {i < learnCorrectCount ? '✓' : i + 1}
              </div>
            ))}
          </div>

          <form onSubmit={submitLearn} className="max-w-md mx-auto">
            <input ref={learnInputRef} type="text" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              value={learnInput} onChange={e => setLearnInput(e.target.value)} placeholder="Type the word…"
              className={`w-full text-center font-display text-3xl md:text-4xl p-5 rounded-2xl t-input ${learnShake ? 'shake' : ''}`} />
            <button type="submit" disabled={!learnInput.trim()}
              className="pressable mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-display font-bold text-lg kid-shadow disabled:opacity-40">
              Check ({learnCorrectCount}/3)
            </button>
          </form>
          <div className="text-xs text-gray-400 mt-4">You don't need to get this attempt right for your score — just learn the spelling 💪</div>
        </div>
      </ActivityShell>
    );
  }

  // ---- FEEDBACK AFTER WRONG ANSWER ----
  if (lastResult && !lastResult.correct) {
    return (
      <ActivityShell user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500"
        onBack={() => setScreen('home')} step={step} total={words.length}>
        <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 text-center pop-in">
          <div className="text-5xl mb-3">💪</div>
          <div className="font-display text-2xl md:text-3xl text-gray-800 mb-4">Not quite — let's learn it!</div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="text-xl text-gray-500"><s>{lastResult.attempt || '(blank)'}</s></div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
            <div className="inline-block bg-gradient-to-br from-amber-100 to-orange-100 px-5 py-3 rounded-2xl">
              <div className="text-xs uppercase tracking-wider text-amber-800 font-bold mb-1">Correct spelling</div>
              <div className="font-display text-3xl md:text-4xl font-bold text-amber-900 tracking-wide">{lastResult.word}</div>
            </div>
          </div>
          <button onClick={() => { sfx.pop(); speakWord(lastResult.word); }} className="mt-3 text-amber-700 underline text-sm font-semibold flex items-center gap-1 mx-auto">
            <Volume2 className="w-4 h-4" /> Hear it again
          </button>
          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={beginLearnPhase} className="pressable px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-display font-bold text-lg kid-shadow">
              Let's practise it! ✍️
            </button>
            <button onClick={() => { setLastResult(null); advanceOrFinish(results); }}
              className="pressable px-6 py-3 rounded-2xl bg-white border-2 border-gray-200 text-gray-600 font-display font-semibold">
              Skip for now
            </button>
          </div>
        </div>
      </ActivityShell>
    );
  }

  // ---- CORRECT ANSWER FLASH ----
  if (lastResult && lastResult.correct) {
    return (
      <ActivityShell user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500"
        onBack={() => setScreen('home')} step={step} total={words.length}>
        <div className="bg-white kid-shadow rounded-[2rem] p-10 text-center pop-in">
          <div className="text-7xl mb-4">🎉</div>
          <div className="font-display text-3xl text-emerald-600 font-bold">Correct!</div>
          <div className="font-display text-2xl text-gray-700 mt-2">{lastResult.word}</div>
        </div>
      </ActivityShell>
    );
  }

  // ---- NORMAL QUESTION VIEW ----
  return (
    <ActivityShell user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500"
      onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={step} total={words.length}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-12 text-center pop-in">
        <div className="text-gray-500 mb-4 font-semibold">Tap the speaker to hear your word 👂</div>
        <button onClick={() => { sfx.pop(); speakWord(words[step]); }}
          className="pressable mx-auto mb-6 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-white flex items-center justify-center kid-shadow">
          <Volume2 className="w-16 h-16 md:w-20 md:h-20" />
        </button>

        {/* Hint system */}
        <div className="mb-5">
          {!hintVisible ? (
            <button type="button" onClick={fetchHint} disabled={hintLoading}
              className="pressable inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-100 text-sky-800 font-semibold border-2 border-sky-200 disabled:opacity-60">
              <Sparkles className="w-4 h-4" /> {hintLoading ? 'Thinking…' : 'Show hint'}
            </button>
          ) : (
            <div className="inline-block max-w-md text-left bg-sky-50 border-2 border-sky-200 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs uppercase tracking-wider font-bold text-sky-800 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Hint</div>
                <button type="button" onClick={() => setHintVisible(false)} className="text-xs text-sky-700 underline">Hide</button>
              </div>
              <div className="text-sky-900 text-sm">{hint}</div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-3">Type what you hear:</div>
        <form onSubmit={submitAnswer} className="max-w-md mx-auto">
          <input ref={inputRef} type="text" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            value={input} onChange={e => setInput(e.target.value)} placeholder="Type the word…"
            className="w-full text-center font-display text-3xl md:text-4xl p-5 rounded-2xl t-input" />
          <button type="submit" disabled={!input.trim()}
            className="pressable mt-5 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-display font-bold text-xl kid-shadow disabled:opacity-40 disabled:cursor-not-allowed">
            {step + 1 === words.length ? 'Finish ✓' : 'Next →'}
          </button>
        </form>
        <button onClick={() => { sfx.pop(); speakWord(words[step]); }} className="mt-5 text-amber-700 font-semibold underline text-sm flex items-center gap-1 mx-auto">
          <RefreshCw className="w-4 h-4" /> Hear it again
        </button>
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   VOCAB — 10 words × 2 questions (meaning + usage)
   ============================================================ */
function VocabActivity({ user, currentDay, saveActivity, setScreen }) {
  const words = useMemo(() => getVocabForDay(currentDay), [currentDay]);
  const theme = THEME[user];
  // Question sequence: all 10 meanings first, then all 10 usages (total 20).
  // Kids learn each word's definition by going through the whole set, then
  // apply their understanding to usage sentences. Much less context-switching.
  const questions = useMemo(() => {
    const out = [];
    // Pass 1 — all definitions
    words.forEach((w, i) => {
      out.push({ kind: 'meaning', wordIdx: i, word: w.word, options: w.meaningOptions, correct: w.meaningCorrect, definition: w.definition });
    });
    // Pass 2 — all usages
    words.forEach((w, i) => {
      out.push({ kind: 'usage', wordIdx: i, word: w.word, sentence: w.sentence, options: w.usageOptions, correct: w.usageCorrect, definition: w.definition });
    });
    return out;
  }, [words]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  // Save & resume
  const R = useResumable('vocab', user, currentDay);
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && step === 0 && results.length === 0) {
      const s = R.saved.state;
      if (Array.isArray(s.results)) setResults(s.results);
      if (typeof s.step === 'number') setStep(s.step);
    }
  // eslint-disable-next-line
  }, [R.phase]);
  function saveAndExit() { sfx.pop(); R.save({ step, results }); setScreen('home'); }

  function choose(idx) {
    if (picked !== null) return;
    setPicked(idx);
    const q = questions[step];
    const correct = idx === q.correct;
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...results, { ...q, chosen: q.options[idx], correct }];
    setTimeout(() => {
      setPicked(null); setResults(newResults);
      if (step + 1 >= questions.length) {
        const score = newResults.filter(r => r.correct).length;
        saveActivity(currentDay, 'vocab', score, { answers: newResults });
        R.clear();
        setDone(true);
        if (score === 20) sfx.celebration(); else sfx.fanfare();
      } else { setStep(step + 1); }
    }, 1200);
  }

  if (R.phase === 'loading') {
    return <ActivityShell user={user} title="Vocabulary" emoji="📚" color="from-sky-400 to-indigo-500" onBack={() => setScreen('home')}><div className="bg-white rounded-[2rem] p-10 text-center"><div className="text-5xl mb-3 floaty">📚</div><div className="text-gray-500">Loading…</div></div></ActivityShell>;
  }
  if (R.phase === 'prompt' && R.saved) {
    const s = R.saved.state || {};
    const info = typeof s.step === 'number' ? `On question ${Math.min(s.step + 1, questions.length)} of ${questions.length}` : null;
    return <ResumePrompt user={user} title="Vocabulary" emoji="📚" color="from-sky-400 to-indigo-500"
      savedAt={R.saved.savedAt} stepInfo={info}
      onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />;
  }

  if (done) {
    const score = results.filter(r => r.correct).length;
    // Group results by word for cleaner display
    const byWord = {};
    results.forEach(r => {
      byWord[r.word] = byWord[r.word] || { word: r.word, definition: r.definition, meaning: null, usage: null };
      if (r.kind === 'meaning') byWord[r.word].meaning = r.correct;
      else byWord[r.word].usage = r.correct;
    });
    return (
      <ActivityShell user={user} title="Vocabulary" emoji="📚" color="from-sky-400 to-indigo-500" onBack={() => setScreen('home')}>
        <ResultsCard
          theme={theme}
          color="from-sky-400 to-indigo-500"
          title="Vocabulary finished!" score={score} total={20}
          items={Object.values(byWord).map(w => ({
            ok: w.meaning && w.usage,
            label: <span>
              <b>{w.word}</b>: {w.definition}
              <span className="ml-2 text-xs">
                {w.meaning ? '✅' : '❌'} meaning · {w.usage ? '✅' : '❌'} usage
              </span>
            </span>
          }))}
          onDone={() => setScreen('home')}
        />
      </ActivityShell>
    );
  }

  const q = questions[step];
  return (
    <ActivityShell user={user} title="Vocabulary" emoji="📚" color="from-sky-400 to-indigo-500"
      onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={step} total={questions.length}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in" key={step}>
        <div className="text-center mb-6">
          <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">
            {q.kind === 'meaning' ? 'What does this word mean?' : 'Which word fits the sentence?'}
          </div>
          {q.kind === 'meaning' ? (
            <div className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">{q.word}</div>
          ) : (
            <div className="font-display text-xl md:text-3xl text-gray-800 leading-relaxed px-2">
              {q.sentence.split('{BLANK}').map((seg, i, arr) => (
                <React.Fragment key={i}>
                  {seg}
                  {i < arr.length - 1 && <span className="inline-block mx-2 px-6 py-1 bg-sky-100 border-b-4 border-sky-400 rounded">_____</span>}
                </React.Fragment>
              ))}
            </div>
          )}
          <button onClick={() => { sfx.pop(); speakWord(q.word); }} className="mt-3 text-sky-600 text-sm font-semibold flex items-center gap-1 mx-auto"><Volume2 className="w-4 h-4" /> Hear "{q.word}"</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {q.options.map((opt, idx) => {
            const isPicked = picked === idx;
            const isCorrect = idx === q.correct;
            const showState = picked !== null;
            let cls = 'bg-sky-50 border-sky-200 hover:bg-sky-100';
            if (showState && isCorrect) cls = 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200';
            else if (showState && isPicked && !isCorrect) cls = 'bg-rose-100 border-rose-400 ring-4 ring-rose-200';
            else if (showState) cls = 'bg-gray-50 border-gray-200 opacity-60';
            return (
              <button key={idx} disabled={picked !== null} onClick={() => choose(idx)}
                className={`pressable text-left p-5 rounded-2xl border-4 text-base md:text-lg font-semibold text-gray-700 ${cls}`}>
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-display text-sky-600 flex-shrink-0">{String.fromCharCode(65 + idx)}</span>
                  <span className="flex-1">{opt}</span>
                  {showState && isCorrect && <Check className="w-6 h-6 text-emerald-600" />}
                  {showState && isPicked && !isCorrect && <X className="w-6 h-6 text-rose-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   WRITING — 10 sentences, rich feedback
   ============================================================ */
function WritingActivity({ user, currentDay, saveActivity, setScreen }) {
  const prompt = useMemo(() => getWritingPrompt(currentDay), [currentDay]);
  const theme = THEME[user];
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Save & resume
  const R = useResumable('writing', user, currentDay);
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && !text) {
      const s = R.saved.state;
      if (typeof s.text === 'string') setText(s.text);
    }
  // eslint-disable-next-line
  }, [R.phase]);
  function saveAndExit() { sfx.pop(); R.save({ text }); setScreen('home'); }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function submit() {
    setLoading(true);
    const fb = await aiCall('writing-feedback', { prompt, response: text, childName: user });
    const finalFb = (fb && typeof fb.grade === 'number') ? fb : heuristicWritingFeedback(text);
    setFeedback(finalFb);
    await saveActivity(currentDay, 'writing', finalFb.grade, { prompt, response: text, feedback: finalFb });
    R.clear();
    finalFb.grade >= 8 ? sfx.celebration() : sfx.fanfare();
    setLoading(false);
  }

  if (feedback) {
    return (
      <ActivityShell user={user} title="Writing" emoji="✏️" color="from-emerald-400 to-green-600" onBack={() => setScreen('home')}>
        <div className="bg-white kid-shadow rounded-[2rem] p-6 md:p-8 pop-in relative overflow-hidden">
          {feedback.grade >= 6 && <Confetti avaTheme={user === 'Ava'} />}

          {/* Grade header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">{feedback.grade >= 8 ? '🌟' : feedback.grade >= 6 ? '🎉' : '💪'}</div>
            <div className="font-display text-2xl font-bold text-gray-800 mb-1">Your grade</div>
            <div className="font-display text-7xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
              {feedback.grade}<span className="text-3xl text-gray-400">/10</span>
            </div>
          </div>

          {/* Short, kid-friendly feedback — 3-4 lines total */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-4 border-emerald-200 rounded-2xl p-5 md:p-6 space-y-3 text-gray-800 text-left">
            {feedback.praise && (
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">⭐</div>
                <div className="leading-relaxed"><span className="font-bold text-emerald-700">Well done: </span>{feedback.praise}</div>
              </div>
            )}
            {feedback.suggestion && (
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">✨</div>
                <div className="leading-relaxed"><span className="font-bold text-sky-700">Try next time: </span>{feedback.suggestion}</div>
              </div>
            )}
            {feedback.idea && (
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">💡</div>
                <div className="leading-relaxed"><span className="font-bold text-violet-700">Idea for your story: </span>{feedback.idea}</div>
              </div>
            )}
          </div>

          {feedback.cheer && (
            <div className={`mt-4 rounded-2xl p-4 text-center font-display text-lg ${theme.pill}`}>
              {feedback.cheer}
            </div>
          )}

          <div className="text-center mt-8">
            <button onClick={() => { sfx.pop(); setScreen('home'); }} className="pressable px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-display font-bold text-xl kid-shadow">Back to Home</button>
          </div>
        </div>
      </ActivityShell>
    );
  }

  if (R.phase === 'loading') {
    return <ActivityShell user={user} title="Writing" emoji="✏️" color="from-emerald-400 to-green-600" onBack={() => setScreen('home')}><div className="bg-white rounded-[2rem] p-10 text-center"><div className="text-5xl mb-3 floaty">✏️</div><div className="text-gray-500">Loading…</div></div></ActivityShell>;
  }
  if (R.phase === 'prompt' && R.saved) {
    const s = R.saved.state || {};
    const wc = s.text ? s.text.trim().split(/\s+/).filter(Boolean).length : 0;
    return <ResumePrompt user={user} title="Writing" emoji="✏️" color="from-emerald-400 to-green-600"
      savedAt={R.saved.savedAt} stepInfo={`Saved draft · ${wc} words so far`}
      onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />;
  }

  return (
    <ActivityShell user={user} title="Writing" emoji="✏️" color="from-emerald-400 to-green-600"
      onBack={() => setScreen('home')} onSaveExit={saveAndExit}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 pop-in">
        <div className="uppercase tracking-widest text-xs text-emerald-600 font-semibold mb-2">Today's prompt</div>
        <div className="font-display text-2xl md:text-3xl text-gray-800 mb-5 leading-snug">"{prompt}"</div>
        <div className="text-sm text-gray-500 mb-3">Write at least <b>10 sentences</b>. Remember capital letters and full stops!</div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start writing here…" rows={12} disabled={loading}
          className="w-full p-5 rounded-2xl t-input text-lg leading-relaxed resize-y" />
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="text-sm text-gray-600 font-semibold">
            <span className="mr-3">📝 {words} words</span>
            <span className="mr-3">📏 {sentences} sentences</span>
            {sentences >= 10 && <span className="text-emerald-600">✓ ready</span>}
          </div>
          <button onClick={submit} disabled={words < 20 || loading}
            className="pressable px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-display font-bold text-lg kid-shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            {loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Getting feedback…</> : <><Send className="w-5 h-5" /> Send for feedback</>}
          </button>
        </div>
        {words < 20 && !loading && (<div className="text-xs text-gray-400 mt-2 text-right">Write a bit more first (at least 20 words)</div>)}
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   MATH — with AI explanations for wrong answers
   ============================================================ */
function MathActivity({ user, progress, currentDay, saveActivity, setScreen }) {
  const userProgress = progress[user] || {};
  const tierOffset = useMemo(() => tierOffsetFor(userProgress, 'math', currentDay), [userProgress, currentDay]);
  const problems = useMemo(() => getMathProblems(currentDay, tierOffset), [currentDay, tierOffset]);
  const theme = THEME[user];
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [explanations, setExplanations] = useState({}); // question -> full explanation object
  const [mistake, setMistake] = useState(null); // {question, correct, given, explanation?}
  const [loadingExplain, setLoadingExplain] = useState(false);
  const inputRef = useRef(null);

  // Save & resume
  const R = useResumable('math', user, currentDay);
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && step === 0 && results.length === 0) {
      const s = R.saved.state;
      if (Array.isArray(s.results)) setResults(s.results);
      if (typeof s.step === 'number') setStep(s.step);
      if (s.explanations) setExplanations(s.explanations);
    }
  // eslint-disable-next-line
  }, [R.phase]);
  function saveAndExit() { sfx.pop(); R.save({ step, results, explanations }); setScreen('home'); }

  useEffect(() => { if (!done && !mistake) { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 100); return () => clearTimeout(t); } }, [step, done, mistake]);

  async function submit(e) {
    e && e.preventDefault();
    if (input === '' || isNaN(Number(input))) return;
    const p = problems[step];
    const given = Number(input);
    const correct = given === p.answer;
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...results, { question: p.question, correct, answer: given, truth: p.answer }];
    setResults(newResults);

    if (correct) {
      // Correct — quick advance
      setTimeout(() => {
        setInput('');
        if (step + 1 >= problems.length) {
          const score = newResults.filter(r => r.correct).length;
          saveActivity(currentDay, 'math', score, { answers: newResults });
          R.clear();
          setDone(true);
          if (score === 10) sfx.celebration(); else sfx.fanfare();
        } else { setStep(step + 1); }
      }, 600);
    } else {
      // Show the working screen immediately — fetch explanation
      setMistake({ question: p.question, correct: p.answer, given });
      setLoadingExplain(true);
      const res = await aiCall('math-explain', { question: p.question, correct: p.answer, given, childName: user });
      setLoadingExplain(false);
      if (res && Array.isArray(res.steps)) {
        setExplanations(e => ({ ...e, [p.question]: res }));
        setMistake(m => m ? ({ ...m, explanation: res }) : m);
      } else {
        // Fallback structure
        const fallback = {
          opening: 'That was a tricky one!',
          steps: [`The answer is ${p.answer}.`],
          tip: 'Try working it out step by step.',
          finalAnswer: `So the answer is ${p.answer}.`
        };
        setExplanations(e => ({ ...e, [p.question]: fallback }));
        setMistake(m => m ? ({ ...m, explanation: fallback }) : m);
      }
    }
  }

  function continueAfterMistake() {
    sfx.pop();
    setMistake(null);
    setInput('');
    if (step + 1 >= problems.length) {
      const score = results.filter(r => r.correct).length;
      saveActivity(currentDay, 'math', score, { answers: results });
      R.clear();
      setDone(true);
      if (score === 10) sfx.celebration(); else sfx.fanfare();
    } else { setStep(step + 1); }
  }

  // ---- SAVE-RESUME PROMPT ----
  if (R.phase === 'loading') {
    return <ActivityShell user={user} title="Maths" emoji="🧮" color="from-violet-400 to-purple-600" onBack={() => setScreen('home')}><div className="bg-white rounded-[2rem] p-10 text-center"><div className="text-5xl mb-3 floaty">🧮</div><div className="text-gray-500">Loading…</div></div></ActivityShell>;
  }
  if (R.phase === 'prompt' && R.saved) {
    const s = R.saved.state || {};
    const info = typeof s.step === 'number' ? `On question ${Math.min(s.step + 1, problems.length)} of ${problems.length}` : null;
    return <ResumePrompt user={user} title="Maths" emoji="🧮" color="from-violet-400 to-purple-600"
      savedAt={R.saved.savedAt} stepInfo={info}
      onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />;
  }

  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
      <ActivityShell user={user} title="Maths" emoji="🧮" color="from-violet-400 to-purple-600" onBack={() => setScreen('home')}>
        <ResultsCard
          theme={theme}
          color="from-violet-400 to-purple-600"
          title="Maths finished!" score={score} total={10}
          items={results.map(r => ({
            ok: r.correct,
            label: r.correct
              ? <span>{r.question} = <b>{r.truth}</b></span>
              : <span>
                  {r.question} = <b>{r.truth}</b> <span className="text-rose-500 text-sm">(you said {r.answer})</span>
                  {explanations[r.question] && (
                    <div className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded-lg">
                      {explanations[r.question].steps && explanations[r.question].steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 mb-0.5"><b className="text-violet-600">{i+1}.</b> <span>{s}</span></div>
                      ))}
                    </div>
                  )}
                </span>
          }))}
          onDone={() => setScreen('home')}
        />
      </ActivityShell>
    );
  }

  // ---- MISTAKE WORKING SCREEN ----
  if (mistake) {
    const ex = mistake.explanation;
    return (
      <ActivityShell user={user} title="Let's work it out" emoji="🧮" color="from-violet-400 to-purple-600"
        onBack={() => setScreen('home')} step={step} total={problems.length}>
        <div className="bg-white kid-shadow rounded-[2rem] p-6 md:p-8 pop-in">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🧠</div>
            <div className="font-display text-2xl md:text-3xl text-gray-800">Let's work this one out together</div>
          </div>

          {/* Question + their answer vs correct */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-5">
            <div className="bg-gray-50 px-5 py-3 rounded-2xl">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">Question</div>
              <div className="font-display text-3xl font-bold text-gray-800">{mistake.question}</div>
            </div>
            <div className="bg-rose-50 px-4 py-3 rounded-2xl border-2 border-rose-100">
              <div className="text-xs uppercase tracking-wider text-rose-600 font-bold">You said</div>
              <div className="font-display text-3xl font-bold text-rose-500"><s>{mistake.given}</s></div>
            </div>
            <div className="bg-emerald-50 px-4 py-3 rounded-2xl border-2 border-emerald-200">
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Answer</div>
              <div className="font-display text-3xl font-bold text-emerald-600">{mistake.correct}</div>
            </div>
          </div>

          {loadingExplain && !ex && (
            <div className="text-center text-gray-500 italic py-6">
              <div className="text-3xl mb-2 floaty">💭</div>
              Working out how to explain this…
            </div>
          )}

          {ex && (
            <>
              {ex.opening && <div className="text-center text-gray-700 italic mb-4">{ex.opening}</div>}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 mb-4 border-2 border-violet-100">
                <div className="font-display text-lg font-bold text-violet-900 mb-3">Step-by-step working:</div>
                {ex.steps && ex.steps.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 text-white font-bold flex items-center justify-center">{i+1}</div>
                    <div className="pt-1 text-gray-800 text-lg flex-1">{s}</div>
                  </div>
                ))}
                {ex.finalAnswer && <div className="mt-3 pt-3 border-t-2 border-violet-200 font-display text-xl font-bold text-violet-800 text-center">{ex.finalAnswer}</div>}
              </div>

              {ex.whyWrong && (
                <div className="bg-amber-50 rounded-2xl p-4 mb-3 border-l-4 border-amber-400">
                  <div className="text-xs uppercase tracking-wider font-bold text-amber-800 mb-1">Easy mistake to avoid</div>
                  <div className="text-gray-700">{ex.whyWrong}</div>
                </div>
              )}

              {ex.tip && (
                <div className="bg-sky-50 rounded-2xl p-4 mb-4 border-l-4 border-sky-400">
                  <div className="text-xs uppercase tracking-wider font-bold text-sky-800 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Remember this trick
                  </div>
                  <div className="text-gray-700">{ex.tip}</div>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-5">
            <button onClick={continueAfterMistake}
              className="pressable px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-400 to-purple-600 text-white font-display font-bold text-lg kid-shadow">
              Got it — next question →
            </button>
          </div>
        </div>
      </ActivityShell>
    );
  }

  // ---- NORMAL QUESTION VIEW ----
  const p = problems[step];
  return (
    <ActivityShell user={user} title="Maths" emoji="🧮" color="from-violet-400 to-purple-600"
      onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={step} total={problems.length}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-12 text-center pop-in">
        <div className="font-display text-6xl md:text-8xl font-bold text-gray-800 mb-2 tracking-tight">{p.question}</div>
        <div className="text-3xl md:text-4xl text-gray-400 font-display mb-6">= ?</div>
        <form onSubmit={submit} className="max-w-xs mx-auto">
          <input ref={inputRef} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off"
            value={input} onChange={e => setInput(e.target.value.replace(/[^\d\-]/g, ''))}
            className="w-full text-center font-display text-5xl md:text-6xl p-5 rounded-2xl t-input" placeholder="?" />
          <button type="submit" disabled={input === ''}
            className="pressable mt-5 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-400 to-purple-600 text-white font-display font-bold text-xl kid-shadow disabled:opacity-40">
            {step + 1 === problems.length ? 'Finish ✓' : 'Next →'}
          </button>
        </form>
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   READING — story with narration + highlight + comprehension quiz
   ============================================================ */
function ReadingActivity({ user, currentDay, saveActivity, setScreen }) {
  const theme = THEME[user];
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('reading'); // reading | quiz | done
  const [playing, setPlaying] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [storyWords, setStoryWords] = useState([]);
  const [quizStep, setQuizStep] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [picked, setPicked] = useState(null);
  const timerRef = useRef(null);
  const utteranceRef = useRef(null);

  // Save & resume — reading saves phase (story vs quiz) + quiz progress
  const R = useResumable('reading', user, currentDay);
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && phase === 'reading' && quizStep === 0 && quizResults.length === 0) {
      const s = R.saved.state;
      if (s.phase) setPhase(s.phase);
      if (Array.isArray(s.quizResults)) setQuizResults(s.quizResults);
      if (typeof s.quizStep === 'number') setQuizStep(s.quizStep);
    }
  // eslint-disable-next-line
  }, [R.phase]);
  function saveAndExit() { sfx.pop(); stopSpeaking(); R.save({ phase, quizStep, quizResults }); setScreen('home'); }

  useEffect(() => { loadStory(); return () => { stopSpeaking(); if (timerRef.current) clearInterval(timerRef.current); }; }, []);
  async function loadStory() {
    setLoading(true);
    // 1) check cache
    let s = await getCachedStory(currentDay);
    // 2) fallback hardcoded for first N days if no cache
    if (!s && currentDay <= FALLBACK_STORIES.length) {
      s = FALLBACK_STORIES[currentDay - 1];
    }
    // 3) generate via API
    if (!s) {
      const generated = await aiCall('generate-story', { day: currentDay });
      if (generated && generated.story && Array.isArray(generated.questions)) {
        s = generated;
        cacheStory(currentDay, s); // share with sister
      }
    }
    // 4) absolute fallback — cycle through hardcoded
    if (!s) s = FALLBACK_STORIES[(currentDay - 1) % FALLBACK_STORIES.length];

    setStory(s);
    setStoryWords(s.story.split(/(\s+)/));
    setLoading(false);
  }

  function startReading() {
    if (!story) return;
    stopSpeaking(); if (timerRef.current) clearInterval(timerRef.current);
    const fullText = story.story;
    setCurrentWordIdx(0); setPlaying(true);

    // Build a map of character offset -> word index in the displayed text
    // so we can use the utterance's onboundary event to highlight the correct
    // word as the TTS engine actually speaks it.
    const wordOffsets = []; // charIndex at the start of each word
    {
      let i = 0, inWord = false, wIdx = 0;
      while (i < fullText.length) {
        const ch = fullText[i];
        if (/\s/.test(ch)) inWord = false;
        else if (!inWord) { wordOffsets.push({ char: i, wordIdx: wIdx++ }); inWord = true; }
        i++;
      }
    }

    function findWordIdxForChar(charIdx) {
      // Linear scan — lists are short enough that binary search isn't needed
      let lastMatch = 0;
      for (let i = 0; i < wordOffsets.length; i++) {
        if (wordOffsets[i].char <= charIdx) lastMatch = wordOffsets[i].wordIdx;
        else break;
      }
      return lastMatch;
    }

    utteranceRef.current = speak(fullText, {
      rate: 0.88, pitch: 1.04, narration: true,
      onboundary: (ev) => {
        // Fires for each word or sentence boundary during speech.
        // ev.charIndex is offset within the utterance text.
        if (ev && ev.name === 'word' && typeof ev.charIndex === 'number') {
          setCurrentWordIdx(findWordIdxForChar(ev.charIndex));
        }
      },
      onend: () => {
        setPlaying(false);
        setCurrentWordIdx(-1);
      },
      onerror: () => {
        setPlaying(false);
        setCurrentWordIdx(-1);
      }
    });

    // Safari iOS does not reliably fire onboundary events for long text. Fall
    // back to a gentle per-word timer that is paused when onboundary fires.
    const totalWords = fullText.split(/\s+/).length;
    const estSeconds = Math.max(90, totalWords / 2.4); // ~144 wpm
    const perWordMs = (estSeconds * 1000) / totalWords;
    let lastBoundaryAt = Date.now();
    utteranceRef.current && (utteranceRef.current._origBoundary = utteranceRef.current.onboundary);
    if (utteranceRef.current) {
      utteranceRef.current.onboundary = (ev) => {
        lastBoundaryAt = Date.now();
        if (ev && ev.name === 'word' && typeof ev.charIndex === 'number') {
          setCurrentWordIdx(findWordIdxForChar(ev.charIndex));
        }
      };
    }
    timerRef.current = setInterval(() => {
      // Only advance if onboundary hasn't fired recently (Safari fallback)
      if (Date.now() - lastBoundaryAt > perWordMs * 1.6) {
        setCurrentWordIdx(idx => {
          if (idx < 0) return 0;
          if (idx >= totalWords - 1) { clearInterval(timerRef.current); timerRef.current = null; return idx; }
          return idx + 1;
        });
      }
    }, perWordMs);
  }
  function pauseReading() {
    try { window.speechSynthesis.pause(); } catch (e) {}
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
  }
  function resumeReading() {
    try { window.speechSynthesis.resume(); setPlaying(true); } catch (e) { startReading(); }
  }
  function restart() { stopSpeaking(); if (timerRef.current) clearInterval(timerRef.current); setCurrentWordIdx(-1); setPlaying(false); }

  function choose(idx) {
    if (picked !== null) return;
    setPicked(idx);
    const q = story.questions[quizStep];
    const correct = idx === q.correct;
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...quizResults, { ...q, chosen: q.options[idx], correct }];
    setTimeout(() => {
      setPicked(null); setQuizResults(newResults);
      if (quizStep + 1 >= story.questions.length) {
        const score = newResults.filter(r => r.correct).length;
        saveActivity(currentDay, 'reading', score, { title: story.title, answers: newResults });
        R.clear();
        setPhase('done');
        if (score === story.questions.length) sfx.celebration(); else sfx.fanfare();
      } else { setQuizStep(quizStep + 1); }
    }, 1200);
  }

  if (loading) {
    return (
      <ActivityShell user={user} title="Reading" emoji="📖" color="from-rose-400 to-red-500" onBack={() => setScreen('home')}>
        <div className="bg-white kid-shadow rounded-[2rem] p-10 text-center">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-3 text-rose-500" />
          <div className="font-display text-xl text-gray-700">Fetching today's story…</div>
        </div>
      </ActivityShell>
    );
  }

  // ---- SAVE-RESUME PROMPT (shown AFTER story loaded, BEFORE regular UI) ----
  if (R.phase === 'prompt' && R.saved) {
    const s = R.saved.state || {};
    const info = s.phase === 'quiz' ? `In the quiz · question ${Math.min((s.quizStep || 0) + 1, (story ? story.questions.length : 4))} of ${(story ? story.questions.length : 4)}` : 'Story in progress';
    return <ResumePrompt user={user} title="Reading" emoji="📖" color="from-rose-400 to-red-500"
      savedAt={R.saved.savedAt} stepInfo={info}
      onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />;
  }

  if (phase === 'done') {
    const score = quizResults.filter(r => r.correct).length;
    return (
      <ActivityShell user={user} title="Reading" emoji="📖" color="from-rose-400 to-red-500" onBack={() => setScreen('home')}>
        <ResultsCard
          theme={theme}
          color="from-rose-400 to-red-500"
          title={`"${story.title}"`}
          score={score} total={story.questions.length}
          items={quizResults.map(r => ({ ok: r.correct, label: <span>{r.q}<br /><b>Answer:</b> {r.options[r.correct]}</span> }))}
          onDone={() => setScreen('home')}
        />
      </ActivityShell>
    );
  }

  if (phase === 'quiz') {
    const q = story.questions[quizStep];
    return (
      <ActivityShell user={user} title="Comprehension" emoji="🧠" color="from-rose-400 to-red-500"
        onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={quizStep} total={story.questions.length}>
        <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in" key={quizStep}>
          <div className="text-center mb-6">
            <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold mb-2">Question {quizStep + 1} of {story.questions.length}</div>
            <div className="font-display text-xl md:text-2xl text-gray-800 leading-snug">{q.q}</div>
          </div>
          <div className="grid gap-3">
            {q.options.map((opt, idx) => {
              const isPicked = picked === idx;
              const isCorrect = idx === q.correct;
              const showState = picked !== null;
              let cls = 'bg-rose-50 border-rose-200 hover:bg-rose-100';
              if (showState && isCorrect) cls = 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200';
              else if (showState && isPicked && !isCorrect) cls = 'bg-rose-100 border-rose-400 ring-4 ring-rose-200';
              else if (showState) cls = 'bg-gray-50 border-gray-200 opacity-60';
              return (
                <button key={idx} disabled={picked !== null} onClick={() => choose(idx)}
                  className={`pressable text-left p-5 rounded-2xl border-4 text-base md:text-lg font-semibold text-gray-700 ${cls}`}>
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-display text-rose-600 flex-shrink-0">{String.fromCharCode(65 + idx)}</span>
                    <span className="flex-1">{opt}</span>
                    {showState && isCorrect && <Check className="w-6 h-6 text-emerald-600" />}
                    {showState && isPicked && !isCorrect && <X className="w-6 h-6 text-rose-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ActivityShell>
    );
  }

  // Reading phase
  let wordCounter = -1;
  return (
    <ActivityShell user={user} title="Reading" emoji="📖" color="from-rose-400 to-red-500" onBack={() => setScreen('home')} onSaveExit={saveAndExit}>
      <div className="bg-white kid-shadow rounded-[2rem] p-6 md:p-10 pop-in">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <div className="text-gray-500 uppercase tracking-widest text-xs font-semibold">Today's story</div>
            <div className="font-display text-2xl md:text-3xl font-bold text-gray-800">{story.title}</div>
          </div>
          <div className="flex gap-2">
            {!playing ? (
              <button onClick={currentWordIdx >= 0 ? resumeReading : startReading} className="pressable px-5 py-3 rounded-2xl bg-rose-500 text-white font-display font-bold flex items-center gap-2 kid-shadow">
                <Play className="w-5 h-5" /> {currentWordIdx >= 0 ? 'Resume' : 'Listen & Read'}
              </button>
            ) : (
              <button onClick={pauseReading} className="pressable px-5 py-3 rounded-2xl bg-amber-500 text-white font-display font-bold flex items-center gap-2 kid-shadow">
                <Pause className="w-5 h-5" /> Pause
              </button>
            )}
            {currentWordIdx >= 0 && (
              <button onClick={restart} className="pressable px-4 py-3 rounded-2xl bg-white border-2 border-gray-200 font-semibold flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
            )}
          </div>
        </div>

        <div className="text-lg md:text-xl leading-relaxed text-gray-800 whitespace-pre-wrap bg-rose-50/40 p-5 rounded-2xl border-2 border-rose-100 min-h-[200px]" style={{fontFamily: "'Quicksand', sans-serif"}}>
          {storyWords.map((seg, i) => {
            if (/^\s+$/.test(seg)) return <span key={i}>{seg}</span>;
            wordCounter++;
            const isCurrent = wordCounter === currentWordIdx;
            return <span key={i} className={isCurrent ? 'reading-highlight' : ''}>{seg}</span>;
          })}
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => { stopSpeaking(); sfx.pop(); setPhase('quiz'); }}
            className="pressable px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-400 to-red-500 text-white font-display font-bold text-xl kid-shadow">
            I'm ready for the quiz →
          </button>
          <div className="text-xs text-gray-500 mt-2">You can listen to the story more than once before starting</div>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   v3: LESSON ACTIVITY — history / geography / science
   Pattern:
     - Load lesson (cache → hardcoded fallback → API → ultimate fallback)
     - Phase 'slides': narrated slide carousel with image or SVG animation,
                        plus "Watch on BBC Bitesize" button if hasVideo
     - Phase 'quiz': 10-question MCQ, like Reading comprehension
     - Phase 'done': show ResultsCard, record subject score
   ============================================================ */
/* ============================================================
   v3.3: Image fetch pipeline for lesson slides.
   Fallback chain:
     1. imageFallback (curated URL on the slide) - highest priority
     2. Wikipedia pageimages (exact page title lookup)
     3. Wikipedia search -> pageimages (fuzzy match)
     4. Wikimedia Commons search (broadest, always succeeds for common topics)
     5. Themed placeholder (no broken image icons)
   ============================================================ */

async function tryWikipediaPage(query) {
  try {
    const q = encodeURIComponent((query || '').trim().replace(/\s+/g, '_'));
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${q}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const json = await r.json();
    const pages = json && json.query && json.query.pages;
    const first = pages && Object.values(pages)[0];
    const thumb = first && first.thumbnail && first.thumbnail.source;
    return thumb || null;
  } catch (e) { return null; }
}

async function tryWikipediaSearch(query) {
  try {
    // First search Wikipedia for the query, then fetch pageimages for top result
    const q = encodeURIComponent(query || '');
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=1&format=json&origin=*`;
    const sr = await fetch(searchUrl);
    if (!sr.ok) return null;
    const sjson = await sr.json();
    const topHit = sjson && sjson.query && sjson.query.search && sjson.query.search[0];
    if (!topHit) return null;
    const title = topHit.title;
    const qTitle = encodeURIComponent(title.replace(/\s+/g, '_'));
    const piUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${qTitle}&prop=pageimages&format=json&pithumbsize=800&origin=*`;
    const pr = await fetch(piUrl);
    if (!pr.ok) return null;
    const pjson = await pr.json();
    const pages = pjson && pjson.query && pjson.query.pages;
    const first = pages && Object.values(pages)[0];
    const thumb = first && first.thumbnail && first.thumbnail.source;
    return thumb || null;
  } catch (e) { return null; }
}

async function tryCommonsSearch(query) {
  try {
    // Wikimedia Commons image search via generator=search + prop=imageinfo
    const q = encodeURIComponent(query || '');
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrlimit=1&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const json = await r.json();
    const pages = json && json.query && json.query.pages;
    if (!pages) return null;
    const first = Object.values(pages)[0];
    const info = first && first.imageinfo && first.imageinfo[0];
    // Prefer the scaled thumb, fall back to the original URL
    return (info && (info.thumburl || info.url)) || null;
  } catch (e) { return null; }
}

function SlideImage({ slide }) {
  const [url, setUrl] = useState(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false); setFailed(false); setUrl(null);

    async function go() {
      // 1. Curated fallback URL if present
      if (slide.imageFallback) {
        if (!cancelled) { setUrl(slide.imageFallback); setReady(true); }
        return;
      }
      const q = slide.imageQuery;
      if (!q) { if (!cancelled) { setReady(true); setFailed(true); } return; }

      // 2. Wikipedia direct page
      const a = await tryWikipediaPage(q);
      if (cancelled) return;
      if (a) { setUrl(a); setReady(true); return; }

      // 3. Wikipedia search → pageimages
      const b = await tryWikipediaSearch(q);
      if (cancelled) return;
      if (b) { setUrl(b); setReady(true); return; }

      // 4. Wikimedia Commons search
      const c = await tryCommonsSearch(q);
      if (cancelled) return;
      if (c) { setUrl(c); setReady(true); return; }

      // 5. All failed — show placeholder
      if (!cancelled) { setReady(true); setFailed(true); }
    }
    go();
    return () => { cancelled = true; };
  }, [slide.imageQuery, slide.imageFallback]);

  // Placeholder (loading or all fallbacks failed) — themed and pleasant, not broken-image
  if (!ready) {
    return (
      <div className="w-full h-64 md:h-80 rounded-3xl bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center">
        <div className="text-6xl opacity-40 floaty">🖼️</div>
      </div>
    );
  }
  if (failed || !url) {
    // Derive two nice initials for the placeholder
    const label = (slide.title || slide.imageQuery || 'lesson').split(/\s+/).slice(0, 3).join(' ');
    return (
      <div className="w-full h-64 md:h-80 rounded-3xl bg-gradient-to-br from-indigo-100 via-sky-100 to-emerald-100 flex flex-col items-center justify-center p-6">
        <div className="text-5xl mb-2">📚</div>
        <div className="font-display text-xl text-gray-600 text-center max-w-md">{label}</div>
      </div>
    );
  }
  return (
    <div className="w-full rounded-3xl overflow-hidden bg-gray-100 kid-shadow">
      <img src={url} alt={slide.imageQuery || slide.title}
        className="w-full h-64 md:h-80 object-cover"
        onError={() => { if (!failed) { setFailed(true); } }}
      />
    </div>
  );
}

/* ============================================================
   PUZZLES — 5 verbal + 5 non-verbal reasoning (11+ prep)
   ============================================================ */
function PuzzleActivity({ user, progress, currentDay, saveActivity, setScreen }) {
  const theme = THEME[user];

  // Adaptive tier offsets — invisible to kids
  const userProgress = progress[user] || {};
  const verbalOffset = useMemo(() => tierOffsetFor(userProgress, 'puzzles', currentDay), [userProgress, currentDay]);
  const nonverbalOffset = verbalOffset; // share the same offset for now

  const verbalQs = useMemo(() => getVerbalQuestionsForDay(currentDay, verbalOffset, 5), [currentDay, verbalOffset]);
  const nonverbalQs = useMemo(() => getNonVerbalQuestionsForDay(currentDay, nonverbalOffset, 5), [currentDay, nonverbalOffset]);
  const questions = useMemo(() => {
    // 5 verbal first, then 5 non-verbal
    return [
      ...verbalQs.map(q => ({ ...q, kind: 'verbal' })),
      ...nonverbalQs.map(q => ({ ...q, kind: 'nonverbal' }))
    ];
  }, [verbalQs, nonverbalQs]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  // Save & resume
  const R = useResumable('puzzles', user, currentDay);
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && step === 0 && results.length === 0) {
      const s = R.saved.state;
      if (Array.isArray(s.results)) setResults(s.results);
      if (typeof s.step === 'number') setStep(s.step);
    }
  // eslint-disable-next-line
  }, [R.phase]);
  function saveAndExit() { sfx.pop(); R.save({ step, results }); setScreen('home'); }

  function choose(idx) {
    if (picked !== null) return;
    setPicked(idx);
    const q = questions[step];
    const correct = idx === q.correct;
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...results, { kind: q.kind, type: q.type, question: q.question, chosen: idx, correctIdx: q.correct, correct, explain: q.explain }];
    setTimeout(() => {
      setPicked(null); setResults(newResults);
      if (step + 1 >= questions.length) {
        const score = newResults.filter(r => r.correct).length;
        saveActivity(currentDay, 'puzzles', score, { answers: newResults });
        R.clear();
        setDone(true);
        if (score === 10) sfx.celebration(); else sfx.fanfare();
      } else { setStep(step + 1); }
    }, 1600);
  }

  if (R.phase === 'loading') {
    return <ActivityShell user={user} title="Puzzles" emoji="🧠" color="from-indigo-400 to-fuchsia-500" onBack={() => setScreen('home')}>
      <div className="bg-white rounded-[2rem] p-10 text-center">
        <div className="text-5xl mb-3 floaty">🧠</div>
        <div className="text-gray-500">Loading…</div>
      </div>
    </ActivityShell>;
  }
  if (R.phase === 'prompt' && R.saved) {
    const s = R.saved.state || {};
    const info = typeof s.step === 'number' ? `On puzzle ${Math.min(s.step + 1, questions.length)} of ${questions.length}` : null;
    return <ResumePrompt user={user} title="Puzzles" emoji="🧠" color="from-indigo-400 to-fuchsia-500"
      savedAt={R.saved.savedAt} stepInfo={info}
      onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />;
  }

  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
      <ActivityShell user={user} title="Puzzles" emoji="🧠" color="from-indigo-400 to-fuchsia-500" onBack={() => setScreen('home')}>
        <div className={`rounded-[2rem] p-8 kid-shadow ${theme.gradient} text-white text-center relative overflow-hidden`}>
          {score >= 6 && <Confetti avaTheme={user === 'Ava'} count={50} />}
          <div className="relative">
            <div className="flex justify-center mb-4"><Mascot who={user} mood={score >= 6 ? 'happy' : 'idle'} size={110} /></div>
            <div className="font-display text-4xl font-bold mb-2">{score === 10 ? 'Perfect brain!' : score >= 8 ? 'Great thinking!' : score >= 5 ? 'Good work!' : 'Nice try!'}</div>
            <div className="font-display text-6xl font-bold my-3">{score}<span className="text-3xl opacity-80">/10</span></div>
            <div className="opacity-95">5 verbal + 5 non-verbal · keep practising!</div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-5 kid-shadow mt-5 max-h-96 overflow-auto">
          <div className="font-display text-lg text-gray-700 mb-3">Review</div>
          {results.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl mb-2 text-sm ${r.correct ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold">{i + 1}.</span>
                <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-500">{r.kind === 'verbal' ? '📖 Verbal' : '🔷 Non-verbal'}</span>
                {r.correct ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
              </div>
              <div className="text-gray-700">{r.question}</div>
              {!r.correct && r.explain && <div className="text-gray-500 italic mt-1">💡 {r.explain}</div>}
            </div>
          ))}
        </div>
        <button onClick={() => { sfx.pop(); setScreen('home'); }}
          className="mt-5 w-full pressable bg-white kid-shadow rounded-2xl p-4 font-display text-xl text-gray-700 flex items-center justify-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to home
        </button>
      </ActivityShell>
    );
  }

  const q = questions[step];
  const isVerbal = q.kind === 'verbal';
  const showState = picked !== null;

  return (
    <ActivityShell user={user} title="Puzzles" emoji="🧠" color="from-indigo-400 to-fuchsia-500" onBack={saveAndExit}>
      {/* Progress */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 bg-white rounded-full h-3 overflow-hidden kid-shadow">
          <div className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-500 transition-all" style={{ width: `${((step) / questions.length) * 100}%` }} />
        </div>
        <div className="font-display text-sm text-gray-600">{step + 1} / {questions.length}</div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-[2rem] p-6 md:p-7 kid-shadow mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold rounded-full px-3 py-1">
            {isVerbal ? '📖 Verbal' : '🔷 Non-verbal'}
          </span>
        </div>
        <div className="font-display text-xl md:text-2xl text-gray-800 mb-5">{q.question}</div>

        {/* Non-verbal: show the visual prompt */}
        {!isVerbal && q.showSequence && (
          <div className="flex items-center gap-3 justify-center mb-5 flex-wrap bg-gray-50 rounded-2xl p-4">
            {q.showSequence.map((svg, i) => (
              <React.Fragment key={i}>
                <div dangerouslySetInnerHTML={{ __html: svg }} />
                {i < q.showSequence.length - 1 && <div className="text-2xl text-gray-400">→</div>}
              </React.Fragment>
            ))}
            <div className="text-2xl text-gray-400">→</div>
            <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-3xl text-gray-300">?</div>
          </div>
        )}
        {!isVerbal && q.showAnalogy && (
          <div className="flex items-center gap-2 justify-center mb-5 flex-wrap bg-gray-50 rounded-2xl p-4">
            <div dangerouslySetInnerHTML={{ __html: q.showAnalogy.given1 }} />
            <div className="text-xl text-gray-400">is to</div>
            <div dangerouslySetInnerHTML={{ __html: q.showAnalogy.given2 }} />
            <div className="text-xl text-gray-400 mx-2">as</div>
            <div dangerouslySetInnerHTML={{ __html: q.showAnalogy.prompt }} />
            <div className="text-xl text-gray-400">is to</div>
            <div className="w-20 h-20 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-3xl text-gray-300">?</div>
          </div>
        )}
        {!isVerbal && q.showPrompt && (
          <div className="flex items-center justify-center mb-5 bg-gray-50 rounded-2xl p-4">
            <div dangerouslySetInnerHTML={{ __html: q.showPrompt }} />
          </div>
        )}

        {/* Verbal: hear-it button */}
        {isVerbal && (
          <button onClick={() => { sfx.pop(); speak(q.question); }}
            className="mb-3 text-indigo-600 text-sm font-semibold flex items-center gap-1">
            <Volume2 className="w-4 h-4" /> Hear the question
          </button>
        )}

        {/* Options */}
        <div className={`grid gap-3 ${isVerbal ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {q.options.map((opt, idx) => {
            const isPicked = picked === idx;
            const isCorrect = idx === q.correct;
            let cls = 'bg-white border-indigo-200 hover:border-indigo-400';
            if (showState && isCorrect) cls = 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200';
            else if (showState && isPicked && !isCorrect) cls = 'bg-rose-100 border-rose-400 ring-4 ring-rose-200';
            else if (showState) cls = 'bg-gray-50 border-gray-200 opacity-60';

            // Detect if option is SVG markup (starts with <svg)
            const isSvg = typeof opt === 'string' && opt.trim().startsWith('<svg');
            return (
              <button key={idx} disabled={picked !== null} onClick={() => choose(idx)}
                className={`pressable p-4 rounded-2xl border-4 font-semibold text-gray-700 flex items-center justify-center min-h-[90px] relative ${cls}`}>
                {isSvg ? (
                  <div dangerouslySetInnerHTML={{ __html: opt }} />
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <span className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center font-display text-indigo-700 flex-shrink-0 text-sm">{String.fromCharCode(65 + idx)}</span>
                    <span className="flex-1 text-left">{opt}</span>
                  </div>
                )}
                {showState && isCorrect && <Check className="w-6 h-6 text-emerald-600 absolute top-2 right-2" />}
                {showState && isPicked && !isCorrect && <X className="w-6 h-6 text-rose-600 absolute top-2 right-2" />}
              </button>
            );
          })}
        </div>

        {/* Explanation on wrong answer */}
        {showState && picked !== q.correct && q.explain && (
          <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-sm text-amber-900">
            <span className="font-semibold">💡 </span>{q.explain}
          </div>
        )}
      </div>
    </ActivityShell>
  );
}

function LessonActivity({ subject, user, currentDay, saveActivity, setScreen }) {
  const theme = THEME[user];
  const meta = SUBJECT_META[subject];
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('slides'); // slides | quiz | done
  const [slideIdx, setSlideIdx] = useState(0);
  const [narrating, setNarrating] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [picked, setPicked] = useState(null);
  const [showCheer, setShowCheer] = useState(false);

  // Save & resume — keyed per subject
  const R = useResumable(`lesson-${subject}`, user, currentDay);
  useEffect(() => {
    if (R.phase === 'ready' && R.saved && R.saved.state && phase === 'slides' && slideIdx === 0 && quizStep === 0 && quizResults.length === 0) {
      const s = R.saved.state;
      if (s.phase) setPhase(s.phase);
      if (typeof s.slideIdx === 'number') setSlideIdx(s.slideIdx);
      if (typeof s.quizStep === 'number') setQuizStep(s.quizStep);
      if (Array.isArray(s.quizResults)) setQuizResults(s.quizResults);
    }
  // eslint-disable-next-line
  }, [R.phase]);
  function saveAndExit() { sfx.pop(); stopSpeaking(); R.save({ phase, slideIdx, quizStep, quizResults }); setScreen('home'); }

  useEffect(() => {
    load();
    return () => stopSpeaking();
    // eslint-disable-next-line
  }, [subject, currentDay]);

  async function load() {
    setLoading(true);
    // 1) Shared cache (both sisters see the same lesson)
    let L = await getCachedLesson(subject, currentDay);
    // 2) Hardcoded fallback for early days
    if (!L) {
      const hc = hardcodedLessonFor(subject, currentDay);
      if (hc) L = hc;
    }
    // 3) Generate via API
    if (!L) {
      const generated = await aiCall('generate-lesson', {
        subject, day: currentDay,
        topic: lessonTopicFor(subject, currentDay),
        brief: lessonBriefFor(subject, currentDay),
        targetYear: targetYearFor(currentDay)
      });
      if (generated && generated.slides && generated.questions) {
        L = generated;
        cacheLesson(subject, currentDay, L);
      }
    }
    // 4) Absolute fallback — cycle through hardcoded for this subject
    if (!L) {
      for (let d = 1; d <= 15; d++) {
        const hc = hardcodedLessonFor(subject, ((currentDay - 1) % 15) + 1);
        if (hc) { L = hc; break; }
      }
    }
    setLesson(L);
    setLoading(false);
  }

  function narrate(text) {
    stopSpeaking();
    setNarrating(true);
    speak(text, { rate: 0.88, pitch: 1.04, narration: true, onend: () => setNarrating(false) });
  }
  function stopNarration() { stopSpeaking(); setNarrating(false); }

  function nextSlide() {
    stopNarration();
    if (!lesson) return;
    if (slideIdx < lesson.slides.length - 1) setSlideIdx(i => i + 1);
    else setPhase('quiz');
  }
  function prevSlide() {
    stopNarration();
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  }

  function openBitesize() {
    if (!lesson) return;
    // Prefer a direct URL if provided (curated per-lesson)
    if (lesson.bitesizeUrl) { window.open(lesson.bitesizeUrl, '_blank', 'noopener'); return; }
    // Fall back to BBC Bitesize's own internal search (NOT Google)
    const q = encodeURIComponent(lesson.bitesizeQuery || lesson.title || '');
    window.open(`https://www.bbc.co.uk/bitesize/search?q=${q}`, '_blank', 'noopener');
  }

  function pickAnswer(i) {
    if (picked !== null) return;
    const q = lesson.questions[quizStep];
    const isRight = i === q.correct;
    if (isRight) sfx.ding(); else sfx.aww();
    setPicked(i);
    setShowCheer(true);
    const newResults = [...quizResults, { q: q.q, your: i, correct: q.correct, right: isRight, cheer: q.cheer }];
    setQuizResults(newResults);
    setTimeout(() => {
      setShowCheer(false);
      setPicked(null);
      if (quizStep < lesson.questions.length - 1) {
        setQuizStep(s => s + 1);
      } else {
        const score = newResults.filter(r => r.right).length;
        saveActivity(currentDay, subject, score, { subject, topic: lesson.title });
        R.clear();
        setPhase('done');
      }
    }, 1400);
  }

  if (loading) {
    return (
      <ActivityShell user={user} title={meta.name} emoji={meta.emoji} color={`from-gray-300 to-gray-400`} onBack={() => setScreen('home')}>
        <div className="bg-white rounded-[2rem] p-10 kid-shadow text-center">
          <div className="text-6xl mb-4 floaty">{meta.emoji}</div>
          <div className="font-display text-2xl text-gray-700">Preparing your {meta.name.toLowerCase()} lesson…</div>
        </div>
      </ActivityShell>
    );
  }

  if (!lesson) {
    return (
      <ActivityShell user={user} title={meta.name} emoji={meta.emoji} color={`from-gray-300 to-gray-400`} onBack={() => setScreen('home')}>
        <div className="bg-white rounded-[2rem] p-10 kid-shadow text-center">
          <div className="text-6xl mb-4">😟</div>
          <div className="font-display text-2xl text-gray-700">Couldn't load today's lesson. Please try again later.</div>
          <button onClick={() => setScreen('home')} className="mt-6 px-8 py-3 rounded-2xl bg-gray-800 text-white font-display font-bold">Back</button>
        </div>
      </ActivityShell>
    );
  }

  // ---- SAVE-RESUME PROMPT ----
  const gradColForPrompt = subject === 'history' ? 'from-amber-400 to-orange-600'
                         : subject === 'geography' ? 'from-sky-400 to-cyan-600'
                         : 'from-violet-400 to-fuchsia-600';
  if (R.phase === 'prompt' && R.saved) {
    const s = R.saved.state || {};
    const info = s.phase === 'quiz' ? `In the quiz · question ${Math.min((s.quizStep || 0) + 1, lesson.questions.length)} of ${lesson.questions.length}`
              : typeof s.slideIdx === 'number' ? `On slide ${Math.min(s.slideIdx + 1, lesson.slides.length)} of ${lesson.slides.length}`
              : null;
    return <ResumePrompt user={user} title={meta.name} emoji={meta.emoji} color={gradColForPrompt}
      savedAt={R.saved.savedAt} stepInfo={info}
      onResume={R.resume} onStartOver={R.startOver} onBack={() => setScreen('home')} />;
  }

  const gradCol = subject === 'history' ? 'from-amber-400 to-orange-600'
                : subject === 'geography' ? 'from-sky-400 to-cyan-600'
                : 'from-violet-400 to-fuchsia-600';

  if (phase === 'done') {
    const score = quizResults.filter(r => r.right).length;
    return (
      <ActivityShell user={user} title={meta.name} emoji={meta.emoji} color={gradCol} onBack={() => setScreen('home')}>
        <ResultsCard
          theme={theme}
          color={gradCol}
          title={`${meta.name} · ${lesson.title}`}
          score={score}
          total={lesson.questions.length}
          items={quizResults.map((r, i) => ({ label: `Q${i+1}`, correct: r.right }))}
          onDone={() => setScreen('home')}
        />
      </ActivityShell>
    );
  }

  if (phase === 'quiz') {
    const q = lesson.questions[quizStep];
    const isLast = quizStep === lesson.questions.length - 1;
    return (
      <ActivityShell user={user} title={`${meta.name} quiz`} emoji={meta.emoji} color={gradCol}
        onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={quizStep + 1} total={lesson.questions.length}>
        <div className="bg-white rounded-[2rem] p-6 md:p-10 kid-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">{meta.name}</div>
              <div className="font-display text-lg text-gray-800">{lesson.title}</div>
            </div>
          </div>
          <div className="font-display text-2xl md:text-3xl text-gray-800 mb-6">{q.q}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = i === q.correct;
              const show = picked !== null;
              let cls = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-800';
              if (show && isCorrect) cls = 'bg-emerald-500 border-emerald-600 text-white';
              else if (show && isPicked && !isCorrect) cls = 'bg-red-500 border-red-600 text-white';
              else if (show) cls = 'bg-gray-50 border-gray-200 text-gray-400';
              return (
                <button key={i} onClick={() => pickAnswer(i)} disabled={picked !== null}
                  className={`pressable ${cls} rounded-2xl p-4 text-left font-semibold text-lg transition-all`}>
                  <span className="inline-block w-7 h-7 rounded-full bg-white/60 text-gray-700 text-center font-bold mr-3 leading-7">{String.fromCharCode(65+i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {showCheer && picked !== null && (
            <div className={`mt-5 text-center font-display text-xl ${picked === q.correct ? 'text-emerald-600' : 'text-red-600'}`}>
              {picked === q.correct ? `✨ ${q.cheer || 'Great job!'}` : `💪 The answer was: ${q.options[q.correct]}`}
            </div>
          )}
          <div className="text-center text-sm text-gray-400 mt-6">Question {quizStep + 1} of {lesson.questions.length}{isLast ? ' · final question' : ''}</div>
        </div>
      </ActivityShell>
    );
  }

  // Phase 'slides'
  const slide = lesson.slides[slideIdx];
  const isFirstSlide = slideIdx === 0;
  const isLastSlide = slideIdx === lesson.slides.length - 1;
  return (
    <ActivityShell user={user} title={meta.name} emoji={meta.emoji} color={gradCol}
      onBack={() => setScreen('home')} onSaveExit={saveAndExit} step={slideIdx + 1} total={lesson.slides.length}>
      <div className="bg-white rounded-[2rem] p-6 md:p-8 kid-shadow">
        {isFirstSlide && (
          <div className="mb-5 text-center">
            <div className="text-5xl mb-2">{meta.emoji}</div>
            <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: meta.accent }}>{lesson.title}</div>
            {lesson.intro && <div className="text-gray-600 mt-2 italic">{lesson.intro}</div>}
          </div>
        )}

        {/* Visual: animation beats image beats fallback */}
        <div className="mb-5">
          {slide.animation
            ? <div className="rounded-3xl bg-gray-50 kid-shadow overflow-hidden"><LessonAnimation name={slide.animation} color={meta.accent} /></div>
            : <SlideImage slide={slide} />
          }
        </div>

        <div className="mb-4">
          <div className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-3">{slide.title}</div>
          <div className="text-gray-700 text-lg leading-relaxed">{slide.text}</div>
        </div>

        {/* Narration controls */}
        <div className="flex items-center gap-2 mb-5">
          {!narrating ? (
            <button onClick={() => narrate(`${slide.title}. ${slide.text}`)} className="pressable flex items-center gap-2 bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold px-4 py-2 rounded-xl kid-shadow">
              <Play className="w-4 h-4" /> Read to me
            </button>
          ) : (
            <button onClick={stopNarration} className="pressable flex items-center gap-2 bg-gray-600 text-white font-bold px-4 py-2 rounded-xl kid-shadow">
              <Pause className="w-4 h-4" /> Stop
            </button>
          )}
        </div>

        {/* Video — only on last slide. If videoId present, embed directly.
            Otherwise open BBC Bitesize's own search page (not Google). */}
        {isLastSlide && lesson.hasVideo && (lesson.videoId || lesson.bitesizeQuery || lesson.bitesizeUrl) && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-3">
              <Film className="w-6 h-6 text-rose-600" />
              <div className="font-display text-lg font-bold text-rose-900">Watch a video on this topic</div>
            </div>
            {lesson.videoId ? (
              <div className="rounded-xl overflow-hidden bg-black kid-shadow" style={{ aspectRatio: '16 / 9' }}>
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0&modestbranding=1`}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-700 mb-3">Tap to go straight to BBC Bitesize for a kid-friendly video.</div>
                <button onClick={openBitesize} className="pressable bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl kid-shadow">
                  Open BBC Bitesize →
                </button>
              </>
            )}
          </div>
        )}

        {/* Slide navigation */}
        <div className="flex items-center justify-between gap-3">
          <button onClick={prevSlide} disabled={isFirstSlide}
            className={`pressable flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${isFirstSlide ? 'bg-gray-200 text-gray-400' : 'bg-gray-700 text-white'}`}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex-1 text-center text-sm text-gray-500">Slide {slideIdx + 1} of {lesson.slides.length}</div>
          <button onClick={nextSlide}
            className={`pressable flex items-center gap-2 bg-gradient-to-r ${gradCol} text-white font-bold px-5 py-2 rounded-xl kid-shadow`}>
            {isLastSlide ? 'Start quiz' : 'Next'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </ActivityShell>
  );
}

/* ============================================================
   RESULTS CARD (shared)
   ============================================================ */
function ResultsCard({ theme, color, title, score, total, items, onDone }) {
  const pct = score / total;
  const emoji = pct === 1 ? '🏆' : pct >= 0.8 ? '🌟' : pct >= 0.5 ? '🎉' : '💪';
  return (
    <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in text-center relative overflow-hidden">
      {pct >= 0.5 && <Confetti avaTheme={theme.name === 'Ava'} />}
      <div className="text-7xl mb-2">{emoji}</div>
      <div className="font-display text-3xl font-bold text-gray-800 mb-1">{title}</div>
      <div className={`font-display text-7xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{score}<span className="text-3xl text-gray-400">/{total}</span></div>
      <div className="mt-2 text-gray-500 font-medium">
        {pct === 1 && (theme.correctLine[0] + ' Perfect score!')}
        {pct >= 0.8 && pct < 1 && 'Excellent work!'}
        {pct >= 0.5 && pct < 0.8 && 'Great effort!'}
        {pct < 0.5 && "Keep practising — you're getting better!"}
      </div>
      <div className="mt-6 max-h-80 overflow-auto text-left divide-y divide-gray-100 rounded-2xl border border-gray-100">
        {items.map((it, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 ${it.ok ? 'bg-emerald-50/40' : 'bg-rose-50/40'}`}>
            {it.ok ? <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" /> : <X className="w-5 h-5 text-rose-500 flex-shrink-0 mt-1" />}
            <div className="text-gray-700 text-sm md:text-base">{it.label}</div>
          </div>
        ))}
      </div>
      <button onClick={() => { sfx.pop(); onDone(); }} className={`pressable mt-6 px-10 py-4 rounded-2xl bg-gradient-to-r ${color} text-white font-display font-bold text-xl kid-shadow`}>Back to Home</button>
    </div>
  );
}

/* ============================================================
   DAY COMPLETE SCREEN — winner/loser encouragement
   ============================================================ */
function DayCompleteScreen({ user, progress, currentDay, setScreen, isDayComplete }) {
  const me = THEME[user];
  // Only Ava/Layla have a "sister" to compare with on this screen.
  const sister = user === 'Ava' ? 'Layla' : user === 'Layla' ? 'Ava' : null;
  const them = sister ? THEME[sister] : null;
  const activities = [
    { id: 'spelling', outOf: 10 }, { id: 'vocab', outOf: 20 }, { id: 'writing', outOf: 10 }, { id: 'math', outOf: 10 }, { id: 'reading', outOf: 4 }, { id: 'puzzles', outOf: 10 },
    { id: 'history', outOf: 10 }, { id: 'geography', outOf: 10 }, { id: 'science', outOf: 10 }
  ];
  const myDay = progress[user][`day${currentDay}`] || {};
  const sisDay = sister ? (progress[sister][`day${currentDay}`] || {}) : {};
  const my = dayPoints(myDay, activities);
  const sis = sister ? dayPoints(sisDay, activities) : 0;
  const dayMax = activities.reduce((s, a) => s + a.outOf, 0); // 84 possible
  const sisDone = sister ? isDayComplete(sister, currentDay) : false;
  const bothDone = sister ? (isDayComplete(user, currentDay) && sisDone) : true;

  let headline, sub;
  if (!sister) {
    // Salahuddin solo celebration
    headline = `Brilliant, ${user}! You finished Day ${currentDay}! 🦖`;
    sub = `You scored ${my} out of ${dayMax}. Dino-mite work — onwards to the next adventure!`;
  } else if (!bothDone) {
    headline = `Brilliant, ${user}! You finished Day ${currentDay}! 🎉`;
    sub = `Waiting for ${sister} to catch up…`;
  } else if (my > sis) {
    headline = `🏆 ${user} wins Day ${currentDay}!`;
    sub = `You scored ${my}. Great work! ${sister} got ${sis} — super close, well played!`;
  } else if (my < sis) {
    headline = `🏆 ${sister} wins Day ${currentDay}!`;
    sub = `${sister} got ${sis}, you got ${my}. Well played! Every day is a fresh chance — go you! 💪`;
  } else {
    headline = `🤝 Day ${currentDay} is a tie!`;
    sub = `You both scored ${my}. What a match!`;
  }

  useEffect(() => { sfx.fanfare(); }, []);

  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => { sfx.pop(); setScreen('home'); }} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <div className={`px-4 py-2 rounded-full ${me.gradient} text-white font-display font-bold`}>🎉 Day {currentDay}</div>
        <div className="w-[88px]" />
      </div>

      <div className={`relative overflow-hidden rounded-[2rem] p-8 kid-shadow ${me.gradient} text-white text-center`}>
        <Confetti avaTheme={user === 'Ava'} count={70} />
        <div className="relative">
          <div className="flex justify-center mb-3"><Mascot who={user} mood="happy" size={130} /></div>
          <div className="font-display text-3xl md:text-4xl font-bold mb-2">{headline}</div>
          <div className="opacity-95">{sub}</div>
          <div className="day-stamp mt-6 inline-block font-display">DAY {currentDay} COMPLETE</div>
        </div>
      </div>

      {/* Score comparison — only for Ava/Layla (Salahuddin has no sister to compare with) */}
      {sister ? (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className={`rounded-3xl p-5 kid-shadow ${me.gradientSoft}`}>
            <div className="flex items-center gap-3 mb-2">
              <Mascot who={user} mood="happy" size={44} />
              <div className={`${me.font} text-2xl font-bold ${me.text}`}>{user}</div>
            </div>
            <div className="font-display text-5xl font-bold text-gray-800">{my}<span className="text-xl text-gray-400"> / {dayMax}</span></div>
          </div>
          <div className={`rounded-3xl p-5 kid-shadow ${them.gradientSoft}`}>
            <div className="flex items-center gap-3 mb-2">
              <Mascot who={sister} mood="happy" size={44} />
              <div className={`${them.font} text-2xl font-bold ${them.text}`}>{sister}</div>
            </div>
            <div className="font-display text-5xl font-bold text-gray-800">{sis}<span className="text-xl text-gray-400"> / {dayMax}</span></div>
            {!sisDone && <div className="text-gray-500 text-sm mt-1">Still playing…</div>}
          </div>
        </div>
      ) : (
        <div className={`rounded-3xl p-6 kid-shadow ${me.gradientSoft} mt-6 text-center`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Mascot who={user} mood="happy" size={54} />
            <div className={`${me.font} text-3xl font-bold ${me.text}`}>{user}</div>
          </div>
          <div className="font-display text-5xl font-bold text-gray-800">{my}<span className="text-xl text-gray-400"> / {dayMax}</span></div>
          <div className="text-gray-600 text-sm mt-2">Total points today</div>
        </div>
      )}

      <button onClick={() => { sfx.pop(); setScreen('leaderboard'); }}
        className="mt-6 w-full pressable bg-white kid-shadow rounded-2xl p-4 font-display text-lg text-gray-700 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" /> See leaderboard →
      </button>
    </div>
  );
}

/* ============================================================
   SCOREBOARD
   ============================================================ */
function Leaderboard({ progress, currentDay, setScreen }) {
  const activities = [
    { id: 'spelling',  emoji: '🔊', outOf: 10 },
    { id: 'vocab',     emoji: '📚', outOf: 20 },
    { id: 'writing',   emoji: '✏️', outOf: 10 },
    { id: 'math',      emoji: '🧮', outOf: 10 },
    { id: 'reading',   emoji: '📖', outOf: 4  },
    { id: 'puzzles',   emoji: '🧠', outOf: 10 },
    { id: 'history',   emoji: '🏛️', outOf: 10 },
    { id: 'geography', emoji: '🌍', outOf: 10 },
    { id: 'science',   emoji: '🔬', outOf: 10 }
  ];
  const baseCompletion = ['spelling','vocab','writing','math','reading','puzzles'];

  // Rankings by total points across all days
  const rankings = NAMES.map(name => ({
    name,
    total: totalPoints(progress[name])
  })).sort((a, b) => b.total - a.total);
  const topTotal = rankings[0]?.total || 0;

  // Per-day table — include days where ANYONE has progress (or current day)
  const maxDay = Math.max(currentDay, 1);
  const perDay = [];
  for (let d = 1; d <= maxDay; d++) {
    const row = { d };
    let anyStarted = false;
    NAMES.forEach(name => {
      const data = progress[name][`day${d}`] || {};
      const sum = dayPoints(data, activities);
      const done = baseCompletion.every(id => data[id] !== undefined);
      row[name] = { data, sum, done };
      if (sum > 0 || done) anyStarted = true;
    });
    if (anyStarted || d === currentDay) perDay.push(row);
  }

  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { sfx.pop(); setScreen('home'); }} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <div className="font-display text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2"><Trophy className="w-8 h-8 text-amber-500" /> Leaderboard</div>
        <div className="w-[88px]" />
      </div>

      {/* Top cards — sorted by total points, leader gets a crown */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {rankings.map((r, idx) => {
          const t = THEME[r.name];
          const isLeader = r.total === topTotal && topTotal > 0;
          return (
            <div key={r.name} className={`relative overflow-hidden rounded-[2rem] p-5 kid-shadow ${t.gradient} text-white`}>
              {isLeader && (
                <div className="absolute top-3 right-3 bg-white text-amber-700 rounded-full px-3 py-1 text-xs font-display font-bold flex items-center gap-1 shadow-lg">
                  <Crown className="w-4 h-4" /> Leading
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <Mascot who={r.name} mood="idle" size={64} />
                <div>
                  <div className={`${t.font} text-2xl font-bold`}>{r.name}</div>
                  <div className="text-xs opacity-90">{t.worldName}</div>
                </div>
              </div>
              <div className="font-display text-5xl font-bold mt-2">{r.total}</div>
              <div className="opacity-90 text-sm">total points · rank #{idx + 1}</div>
            </div>
          );
        })}
      </div>

      {/* Day-by-day table */}
      <div className="bg-white kid-shadow rounded-[2rem] p-5 md:p-7">
        <div className="font-display text-2xl font-bold text-gray-800 mb-4">Day by day</div>
        {perDay.length === 0 && (<div className="text-center text-gray-400 py-6">No days completed yet — get started!</div>)}
        {perDay.length > 0 && (
          <div className="space-y-3">
            {perDay.map(row => {
              // Determine winner(s) for this day among those who completed it
              const completedPlayers = NAMES.filter(n => row[n].done);
              const topScoreToday = Math.max(...NAMES.map(n => row[n].sum));
              const winners = completedPlayers.filter(n => row[n].sum === topScoreToday && topScoreToday > 0);
              return (
                <div key={row.d} className="border-t pt-3 first:border-t-0 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-display font-bold text-gray-700 text-lg">Day {row.d}</div>
                    {winners.length === 1 && completedPlayers.length > 1 && (
                      <div className={`font-display font-bold flex items-center gap-1 text-sm ${THEME[winners[0]].text}`}>
                        <Crown className="w-4 h-4" /> {winners[0]} wins
                      </div>
                    )}
                    {winners.length > 1 && (
                      <div className="font-semibold text-gray-500 text-sm">Tied: {winners.join(' & ')}</div>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {NAMES.map(name => (
                      <LeaderCell key={name} name={name} data={row[name].data} sum={row[name].sum} done={row[name].done} activities={activities} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function LeaderCell({ name, data, sum, done, activities }) {
  const t = THEME[name];
  const bgCls = name === 'Ava' ? 'bg-pink-50 text-pink-800'
             : name === 'Layla' ? 'bg-green-50 text-green-800'
             : 'bg-orange-50 text-orange-800';
  return (
    <div className={`rounded-xl px-3 py-2 ${bgCls}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-display font-bold flex items-center gap-1">
          <span className="text-base">{t.emoji}</span> {name}
        </span>
        <span className="font-display font-bold text-lg">{sum}{done && ' ✓'}</span>
      </div>
      <div className="text-xs space-x-1 truncate opacity-80">
        {activities.map(a => {
          const v = data[a.id];
          const display = (v === undefined || v === null) ? '–'
                        : (typeof v === 'number' || typeof v === 'string') ? v
                        : '–'; // object or other — show dash, don't crash
          return <span key={a.id}>{a.emoji}{display}</span>;
        })}
      </div>
    </div>
  );
}
