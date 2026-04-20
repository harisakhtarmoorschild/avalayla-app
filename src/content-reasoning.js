/* ============================================================
   content-reasoning.js
   Verbal & non-verbal reasoning content for 11+ prep.
   - Verbal: hand-curated bank of 100+ questions across 4 tiers.
   - Non-verbal: procedural SVG generators (infinite questions).
   Tier 1 = easiest (Year 2/3) … Tier 4 = hardest (Year 5/6 stretch).
   ============================================================ */

/* ----------- VERBAL BANK -----------
   Each item: { type, question, options, correct (index), explain, tier }
   Types:
     'odd'       — odd one out: pick the word that doesn't fit
     'opposite'  — which word means the opposite?
     'synonym'   — which word means the same / similar?
     'analogy'   — X is to Y as A is to ? (pick from options)
     'hidden'    — hidden word: which small word is inside?
     'sequence'  — letter / position sequence: next item
     'compound'  — which word pairs with the given word?
*/
export const VERBAL_BANK = [
  /* ====== Tier 1 — gentle introduction (age 6-7) ====== */
  { type:'odd', tier:1, question:'Which is the odd one out?', options:['apple','banana','carrot','grape'], correct:2, explain:'Apple, banana and grape are fruits. Carrot is a vegetable.' },
  { type:'odd', tier:1, question:'Which is the odd one out?', options:['cat','dog','horse','table'], correct:3, explain:'Cat, dog and horse are animals. A table is furniture.' },
  { type:'odd', tier:1, question:'Which is the odd one out?', options:['red','blue','green','happy'], correct:3, explain:'Red, blue and green are colours. Happy is a feeling.' },
  { type:'odd', tier:1, question:'Which is the odd one out?', options:['car','bus','train','house'], correct:3, explain:'Car, bus and train move people. A house stays still.' },
  { type:'odd', tier:1, question:'Which is the odd one out?', options:['apple','pear','orange','potato'], correct:3, explain:'Potato grows underground — the others are fruits that grow on trees.' },

  { type:'opposite', tier:1, question:'Which word means the opposite of BIG?', options:['huge','small','tall','wide'], correct:1, explain:'Small is the opposite of big.' },
  { type:'opposite', tier:1, question:'Which word means the opposite of HOT?', options:['warm','sunny','cold','spicy'], correct:2, explain:'Cold is the opposite of hot.' },
  { type:'opposite', tier:1, question:'Which word means the opposite of FAST?', options:['quick','slow','fast','speedy'], correct:1, explain:'Slow is the opposite of fast.' },
  { type:'opposite', tier:1, question:'Which word means the opposite of UP?', options:['over','high','down','top'], correct:2, explain:'Down is the opposite of up.' },
  { type:'opposite', tier:1, question:'Which word means the opposite of HAPPY?', options:['cheerful','merry','sad','nice'], correct:2, explain:'Sad is the opposite of happy.' },

  { type:'synonym', tier:1, question:'Which word means almost the same as HAPPY?', options:['angry','joyful','tired','scared'], correct:1, explain:'Joyful means the same as happy.' },
  { type:'synonym', tier:1, question:'Which word means almost the same as BIG?', options:['small','tiny','large','short'], correct:2, explain:'Large means the same as big.' },
  { type:'synonym', tier:1, question:'Which word means almost the same as JUMP?', options:['hop','run','sit','crawl'], correct:0, explain:'Hop means the same as jump.' },
  { type:'synonym', tier:1, question:'Which word means almost the same as SHOUT?', options:['whisper','mumble','yell','talk'], correct:2, explain:'Yell means the same as shout.' },
  { type:'synonym', tier:1, question:'Which word means almost the same as QUICK?', options:['slow','fast','quiet','long'], correct:1, explain:'Fast means the same as quick.' },

  { type:'analogy', tier:1, question:'Dog is to puppy as cat is to…?', options:['kitten','cub','foal','calf'], correct:0, explain:'A baby dog is a puppy; a baby cat is a kitten.' },
  { type:'analogy', tier:1, question:'Bird is to nest as bee is to…?', options:['web','cave','hive','den'], correct:2, explain:'Birds live in nests; bees live in hives.' },
  { type:'analogy', tier:1, question:'Hand is to glove as foot is to…?', options:['hat','sock','coat','ring'], correct:1, explain:'A glove covers a hand; a sock covers a foot.' },
  { type:'analogy', tier:1, question:'Day is to night as sun is to…?', options:['rain','cloud','moon','star'], correct:2, explain:'The sun shines in the day; the moon shines at night.' },

  { type:'hidden', tier:1, question:'Which small word is hidden inside HEART?', options:['ear','art','hat','tea'], correct:0, explain:'HEART contains E-A-R: "ear".' },
  { type:'hidden', tier:1, question:'Which small word is hidden inside STONE?', options:['one','ton','not','sun'], correct:0, explain:'STONE contains O-N-E: "one".' },
  { type:'hidden', tier:1, question:'Which small word is hidden inside CHAIR?', options:['air','arm','car','her'], correct:0, explain:'CHAIR ends with A-I-R: "air".' },

  { type:'sequence', tier:1, question:'What letter comes next? A, C, E, G, …', options:['H','I','J','K'], correct:1, explain:'The pattern skips a letter each time: A→C→E→G→I.' },
  { type:'sequence', tier:1, question:'What letter comes next? B, D, F, H, …', options:['I','J','K','L'], correct:1, explain:'Skip one each time: B→D→F→H→J.' },
  { type:'sequence', tier:1, question:'What letter comes next? Z, Y, X, W, …', options:['T','U','V','A'], correct:2, explain:'The alphabet in reverse: Z→Y→X→W→V.' },

  { type:'compound', tier:1, question:'Which word makes a compound word with SUN?', options:['table','flower','happy','quick'], correct:1, explain:'SUN + FLOWER = sunflower.' },
  { type:'compound', tier:1, question:'Which word makes a compound word with RAIN?', options:['bow','dog','shoe','hat'], correct:0, explain:'RAIN + BOW = rainbow.' },
  { type:'compound', tier:1, question:'Which word makes a compound word with FOOT?', options:['pen','ball','ring','apple'], correct:1, explain:'FOOT + BALL = football.' },

  /* ====== Tier 2 — building up (age 7-8) ====== */
  { type:'odd', tier:2, question:'Which is the odd one out?', options:['robin','sparrow','eagle','salmon'], correct:3, explain:'Robin, sparrow and eagle are birds. Salmon is a fish.' },
  { type:'odd', tier:2, question:'Which is the odd one out?', options:['square','triangle','circle','pyramid'], correct:3, explain:'Square, triangle and circle are 2D shapes. A pyramid is 3D.' },
  { type:'odd', tier:2, question:'Which is the odd one out?', options:['hammer','saw','nail','screwdriver'], correct:2, explain:'Hammer, saw and screwdriver are tools. A nail is what you use them on.' },
  { type:'odd', tier:2, question:'Which is the odd one out?', options:['London','Paris','Europe','Rome'], correct:2, explain:'London, Paris and Rome are cities. Europe is a continent.' },
  { type:'odd', tier:2, question:'Which is the odd one out?', options:['whisper','mumble','shout','murmur'], correct:2, explain:'The others are quiet ways to speak. Shout is loud.' },

  { type:'opposite', tier:2, question:'Which word means the opposite of BRAVE?', options:['bold','fearful','strong','silly'], correct:1, explain:'Fearful (afraid) is the opposite of brave.' },
  { type:'opposite', tier:2, question:'Which word means the opposite of ANCIENT?', options:['old','modern','famous','broken'], correct:1, explain:'Modern (new) is the opposite of ancient.' },
  { type:'opposite', tier:2, question:'Which word means the opposite of GATHER?', options:['collect','scatter','group','find'], correct:1, explain:'Scatter (spread out) is the opposite of gather (bring together).' },
  { type:'opposite', tier:2, question:'Which word means the opposite of PERMIT?', options:['allow','forbid','accept','enjoy'], correct:1, explain:'Forbid (say no to) is the opposite of permit (allow).' },

  { type:'synonym', tier:2, question:'Which word means almost the same as ENORMOUS?', options:['small','tiny','gigantic','average'], correct:2, explain:'Gigantic means the same as enormous — very large.' },
  { type:'synonym', tier:2, question:'Which word means almost the same as BEGIN?', options:['finish','stop','start','wait'], correct:2, explain:'Start means the same as begin.' },
  { type:'synonym', tier:2, question:'Which word means almost the same as BRAVE?', options:['scared','courageous','weak','quiet'], correct:1, explain:'Courageous means the same as brave.' },
  { type:'synonym', tier:2, question:'Which word means almost the same as DELICATE?', options:['strong','fragile','heavy','thick'], correct:1, explain:'Fragile means the same as delicate — easily broken.' },

  { type:'analogy', tier:2, question:'Book is to read as song is to…?', options:['write','sing','dance','draw'], correct:1, explain:'You read a book; you sing a song.' },
  { type:'analogy', tier:2, question:'Fish is to water as bird is to…?', options:['nest','tree','air','ground'], correct:2, explain:'Fish swim in water; birds fly in the air.' },
  { type:'analogy', tier:2, question:'Pen is to write as knife is to…?', options:['eat','cook','cut','clean'], correct:2, explain:'A pen is used to write; a knife is used to cut.' },
  { type:'analogy', tier:2, question:'Tree is to forest as flower is to…?', options:['petal','garden','leaf','stem'], correct:1, explain:'Many trees make a forest; many flowers make a garden.' },

  { type:'hidden', tier:2, question:'Which small word is hidden inside TRAIN?', options:['rain','ran','tin','air'], correct:0, explain:'TRAIN contains R-A-I-N: "rain".' },
  { type:'hidden', tier:2, question:'Which small word is hidden inside PLANET?', options:['let','lane','plan','net'], correct:2, explain:'PLANET starts with P-L-A-N: "plan".' },
  { type:'hidden', tier:2, question:'Which small word is hidden inside THOUGHT?', options:['tough','ought','hot','got'], correct:1, explain:'THOUGHT contains O-U-G-H-T: "ought".' },
  { type:'hidden', tier:2, question:'Which small word is hidden inside SISTER?', options:['sit','ester','set','set'], correct:0, explain:'SISTER starts with S-I-S — and contains S-I-T: "sit" (s-i-s-t-e-r, take positions 1,3,4).' },

  { type:'sequence', tier:2, question:'What letter comes next? A, D, G, J, …', options:['L','M','N','K'], correct:1, explain:'The pattern skips 2 letters each time: +3. A→D→G→J→M.' },
  { type:'sequence', tier:2, question:'What comes next? Mon, Wed, Fri, …', options:['Sat','Sun','Tue','Thu'], correct:1, explain:'Days go every other: Monday, Wednesday, Friday, Sunday.' },
  { type:'sequence', tier:2, question:'What letter comes next? B, E, H, K, …', options:['N','M','L','O'], correct:0, explain:'Pattern: skip 2 letters (+3 each time). B→E→H→K→N.' },

  { type:'compound', tier:2, question:'Which word makes a compound word with MOON?', options:['light','drop','color','happy'], correct:0, explain:'MOON + LIGHT = moonlight.' },
  { type:'compound', tier:2, question:'Which word makes a compound word with BUTTER?', options:['knife','fly','bread','toast'], correct:1, explain:'BUTTER + FLY = butterfly.' },
  { type:'compound', tier:2, question:'Which word makes a compound word with BED?', options:['pillow','room','sleep','night'], correct:1, explain:'BED + ROOM = bedroom.' },

  /* ====== Tier 3 — 11+ target level (age 9-10) ====== */
  { type:'odd', tier:3, question:'Which is the odd one out?', options:['tulip','daisy','oak','rose'], correct:2, explain:'Tulip, daisy and rose are flowers. Oak is a tree.' },
  { type:'odd', tier:3, question:'Which is the odd one out?', options:['mercury','venus','europa','mars'], correct:2, explain:'Mercury, Venus and Mars are planets. Europa is a moon of Jupiter.' },
  { type:'odd', tier:3, question:'Which is the odd one out?', options:['gallop','trot','canter','slither'], correct:3, explain:'Gallop, trot and canter are horse movements. Slither is how snakes move.' },
  { type:'odd', tier:3, question:'Which is the odd one out?', options:['violin','cello','flute','guitar'], correct:2, explain:'Violin, cello and guitar are string instruments. Flute is a wind instrument.' },
  { type:'odd', tier:3, question:'Which is the odd one out?', options:['generous','kind','selfish','thoughtful'], correct:2, explain:'The others describe kindness. Selfish is the opposite.' },

  { type:'opposite', tier:3, question:'Which word means the opposite of RELUCTANT?', options:['slow','eager','unsure','angry'], correct:1, explain:'Eager (keen, willing) is the opposite of reluctant (unwilling).' },
  { type:'opposite', tier:3, question:'Which word means the opposite of ARTIFICIAL?', options:['fake','plastic','natural','pretty'], correct:2, explain:'Natural is the opposite of artificial (man-made).' },
  { type:'opposite', tier:3, question:'Which word means the opposite of TRANSPARENT?', options:['clear','thin','opaque','shiny'], correct:2, explain:'Opaque (cannot see through) is the opposite of transparent.' },
  { type:'opposite', tier:3, question:'Which word means the opposite of ABUNDANT?', options:['plentiful','scarce','rich','lots'], correct:1, explain:'Scarce (not enough) is the opposite of abundant (a lot).' },

  { type:'synonym', tier:3, question:'Which word means almost the same as INVESTIGATE?', options:['ignore','examine','destroy','hide'], correct:1, explain:'Examine (look carefully) means the same as investigate.' },
  { type:'synonym', tier:3, question:'Which word means almost the same as RELUCTANT?', options:['keen','unwilling','happy','loud'], correct:1, explain:'Unwilling means the same as reluctant.' },
  { type:'synonym', tier:3, question:'Which word means almost the same as COMMENCE?', options:['finish','begin','pause','repeat'], correct:1, explain:'Begin (start) means the same as commence.' },
  { type:'synonym', tier:3, question:'Which word means almost the same as CONCEAL?', options:['show','reveal','hide','find'], correct:2, explain:'Hide means the same as conceal.' },

  { type:'analogy', tier:3, question:'Petal is to flower as feather is to…?', options:['wing','bird','fly','nest'], correct:1, explain:'Petals are part of a flower; feathers are part of a bird.' },
  { type:'analogy', tier:3, question:'Oar is to boat as pedal is to…?', options:['car','road','bike','foot'], correct:2, explain:'An oar moves a boat; a pedal moves a bike.' },
  { type:'analogy', tier:3, question:'Doctor is to hospital as teacher is to…?', options:['book','school','pupil','lesson'], correct:1, explain:'Doctors work in hospitals; teachers work in schools.' },
  { type:'analogy', tier:3, question:'Symphony is to orchestra as novel is to…?', options:['pen','paper','author','library'], correct:2, explain:'An orchestra creates a symphony; an author writes a novel.' },

  { type:'hidden', tier:3, question:'Which small word is hidden at the end of CONSIDER?', options:['con','side','sider','idea'], correct:2, explain:'CONSIDER ends with S-I-D-E-R: "sider".' },
  { type:'hidden', tier:3, question:'Which small word is hidden inside AGAIN?', options:['gain','ago','nag','age'], correct:0, explain:'AGAIN contains G-A-I-N: "gain".' },
  { type:'hidden', tier:3, question:'Which small word is hidden inside SEARCH?', options:['reach','each','arch','cash'], correct:2, explain:'SEARCH contains A-R-C-H: "arch".' },

  { type:'sequence', tier:3, question:'What letter comes next? Z, W, T, Q, …', options:['M','N','O','P'], correct:1, explain:'Each step goes back 3 letters: Z→W→T→Q→N.' },
  { type:'sequence', tier:3, question:'What letter comes next? A, B, D, G, K, …', options:['P','O','N','Q'], correct:0, explain:'Steps grow: +1, +2, +3, +4, +5. K+5=P.' },
  { type:'sequence', tier:3, question:'What letter comes next? C, F, I, L, …', options:['M','O','N','P'], correct:1, explain:'Pattern +3 each: C→F→I→L→O.' },

  { type:'compound', tier:3, question:'Which word makes a compound word with LIGHT?', options:['house','fast','warm','happy'], correct:0, explain:'LIGHT + HOUSE = lighthouse.' },
  { type:'compound', tier:3, question:'Which word makes a compound word with WATER?', options:['cake','fall','quick','soft'], correct:1, explain:'WATER + FALL = waterfall.' },
  { type:'compound', tier:3, question:'Which word makes a compound word with THUNDER?', options:['storm','quick','small','quiet'], correct:0, explain:'THUNDER + STORM = thunderstorm.' },

  /* ====== Tier 4 — stretch (age 10+) ====== */
  { type:'odd', tier:4, question:'Which is the odd one out?', options:['iambic','sonnet','haiku','novel'], correct:3, explain:'Iambic, sonnet and haiku are types of poetry. A novel is prose.' },
  { type:'odd', tier:4, question:'Which is the odd one out?', options:['cumulus','cirrus','stratus','aurora'], correct:3, explain:'Cumulus, cirrus and stratus are cloud types. Aurora is the northern lights.' },
  { type:'odd', tier:4, question:'Which is the odd one out?', options:['mammal','reptile','amphibian','spider'], correct:3, explain:'Mammal, reptile and amphibian are vertebrate classes. A spider is an arachnid (invertebrate).' },

  { type:'opposite', tier:4, question:'Which word means the opposite of METICULOUS?', options:['precise','careless','thorough','neat'], correct:1, explain:'Careless (sloppy) is the opposite of meticulous (very careful).' },
  { type:'opposite', tier:4, question:'Which word means the opposite of BENEVOLENT?', options:['kind','generous','malicious','helpful'], correct:2, explain:'Malicious (wanting to harm) is the opposite of benevolent (kind).' },
  { type:'opposite', tier:4, question:'Which word means the opposite of VERBOSE?', options:['wordy','concise','talkative','loud'], correct:1, explain:'Concise (using few words) is the opposite of verbose (using too many).' },

  { type:'synonym', tier:4, question:'Which word means almost the same as BENEVOLENT?', options:['cruel','kind','lazy','clever'], correct:1, explain:'Kind (generous) means the same as benevolent.' },
  { type:'synonym', tier:4, question:'Which word means almost the same as LUCID?', options:['murky','clear','sleepy','strange'], correct:1, explain:'Clear (easy to understand) means the same as lucid.' },
  { type:'synonym', tier:4, question:'Which word means almost the same as ELOQUENT?', options:['silent','clumsy','articulate','shy'], correct:2, explain:'Articulate (speaks well) means the same as eloquent.' },

  { type:'analogy', tier:4, question:'Stanza is to poem as chapter is to…?', options:['page','book','word','story'], correct:1, explain:'A stanza is a section of a poem; a chapter is a section of a book.' },
  { type:'analogy', tier:4, question:'Pride is to lion as pack is to…?', options:['leader','wolf','cub','forest'], correct:1, explain:'A group of lions is called a pride; a group of wolves is called a pack.' },
  { type:'analogy', tier:4, question:'Cartographer is to map as biographer is to…?', options:['painting','life story','science','poem'], correct:1, explain:'A cartographer makes maps; a biographer writes life stories.' },

  { type:'sequence', tier:4, question:'What comes next? A1, C3, E5, G7, …', options:['H9','I9','J9','I8'], correct:1, explain:'Letter skips 1 (A,C,E,G,I) and number matches position (1,3,5,7,9).' },
  { type:'sequence', tier:4, question:'What letter comes next? B, D, H, N, …', options:['U','V','T','S'], correct:1, explain:'Steps double then add: +2, +4, +6, +8. N+8=V.' },

  { type:'hidden', tier:4, question:'Which small word is hidden at the start of DELIBERATE?', options:['liber','debate','deli','rate'], correct:2, explain:'DELIBERATE starts with D-E-L-I: "deli".' },
  { type:'hidden', tier:4, question:'Which small word is hidden inside CHAMPION?', options:['champ','ham','pion','amp'], correct:1, explain:'CHAMPION contains H-A-M: "ham".' }
];

export function getVerbalQuestionsForDay(day, tierOffset = 0, count = 5) {
  const baseTier = tierFromDay(day);
  const effectiveTier = clamp(baseTier + tierOffset, 1, 4);
  // Take from the target tier first, fall back to neighbours
  const pool = VERBAL_BANK.filter(q => q.tier === effectiveTier);
  const fallback = VERBAL_BANK.filter(q => q.tier === effectiveTier - 1 || q.tier === effectiveTier + 1);
  const all = [...pool, ...fallback];
  // Deterministic shuffle so both sisters see the same q's on same day at same tier
  const seed = day * 101 + effectiveTier * 13 + 7;
  return shuffleSeeded(all, seed).slice(0, count);
}

/* ----------- NON-VERBAL GENERATORS -----------
   Each returns: { type, svg: (selected)=>SVGString, options: [svgStr,...], correct, explain }
   Shapes drawn in a 100×100 viewBox for consistent sizing.
*/

const SHAPES = ['circle','square','triangle','pentagon','hexagon','star'];
const COLORS = ['#f472b6','#60a5fa','#fbbf24','#34d399','#a78bfa','#fb923c'];

function svgShape(shape, color = '#60a5fa', size = 48, rotation = 0, fill = true, dot = null) {
  // Returns inline SVG markup for one shape inside a 100x100 box.
  // dot: null | 'center' | 'topleft' | 'topright' etc
  const s = size;
  const cx = 50, cy = 50;
  const fillAttr = fill ? color : 'none';
  const strokeAttr = color;
  let shapeEl = '';
  if (shape === 'circle') shapeEl = `<circle cx="${cx}" cy="${cy}" r="${s/2}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="3" />`;
  else if (shape === 'square') shapeEl = `<rect x="${cx-s/2}" y="${cy-s/2}" width="${s}" height="${s}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="3" />`;
  else if (shape === 'triangle') shapeEl = `<polygon points="${cx},${cy-s/2} ${cx-s/2},${cy+s/2} ${cx+s/2},${cy+s/2}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="3" />`;
  else if (shape === 'pentagon') {
    const pts = [0,1,2,3,4].map(i => {
      const a = (i * 72 - 90) * Math.PI / 180;
      return `${cx + Math.cos(a) * s/2},${cy + Math.sin(a) * s/2}`;
    }).join(' ');
    shapeEl = `<polygon points="${pts}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="3" />`;
  }
  else if (shape === 'hexagon') {
    const pts = [0,1,2,3,4,5].map(i => {
      const a = (i * 60 - 30) * Math.PI / 180;
      return `${cx + Math.cos(a) * s/2},${cy + Math.sin(a) * s/2}`;
    }).join(' ');
    shapeEl = `<polygon points="${pts}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="3" />`;
  }
  else if (shape === 'star') {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s/2 : s/4;
      const a = (i * 36 - 90) * Math.PI / 180;
      pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
    }
    shapeEl = `<polygon points="${pts.join(' ')}" fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="3" />`;
  }
  const rotated = `<g transform="rotate(${rotation} ${cx} ${cy})">${shapeEl}</g>`;
  const dotMarkup = dot ? svgDot(dot) : '';
  return `<svg viewBox="0 0 100 100" width="80" height="80">${rotated}${dotMarkup}</svg>`;
}
function svgDot(pos) {
  const map = {
    'center': [50,50], 'topleft':[22,22], 'topright':[78,22],
    'bottomleft':[22,78], 'bottomright':[78,78], 'top':[50,18], 'bottom':[50,82], 'left':[18,50], 'right':[82,50]
  };
  const [x,y] = map[pos] || [50,50];
  return `<circle cx="${x}" cy="${y}" r="5" fill="#1f2937" />`;
}

// -- Generator: next shape in a sequence of rotations --
function genRotationSequence(seed, tier) {
  const rng = mulberry32Inner(seed);
  const shape = pick(rng, SHAPES.slice(0, 4)); // pick easier shapes at low tiers
  const color = pick(rng, COLORS);
  const step = (tier <= 2) ? 45 : 30;
  const start = Math.floor(rng() * 8) * step;
  // Build 3 shown rotations, 4th is the answer
  const rotations = [start, start + step, start + 2*step, start + 3*step];
  const shownSvgs = rotations.slice(0, 3).map(r => svgShape(shape, color, 50, r));
  const answerRotation = rotations[3];
  // Make 3 distractors: wrong rotations
  const wrongs = [answerRotation + step, answerRotation - step, answerRotation + step * 2];
  const options = [svgShape(shape, color, 50, answerRotation), ...wrongs.map(r => svgShape(shape, color, 50, r))];
  const order = shuffleSeeded([0,1,2,3], seed + 99);
  const shuffled = order.map(i => options[i]);
  const correct = order.indexOf(0);
  return {
    type: 'rotation',
    question: 'Which shape comes next in the pattern?',
    showSequence: shownSvgs,
    options: shuffled,
    correct,
    explain: `The shape rotates by ${step}° each step. The next rotation continues the pattern.`
  };
}

// -- Generator: odd shape out --
function genOddShapeOut(seed, tier) {
  const rng = mulberry32Inner(seed);
  const shape = pick(rng, SHAPES);
  const color = pick(rng, COLORS);
  const oddShape = pick(rng, SHAPES.filter(s => s !== shape));
  // 3 of same shape with tiny differences (rotation only), 1 different shape
  const normals = [svgShape(shape, color, 50, 0), svgShape(shape, color, 50, 30), svgShape(shape, color, 50, 60)];
  const odd = svgShape(oddShape, color, 50, 0);
  const all = [...normals, odd];
  const order = shuffleSeeded([0,1,2,3], seed + 7);
  const shuffled = order.map(i => all[i]);
  const correct = order.indexOf(3);
  return {
    type: 'odd-shape',
    question: 'Which shape is the odd one out?',
    options: shuffled,
    correct,
    explain: `Three of the shapes are ${shape}s. The odd one is a ${oddShape}.`
  };
}

// -- Generator: shape + dot analogy --
function genShapeDotAnalogy(seed, tier) {
  const rng = mulberry32Inner(seed);
  const s1 = pick(rng, SHAPES.slice(0,4));
  const s2 = pick(rng, SHAPES.slice(0,4).filter(x => x !== s1));
  const dotPos = pick(rng, ['topleft','topright','bottomleft','bottomright','center']);
  // Pair: s1 with dot, s1 alone. Question: s2 alone → s2 with dot?
  const given1 = svgShape(s1, '#60a5fa', 50, 0, true, dotPos);
  const given2 = svgShape(s1, '#60a5fa', 50, 0, true, null);
  const prompt = svgShape(s2, '#f472b6', 50, 0, true, null);
  const answer = svgShape(s2, '#f472b6', 50, 0, true, dotPos);
  const wrongPositions = ['topleft','topright','bottomleft','bottomright','center'].filter(p => p !== dotPos);
  const wrongs = wrongPositions.slice(0, 3).map(p => svgShape(s2, '#f472b6', 50, 0, true, p));
  const all = [answer, ...wrongs];
  const order = shuffleSeeded([0,1,2,3], seed + 3);
  const shuffled = order.map(i => all[i]);
  const correct = order.indexOf(0);
  return {
    type: 'dot-analogy',
    question: 'Complete the pattern:',
    showAnalogy: { given1, given2, prompt },
    options: shuffled,
    correct,
    explain: `The first pair shows the shape with and without a dot in the ${dotPos.replace(/(top|bottom|left|right|center)/g, ' $1')} position. The answer applies the same change.`
  };
}

// -- Generator: which is the same as first? (rotation equivalence) --
function genRotationMatch(seed, tier) {
  const rng = mulberry32Inner(seed);
  const shape = pick(rng, ['triangle', 'pentagon', 'star']); // asymmetric enough
  const color = pick(rng, COLORS);
  const baseRotation = Math.floor(rng() * 12) * 30;
  const target = svgShape(shape, color, 55, baseRotation);
  // Correct: another rotation of same shape
  const correctRot = baseRotation + 120;
  const correctSvg = svgShape(shape, color, 55, correctRot);
  // Distractors: different shapes same color, or mirrored
  const wrongShapes = SHAPES.filter(s => s !== shape).slice(0, 3);
  const wrongs = wrongShapes.map(s => svgShape(s, color, 55, baseRotation));
  const all = [correctSvg, ...wrongs];
  const order = shuffleSeeded([0,1,2,3], seed + 17);
  const shuffled = order.map(i => all[i]);
  const correct = order.indexOf(0);
  return {
    type: 'rotation-match',
    question: 'Which shape is the same as the first one (but turned)?',
    showPrompt: target,
    options: shuffled,
    correct,
    explain: `All four options could look like the prompt, but only one is the same shape (${shape}) — the others are different shapes made to look similar.`
  };
}

// -- Generator: count the shapes hidden in a pattern --
function genCountShapes(seed, tier) {
  const rng = mulberry32Inner(seed);
  const shape = pick(rng, ['triangle','square','circle']);
  const shapeColor = pick(rng, COLORS);
  const count = 3 + Math.floor(rng() * (tier + 2)); // tier 1: 3-4, tier 4: 3-7
  let markup = '';
  // Place count shapes at spread positions
  const positions = [];
  for (let i = 0; i < count; i++) {
    const x = 15 + (i % 4) * 22 + (Math.floor(i / 4) * 8);
    const y = 20 + Math.floor(i / 4) * 25 + (i % 2) * 5;
    positions.push([x, y]);
  }
  positions.forEach(([x, y]) => {
    if (shape === 'triangle') markup += `<polygon points="${x},${y-8} ${x-8},${y+6} ${x+8},${y+6}" fill="${shapeColor}" stroke="#1f2937" stroke-width="1.5"/>`;
    else if (shape === 'square') markup += `<rect x="${x-7}" y="${y-7}" width="14" height="14" fill="${shapeColor}" stroke="#1f2937" stroke-width="1.5"/>`;
    else markup += `<circle cx="${x}" cy="${y}" r="7" fill="${shapeColor}" stroke="#1f2937" stroke-width="1.5"/>`;
  });
  // Add some distractor shapes (different)
  const distractorShape = shape === 'circle' ? 'triangle' : 'circle';
  for (let i = 0; i < 2; i++) {
    const x = 20 + i * 60;
    const y = 75;
    if (distractorShape === 'triangle') markup += `<polygon points="${x},${y-6} ${x-6},${y+5} ${x+6},${y+5}" fill="#e5e7eb" stroke="#6b7280" stroke-width="1.5"/>`;
    else markup += `<circle cx="${x}" cy="${y}" r="6" fill="#e5e7eb" stroke="#6b7280" stroke-width="1.5"/>`;
  }
  const prompt = `<svg viewBox="0 0 120 100" width="220" height="180" style="background:#f9fafb;border-radius:12px;">${markup}</svg>`;
  // Options: correct count + distractors
  const options = [String(count), String(count - 1), String(count + 1), String(count + 2)];
  const order = shuffleSeeded([0,1,2,3], seed + 41);
  const shuffled = order.map(i => options[i]);
  const correct = order.indexOf(0);
  return {
    type: 'count',
    question: `How many ${shape}s do you see?`,
    showPrompt: prompt,
    options: shuffled,
    correct,
    explain: `Count only the coloured ${shape}s. There are ${count}.`
  };
}

const NON_VERBAL_GENERATORS = [genRotationSequence, genOddShapeOut, genShapeDotAnalogy, genRotationMatch, genCountShapes];

export function getNonVerbalQuestionsForDay(day, tierOffset = 0, count = 5) {
  const baseTier = tierFromDay(day);
  const effectiveTier = clamp(baseTier + tierOffset, 1, 4);
  const questions = [];
  for (let i = 0; i < count; i++) {
    // Seed varies by day, question index, and tier so content is stable per-day but different per-question
    const seed = day * 1000 + i * 71 + effectiveTier * 13;
    const gen = NON_VERBAL_GENERATORS[i % NON_VERBAL_GENERATORS.length];
    questions.push(gen(seed, effectiveTier));
  }
  return questions;
}

/* ----------- Utilities ----------- */
function tierFromDay(day) {
  if (day <= 15) return 1;
  if (day <= 30) return 2;
  if (day <= 45) return 3;
  return 4;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function mulberry32Inner(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleSeeded(arr, seed) {
  const rng = mulberry32Inner(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
