import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Volume2, Check, X, Trophy, Sparkles, BookOpen, Calculator, PenTool,
  ArrowLeft, Crown, Heart, RefreshCw, Send, ChevronRight
} from 'lucide-react';
import { loadProgress, saveProgress, subscribeProgress } from './firebase.js';

const TOTAL_DAYS = 90;
const NAMES = ['Ava', 'Layla'];

const THEME = {
  Ava:   { from: 'from-amber-400', to: 'to-orange-500',  ring: 'ring-amber-300', text: 'text-amber-600', bg: 'bg-amber-100', soft: 'bg-amber-50', emoji: '🐶', accent: '🐾', name: 'Ava',   tagline: 'Time to fetch some new skills! 🐾' },
  Layla: { from: 'from-green-500', to: 'to-emerald-600', ring: 'ring-green-300', text: 'text-green-600', bg: 'bg-green-100', soft: 'bg-green-50', emoji: '⚽', accent: '🥅', name: 'Layla', tagline: "Let's score some goals today! 🥅" },
};

const SPELLING_BANK = [
  'because','friend','people','enough','through','family','children','together','different','important',
  'remember','morning','evening','favourite','brother','sister','garden','another','sometimes','answer',
  'beautiful','between','breakfast','country','thought','laugh','listen','neighbour','special','surprise',
  'treasure','weather','wonder','island','library','science','picture','quickly','castle','double',
  'chocolate','whisper','suddenly','imagine','delicious','wonderful','adventure','dangerous','mysterious','curious',
  'enormous','fantastic','magnificent','peculiar','sparkle','giggle','forgotten','invisible','mountain','squirrel',
  'elephant','umbrella','butterfly','pineapple','strawberry','vegetable','temperature','afternoon','kitchen','dinosaur',
  'celebrate','calendar','creature','discover','disappear','electric','excellent','exercise','explore','glittering',
  'happiness','hospital','knowledge','language','necessary','orchestra','parachute','quarrel','quicksand','scissors',
  'rhythm','rhinoceros','telescope','volcano','wilderness','xylophone','yesterday','ancient','ceremony','chemical',
  'conscience','courageous','definitely','effective','familiar','gorgeous','hurricane','identical','jealous','laboratory',
  'microphone','nightmare','obstacle','photograph','questionnaire','rehearse','satellite','sincere','strategy','tomorrow',
  'acquaintance','camouflage','conscientious','embarrass','fluorescent','guarantee','hypothesis','illuminate','jeopardy','kaleidoscope',
  'labyrinth','miscellaneous','noticeable','perseverance','reminiscent','silhouette','thorough','unanimous','vulnerable','whimsical',
  'exquisite','poignant','quintessential','serendipity','magnificence','phenomenon','extraordinary','responsibility','opportunity','celebration'
];
const DEDUPED_SPELLING = [...new Set(SPELLING_BANK)];

const VOCAB_BANK = [
  {w:'abundant',d:'existing in very large amounts'},{w:'accomplish',d:'to finish or achieve something'},
  {w:'admire',d:'to think highly of someone or something'},{w:'ancient',d:'very, very old; from long ago'},
  {w:'astonish',d:'to surprise someone greatly'},{w:'brilliant',d:'very smart or extremely bright'},
  {w:'calm',d:'peaceful and not upset or excited'},{w:'cautious',d:'being careful to avoid danger'},
  {w:'clever',d:'quick to understand; smart'},{w:'courageous',d:'very brave'},
  {w:'curious',d:'wanting to know or learn'},{w:'delicate',d:'easy to break; very gentle'},
  {w:'determined',d:'firmly decided to do something'},{w:'diligent',d:'working hard and carefully'},
  {w:'eager',d:'very excited and keen'},{w:'elegant',d:'graceful and stylish'},
  {w:'enormous',d:'extremely large'},{w:'fascinate',d:'to attract strong interest'},
  {w:'fragile',d:'easily broken'},{w:'generous',d:'willing to give and share'},
  {w:'gentle',d:'kind and soft in manner'},{w:'glimpse',d:'a quick look at something'},
  {w:'gorgeous',d:'very beautiful'},{w:'grateful',d:'feeling thankful'},
  {w:'hesitate',d:'to pause before doing something'},{w:'honest',d:'truthful and fair'},
  {w:'humble',d:'not proud; modest'},{w:'imagine',d:'to picture something in your mind'},
  {w:'immense',d:'extremely large'},{w:'inspect',d:'to look at very carefully'},
  {w:'jolly',d:'happy and cheerful'},{w:'journey',d:'a long trip'},
  {w:'leap',d:'to jump high or far'},{w:'loyal',d:'faithful and trustworthy'},
  {w:'magnificent',d:'extremely beautiful or grand'},{w:'marvellous',d:'wonderful; amazing'},
  {w:'mischievous',d:'playfully naughty'},{w:'mysterious',d:'hard to understand or explain'},
  {w:'noble',d:'honest and with good character'},{w:'observe',d:'to watch carefully'},
  {w:'patient',d:'able to wait without getting upset'},{w:'peculiar',d:'strange or unusual'},
  {w:'persist',d:'to keep trying, even when hard'},{w:'polite',d:'having good manners'},
  {w:'ponder',d:'to think carefully about something'},{w:'precious',d:'very valuable or loved'},
  {w:'puzzle',d:'to be confused about something'},{w:'quiver',d:'to shake slightly'},
  {w:'radiant',d:'shining brightly; glowing'},{w:'rare',d:'not happening or seen often'},
  {w:'reliable',d:'able to be trusted'},{w:'reluctant',d:'not wanting to do something'},
  {w:'remarkable',d:'worth noticing; impressive'},{w:'rescue',d:'to save from danger'},
  {w:'scamper',d:'to run quickly with short steps'},{w:'scarce',d:'not enough of something'},
  {w:'serene',d:'calm and peaceful'},{w:'sincere',d:'honest and truthful'},
  {w:'sly',d:'tricky and clever in a sneaky way'},{w:'sparkle',d:'to shine with little flashes'},
  {w:'splendid',d:'very impressive; wonderful'},{w:'stroll',d:'to walk in a slow, relaxed way'},
  {w:'stubborn',d:'refusing to change your mind'},{w:'sturdy',d:'strong and solid'},
  {w:'swift',d:'very fast'},{w:'terrific',d:'very good; excellent'},
  {w:'thrilled',d:'very excited and happy'},{w:'timid',d:'shy and easily frightened'},
  {w:'tranquil',d:'quiet and peaceful'},{w:'triumph',d:'a great success or victory'},
  {w:'unique',d:'one of a kind; unlike anything else'},{w:'vast',d:'very large in size or amount'},
  {w:'vibrant',d:'full of life and energy'},{w:'vivid',d:'very bright or clear'},
  {w:'wander',d:'to walk around with no particular goal'},{w:'weary',d:'very tired'},
  {w:'wise',d:'having good judgment from experience'},{w:'witness',d:'to see something happen'},
  {w:'yearn',d:'to want something very much'},{w:'zealous',d:'very eager and enthusiastic'},
  {w:'blossom',d:'to flower or develop beautifully'},{w:'cherish',d:'to love and care for deeply'},
  {w:'dazzle',d:'to shine so brightly it amazes'},{w:'earnest',d:'serious and sincere'},
  {w:'flourish',d:'to grow well and succeed'},{w:'gleam',d:'to shine softly'},
  {w:'harmony',d:'a pleasing combination'},{w:'invent',d:'to create something new'},
  {w:'jubilant',d:'extremely joyful'},{w:'keen',d:'very interested; sharp'},
  {w:'linger',d:'to stay longer than needed'},{w:'nibble',d:'to eat with small bites'},
  {w:'opaque',d:'not see-through'},{w:'precise',d:'exactly correct'},
  {w:'quest',d:'a long search for something'},{w:'rival',d:'someone competing with you'},
  {w:'soothe',d:'to make calm or comfortable'},{w:'tremble',d:'to shake with fear or cold'},
  {w:'unite',d:'to join together'},{w:'vanish',d:'to disappear suddenly'}
];

const WRITING_PROMPTS = [
  'Describe your favourite toy and why you love it.','What would you do if you found a magic key?',
  'Write about your best friend and what makes them special.','Describe the most delicious meal you have ever eaten.',
  'If you could have any superpower, what would it be and why?','Write about a time you felt really proud of yourself.',
  'Describe your perfect day at the park.','What would you pack for a trip to the moon?',
  'Write about your favourite animal and why you like it.','If you could talk to an animal, which one would it be?',
  'Describe your bedroom so someone who has never seen it can picture it.','What would you do if you woke up as a giant?',
  'Write about something that made you laugh really hard.','Describe your family using three describing words for each person.',
  'If you had a time machine, where would you go first?','Write about a dream you remember.',
  'Describe what you think clouds feel like.','What would you do if you could fly for one day?',
  'Write about your favourite season and why.','Describe a walk through a magical forest.',
  'What is the best gift you have ever received?','Write about something kind you did for someone.',
  'Describe what lives at the bottom of the ocean.','If you could invent something new, what would it be?',
  'Write about your favourite book and what happens in it.','Describe a rainbow to someone who has never seen one.',
  'What would you do if you had a pet dragon?','Write about a time you felt brave.',
  'Describe the perfect picnic.','If you could live anywhere, where would you live?',
  'Write about your favourite game and how to play it.','Describe what the clouds look like today.',
  'What is the best thing about being seven years old?','Write about a time you helped somebody.',
  'Describe the taste of your favourite fruit.','If you were in charge for one day, what would you do?',
  'Write about what you want to be when you grow up.','Describe your favourite song and why you love it.',
  'What would you do if you met a fairy?','Write about the funniest thing that ever happened to you.',
  'Describe a storm from inside your house.','If you could have any pet, what would it be?',
  'Write about your favourite holiday memory.','Describe what happiness feels like.',
  'What would you do with a box of stars?','Write about a time you tried something new.',
  'Describe your favourite place to visit.','If your toys came alive at night, what would they do?',
  'Write about a secret hideout.','Describe the best treehouse you can imagine.',
  'What would you do if you could make it snow?','Write about your favourite thing to do with your sister.',
  'Describe a character from a story you made up.','If you could change one thing about your school, what would it be?',
  'Write about something you are really good at.','Describe a tiny creature that lives in your garden.',
  'What would you do if you could breathe underwater?','Write about your perfect birthday party.',
  'Describe a kingdom made entirely of sweets.','If you had a robot friend, what would it do?',
  'Write about the smell of your favourite food.','Describe what you think the sun does at night.',
  'What would you do if you could shrink to ant-size?','Write about a time you felt nervous and what helped.',
  'Describe the most beautiful thing you have ever seen.','If trees could talk, what would they say?',
  'Write about your favourite memory with your family.','Describe a mysterious door you find in a wall.',
  'What would you do if you found a treasure map?','Write about a time you felt really happy.',
  'Describe what a friendly ghost might look like.','If you could invent a new flavour of ice cream, what would it be?',
  'Write about a place you dream about visiting.','Describe a day in the life of your pet (or the pet you wish you had).',
  'What would you do if you could paint with light?','Write about a time you learned something new.',
  "Describe the inside of a wizard's hat.",'If you could plant a garden of anything, what would grow there?',
  'Write about the most amazing sky you have ever seen.','Describe what you think lives under the stairs.',
  'What would you do if you could talk to plants?','Write about your favourite game to play with friends.',
  'Describe a forest where all the animals are friends.','If you had a magic paintbrush, what would you paint?',
  'Write about something that scared you but ended up being okay.','Describe a sandwich only a giant could eat.',
  'What would you do if you could live in a castle?','Write about a time you surprised someone.',
  'Describe your favourite outfit and when you wear it.','If you could build a spaceship, where would you go?',
  'Write about the best dinner your family has ever had.','Describe a new planet you discovered.',
  'Write about three things you love most and why.'
];

function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleWithRand(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getSpellingWords(day) {
  const rand = mulberry32(day * 17 + 3);
  const tierSize = Math.floor(DEDUPED_SPELLING.length / 4);
  const tier = Math.min(3, Math.floor((day - 1) / Math.ceil(TOTAL_DAYS / 4)));
  const start = tier * tierSize;
  const pool = DEDUPED_SPELLING.slice(Math.max(0, start - 5), Math.min(DEDUPED_SPELLING.length, start + tierSize + 5));
  return shuffleWithRand(pool, rand).slice(0, 10);
}
function getVocabQuestions(day) {
  const rand = mulberry32(day * 31 + 7);
  const selected = shuffleWithRand(VOCAB_BANK, rand).slice(0, 5);
  return selected.map((entry, idx) => {
    const drand = mulberry32(day * 31 + idx * 11 + 13);
    const others = VOCAB_BANK.filter(v => v.w !== entry.w);
    const distractors = shuffleWithRand(others, drand).slice(0, 3).map(v => v.d);
    const options = shuffleWithRand([entry.d, ...distractors], drand);
    return { word: entry.w, options, correctIndex: options.indexOf(entry.d), correctDefinition: entry.d };
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
  return shuffleWithRand(problems, rand);
}

function speak(text) {
  try {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.75; u.pitch = 1.05; u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /en.?(GB|US)/i.test(v.lang) && /female|samantha|kate|karen|serena|moira/i.test(v.name)) || voices.find(v => /en.?GB/i.test(v.lang)) || voices.find(v => /en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

async function getWritingFeedback(prompt, response) {
  try {
    const r = await fetch('/api/writing-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, response })
    });
    if (r.ok) {
      const data = await r.json();
      if (typeof data.grade === 'number') return data;
    }
  } catch (e) {}
  // Heuristic fallback
  const text = (response || '').trim();
  const words = text ? text.split(/\s+/).length : 0;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const capStart = sentences.filter(s => /^[A-Z]/.test(s.trim())).length;
  const hasPunct = /[.!?]/.test(text);
  let grade = 3;
  if (words >= 15) grade += 1; if (words >= 30) grade += 2; if (words >= 50) grade += 1;
  if (sentences.length >= 5) grade += 1; if (hasPunct) grade += 1; if (capStart >= 3) grade += 1;
  grade = Math.max(1, Math.min(10, grade));
  return {
    grade,
    praise: words > 20 ? 'You wrote a lovely amount — well done for sharing your ideas!' : 'Thank you for writing — nice start!',
    suggestion: sentences.length < 5
      ? 'Next time, try to write at least 5 full sentences, each with a capital letter at the start and a full stop at the end.'
      : 'Try adding a sparkly describing word (like enormous, glittering, or peculiar) to make your writing come alive.'
  };
}

function getLocalUser() {
  try { return localStorage.getItem('current-user'); } catch (e) { return null; }
}
function setLocalUser(name) {
  try { if (name) localStorage.setItem('current-user', name); else localStorage.removeItem('current-user'); } catch (e) {}
}

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('home');
  const [progress, setProgress] = useState({ Ava: {}, Layla: {} });
  const [loading, setLoading] = useState(true);

  // Initial load + Firestore subscriptions for live sync
  useEffect(() => {
    let unsubA = null, unsubL = null;
    (async () => {
      const savedUser = getLocalUser();
      if (savedUser && NAMES.includes(savedUser)) setUser(savedUser);
      const [ava, layla] = await Promise.all([loadProgress('Ava'), loadProgress('Layla')]);
      setProgress({ Ava: ava || {}, Layla: layla || {} });
      setLoading(false);
      unsubA = subscribeProgress('Ava', (data) => setProgress(p => ({ ...p, Ava: data || {} })));
      unsubL = subscribeProgress('Layla', (data) => setProgress(p => ({ ...p, Layla: data || {} })));
      if (window.speechSynthesis) window.speechSynthesis.getVoices();
    })();
    return () => { if (unsubA) unsubA(); if (unsubL) unsubL(); };
  }, []);

  function chooseUser(name) { setUser(name); setLocalUser(name); }
  function switchUser() { setUser(null); setScreen('home'); setLocalUser(null); }

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
    return p && p.spelling !== undefined && p.vocab !== undefined && p.writing !== undefined && p.math !== undefined;
  };
  const currentDay = useMemo(() => {
    let d = 1;
    while (d < TOTAL_DAYS && isDayComplete('Ava', d) && isDayComplete('Layla', d)) d++;
    return d;
  // eslint-disable-next-line
  }, [progress]);

  if (loading) {
    return (
      <div className="font-body min-h-screen w-full flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="text-7xl mb-6 floaty">✨</div>
          <div className="font-display text-3xl text-purple-700">Loading your adventure…</div>
        </div>
      </div>
    );
  }

  if (!user) return <ProfileSelection onSelect={chooseUser} progress={progress} />;

  const sharedProps = { user, progress, currentDay, setScreen, saveActivity, switchUser, isDayComplete };
  return (
    <div className="font-body bg-cream min-h-screen">
      {screen === 'home' && <Home {...sharedProps} />}
      {screen === 'spelling' && <SpellingActivity {...sharedProps} />}
      {screen === 'vocab'    && <VocabActivity {...sharedProps} />}
      {screen === 'writing'  && <WritingActivity {...sharedProps} />}
      {screen === 'math'     && <MathActivity {...sharedProps} />}
      {screen === 'scoreboard' && <Scoreboard {...sharedProps} />}
    </div>
  );
}

function ProfileSelection({ onSelect, progress }) {
  return (
    <div className="font-body min-h-screen w-full bg-cream flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 pop-in">
        <div className="text-6xl mb-2 floaty">🐶 ✨ ⚽</div>
        <h1 className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-500 via-purple-500 to-green-600 bg-clip-text text-transparent leading-tight">Ava &amp; Layla</h1>
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-purple-700 mt-1">Learn Together!</h2>
        <p className="mt-4 text-lg text-gray-600 font-medium">Who's playing today?</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {NAMES.map((n) => {
          const t = THEME[n];
          const totalPts = totalPoints(progress[n]);
          return (
            <button key={n} onClick={() => onSelect(n)}
              className={`pressable kid-shadow rounded-[2rem] p-8 bg-gradient-to-br ${t.from} ${t.to} text-white text-left relative overflow-hidden`}>
              <div className="absolute -top-10 -right-10 text-[10rem] opacity-20 select-none">{t.emoji}</div>
              <div className="text-6xl mb-3">{t.emoji}</div>
              <div className="font-display text-5xl font-bold">{n}</div>
              <div className="text-white/90 mt-1 text-sm font-medium">{t.tagline}</div>
              <div className="mt-4 text-white/90 text-lg"><span className="font-bold">{totalPts}</span> points so far</div>
              <div className="mt-2 text-white/80">Tap to start →</div>
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
    t += (d.spelling || 0) + (d.vocab || 0) + (d.writing || 0) + (d.math || 0);
  }
  return t;
}

function Home({ user, progress, currentDay, setScreen, switchUser, isDayComplete }) {
  const me = THEME[user];
  const sister = user === 'Ava' ? 'Layla' : 'Ava';
  const them = THEME[sister];
  const dayKey = `day${currentDay}`;
  const myDay = progress[user][dayKey] || {};
  const sisDay = progress[sister][dayKey] || {};

  const activities = [
    { id: 'spelling', label: 'Spelling',   icon: Volume2,    emoji: '🔊', color: 'from-amber-300 to-orange-400',  outOf: 10 },
    { id: 'vocab',    label: 'Vocabulary', icon: BookOpen,   emoji: '📚', color: 'from-sky-300 to-indigo-400',    outOf: 5  },
    { id: 'writing',  label: 'Writing',    icon: PenTool,    emoji: '✏️', color: 'from-emerald-300 to-green-500', outOf: 10 },
    { id: 'math',     label: 'Maths',      icon: Calculator, emoji: '🧮', color: 'from-violet-300 to-purple-500', outOf: 10 },
  ];

  const myTotalToday = activities.reduce((s, a) => s + (myDay[a.id] || 0), 0);
  const sisTotalToday = activities.reduce((s, a) => s + (sisDay[a.id] || 0), 0);
  const myAllDone = isDayComplete(user, currentDay);
  const sisAllDone = isDayComplete(sister, currentDay);

  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 pop-in">
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${me.from} ${me.to} flex items-center justify-center text-3xl kid-shadow`}>{me.emoji}</div>
          <div>
            <div className="font-display text-3xl md:text-4xl font-bold text-gray-800">Hi {user}! ✨</div>
            <div className="text-gray-500 text-sm">{me.tagline}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setScreen('scoreboard')} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
            <Trophy className="w-5 h-5 text-amber-500" /> Scores
          </button>
          <button onClick={switchUser} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 text-gray-700 font-semibold">Switch</button>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-[2rem] p-6 md:p-8 kid-shadow bg-gradient-to-r ${me.from} ${me.to} text-white mb-6`}>
        <div className="absolute inset-0 dashed-box opacity-40" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-sm md:text-base uppercase tracking-widest opacity-90">Your adventure</div>
            <div className="font-display text-5xl md:text-6xl font-bold">Day {currentDay}</div>
            <div className="opacity-90 mt-1">of {TOTAL_DAYS}</div>
          </div>
          <div className="text-right">
            <div className="text-sm uppercase tracking-widest opacity-90 font-display">Today's points</div>
            <div className="font-display text-5xl md:text-6xl font-bold">{myTotalToday}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl p-5 bg-white kid-shadow mb-6 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${them.from} ${them.to} flex items-center justify-center text-2xl`}>{them.emoji}</div>
        <div className="flex-1">
          <div className="font-display text-lg text-gray-800">{sister}'s Day {currentDay}: <span className={`font-bold ${them.text}`}>{sisTotalToday} points</span></div>
          <div className="text-sm text-gray-500 flex flex-wrap gap-3 mt-1">
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

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {activities.map((a, idx) => {
          const done = myDay[a.id] !== undefined;
          const Icon = a.icon;
          return (
            <button key={a.id} onClick={() => setScreen(a.id)}
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
                    {a.id === 'spelling' && '10 words, spoken aloud'}
                    {a.id === 'vocab'    && '5 new words to learn'}
                    {a.id === 'writing'  && 'Write 5 sentences'}
                    {a.id === 'math'     && '10 mixed questions'}
                  </div>
                </div>
                {done ? (
                  <div className="bg-white/25 rounded-2xl px-3 py-2 flex items-center gap-1 font-bold"><Check className="w-5 h-5" /> {myDay[a.id]}/{a.outOf}</div>
                ) : (<ChevronRight className="w-8 h-8 opacity-80 group-hover:translate-x-1 transition" />)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl p-5 bg-white kid-shadow text-center">
        {!myAllDone && (<div className="font-display text-xl text-gray-700">Finish all 4 activities to unlock Day {currentDay + 1}! 🚀</div>)}
        {myAllDone && !sisAllDone && (<div className="font-display text-xl text-gray-700">Great job, {user}! 🎉 Waiting for <span className={them.text}>{sister}</span> to finish Day {currentDay}…</div>)}
        {myAllDone && sisAllDone && currentDay < TOTAL_DAYS && (<div className="font-display text-xl text-emerald-600">You both finished Day {currentDay}! Day {currentDay + 1} is unlocking… 🎊</div>)}
        {currentDay >= TOTAL_DAYS && myAllDone && sisAllDone && (<div className="font-display text-2xl text-purple-700">🏆 You completed all 90 days! You're superstars! 🏆</div>)}
      </div>
    </div>
  );
}

function ActivityShell({ title, emoji, color, onBack, step, total, children }) {
  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
          <ArrowLeft className="w-5 h-5" /> Home
        </button>
        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white font-display font-bold flex items-center gap-2`}>
          <span className="text-2xl">{emoji}</span> {title}
        </div>
        <div className="w-[88px]" />
      </div>
      {typeof step === 'number' && typeof total === 'number' && (
        <div className="mb-5">
          <div className="flex justify-between text-sm text-gray-500 mb-1 font-semibold">
            <span>Question {Math.min(step + 1, total)} of {total}</span>
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

function SpellingActivity({ currentDay, saveActivity, setScreen }) {
  const words = useMemo(() => getSpellingWords(currentDay), [currentDay]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => speak(words[0]), 400); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!done) { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 100); return () => clearTimeout(t); } }, [step, done]);

  function submitAnswer(e) {
    e && e.preventDefault();
    const word = words[step];
    const correct = input.trim().toLowerCase() === word.toLowerCase();
    const newResults = [...results, { word, answer: input.trim(), correct }];
    setResults(newResults); setInput('');
    if (step + 1 >= words.length) {
      const score = newResults.filter(r => r.correct).length;
      saveActivity(currentDay, 'spelling', score, { words: newResults });
      setDone(true);
    } else { setStep(step + 1); setTimeout(() => speak(words[step + 1]), 300); }
  }

  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
      <ActivityShell title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500" onBack={() => setScreen('home')}>
        <ResultsCard color="from-amber-300 to-orange-500" title="Spelling finished!" score={score} total={10}
          items={results.map(r => ({ ok: r.correct, label: r.correct ? r.word : <span><s className="opacity-70">{r.answer || '(blank)'}</s> → <b>{r.word}</b></span> }))}
          onDone={() => setScreen('home')} />
      </ActivityShell>
    );
  }

  return (
    <ActivityShell title="Spelling" emoji="🔊" color="from-amber-400 to-orange-500" onBack={() => setScreen('home')} step={step} total={words.length}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-12 text-center pop-in">
        <div className="text-gray-500 mb-4 font-semibold">Tap the speaker to hear your word 👂</div>
        <button onClick={() => speak(words[step])} className="pressable mx-auto mb-8 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-white flex items-center justify-center kid-shadow">
          <Volume2 className="w-16 h-16 md:w-20 md:h-20" />
        </button>
        <div className="text-sm text-gray-500 mb-6">Type what you hear below:</div>
        <form onSubmit={submitAnswer} className="max-w-md mx-auto">
          <input ref={inputRef} type="text" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            value={input} onChange={e => setInput(e.target.value)} placeholder="Type the word…"
            className="w-full text-center font-display text-3xl md:text-4xl p-5 rounded-2xl border-4 border-amber-200 focus:border-amber-400 focus:outline-none bg-amber-50" />
          <button type="submit" disabled={!input.trim()} className="pressable mt-5 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-display font-bold text-xl kid-shadow disabled:opacity-40 disabled:cursor-not-allowed">
            {step + 1 === words.length ? 'Finish ✓' : 'Next →'}
          </button>
        </form>
        <button onClick={() => speak(words[step])} className="mt-5 text-amber-700 font-semibold underline text-sm flex items-center gap-1 mx-auto">
          <RefreshCw className="w-4 h-4" /> Hear it again
        </button>
      </div>
    </ActivityShell>
  );
}

function VocabActivity({ currentDay, saveActivity, setScreen }) {
  const questions = useMemo(() => getVocabQuestions(currentDay), [currentDay]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  function choose(idx) {
    if (picked !== null) return;
    setPicked(idx);
    const q = questions[step];
    const correct = idx === q.correctIndex;
    const newResults = [...results, { word: q.word, correct, chosen: q.options[idx], correctDefinition: q.correctDefinition }];
    setTimeout(() => {
      setPicked(null); setResults(newResults);
      if (step + 1 >= questions.length) {
        const score = newResults.filter(r => r.correct).length;
        saveActivity(currentDay, 'vocab', score, { answers: newResults });
        setDone(true);
      } else { setStep(step + 1); }
    }, 1200);
  }

  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
      <ActivityShell title="Vocabulary" emoji="📚" color="from-sky-400 to-indigo-500" onBack={() => setScreen('home')}>
        <ResultsCard color="from-sky-400 to-indigo-500" title="Vocabulary finished!" score={score} total={5}
          items={results.map(r => ({ ok: r.correct, label: <span><b>{r.word}</b>: {r.correctDefinition}</span> }))}
          onDone={() => setScreen('home')} />
      </ActivityShell>
    );
  }

  const q = questions[step];
  return (
    <ActivityShell title="Vocabulary" emoji="📚" color="from-sky-400 to-indigo-500" onBack={() => setScreen('home')} step={step} total={questions.length}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in" key={step}>
        <div className="text-center mb-8">
          <div className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-2">What does this word mean?</div>
          <div className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">{q.word}</div>
          <button onClick={() => speak(q.word)} className="mt-3 text-sky-600 text-sm font-semibold flex items-center gap-1 mx-auto"><Volume2 className="w-4 h-4" /> Hear it</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {q.options.map((opt, idx) => {
            const isPicked = picked === idx;
            const isCorrect = idx === q.correctIndex;
            const showState = picked !== null;
            let cls = 'bg-sky-50 border-sky-200 hover:bg-sky-100';
            if (showState && isCorrect) cls = 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-200';
            else if (showState && isPicked && !isCorrect) cls = 'bg-rose-100 border-rose-400 ring-4 ring-rose-200';
            else if (showState) cls = 'bg-gray-50 border-gray-200 opacity-60';
            return (
              <button key={idx} disabled={picked !== null} onClick={() => choose(idx)} className={`pressable text-left p-5 rounded-2xl border-4 text-lg font-semibold text-gray-700 ${cls}`}>
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

function WritingActivity({ currentDay, saveActivity, setScreen }) {
  const prompt = useMemo(() => getWritingPrompt(currentDay), [currentDay]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const lines = text.split('\n').filter(l => l.trim().length > 0).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  async function submit() {
    setLoading(true);
    const fb = await getWritingFeedback(prompt, text);
    setFeedback(fb);
    await saveActivity(currentDay, 'writing', fb.grade, { prompt, response: text, feedback: fb });
    setLoading(false);
  }

  if (feedback) {
    return (
      <ActivityShell title="Writing" emoji="✏️" color="from-emerald-400 to-green-600" onBack={() => setScreen('home')}>
        <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in text-center">
          <Confetti />
          <div className="text-6xl mb-2">{feedback.grade >= 8 ? '🌟' : feedback.grade >= 6 ? '🎉' : '💪'}</div>
          <div className="font-display text-3xl font-bold text-gray-800 mb-1">Your grade</div>
          <div className="font-display text-7xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">{feedback.grade}<span className="text-3xl text-gray-400">/10</span></div>
          <div className="mt-8 grid md:grid-cols-2 gap-4 text-left">
            <div className="bg-emerald-50 border-4 border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-emerald-700 font-display font-bold text-lg mb-1"><Heart className="w-5 h-5" /> What you did well</div>
              <div className="text-gray-700">{feedback.praise}</div>
            </div>
            <div className="bg-sky-50 border-4 border-sky-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sky-700 font-display font-bold text-lg mb-1"><Sparkles className="w-5 h-5" /> Try next time</div>
              <div className="text-gray-700">{feedback.suggestion}</div>
            </div>
          </div>
          <button onClick={() => setScreen('home')} className="pressable mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-display font-bold text-xl kid-shadow">Back to Home</button>
        </div>
      </ActivityShell>
    );
  }

  return (
    <ActivityShell title="Writing" emoji="✏️" color="from-emerald-400 to-green-600" onBack={() => setScreen('home')}>
      <div className="bg-white kid-shadow rounded-[2rem] p-8 pop-in">
        <div className="uppercase tracking-widest text-xs text-emerald-600 font-semibold mb-2">Today's prompt</div>
        <div className="font-display text-2xl md:text-3xl text-gray-800 mb-5 leading-snug">"{prompt}"</div>
        <div className="text-sm text-gray-500 mb-3">Write at least <b>5 sentences</b>. Remember capital letters and full stops!</div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start writing here…" rows={10} disabled={loading}
          className="w-full p-5 rounded-2xl border-4 border-emerald-200 focus:border-emerald-400 focus:outline-none bg-emerald-50 text-lg leading-relaxed resize-y" />
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="text-sm text-gray-600 font-semibold"><span className="mr-3">📝 {words} words</span><span>📏 {lines} lines</span></div>
          <button onClick={submit} disabled={words < 10 || loading} className="pressable px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-600 text-white font-display font-bold text-lg kid-shadow disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            {loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Getting feedback…</> : <><Send className="w-5 h-5" /> Send for feedback</>}
          </button>
        </div>
        {words < 10 && !loading && (<div className="text-xs text-gray-400 mt-2 text-right">Write a bit more first (at least 10 words)</div>)}
      </div>
    </ActivityShell>
  );
}

function MathActivity({ currentDay, saveActivity, setScreen }) {
  const problems = useMemo(() => getMathProblems(currentDay), [currentDay]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { if (!done) { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 100); return () => clearTimeout(t); } }, [step, done]);

  function submit(e) {
    e && e.preventDefault();
    if (input === '' || isNaN(Number(input))) return;
    const p = problems[step];
    const correct = Number(input) === p.answer;
    setFlash(correct ? 'ok' : 'no');
    const newResults = [...results, { question: p.question, correct, answer: Number(input), truth: p.answer }];
    setTimeout(() => {
      setFlash(null); setResults(newResults); setInput('');
      if (step + 1 >= problems.length) {
        const score = newResults.filter(r => r.correct).length;
        saveActivity(currentDay, 'math', score, { answers: newResults });
        setDone(true);
      } else { setStep(step + 1); }
    }, 550);
  }

  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
      <ActivityShell title="Maths" emoji="🧮" color="from-violet-400 to-purple-600" onBack={() => setScreen('home')}>
        <ResultsCard color="from-violet-400 to-purple-600" title="Maths finished!" score={score} total={10}
          items={results.map(r => ({ ok: r.correct, label: r.correct
            ? <span>{r.question} = <b>{r.truth}</b></span>
            : <span>{r.question} = <b>{r.truth}</b> <span className="text-rose-500 text-sm">(you said {r.answer})</span></span> }))}
          onDone={() => setScreen('home')} />
      </ActivityShell>
    );
  }

  const p = problems[step];
  const flashColor = flash === 'ok' ? 'ring-8 ring-emerald-300' : flash === 'no' ? 'ring-8 ring-rose-300' : '';
  return (
    <ActivityShell title="Maths" emoji="🧮" color="from-violet-400 to-purple-600" onBack={() => setScreen('home')} step={step} total={problems.length}>
      <div className={`bg-white kid-shadow rounded-[2rem] p-8 md:p-12 text-center transition pop-in ${flashColor}`}>
        <div className="font-display text-6xl md:text-8xl font-bold text-gray-800 mb-2 tracking-tight">{p.question}</div>
        <div className="text-3xl md:text-4xl text-gray-400 font-display mb-6">= ?</div>
        <form onSubmit={submit} className="max-w-xs mx-auto">
          <input ref={inputRef} type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off"
            value={input} onChange={e => setInput(e.target.value.replace(/[^\d\-]/g, ''))}
            className="w-full text-center font-display text-5xl md:text-6xl p-5 rounded-2xl border-4 border-violet-200 focus:border-violet-400 focus:outline-none bg-violet-50" placeholder="?" />
          <button type="submit" disabled={input === ''} className="pressable mt-5 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-400 to-purple-600 text-white font-display font-bold text-xl kid-shadow disabled:opacity-40">
            {step + 1 === problems.length ? 'Finish ✓' : 'Next →'}
          </button>
        </form>
      </div>
    </ActivityShell>
  );
}

function ResultsCard({ color, title, score, total, items, onDone }) {
  const pct = score / total;
  const emoji = pct === 1 ? '🏆' : pct >= 0.8 ? '🌟' : pct >= 0.5 ? '🎉' : '💪';
  return (
    <div className="bg-white kid-shadow rounded-[2rem] p-8 md:p-10 pop-in text-center relative overflow-hidden">
      {pct >= 0.5 && <Confetti />}
      <div className="text-7xl mb-2">{emoji}</div>
      <div className="font-display text-3xl font-bold text-gray-800 mb-1">{title}</div>
      <div className={`font-display text-7xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{score}<span className="text-3xl text-gray-400">/{total}</span></div>
      <div className="mt-2 text-gray-500">
        {pct === 1 && 'Perfect score — amazing!'}
        {pct >= 0.8 && pct < 1 && 'Excellent work!'}
        {pct >= 0.5 && pct < 0.8 && 'Great effort!'}
        {pct < 0.5 && "Keep practising — you're getting better!"}
      </div>
      <div className="mt-6 max-h-72 overflow-auto text-left divide-y divide-gray-100 rounded-2xl border border-gray-100">
        {items.map((it, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 ${it.ok ? 'bg-emerald-50/50' : 'bg-rose-50/50'}`}>
            {it.ok ? <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <X className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />}
            <div className="text-gray-700">{it.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onDone} className={`pressable mt-6 px-10 py-4 rounded-2xl bg-gradient-to-r ${color} text-white font-display font-bold text-xl kid-shadow`}>Back to Home</button>
    </div>
  );
}

function Scoreboard({ progress, currentDay, setScreen }) {
  const avaTotal = totalPoints(progress.Ava);
  const laylaTotal = totalPoints(progress.Layla);
  const daysCompleted = Math.max(0, currentDay - 1);
  const leader = avaTotal === laylaTotal ? null : (avaTotal > laylaTotal ? 'Ava' : 'Layla');

  const perDay = [];
  for (let d = 1; d <= Math.max(currentDay, 1); d++) {
    const a = progress.Ava[`day${d}`] || {};
    const l = progress.Layla[`day${d}`] || {};
    const aSum = (a.spelling || 0) + (a.vocab || 0) + (a.writing || 0) + (a.math || 0);
    const lSum = (l.spelling || 0) + (l.vocab || 0) + (l.writing || 0) + (l.math || 0);
    const aDone = a.spelling !== undefined && a.vocab !== undefined && a.writing !== undefined && a.math !== undefined;
    const lDone = l.spelling !== undefined && l.vocab !== undefined && l.writing !== undefined && l.math !== undefined;
    if (aDone || lDone || d === currentDay) perDay.push({ d, a, l, aSum, lSum, aDone, lDone });
  }

  return (
    <div className="min-h-screen w-full p-5 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setScreen('home')} className="pressable bg-white kid-shadow rounded-2xl px-4 py-3 flex items-center gap-2 text-gray-700 font-semibold">
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
            <div key={n} className={`relative overflow-hidden rounded-[2rem] p-6 kid-shadow bg-gradient-to-br ${t.from} ${t.to} text-white`}>
              {isLeader && (<div className="absolute top-4 right-4 bg-white text-amber-700 rounded-full px-3 py-1 text-sm font-display font-bold flex items-center gap-1 shadow-lg"><Crown className="w-4 h-4" /> Leading</div>)}
              <div className="text-5xl mb-2">{t.emoji}</div>
              <div className="font-display text-3xl font-bold">{n}</div>
              <div className="font-display text-6xl font-bold mt-2">{total}</div>
              <div className="opacity-90">total points</div>
              <div className="opacity-80 text-sm mt-1">across {daysCompleted + (currentDay && (progress[n][`day${currentDay}`]) ? 1 : 0)} active days</div>
            </div>
          );
        })}
      </div>
      <div className="bg-white kid-shadow rounded-[2rem] p-5 md:p-7">
        <div className="font-display text-2xl font-bold text-gray-800 mb-4">Day by day</div>
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 md:gap-4 items-center text-sm">
          <div className="font-display text-gray-500 px-2">Day</div>
          <div className="font-display text-amber-600 px-2 text-center">🐶 Ava</div>
          <div className="font-display text-green-600 px-2 text-center">⚽ Layla</div>
          <div className="font-display text-gray-500 px-2 text-right">Winner</div>
          {perDay.length === 0 && (<div className="col-span-4 text-center text-gray-400 py-6">No days completed yet — get started!</div>)}
          {perDay.map(row => {
            const winner = row.aSum === row.lSum ? null : (row.aSum > row.lSum ? 'Ava' : 'Layla');
            const bothDone = row.aDone && row.lDone;
            return (
              <React.Fragment key={row.d}>
                <div className="font-display font-bold text-gray-700 px-2 py-3 md:text-lg">#{row.d}</div>
                <ScoreCell data={row.a} sum={row.aSum} done={row.aDone} color="ava" />
                <ScoreCell data={row.l} sum={row.lSum} done={row.lDone} color="layla" />
                <div className="px-2 py-3 text-right">
                  {bothDone ? (winner === null ? <span className="text-gray-500 font-semibold">Tie</span>
                    : <span className={`font-display font-bold flex items-center justify-end gap-1 ${winner === 'Ava' ? 'text-amber-600' : 'text-green-600'}`}><Crown className="w-4 h-4" /> {winner}</span>
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

function ScoreCell({ data, sum, done, color }) {
  const cls = color === 'ava' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
  const hi  = color === 'ava' ? 'text-amber-600' : 'text-green-600';
  return (
    <div className={`rounded-xl px-3 py-2 ${cls}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs space-x-1">
          <span>🔊{data.spelling ?? '–'}</span><span>📚{data.vocab ?? '–'}</span>
          <span>✏️{data.writing ?? '–'}</span><span>🧮{data.math ?? '–'}</span>
        </span>
        <span className={`font-display font-bold text-lg ${hi}`}>{sum || 0}{done && ' ✓'}</span>
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.5, color: colors[i % colors.length], rot: Math.random() * 360,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <div key={i} className="confetti-piece" style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s`, transform: `rotate(${p.rot}deg)` }} />
      ))}
    </div>
  );
}
