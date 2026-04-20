import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Volume2, Check, X, Trophy, Sparkles, BookOpen, Calculator, PenTool, ArrowLeft,
  Crown, Heart, RefreshCw, Send, ChevronRight, Play, Pause, RotateCcw, Star,
  Headphones, Medal
} from 'lucide-react';
import { loadProgress, saveProgress, subscribeProgress, getCachedStory, cacheStory } from './firebase.js';
import { TOTAL_DAYS, SPELLING_BANK, VOCAB_BANK, WRITING_PROMPTS, FALLBACK_STORIES } from './content.js';
import { sfx, primeAudio } from './sounds.js';

const NAMES = ['Ava', 'Layla'];

/* ============================================================
   THEMES — two distinct worlds
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
function getSpellingWords(day) {
  const rand = mulberry32(day * 17 + 3);
  const tierSize = Math.floor(DEDUPED_SPELLING.length / 4);
  const tier = Math.min(3, Math.floor((day - 1) / Math.ceil(TOTAL_DAYS / 4)));
  const start = tier * tierSize;
  const pool = DEDUPED_SPELLING.slice(Math.max(0, start - 5), Math.min(DEDUPED_SPELLING.length, start + tierSize + 5));
  return shuffle(pool, rand).slice(0, 10);
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

function getMathProblems(day) {
  const rand = mulberry32(day * 41 + 5);
  const problems = [];
  const tier = Math.min(3, Math.floor((day - 1) / Math.ceil(TOTAL_DAYS / 4)));
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
function speak(text, opts = {}) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts.rate ?? 0.75;
    u.pitch = opts.pitch ?? 1.05;
    u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /en.?(GB|US)/i.test(v.lang) && /female|samantha|kate|karen|serena|moira/i.test(v.name)) || voices.find(v => /en.?GB/i.test(v.lang)) || voices.find(v => /en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    if (opts.onend) u.onend = opts.onend;
    if (opts.onboundary) u.onboundary = opts.onboundary;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return u;
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

function Mascot({ who, mood, size }) {
  return who === 'Ava' ? <AvaMascot mood={mood} size={size} /> : <LaylaMascot mood={mood} size={size} />;
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
    let unsubA = null, unsubL = null;
    (async () => {
      const savedUser = getLocalUser();
      if (savedUser && NAMES.includes(savedUser)) setUser(savedUser);
      const [ava, layla] = await Promise.all([loadProgress('Ava'), loadProgress('Layla')]);
      setProgress({ Ava: ava || {}, Layla: layla || {} });
      setLoading(false);
      unsubA = subscribeProgress('Ava', (d) => setProgress(p => ({ ...p, Ava: d || {} })));
      unsubL = subscribeProgress('Layla', (d) => setProgress(p => ({ ...p, Layla: d || {} })));
      if (window.speechSynthesis) window.speechSynthesis.getVoices();
    })();
    return () => { if (unsubA) unsubA(); if (unsubL) unsubL(); };
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
    return p && p.spelling !== undefined && p.vocab !== undefined && p.writing !== undefined && p.math !== undefined && p.reading !== undefined;
  };
  const currentDay = useMemo(() => {
    let d = 1;
    while (d < TOTAL_DAYS && isDayComplete('Ava', d) && isDayComplete('Layla', d)) d++;
    return d;
  // eslint-disable-next-line
  }, [progress]);

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
      {screen === 'scoreboard' && <Scoreboard {...sharedProps} />}
      {screen === 'dayDone' && <DayCompleteScreen {...sharedProps} />}
    </div>
  );
}

/* ============================================================
   PROFILE SELECTION
   ============================================================ */
function ProfileSelection({ onSelect, progress }) {
  return (
    <div className="font-body min-h-screen w-full ava-bg flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 pop-in">
        <div className="text-6xl mb-2 floaty">🐶 ✨ ⚽</div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
          <span className="ava-text">Ava</span>
          <span className="text-gray-400"> &amp; </span>
          <span className="layla-text">Layla</span>
        </h1>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-purple-700 mt-1">Learn Together!</h2>
        <p className="mt-4 text-lg text-gray-600 font-medium">Who's playing today?</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
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
                <div className={`${t.font} text-6xl font-bold drop-shadow`}>{n}</div>
                <div className="text-white/90 mt-2 text-lg font-medium">{t.worldName}</div>
                <div className="mt-4 text-white/90 text-base"><span className="font-bold text-xl">{totalPts}</span> points so far</div>
                <div className="mt-2 text-white/90 font-semibold">Tap to start →</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function totalPoints(userProgress) {
  if (!userProgress) return 0;
  let t = 0;
  for (const k in userProgress) {
    const d = userProgress[k]; if (!d || typeof d !== 'object') continue;
    t += (d.spelling || 0) + (d.vocab || 0) + (d.writing || 0) + (d.math || 0) + (d.reading || 0);
  }
  return t;
}
function dayPoints(dayObj, activities) {
  if (!dayObj) return 0;
  return activities.reduce((s, a) => s + (dayObj[a.id] || 0), 0);
}

/* ============================================================
   HOME
   ============================================================ */
function Home({ user, progress, currentDay, setScreen, switchUser, isDayComplete }) {
  const me = THEME[user];
  const sister = user === 'Ava' ? 'Layla' : 'Ava';
  const them = THEME[sister];
  const dayKey = `day${currentDay}`;
  const myDay = progress[user][dayKey] || {};
  const sisDay = progress[sister][dayKey] || {};

  const activities = [
    { id: 'spelling', label: 'Spelling',   icon: Volume2,    emoji: '🔊', color: 'from-amber-300 to-orange-400',  outOf: 10 },
    { id: 'vocab',    label: 'Vocabulary', icon: BookOpen,   emoji: '📚', color: 'from-sky-300 to-indigo-400',    outOf: 20 },
    { id: 'writing',  label: 'Writing',    icon: PenTool,    emoji: '✏️', color: 'from-emerald-300 to-green-500', outOf: 10 },
    { id: 'math',     label: 'Maths',      icon: Calculator, emoji: '🧮', color: 'from-violet-300 to-purple-500', outOf: 10 },
    { id: 'reading',  label: 'Reading',    icon: Headphones, emoji: '📖', color: 'from-rose-300 to-red-400',      outOf: 4  }
  ];
  const myTotalToday = activities.reduce((s, a) => s + (myDay[a.id] || 0), 0);
  const sisTotalToday = activities.reduce((s, a) => s + (sisDay[a.id] || 0), 0);
  const myAllDone = isDayComplete(user, currentDay);
  const sisAllDone = isDayComplete(sister, currentDay);

  // Trophy cabinet — one trophy per fully completed day
  const myCompleted = [];
  for (let d = 1; d < currentDay; d++) if (isDayComplete(user, d)) myCompleted.push(d);

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
              {user === 'Ava' ? 'Today at Pawsome Academy' : 'Today\'s Match'}
            </div>
            <div className="font-display text-5xl md:text-6xl font-bold mt-1">Day {currentDay}</div>
            <div className="opacity-90 mt-1">of {TOTAL_DAYS}</div>
          </div>
          <div className="text-right">
            <div className="text-sm uppercase tracking-widest opacity-90 font-display">Today's points</div>
            <div className="font-display text-5xl md:text-6xl font-bold">{myTotalToday}<span className="text-2xl opacity-75">/54</span></div>
          </div>
        </div>
      </div>

      {/* Sister strip */}
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

      {/* Activities */}
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {activities.map((a, idx) => {
          const done = myDay[a.id] !== undefined;
          const Icon = a.icon;
          return (
            <button key={a.id} onClick={() => { sfx.pop(); setScreen(a.id); }}
              className={`pressable group kid-shadow rounded-[1.75rem] p-6 bg-gradient-to-br ${a.color} text-white text-left relative overflow-hidden`}
              style={{ animation: `pop-in .35s ${idx*60}ms both cubic-bezier(.34,1.56,.64,1)` }}>
              <div className="absolute -bottom-6 -right-6 text-[7rem] opacity-15 select-none">{a.emoji}</div>
              <div className="relative flex items-start justify-between">
                <div>
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
                  </div>
                </div>
                {done ? (
                  <div className="bg-white/25 rounded-2xl px-3 py-2 flex items-center gap-1 font-bold"><Check className="w-5 h-5" /> {myDay[a.id]}/{a.outOf}</div>
                ) : (<ChevronRight className="w-8 h-8 opacity-80" />)}
              </div>
            </button>
          );
        })}
        {/* 6th slot: day finish / waiting */}
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
            <Medal className="w-5 h-5" /> {user === 'Ava' ? 'Your sparkle collection' : 'Your trophy cabinet'}
            <span className="text-gray-500 text-sm font-medium ml-auto">{myCompleted.length} day{myCompleted.length === 1 ? '' : 's'} done</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: Math.min(TOTAL_DAYS, Math.max(currentDay + 1, 12)) }).map((_, i) => {
              const d = i + 1;
              const earned = myCompleted.includes(d);
              return (
                <div key={d} className={`trophy-slot ${earned ? 'earned' : ''}`} title={`Day ${d}`}>
                  {earned ? (user === 'Ava' ? '💖' : '🏆') : <span className="text-gray-300 text-xs">{d}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer status */}
      <div className="rounded-3xl p-5 bg-white kid-shadow text-center">
        {!myAllDone && (<div className="font-display text-xl text-gray-700">Finish all 5 activities to unlock Day {currentDay + 1}! 🚀</div>)}
        {myAllDone && !sisAllDone && (<div className="font-display text-xl text-gray-700">Amazing work, {user}! 🎉 Waiting for <span className={them.text}>{sister}</span> to finish Day {currentDay}…</div>)}
        {myAllDone && sisAllDone && currentDay < TOTAL_DAYS && (<div className="font-display text-xl text-emerald-600">You both finished Day {currentDay}! Day {currentDay + 1} is unlocking… 🎊</div>)}
        {currentDay >= TOTAL_DAYS && myAllDone && sisAllDone && (<div className="font-display text-2xl text-purple-700">🏆 You completed all {TOTAL_DAYS} days! You're superstars! 🏆</div>)}
      </div>
    </div>
  );
}

/* ============================================================
   SHARED — Activity shell
   ============================================================ */
function ActivityShell({ user, title, emoji, color, onBack, step, total, children }) {
  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white font-display font-bold flex items-center gap-2 shadow-lg`}>
          <span className="text-2xl">{emoji}</span> {title}
        </div>
        <div className="w-[88px]" />
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
   SPELLING — with memory tips on wrong answers
   ============================================================ */
function SpellingActivity({ user, currentDay, saveActivity, setScreen }) {
  const words = useMemo(() => getSpellingWords(currentDay), [currentDay]);
  const theme = THEME[user];
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [tipsByWord, setTipsByWord] = useState({});
  const inputRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => speak(words[0]), 400); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!done) { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 100); return () => clearTimeout(t); } }, [step, done]);

  async function submitAnswer(e) {
    e && e.preventDefault();
    const word = words[step];
    const correct = input.trim().toLowerCase() === word.toLowerCase();
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...results, { word, answer: input.trim(), correct }];
    setResults(newResults); setInput('');

    // Fire-and-forget memory tip for wrong answers (keeps flow fast)
    if (!correct) {
      aiCall('spelling-tip', { word, wrongAnswer: input.trim(), childName: user }).then(res => {
        if (res && res.tip) setTipsByWord(t => ({ ...t, [word]: res.tip }));
      });
    }

    if (step + 1 >= words.length) {
      const score = newResults.filter(r => r.correct).length;
      saveActivity(currentDay, 'spelling', score, { words: newResults });
      setDone(true);
      if (score === 10) sfx.celebration(); else sfx.fanfare();
    } else { setStep(step + 1); setTimeout(() => speak(words[step + 1]), 300); }
  }

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

  return (
    <ActivityShell user={user} title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500"
      onBack={() => setScreen('home')} step={step} total={words.length}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-12 text-center pop-in">
        <div className="text-gray-500 mb-4 font-semibold">Tap the speaker to hear your word 👂</div>
        <button onClick={() => { sfx.pop(); speak(words[step]); }}
          className="pressable mx-auto mb-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-white flex items-center justify-center kid-shadow">
          <Volume2 className="w-16 h-16 md:w-20 md:h-20" />
        </button>
        <div className="text-sm text-gray-500 mb-6">Type what you hear:</div>
        <form onSubmit={submitAnswer} className="max-w-md mx-auto">
          <input ref={inputRef} type="text" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            value={input} onChange={e => setInput(e.target.value)} placeholder="Type the word…"
            className="w-full text-center font-display text-3xl md:text-4xl p-5 rounded-2xl t-input" />
          <button type="submit" disabled={!input.trim()}
            className="pressable mt-5 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-display font-bold text-xl kid-shadow disabled:opacity-40 disabled:cursor-not-allowed">
            {step + 1 === words.length ? 'Finish ✓' : 'Next →'}
          </button>
        </form>
        <button onClick={() => { sfx.pop(); speak(words[step]); }} className="mt-5 text-amber-700 font-semibold underline text-sm flex items-center gap-1 mx-auto">
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
  // Question sequence: meaning_0, usage_0, meaning_1, usage_1, ... 20 total
  const questions = useMemo(() => {
    const out = [];
    words.forEach((w, i) => {
      out.push({ kind: 'meaning', wordIdx: i, word: w.word, options: w.meaningOptions, correct: w.meaningCorrect, definition: w.definition });
      out.push({ kind: 'usage', wordIdx: i, word: w.word, sentence: w.sentence, options: w.usageOptions, correct: w.usageCorrect, definition: w.definition });
    });
    return out;
  }, [words]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

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
        setDone(true);
        if (score === 20) sfx.celebration(); else sfx.fanfare();
      } else { setStep(step + 1); }
    }, 1200);
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
      onBack={() => setScreen('home')} step={step} total={questions.length}>
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
          <button onClick={() => { sfx.pop(); speak(q.word); }} className="mt-3 text-sky-600 text-sm font-semibold flex items-center gap-1 mx-auto"><Volume2 className="w-4 h-4" /> Hear "{q.word}"</button>
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

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function submit() {
    setLoading(true);
    const fb = await aiCall('writing-feedback', { prompt, response: text, childName: user });
    const finalFb = (fb && typeof fb.grade === 'number') ? fb : heuristicWritingFeedback(text);
    setFeedback(finalFb);
    await saveActivity(currentDay, 'writing', finalFb.grade, { prompt, response: text, feedback: finalFb });
    finalFb.grade >= 8 ? sfx.celebration() : sfx.fanfare();
    setLoading(false);
  }

  if (feedback) {
    return (
      <ActivityShell user={user} title="Writing" emoji="✏️" color="from-emerald-400 to-green-600" onBack={() => setScreen('home')}>
        <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in text-center relative overflow-hidden">
          {feedback.grade >= 6 && <Confetti avaTheme={user === 'Ava'} />}
          <div className="text-6xl mb-2">{feedback.grade >= 8 ? '🌟' : feedback.grade >= 6 ? '🎉' : '💪'}</div>
          <div className="font-display text-3xl font-bold text-gray-800 mb-1">Your grade</div>
          <div className="font-display text-7xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            {feedback.grade}<span className="text-3xl text-gray-400">/10</span>
          </div>
          <div className="mt-6 text-left space-y-3">
            <div className="bg-emerald-50 border-4 border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-700 font-display font-bold text-lg mb-2"><Heart className="w-5 h-5" /> What you did well</div>
              <div className="text-gray-700 mb-2">{feedback.praise}</div>
              {feedback.strengths && feedback.strengths.length > 0 && (
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  {feedback.strengths.map((s, i) => <li key={i}>✨ {s}</li>)}
                </ul>
              )}
            </div>
            <div className="bg-sky-50 border-4 border-sky-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sky-700 font-display font-bold text-lg mb-2"><Sparkles className="w-5 h-5" /> Try next time</div>
              <div className="text-gray-700 mb-2">{feedback.suggestion}</div>
              {feedback.ideas && feedback.ideas.length > 0 && (
                <>
                  <div className="text-sm text-sky-800 font-semibold mt-3">Ideas to try:</div>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    {feedback.ideas.map((s, i) => <li key={i}>💡 {s}</li>)}
                  </ul>
                </>
              )}
            </div>
            {feedback.cheer && (
              <div className={`rounded-2xl p-5 text-center font-display text-lg ${user === 'Ava' ? 'ava-pill' : 'layla-pill'}`}>
                {feedback.cheer}
              </div>
            )}
          </div>
          <button onClick={() => { sfx.pop(); setScreen('home'); }} className="pressable mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-display font-bold text-xl kid-shadow">Back to Home</button>
        </div>
      </ActivityShell>
    );
  }

  return (
    <ActivityShell user={user} title="Writing" emoji="✏️" color="from-emerald-400 to-green-600" onBack={() => setScreen('home')}>
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
function MathActivity({ user, currentDay, saveActivity, setScreen }) {
  const problems = useMemo(() => getMathProblems(currentDay), [currentDay]);
  const theme = THEME[user];
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(null);
  const [explanations, setExplanations] = useState({});
  const inputRef = useRef(null);

  useEffect(() => { if (!done) { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 100); return () => clearTimeout(t); } }, [step, done]);

  function submit(e) {
    e && e.preventDefault();
    if (input === '' || isNaN(Number(input))) return;
    const p = problems[step];
    const correct = Number(input) === p.answer;
    setFlash(correct ? 'ok' : 'no');
    correct ? sfx.ding() : sfx.aww();
    const newResults = [...results, { question: p.question, correct, answer: Number(input), truth: p.answer }];
    if (!correct) {
      aiCall('math-explain', { question: p.question, correct: p.answer, given: Number(input), childName: user })
        .then(res => { if (res && res.explanation) setExplanations(e => ({ ...e, [p.question]: res.explanation })); });
    }
    setTimeout(() => {
      setFlash(null); setResults(newResults); setInput('');
      if (step + 1 >= problems.length) {
        const score = newResults.filter(r => r.correct).length;
        saveActivity(currentDay, 'math', score, { answers: newResults });
        setDone(true);
        if (score === 10) sfx.celebration(); else sfx.fanfare();
      } else { setStep(step + 1); }
    }, 600);
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
                  {explanations[r.question] && <div className="text-sm text-gray-600 mt-1 italic">💡 {explanations[r.question]}</div>}
                </span>
          }))}
          onDone={() => setScreen('home')}
        />
      </ActivityShell>
    );
  }

  const p = problems[step];
  const flashColor = flash === 'ok' ? 'ring-8 ring-emerald-300' : flash === 'no' ? 'ring-8 ring-rose-300' : '';
  return (
    <ActivityShell user={user} title="Maths" emoji="🧮" color="from-violet-400 to-purple-600"
      onBack={() => setScreen('home')} step={step} total={problems.length}>
      <div className={`bg-white kid-shadow rounded-[2rem] p-8 md:p-12 text-center transition pop-in ${flashColor}`}>
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
    const words = story.story.split(/\s+/);
    const totalWords = words.length;
    const estSeconds = Math.max(90, totalWords / 2.4); // ~144 wpm
    const perWordMs = (estSeconds * 1000) / totalWords;
    setCurrentWordIdx(0); setPlaying(true);

    // Approximate sync: increment one word per interval
    let visibleIdx = 0;
    timerRef.current = setInterval(() => {
      visibleIdx += 1;
      if (visibleIdx >= totalWords) {
        clearInterval(timerRef.current); timerRef.current = null;
      } else setCurrentWordIdx(visibleIdx);
    }, perWordMs);

    utteranceRef.current = speak(story.story, {
      rate: 0.85, pitch: 1.0,
      onend: () => {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        setPlaying(false);
        setCurrentWordIdx(-1);
      }
    });
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
        onBack={() => setScreen('home')} step={quizStep} total={story.questions.length}>
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
    <ActivityShell user={user} title="Reading" emoji="📖" color="from-rose-400 to-red-500" onBack={() => setScreen('home')}>
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
  const sister = user === 'Ava' ? 'Layla' : 'Ava';
  const them = THEME[sister];
  const activities = [
    { id: 'spelling', outOf: 10 }, { id: 'vocab', outOf: 20 }, { id: 'writing', outOf: 10 }, { id: 'math', outOf: 10 }, { id: 'reading', outOf: 4 }
  ];
  const myDay = progress[user][`day${currentDay}`] || {};
  const sisDay = progress[sister][`day${currentDay}`] || {};
  const my = dayPoints(myDay, activities);
  const sis = dayPoints(sisDay, activities);
  const bothDone = isDayComplete(user, currentDay) && isDayComplete(sister, currentDay);

  let headline, sub;
  if (!bothDone) {
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

      {/* Score comparison */}
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className={`rounded-3xl p-5 kid-shadow ${me.gradientSoft}`}>
          <div className="flex items-center gap-3 mb-2">
            <Mascot who={user} mood="happy" size={44} />
            <div className={`${me.font} text-2xl font-bold ${me.text}`}>{user}</div>
          </div>
          <div className="font-display text-5xl font-bold text-gray-800">{my}<span className="text-xl text-gray-400"> / 54</span></div>
        </div>
        <div className={`rounded-3xl p-5 kid-shadow ${them.gradientSoft}`}>
          <div className="flex items-center gap-3 mb-2">
            <Mascot who={sister} mood="happy" size={44} />
            <div className={`${them.font} text-2xl font-bold ${them.text}`}>{sister}</div>
          </div>
          <div className="font-display text-5xl font-bold text-gray-800">{sis}<span className="text-xl text-gray-400"> / 54</span></div>
          {!isDayComplete(sister, currentDay) && <div className="text-gray-500 text-sm mt-1">Still playing…</div>}
        </div>
      </div>

      <button onClick={() => { sfx.pop(); setScreen('scoreboard'); }}
        className="mt-6 w-full pressable bg-white kid-shadow rounded-2xl p-4 font-display text-lg text-gray-700 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" /> See full scoreboard →
      </button>
    </div>
  );
}

/* ============================================================
   SCOREBOARD
   ============================================================ */
function Scoreboard({ progress, currentDay, setScreen }) {
  const activities = [
    { id: 'spelling', emoji: '🔊', outOf: 10 },
    { id: 'vocab',    emoji: '📚', outOf: 20 },
    { id: 'writing',  emoji: '✏️', outOf: 10 },
    { id: 'math',     emoji: '🧮', outOf: 10 },
    { id: 'reading',  emoji: '📖', outOf: 4  }
  ];
  const avaTotal = totalPoints(progress.Ava);
  const laylaTotal = totalPoints(progress.Layla);
  const leader = avaTotal === laylaTotal ? null : (avaTotal > laylaTotal ? 'Ava' : 'Layla');

  const perDay = [];
  for (let d = 1; d <= Math.max(currentDay, 1); d++) {
    const a = progress.Ava[`day${d}`] || {};
    const l = progress.Layla[`day${d}`] || {};
    const aSum = dayPoints(a, activities);
    const lSum = dayPoints(l, activities);
    const aDone = activities.every(x => a[x.id] !== undefined);
    const lDone = activities.every(x => l[x.id] !== undefined);
    if (aDone || lDone || d === currentDay) perDay.push({ d, a, l, aSum, lSum, aDone, lDone });
  }

  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => { sfx.pop(); setScreen('home'); }} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <div className="font-display text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2"><Trophy className="w-8 h-8 text-amber-500" /> Scoreboard</div>
        <div className="w-[88px]" />
      </div>
      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {NAMES.map(n => {
          const t = THEME[n];
          const total = n === 'Ava' ? avaTotal : laylaTotal;
          const isLeader = leader === n;
          return (
            <div key={n} className={`relative overflow-hidden rounded-[2rem] p-6 kid-shadow ${t.gradient} text-white`}>
              {isLeader && (<div className="absolute top-4 right-4 bg-white text-amber-700 rounded-full px-3 py-1 text-sm font-display font-bold flex items-center gap-1 shadow-lg"><Crown className="w-4 h-4" /> Leading</div>)}
              <Mascot who={n} mood="idle" size={80} />
              <div className={`${t.font} text-3xl font-bold mt-2`}>{n}</div>
              <div className="text-sm opacity-90">{t.worldName}</div>
              <div className="font-display text-6xl font-bold mt-2">{total}</div>
              <div className="opacity-90">total points</div>
            </div>
          );
        })}
      </div>
      <div className="bg-white kid-shadow rounded-[2rem] p-5 md:p-7">
        <div className="font-display text-2xl font-bold text-gray-800 mb-4">Day by day</div>
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 md:gap-4 items-center text-sm">
          <div className="font-display text-gray-500 px-2">Day</div>
          <div className={`font-display px-2 text-center ava-text`}>🐶 Ava</div>
          <div className={`font-display px-2 text-center layla-text`}>⚽ Layla</div>
          <div className="font-display text-gray-500 px-2 text-right">Winner</div>
          {perDay.length === 0 && (<div className="col-span-4 text-center text-gray-400 py-6">No days completed yet — get started!</div>)}
          {perDay.map(row => {
            const winner = row.aSum === row.lSum ? null : (row.aSum > row.lSum ? 'Ava' : 'Layla');
            const bothDone = row.aDone && row.lDone;
            return (
              <React.Fragment key={row.d}>
                <div className="font-display font-bold text-gray-700 px-2 py-3 md:text-lg">#{row.d}</div>
                <ScoreCell data={row.a} sum={row.aSum} done={row.aDone} color="ava" activities={activities} />
                <ScoreCell data={row.l} sum={row.lSum} done={row.lDone} color="layla" activities={activities} />
                <div className="px-2 py-3 text-right">
                  {bothDone ? (winner === null ? <span className="text-gray-500 font-semibold">Tie</span>
                    : <span className={`font-display font-bold flex items-center justify-end gap-1 ${winner === 'Ava' ? 'ava-text' : 'layla-text'}`}><Crown className="w-4 h-4" /> {winner}</span>
                  ) : (<span className="text-gray-400 text-xs">In progress</span>)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function ScoreCell({ data, sum, done, color, activities }) {
  const cls = color === 'ava' ? 'bg-pink-50 text-pink-800' : 'bg-green-50 text-green-800';
  return (
    <div className={`rounded-xl px-3 py-2 ${cls}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs space-x-1 truncate">
          {activities.map(a => <span key={a.id}>{a.emoji}{data[a.id] ?? '–'}</span>)}
        </span>
        <span className="font-display font-bold text-lg flex-shrink-0">{sum}{done && ' ✓'}</span>
      </div>
    </div>
  );
}
