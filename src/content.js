// Static content banks. Deterministic: both sisters see the same content on the same day.

// --- New lesson imports for v3 (history, geography, science) ---
import { HISTORY_TOPICS, HISTORY_LESSONS, HISTORY_BRIEFS } from './lessons/history.js';
import { GEOGRAPHY_TOPICS, GEOGRAPHY_LESSONS, GEOGRAPHY_BRIEFS } from './lessons/geography.js';
import { SCIENCE_TOPICS, SCIENCE_LESSONS, SCIENCE_BRIEFS } from './lessons/science.js';

export const TOTAL_DAYS = 60;

/* ==========================================================================
   v3: LESSON SUBJECT ROTATION
   Subjects rotate by student's current day number (NOT by real calendar day).
   Day 1 → history, Day 2 → geography, Day 3 → science, Day 4 → history, …
   Every study session gets a fresh subject — no more repeated history days.
   ========================================================================== */

// Rotate subjects by day number, so every study session gets a different subject.
// Kept the old name lessonSubjectForDate for backward-compat, but now it ignores
// the argument and callers pass a day number instead. A wrapper helps callers
// that still pass a Date.
export function lessonSubjectForDay(day) {
  const d = Math.max(1, Math.floor(day || 1));
  const subjects = ['history', 'geography', 'science'];
  return subjects[(d - 1) % subjects.length];
}

// Back-compat wrapper. Pass a day number or a Date:
// - Number  → rotate by day
// - Date (legacy) → rotate by dayOfYear so it still rotates instead of repeating
export function lessonSubjectForDate(arg = new Date()) {
  if (typeof arg === 'number') return lessonSubjectForDay(arg);
  // Treat a Date as day-of-year to at least spread subjects across the week
  const d = arg instanceof Date ? arg : new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return lessonSubjectForDay(dayOfYear);
}

// Human-friendly subject metadata
export const SUBJECT_META = {
  history:   { name: 'History',   emoji: '🏛️', color: '#b45309', gradFrom: '#fef3c7', gradTo: '#fde68a', accent: '#92400e' },
  geography: { name: 'Geography', emoji: '🌍', color: '#0369a1', gradFrom: '#dbeafe', gradTo: '#bae6fd', accent: '#075985' },
  science:   { name: 'Science',   emoji: '🔬', color: '#6d28d9', gradFrom: '#ede9fe', gradTo: '#ddd6fe', accent: '#5b21b6' }
};

// Lesson topic/brief accessors
export function lessonTopicFor(subject, day) {
  const d = Math.max(1, Math.min(TOTAL_DAYS, day));
  if (subject === 'history')   return HISTORY_TOPICS[d-1];
  if (subject === 'geography') return GEOGRAPHY_TOPICS[d-1];
  if (subject === 'science')   return SCIENCE_TOPICS[d-1];
  return null;
}

export function hardcodedLessonFor(subject, day) {
  if (subject === 'history')   return HISTORY_LESSONS[day] || null;
  if (subject === 'geography') return GEOGRAPHY_LESSONS[day] || null;
  if (subject === 'science')   return SCIENCE_LESSONS[day] || null;
  return null;
}

export function lessonBriefFor(subject, day) {
  if (subject === 'history')   return HISTORY_BRIEFS[day] || '';
  if (subject === 'geography') return GEOGRAPHY_BRIEFS[day] || '';
  if (subject === 'science')   return SCIENCE_BRIEFS[day] || '';
  return '';
}

// A child's current target year (UK curriculum) for content tuning.
// Year 2 at start → Year 7 at end over 60 days.
export function targetYearFor(day) {
  if (day <= 10) return 2;
  if (day <= 20) return 3;
  if (day <= 30) return 4;
  if (day <= 40) return 5;
  if (day <= 50) return 6;
  return 7;
}

/* ---------------- SPELLING (tiered, cycles as needed) ---------------- */
export const SPELLING_BANK = [
  // ============================================================
  // Tier 1 (days 1-15) — Year 2 core
  // ============================================================
  'because','friend','people','enough','through','family','children','together','important',
  'remember','morning','evening','favourite','brother','sister','garden','another','sometimes','answer',
  'beautiful','between','breakfast','country','thought','laugh','listen','neighbour','surprise',
  'treasure','weather','wonder','library','science','picture','quickly','castle','double',
  'bicycle','daughter','brought','caught','perhaps','without','before','after','often','every',
  'should','would','could','which','women','water','write','wrote','written','above',
  'money','many','only','very','much','most','half','whole','until','while',
  'always','early','late','never','asleep','awake','broken','clean','dirty','empty',
  'flower','teacher','school','number','office','reply','simple','certain','paper','visit',

  // ============================================================
  // Tier 2 (days 16-30) — Year 3/4
  // ============================================================
  'chocolate','whisper','suddenly','imagine','delicious','wonderful','adventure','dangerous','mysterious','curious',
  'enormous','fantastic','magnificent','peculiar','sparkle','giggle','forgotten','invisible','mountain','squirrel',
  'elephant','umbrella','butterfly','pineapple','strawberry','vegetable','temperature','afternoon','kitchen','dinosaur',
  'celebrate','calendar','creature','discover','disappear','electric','exercise','explore','glittering',
  'amazing','believe','different','earlier','exciting','famous','forward','happened','history','island',
  'learned','machine','natural','promise','recent','special','station','stomach','strange','ordinary',
  'popular','possible','reasonable','therefore','thousand','tonight','travelling',
  'whistle','thirsty','twelve','journey','knight','kingdom','midnight','pillow','piano','pretend',
  'actually','business','breathe','centre','complete','continue','decide','describe','naughty','peaceful',

  // ============================================================
  // Tier 3 (days 31-45) — Year 5
  // ============================================================
  'happiness','hospital','knowledge','orchestra','parachute','quarrel','quicksand','scissors',
  'rhythm','rhinoceros','telescope','volcano','wilderness','xylophone','yesterday','ceremony','chemical',
  'courageous','definitely','effective','gorgeous','hurricane','identical','jealous','laboratory',
  'microphone','nightmare','obstacle','photograph','questionnaire','rehearse','satellite','sincere','strategy','tomorrow',
  'accident','accompany','achieve','aggressive','amateur','ancient','apparent','appreciate','approach','argument',
  'arrange','attached','available','awkward','bargain','bruise','cemetery','committee','community','convenience',
  'correspond','desperate','determined','develop','dictionary','disastrous','embarrass','environment','equipment',
  'especially','exaggerate','excellent','existence','experience','explanation','forty','frequently','government',
  'language','necessary','conscience','familiar',

  // ============================================================
  // Tier 4 (days 46-60) — Year 6/7 + stretch words
  // ============================================================
  'acquaintance','camouflage','conscientious','fluorescent','guarantee','hypothesis','illuminate','jeopardy','kaleidoscope',
  'labyrinth','miscellaneous','noticeable','perseverance','reminiscent','silhouette','thorough','unanimous','vulnerable','whimsical',
  'exquisite','poignant','quintessential','serendipity','magnificence','phenomenon','extraordinary','responsibility','opportunity','celebration',
  'accommodate','accompanied','achievement','category','communicate','conscious','controversy','criticise','curiosity',
  'definite','eighth','equipped','foreign','harass','hindrance','identity','immediately',
  'individual','interfere','interrupt','leisure','lightning','marvellous','mischievous','muscle',
  'occasionally','occupy','occurred','parallel','persuade','possession','privilege',
  'profession','programme','pronunciation','queue','recognise','recommend','relevant','restaurant',
  'rhyme','sacrifice','secretary','shoulder','signature','soldier','symbol','system',
  'variety','vehicle','yacht','zoo'
];

/* ---------------- VOCAB — word, definition, cloze sentence ----------------
   For usage question: sentence with {BLANK} replaces the target word.
   Distractors drawn from other words in the bank. */
export const VOCAB_BANK = [
  {w:'abundant',d:'existing in very large amounts', s:'The garden was {BLANK} with colourful flowers after the rain.'},
  {w:'admire',d:'to think highly of someone or something', s:'I really {BLANK} my big sister for being so brave.'},
  {w:'ancient',d:'very, very old; from long ago', s:'The {BLANK} castle had stood on the hill for a thousand years.'},
  {w:'astonish',d:'to surprise someone greatly', s:'The magician will {BLANK} you with his amazing tricks.'},
  {w:'brilliant',d:'very smart or extremely bright', s:'The sun was so {BLANK} we had to put on our sunglasses.'},
  {w:'cautious',d:'being careful to avoid danger', s:'Be {BLANK} when you cross the road and always look both ways.'},
  {w:'clever',d:'quick to understand; smart', s:'That was a very {BLANK} way to solve the puzzle.'},
  {w:'courageous',d:'very brave', s:'The {BLANK} firefighter rescued the cat from the tall tree.'},
  {w:'curious',d:'wanting to know or learn', s:'The {BLANK} kitten poked its nose into every box.'},
  {w:'delicate',d:'easy to break; very gentle', s:'Handle the butterfly carefully — its wings are very {BLANK}.'},
  {w:'determined',d:'firmly decided to do something', s:'She was {BLANK} to win the race no matter what.'},
  {w:'diligent',d:'working hard and carefully', s:'A {BLANK} student always finishes her homework on time.'},
  {w:'eager',d:'very excited and keen', s:'The puppies were {BLANK} to go outside and play.'},
  {w:'elegant',d:'graceful and stylish', s:'The dancer moved across the stage in an {BLANK} twirl.'},
  {w:'enormous',d:'extremely large', s:'A whale is an {BLANK} creature that lives in the sea.'},
  {w:'fascinate',d:'to attract strong interest', s:'Dinosaurs {BLANK} me — I read about them every night.'},
  {w:'fragile',d:'easily broken', s:'Please wrap the glass vase carefully because it is {BLANK}.'},
  {w:'generous',d:'willing to give and share', s:'It was {BLANK} of you to share your snack with your friend.'},
  {w:'gentle',d:'kind and soft in manner', s:'Be {BLANK} with the baby — she is only a week old.'},
  {w:'glimpse',d:'a quick look at something', s:'I only caught a {BLANK} of the fox before it ran away.'},
  {w:'gorgeous',d:'very beautiful', s:'What a {BLANK} sunset — the whole sky is pink and gold.'},
  {w:'grateful',d:'feeling thankful', s:'She wrote a {BLANK} letter to thank grandma for the present.'},
  {w:'hesitate',d:'to pause before doing something', s:'Do not {BLANK} — just dive into the pool!'},
  {w:'honest',d:'truthful and fair', s:'An {BLANK} friend always tells you the truth.'},
  {w:'humble',d:'not proud; modest', s:'Even though he won the trophy, he was very {BLANK} about it.'},
  {w:'imagine',d:'to picture something in your mind', s:'Can you {BLANK} a world where everyone could fly?'},
  {w:'immense',d:'extremely large', s:'From the top of the hill we could see the {BLANK} blue sea.'},
  {w:'inspect',d:'to look at very carefully', s:'The teacher stopped to {BLANK} every letter in my handwriting.'},
  {w:'jolly',d:'happy and cheerful', s:'Grandpa has a {BLANK} laugh that fills the whole room.'},
  {w:'journey',d:'a long trip', s:'Our {BLANK} to the seaside took three whole hours.'},
  {w:'leap',d:'to jump high or far', s:'The frog can {BLANK} from one lily pad to the next.'},
  {w:'loyal',d:'faithful and trustworthy', s:'A dog is a {BLANK} friend who will always stand by you.'},
  {w:'magnificent',d:'extremely beautiful or grand', s:'The peacock spread its {BLANK} rainbow tail.'},
  {w:'marvellous',d:'wonderful; amazing', s:'We had a {BLANK} time at the birthday party.'},
  {w:'mischievous',d:'playfully naughty', s:'The {BLANK} monkey stole a banana and ran off giggling.'},
  {w:'mysterious',d:'hard to understand or explain', s:'A {BLANK} noise was coming from behind the old door.'},
  {w:'observe',d:'to watch carefully', s:'Scientists {BLANK} the ants to learn how they build their nest.'},
  {w:'patient',d:'able to wait calmly', s:'You have to be {BLANK} when you are waiting for a kettle to boil.'},
  {w:'peculiar',d:'strange or unusual', s:'What a {BLANK} hat — it has a little clock on top!'},
  {w:'persist',d:'to keep trying, even when hard', s:'If you {BLANK}, you will get better at riding a bike.'},
  {w:'polite',d:'having good manners', s:'It is {BLANK} to say please and thank you.'},
  {w:'ponder',d:'to think carefully about something', s:'She sat quietly to {BLANK} what to write in her story.'},
  {w:'precious',d:'very valuable or loved', s:'Grandma\'s old ring is {BLANK} to our family.'},
  {w:'puzzle',d:'to confuse someone', s:'The strange riddle seemed to {BLANK} even the clever grown-ups.'},
  {w:'quiver',d:'to shake slightly', s:'The leaves began to {BLANK} in the cool autumn breeze.'},
  {w:'radiant',d:'shining brightly; glowing', s:'On her wedding day, mum had a {BLANK} smile.'},
  {w:'reluctant',d:'not wanting to do something', s:'The cat was {BLANK} to get into the bath.'},
  {w:'remarkable',d:'worth noticing; impressive', s:'It is {BLANK} how quickly a seed can grow into a plant.'},
  {w:'rescue',d:'to save from danger', s:'The brave lifeguard swam out to {BLANK} the swimmer.'},
  {w:'scamper',d:'to run quickly with short steps', s:'The squirrels {BLANK} up the tree when the dog barked.'},
  {w:'scarce',d:'not enough of something', s:'Fresh water became {BLANK} in the long, hot summer.'},
  {w:'serene',d:'calm and peaceful', s:'The lake was {BLANK} and still on the quiet morning.'},
  {w:'sincere',d:'honest and truthful', s:'Please accept my {BLANK} apology for breaking your toy.'},
  {w:'sly',d:'tricky and clever in a sneaky way', s:'The {BLANK} fox crept up to the chicken coop.'},
  {w:'sparkle',d:'to shine with little flashes', s:'The sea seemed to {BLANK} whenever the sun came out.'},
  {w:'splendid',d:'very impressive; wonderful', s:'What a {BLANK} idea for a birthday party!'},
  {w:'stubborn',d:'refusing to change your mind', s:'The {BLANK} donkey would not move an inch.'},
  {w:'sturdy',d:'strong and solid', s:'Make sure the ladder is {BLANK} before you climb up.'},
  {w:'swift',d:'very fast', s:'A cheetah is the {BLANK}est animal on land.'},
  {w:'terrific',d:'very good; excellent', s:'You did a {BLANK} job on your painting today.'},
  {w:'thrilled',d:'very excited and happy', s:'We were {BLANK} when we heard we were going to Disneyland.'},
  {w:'timid',d:'shy and easily frightened', s:'The new puppy was {BLANK} and hid under the sofa.'},
  {w:'tranquil',d:'quiet and peaceful', s:'The garden felt {BLANK} with only the sound of bees.'},
  {w:'triumph',d:'a great success or victory', s:'Winning the spelling bee was a real {BLANK} for the whole class.'},
  {w:'unique',d:'one of a kind; unlike anything else', s:'Every snowflake has a {BLANK} shape.'},
  {w:'vast',d:'very large in size or amount', s:'The desert stretched out in a {BLANK} sea of sand.'},
  {w:'vibrant',d:'full of life and energy', s:'The market was {BLANK} with colour and music.'},
  {w:'vivid',d:'very bright or clear', s:'I had a {BLANK} dream about flying over the clouds.'},
  {w:'wander',d:'to walk around without a plan', s:'We love to {BLANK} through the woods and collect pine cones.'},
  {w:'weary',d:'very tired', s:'After the long walk, the {BLANK} travellers sat down to rest.'},
  {w:'wise',d:'having good judgment from experience', s:'The {BLANK} old owl seemed to know all the forest\'s secrets.'},
  {w:'witness',d:'to see something happen', s:'We were lucky to {BLANK} a rainbow after the storm.'},
  {w:'yearn',d:'to want something very much', s:'I {BLANK} for the summer holidays to begin.'},
  {w:'zealous',d:'very eager and enthusiastic', s:'She is a {BLANK} football fan and never misses a match.'},
  {w:'blossom',d:'to flower or develop beautifully', s:'Cherry trees {BLANK} pink every spring.'},
  {w:'cherish',d:'to love and care for deeply', s:'I will {BLANK} the little necklace mum gave me forever.'},
  {w:'dazzle',d:'to shine so brightly it amazes', s:'The fireworks {BLANK} the crowd on bonfire night.'},
  {w:'flourish',d:'to grow well and succeed', s:'The little plant began to {BLANK} once we moved it to the sunny window.'},
  {w:'gleam',d:'to shine softly', s:'The polished trophy began to {BLANK} in the lamplight.'},
  {w:'harmony',d:'a pleasing combination', s:'The choir sang in perfect {BLANK}.'},
  {w:'invent',d:'to create something new', s:'One day I want to {BLANK} a robot that tidies my bedroom.'},
  {w:'jubilant',d:'extremely joyful', s:'The team was {BLANK} after scoring the winning goal.'},
  {w:'linger',d:'to stay longer than needed', s:'The smell of freshly baked bread seemed to {BLANK} in the air.'},
  {w:'nibble',d:'to eat with small bites', s:'The rabbit began to {BLANK} a carrot.'},
  {w:'opaque',d:'not see-through', s:'The frosted glass was {BLANK} so I could not see into the room.'},
  {w:'precise',d:'exactly correct', s:'A watchmaker has to be {BLANK} with every tiny piece.'},
  {w:'quest',d:'a long search for something', s:'The knight set off on a {BLANK} to find the dragon.'},
  {w:'soothe',d:'to make calm or comfortable', s:'Mum sang a quiet song to {BLANK} the crying baby.'},
  {w:'tremble',d:'to shake with fear or cold', s:'My knees began to {BLANK} before I went on stage.'},
  {w:'vanish',d:'to disappear suddenly', s:'The magician made the rabbit {BLANK} right before our eyes.'}
];

/* ---------------- WRITING PROMPTS (60) ---------------- */
export const WRITING_PROMPTS = [
  'Describe your favourite toy and why you love it.',
  'What would you do if you found a magic key?',
  'Write about your best friend and what makes them special.',
  'Describe the most delicious meal you have ever eaten.',
  'If you could have any superpower, what would it be and why?',
  'Write about a time you felt really proud of yourself.',
  'Describe your perfect day at the park.',
  'What would you pack for a trip to the moon?',
  'Write about your favourite animal and why you like it.',
  'If you could talk to an animal, which one would it be?',
  'Describe your bedroom so someone who has never seen it can picture it.',
  'What would you do if you woke up as a giant?',
  'Write about something that made you laugh really hard.',
  'Describe your family using three describing words for each person.',
  'If you had a time machine, where would you go first?',
  'Write about a dream you remember.',
  'Describe what you think clouds feel like.',
  'What would you do if you could fly for one day?',
  'Write about your favourite season and why.',
  'Describe a walk through a magical forest.',
  'What is the best gift you have ever received?',
  'Write about something kind you did for someone.',
  'Describe what lives at the bottom of the ocean.',
  'If you could invent something new, what would it be?',
  'Write about your favourite book and what happens in it.',
  'Describe a rainbow to someone who has never seen one.',
  'What would you do if you had a pet dragon?',
  'Write about a time you felt brave.',
  'Describe the perfect picnic.',
  'If you could live anywhere, where would you live?',
  'Write about your favourite game and how to play it.',
  'What is the best thing about being seven years old?',
  'Write about a time you helped somebody.',
  'Describe the taste of your favourite fruit.',
  'If you were in charge for one day, what would you do?',
  'Write about what you want to be when you grow up.',
  'What would you do if you met a fairy?',
  'Write about the funniest thing that ever happened to you.',
  'Describe a storm from inside your house.',
  'If you could have any pet, what would it be?',
  'Write about your favourite holiday memory.',
  'What would you do with a box of stars?',
  'Write about a time you tried something new.',
  'Describe your favourite place to visit.',
  'If your toys came alive at night, what would they do?',
  'Write about a secret hideout.',
  'Describe the best treehouse you can imagine.',
  'What would you do if you could make it snow?',
  'Write about your favourite thing to do with your sister.',
  'Describe a character from a story you made up.',
  'If you could change one thing about your school, what would it be?',
  'Write about something you are really good at.',
  'Describe a tiny creature that lives in your garden.',
  'If you had a robot friend, what would it do?',
  'Write about the smell of your favourite food.',
  'If trees could talk, what would they say?',
  'Write about your favourite memory with your family.',
  'Describe a mysterious door you find in a wall.',
  'What would you do if you found a treasure map?',
  'If you could invent a new flavour of ice cream, what would it be?'
];

/* ---------------- HARDCODED FALLBACK STORIES (15) ---------------- */
// Used if API fails. Days 1-15 hardcoded, rest come from Claude.
export const FALLBACK_STORIES = [
  {
    title: 'The Puppy Who Forgot How to Bark',
    story: `One sunny morning, a small golden puppy named Biscuit woke up with a funny feeling in his throat. He opened his mouth to bark, but only a tiny squeak came out.\n\n"Oh no!" thought Biscuit. "How will I tell the postman I'm friendly? How will I cheer for my football team on the telly?"\n\nHe padded into the garden and found his wise old cat friend, Marmalade. Biscuit squeaked and squeaked. Marmalade tilted her head."Have you tried warm milk?" she purred. Biscuit drank some. Still just a squeak.\n\nAll day, Biscuit visited his friends. The hen suggested singing. The fish offered silent blowing. The tortoise, very slowly, said "hmmmm". Nothing worked.\n\nAs the sun began to set, Biscuit sat in the garden feeling glum. Then a little bird landed on the fence and started chirping a happy tune. Biscuit forgot all about his squeak. He just wanted to say hello. Out of his mouth came the loudest, happiest BARK the garden had ever heard!\n\n"There you are!" laughed Marmalade. "You forgot about being worried, and your bark came back."\n\nBiscuit wagged his tail so hard he nearly toppled over. From that day on, whenever he felt a squeak coming, he would find a friend to say hello to — and the bark always came right back.`,
    questions: [
      {q:"What did Biscuit find came out instead of a bark?", options:["A loud woof","A tiny squeak","A happy song","Nothing at all"], correct:1},
      {q:"Who did Biscuit ask for help first?", options:["The postman","The tortoise","Marmalade the cat","A little bird"], correct:2},
      {q:"Why do you think Biscuit's bark came back?", options:["He drank more milk","He stopped worrying about it","The bird taught him","He practised all day"], correct:1},
      {q:"What lesson does the story teach?", options:["Cats are wiser than dogs","Warm milk fixes everything","Sometimes it helps to stop worrying","Birds can sing better than dogs"], correct:2}
    ]
  },
  {
    title: 'Mia and the Talking Cat',
    story: `Every Tuesday morning, something very strange happened at Mia's house. Her cat, Pepper, could talk.\n\nIt started when Mia was six. She woke up one Tuesday to find Pepper sitting on her pillow saying, "Good morning, Mia. You need to wear your red socks today."\n\nMia was so surprised she nearly fell out of bed. But she put on her red socks, and that day she found a lost pound coin on the pavement. After that, she listened very carefully to Pepper every Tuesday.\n\nThe strange thing was, Pepper never talked on any other day. Not Mondays, not Wednesdays. Only Tuesdays. Mia asked her mum about it, but mum just laughed and said, "Cats have their own secrets, darling."\n\nOne Tuesday, Mia was feeling worried about a school spelling test. Pepper hopped onto the table and said, "Don't worry about the letters, Mia. Worry about the story they tell."\n\nMia didn't really understand, but at school she tried to picture each spelling word as part of a little story. "Because" became a big elephant carrying a small elephant. "Friend" had the word "end" hidden inside. To her amazement, she got every single word right.\n\nWhen she ran home to tell Pepper, the cat just purred and licked her paw. It was Wednesday, after all. But Mia could have sworn she saw Pepper wink.`,
    questions: [
      {q:"What day of the week could Pepper talk?", options:["Monday","Tuesday","Wednesday","Every day"], correct:1},
      {q:"What did Pepper tell Mia to wear the first time?", options:["Red socks","A raincoat","Her trainers","A hat"], correct:0},
      {q:"What did Pepper's advice about the spelling test mean?", options:["To ignore the letters","To make each word into a little picture or story","To learn them by singing","To ask mum for help"], correct:1},
      {q:"Why do you think Pepper winked at the end?", options:["She had something in her eye","She was teasing Mia that she could really talk","She was tired","She wanted food"], correct:1}
    ]
  },
  {
    title: 'The Goalkeeper With Wings',
    story: `The Rainbow Rovers were the worst team in the school league. They hadn't won a match in three whole years. Their biggest problem was that no one wanted to be goalkeeper.\n\nOne Saturday, a new player turned up at practice. Her name was Robin, and she was very small, very quick, and — this was the strange part — she had a pair of fluffy wings sticking out of her jumper.\n\n"Can you be our goalkeeper?" asked the captain, Leo, a bit nervously.\n\n"I'll try," said Robin.\n\nIn the first match, something amazing happened. Every time the other team shot at the goal, Robin would flap her wings once and glide up high, catching the ball mid-air. By the end, the Rovers had won five-nil.\n\nThe other team complained. "It isn't fair! She has wings!"\n\nThe referee scratched his head. He checked the rule book. It said nothing about wings. "I suppose it's allowed," he said.\n\nAfter the match, Leo found Robin sitting quietly. "Thanks for saving our team," he said.\n\nRobin smiled. "Actually," she whispered, "the wings aren't real. They're just a costume. But they make me believe I can fly — and believing is half the battle."\n\nLeo's mouth fell open. That afternoon, he noticed that everyone on the team played better, just because they had started to believe.`,
    questions: [
      {q:"Why had the Rainbow Rovers not won in three years?", options:["They were lazy","No one wanted to be goalkeeper","Their pitch was too small","They had no football"], correct:1},
      {q:"What happened every time the other team shot at goal?", options:["Robin missed the ball","Robin flapped her wings and caught it","The ball bounced back","Leo saved it"], correct:1},
      {q:"What did Robin's wings turn out to be?", options:["Real feathered wings","A costume that gave her confidence","A trick of the light","Magic wings"], correct:1},
      {q:"What is the main idea of the story?", options:["You need magic to win at football","Believing in yourself helps you do your best","Goalkeepers are the most important players","Small players cannot be good at sport"], correct:1}
    ]
  },
  {
    title: 'The Sparkly Shoes',
    story: `Ella had never owned a pair of shoes as beautiful as the ones in the shop window. They were pink and silver and sparkled like a thousand tiny stars. She pressed her nose against the glass.\n\n"Mum, please?" she whispered.\n\nBut mum shook her head gently. "They're too dear, sweetheart. Perhaps for your birthday."\n\nElla's birthday was six whole months away. It felt like forever.\n\nThat weekend, Ella did something she had never done before. She emptied her old piggy bank, counted every penny, and decided to earn the rest. She helped Mrs Patel next door with her shopping. She washed the car with dad. She made bracelets from beads and sold them to her aunties for a pound each.\n\nWeek after week, she saved and saved. Sometimes she felt like giving up. Once she nearly spent her savings on a giant chocolate egg. But she always remembered those sparkly shoes.\n\nFinally, on a rainy Saturday, Ella walked into the shop with her own purse full of coins. The shopkeeper smiled kindly as she counted them out. The shoes fit perfectly.\n\nAs Ella danced down the street, splashing happily in a puddle, mum squeezed her hand. "You know what's even sparklier than those shoes?" mum said.\n\n"What?" asked Ella.\n\n"The way you never gave up."`,
    questions: [
      {q:"Why couldn't Ella buy the shoes at first?", options:["They didn't fit","They were too expensive","The shop was closed","Mum didn't like them"], correct:1},
      {q:"What did Ella do to earn money?", options:["She got pocket money","She helped neighbours and sold bracelets","She found a wallet","She did nothing"], correct:1},
      {q:"What nearly stopped Ella from saving?", options:["A chocolate egg","Rain","A broken piggy bank","Her friends"], correct:0},
      {q:"What did mum mean when she said something was 'sparklier than the shoes'?", options:["Her socks","Ella's determination not to give up","The puddle","The shopkeeper's smile"], correct:1}
    ]
  },
  {
    title: 'The Dragon Who Couldn\'t Breathe Fire',
    story: `Deep in the mountains lived a small purple dragon called Pip. Every dragon in the mountains could breathe fire — except Pip. No matter how hard he tried, all that came out of his mouth was a tiny puff of steam.\n\nThe other dragons didn't mean to be unkind, but sometimes they laughed. "Just try harder, Pip!" they said. Pip did try. He tried every single day. Nothing worked.\n\nOne cold winter, a terrible snowstorm trapped a family of mountain rabbits inside their burrow. Even the biggest, strongest dragons couldn't help — their fire melted the snow too fast and made everything collapse.\n\nPip hurried over. He puffed his tiny cloud of warm steam into the burrow, very gently. Slowly, slowly, the snow softened and shifted. The rabbits were able to crawl out safely, one by one.\n\n"You saved us!" squeaked the mother rabbit.\n\nPip blinked. He had never saved anyone before.\n\nWhen he flew back to the other dragons, the biggest dragon of all bowed her head. "We were wrong to laugh," she said. "You have something we don't. You are gentle."\n\nFrom that day on, whenever an animal was hurt or cold or scared, they came to find Pip. And Pip, who had once felt small and useless, discovered that being different can be exactly what the world needs.`,
    questions: [
      {q:"What came out of Pip's mouth instead of fire?", options:["Snow","Nothing","Steam","Sparks"], correct:2},
      {q:"Why couldn't the other dragons rescue the rabbits?", options:["They were asleep","Their fire melted the snow too fast","It was too cold","They were too big"], correct:1},
      {q:"What did Pip's steam do that fire could not?", options:["Make the rabbits laugh","Soften the snow gently","Keep the dragons warm","Melt the whole mountain"], correct:1},
      {q:"What is the main lesson of the story?", options:["Fire is always best","Dragons should not laugh","Being different can be a special gift","Rabbits live in burrows"], correct:2}
    ]
  },
  {
    title: 'The Trophy In The Attic',
    story: `Lola loved rainy days because rainy days meant the attic. The attic was full of boxes, each one holding a little piece of family history.\n\nOne wet Sunday, she climbed up with her torch and found a small, dusty trophy behind a stack of old books. It was gold coloured, with a tiny footballer on top. Engraved on the side were the words: "Top Scorer — 1987 — A. Roberts".\n\n"Mum!" Lola called. "Whose trophy is this?"\n\nMum came up, smiling in a faraway sort of way. "That's Auntie Amy's. She was the best striker in the whole school. I'd forgotten all about it."\n\n"Auntie Amy? But she can't even kick a ball now!"\n\n"Things change," said mum gently. "When I was your age, everyone thought Amy would play for England."\n\nThe next day, Lola took the trophy to the care home where Auntie Amy lived. Amy's eyes, which hadn't twinkled in a long while, lit up like two little lamps.\n\n"My trophy!" she whispered. "Oh, Lola, I remember that goal like it was yesterday. The rain was pouring down, the ball was slippery, and the goalkeeper thought I'd miss..."\n\nAuntie Amy told the story three times that afternoon, and each time her voice got a little stronger. When Lola hugged her goodbye, Amy held onto the trophy tightly.\n\n"Some old things," mum said on the way home, "aren't old at all when you dust them off."`,
    questions: [
      {q:"Where did Lola find the trophy?", options:["In the garden","In a shop","Behind books in the attic","At school"], correct:2},
      {q:"Who had won the trophy?", options:["Lola's mum","Auntie Amy","Uncle Bob","Lola herself"], correct:1},
      {q:"How did Auntie Amy react when she saw the trophy?", options:["She didn't recognise it","Her eyes lit up and she remembered","She was sad","She gave it away"], correct:1},
      {q:"What did mum's last sentence really mean?", options:["The trophy needed polishing","Memories can feel fresh when you share them","Old things are always best","Amy needed to clean more"], correct:1}
    ]
  },
  {
    title: 'The Whispering Seashell',
    story: `On a grey beach in Cornwall, a girl called Freya found a shell unlike any other. It was curled like a small horn, pink inside, and when she held it to her ear, she heard more than just the sound of the sea.\n\nShe heard a voice.\n\n"Hello there," whispered the shell.\n\nFreya nearly dropped it in surprise. "Did you just speak?"\n\n"Only to those who listen carefully," said the shell. "Most people are far too busy."\n\nFor the rest of the holiday, Freya carried the shell everywhere. It told her quiet stories — about pirates who hid gold in sea caves, about a mermaid who once rode a friendly porpoise, about an old fisherman who became a rock. Freya began to see the seaside as a place full of secrets.\n\nOn the last day, Freya packed her bag to go home. She held the shell and wondered whether to take it with her.\n\n"Leave me here, please," said the shell. "My stories belong to the sea. If you take me away, I'll go quiet."\n\nIt nearly broke Freya's heart. But she placed the shell gently back on the wet sand and walked up the beach.\n\nYears later, Freya would write books — wonderful books full of sea stories that children loved. And every book began with the same dedication: "For the shell that taught me how to listen."`,
    questions: [
      {q:"What made the shell different from others?", options:["It was bigger","It whispered stories","It was made of gold","It could float"], correct:1},
      {q:"Who did the shell speak to?", options:["Anyone who held it","Only people who listened carefully","Only adults","Only Freya"], correct:1},
      {q:"Why did Freya leave the shell behind?", options:["She forgot it","The shell asked to stay — it belonged to the sea","Her bag was full","It was broken"], correct:1},
      {q:"What did the shell help Freya grow up to do?", options:["Become a pirate","Write books filled with sea stories","Live by the sea","Study shells"], correct:1}
    ]
  },
  {
    title: 'The Stadium Under The Stars',
    story: `Nadia loved football more than anything — but there was no pitch near her flat and no team for girls her age. So every Tuesday and Thursday night, after homework, she would go up to the roof of her block of flats and play against the moon.\n\nShe would dribble an old tennis ball between flower pots, do keepy-uppies until the street lights flickered on, and whisper commentary in her best broadcaster voice. "And Nadia scores again! The crowd goes wild!"\n\nThe crowd was, of course, just the pigeons.\n\nOne night, an older boy from the flat below climbed up to fetch his lost frisbee. He saw Nadia performing a perfect step-over around a plant pot. He stopped and watched for a long time.\n\n"You're really good," he said. "Why aren't you playing for a team?"\n\nNadia shrugged. "There isn't one."\n\nThe next Saturday, the boy — whose name was Arjun — knocked on her door. He had spent the week ringing around. Six streets away, there was a new girls' team starting, but they needed one more player.\n\nFor the first time in her life, Nadia wore a real kit. She played her first match in pouring rain, on a proper pitch, with real goalposts. And when she scored — a sliding shot into the bottom corner — the crowd that cheered was much bigger than the pigeons.\n\nThat night she climbed back up to the rooftop, smiled at the moon, and thanked it for being her first ever supporter.`,
    questions: [
      {q:"Where did Nadia practise football?", options:["In the park","On her rooftop","At school","In her bedroom"], correct:1},
      {q:"Who were Nadia's 'crowd' when she practised alone?", options:["Her family","The pigeons","Her friends","The moon"], correct:1},
      {q:"What did Arjun do after watching her play?", options:["Joined her team","Found her a real team to join","Taught her tricks","Told her to stop"], correct:1},
      {q:"Why did Nadia thank the moon at the end?", options:["It had kept her company","It was her first ever supporter","It lit up the rooftop","She felt silly"], correct:1}
    ]
  },
  {
    title: 'Grandma\'s Garden Secret',
    story: `Grandma's garden grew the biggest, brightest flowers on the whole street. Neighbours often stopped to admire them. "What's your secret?" they would ask. Grandma would always just smile and say, "A little bit of love and a little bit of time."\n\nBut seven-year-old Priya was sure there was more to it. Every Saturday when she visited, she kept a close eye on grandma.\n\nOne week, she noticed grandma pause beside the roses and say something very quietly. Another week, grandma spent ten minutes simply looking at a single sunflower. The week after, she picked up a tiny beetle that had fallen over and gently placed it back on a leaf.\n\n"Grandma," Priya asked finally, "are you talking to the flowers?"\n\n"Perhaps," grandma said. "Or perhaps I'm just thanking them."\n\n"Thanking them for what?"\n\n"For waking me up in the morning with colour. For feeding the bees. For reminding me that patience makes beautiful things."\n\nPriya thought about this. She wasn't sure the flowers understood. But the next week, she brought a little notebook to the garden and wrote down everything that made her feel grateful. The soft grass. The humming bees. Grandma's warm hand in hers.\n\nBy the end of the summer, Priya's notebook was nearly full. And when she looked at grandma's flowers, it seemed to her that they were blooming just for the two of them.`,
    questions: [
      {q:"What did neighbours always ask grandma?", options:["For flowers","What her gardening secret was","To lend her tools","How old she was"], correct:1},
      {q:"What did Priya see grandma doing to a tiny beetle?", options:["Chasing it away","Placing it gently back on a leaf","Stepping on it","Feeding it"], correct:1},
      {q:"According to grandma, what was the real secret of her garden?", options:["Special soil","Love, time and gratitude","Talking to flowers","Expensive seeds"], correct:1},
      {q:"Why do you think Priya started writing things in a notebook?", options:["She was copying school","She wanted to practise gratitude like grandma","She was bored","Her mum told her to"], correct:1}
    ]
  },
  {
    title: 'The Red Wellies',
    story: `Ben's red wellies were his favourite thing in the world. They had a small scratch on one toe where he had slipped on a stone, and a paint splodge on the back from when he had been painting a wall with dad. They were slightly too big, but he would grow into them.\n\nBen wore his wellies everywhere he was allowed. He wore them to splash in puddles. He wore them to jump in leaves. He even wore them to walk to school on snowy mornings.\n\nOne rainy Saturday, a very small voice came from Ben's bedroom.\n\n"Puddle time?" said the wellies.\n\nBen blinked. He looked around the room. Had his wellies just spoken?\n\n"Yes, it's us," said the left welly. "We've been waiting. You've been indoors all morning. There are EIGHT puddles on your street and we haven't been in ANY of them."\n\nBen burst out laughing. He put on his raincoat, pulled on his wellies, and ran outside. SPLASH went puddle one. SPLOOSH went puddle two. By puddle eight, he was soaked, muddy, and grinning.\n\nWhen mum saw him at the door, she raised her eyebrows. Ben opened his mouth to explain. Then he noticed the wellies had gone completely quiet.\n\n"Fine," said mum, trying not to smile. "But next time, take an umbrella."\n\nThat night, Ben tucked his wellies in by the door and whispered goodnight. He thought he heard a tiny, sleepy, "See you in the next puddle."`,
    questions: [
      {q:"What made Ben's wellies special to him?", options:["They were new","They had marks from his adventures","They were expensive","They were magical"], correct:1},
      {q:"What did the wellies complain about?", options:["Being wet","Not having been in any puddles that morning","Being too small","Being dirty"], correct:1},
      {q:"How did Ben feel jumping in the puddles?", options:["Grumpy","Soaked, muddy and grinning","Scared","Bored"], correct:1},
      {q:"What did the wellies say at the end of the day?", options:["See you in the next puddle","Goodnight","Nothing","I'm tired"], correct:0}
    ]
  },
  {
    title: 'The Library That Came Alive',
    story: `Tom had never liked libraries. They were too quiet, too still, and far too full of books he didn't understand. But when his dad started working late, Tom had to go to the library after school to do his homework.\n\nOn the third evening, something strange happened. Tom was sitting alone in the children's corner when the clock ticked over to five minutes past six. Every light dimmed. Every book gave a little shiver.\n\nAnd then the books started to whisper.\n\nTom nearly fell off his chair. A book about dinosaurs rustled its pages and roared softly. A poetry book hummed a gentle tune. A book of fairy tales stood up on its own, walked across the shelf, and gave Tom a tiny wave.\n\n"Don't be scared," said a voice behind him.\n\nTom turned. It was Mrs Okafor, the librarian, smiling at him over her spectacles. "They only wake up when someone really needs them," she said.\n\n"Needs them for what?" asked Tom.\n\n"A friend. A story. A little adventure. Whatever you need most."\n\nTom thought for a long moment. Then he reached out to a book about sailing, which had a boy on the cover who looked a bit like him. The book hopped into his lap and opened itself.\n\nFrom that day on, Tom went to the library early. He came to know the books, and the books came to know him. And slowly, without really noticing, Tom turned into a reader.`,
    questions: [
      {q:"Why did Tom start going to the library after school?", options:["He loved reading","His dad was working late","His friends were there","He had to"], correct:1},
      {q:"What time did the books come alive?", options:["Six o'clock","Five past six","Midnight","Noon"], correct:1},
      {q:"According to Mrs Okafor, when do the books wake up?", options:["Every night","When someone really needs them","Only on weekends","When Tom visits"], correct:1},
      {q:"How did Tom change by the end of the story?", options:["He became a librarian","He turned into a reader","He learned to sail","He moved away"], correct:1}
    ]
  },
  {
    title: 'The Paintbrush Of Possible Things',
    story: `In a tiny shop on a narrow street, Emily spent the last of her birthday money on a paintbrush. It didn't look special — just a wooden handle and soft brown bristles — but the old shopkeeper winked as she handed it over.\n\n"Paint carefully," she said. "This brush shows you what's possible, if you dare."\n\nEmily didn't really understand. She took the brush home and that evening, she painted a picture of a garden in her notebook. Just flowers, a tree, a little bench.\n\nIn the morning, when she opened the notebook, the flowers had grown taller. The tree had a tiny robin in it. The bench had a book sitting on it that she was sure hadn't been there before.\n\nShe painted a picture of herself making a cake for her grandma. The next day, she noticed her grandma had posted, "I think I'll bake a cake today!" on the family group chat.\n\nShe painted her class football team winning a match. They won their next game four-nil.\n\nEmily began to understand. The paintbrush didn't change the world by magic — it changed what she noticed. It made her see all the tiny possibilities she had walked past before.\n\nThe paintbrush grew old, eventually, and one day the bristles all fell out. By then, it didn't matter. Emily had learned to paint possible things in her imagination without any help at all. And her notebooks were the happiest place she knew.`,
    questions: [
      {q:"What did the shopkeeper say the brush could do?", options:["Paint real gold","Show what's possible if you dare","Make people happy","Paint by itself"], correct:1},
      {q:"What happened to the garden picture overnight?", options:["It faded","The flowers had grown and a robin had appeared","Someone tore it","Nothing"], correct:1},
      {q:"What did Emily realise the paintbrush really did?", options:["Made magic happen","Changed what she noticed in the world","Painted food","Helped her draw better"], correct:1},
      {q:"Why didn't it matter when the brush wore out?", options:["She bought another one","She had learned to imagine possibilities herself","She stopped painting","The shop closed"], correct:1}
    ]
  },
  {
    title: 'Tortoise and the Tuesday Race',
    story: `Every Tuesday, the animals of Ambleberry Wood held a running race. It was mostly for fun, and everyone joined in — the squirrels, the foxes, the rabbits, and, right at the very back, an old tortoise called Marjorie.\n\nMarjorie never came anywhere close to winning. She always trundled over the finish line about half an hour after everyone else. But she always finished. Every single Tuesday. For forty-two years.\n\nOne Tuesday in summer, a visiting hare decided to make fun of her.\n\n"Why do you even bother?" he laughed. "You come last every single time!"\n\nMarjorie stopped, thought about it, and smiled her very slow smile. "Because coming last is not the same as giving up," she said. "And besides, I love the walk."\n\nThe other animals clapped. The hare went a little pink and hopped away.\n\nThe next Tuesday, Marjorie noticed something new. A little family of hedgehogs was walking beside her, taking their time. Behind them, a dormouse was having a little snooze halfway. Behind her, two tired older foxes were chatting in the sunshine.\n\n"I didn't know so many of us enjoyed the slow way," said the mother hedgehog.\n\nMarjorie twinkled. "We've always been here," she said. "Now and then, the world remembers to notice us."\n\nFrom then on, the race had two winners each Tuesday — the fastest, and the finisher who looked like they had enjoyed it the most. And more often than not, that was Marjorie.`,
    questions: [
      {q:"How long had Marjorie been in the race?", options:["Forty-two years","Four years","One year","Since last Tuesday"], correct:0},
      {q:"Why did Marjorie keep running even though she came last?", options:["She hoped to win","She loved the walk and never gave up","Someone made her","She wanted a medal"], correct:1},
      {q:"What did the hare do after Marjorie's reply?", options:["Laughed more","Went pink and hopped away","Joined Marjorie","Gave up"], correct:1},
      {q:"What new prize did the race start giving?", options:["Gold medals","One for the finisher who enjoyed it most","Sweets","A cup"], correct:1}
    ]
  },
  {
    title: 'The Star That Fell In The Back Garden',
    story: `One September evening, Leo heard a sound he had never heard before — a soft THUD from the back garden, as if something small had landed in the vegetable patch.\n\nHe ran outside in his pyjamas. There, between the carrots and the cabbages, was a tiny, glowing, golden star. It was about the size of his hand, and it was whispering softly, as if it had the hiccups.\n\n"Hic. Hic. HIC," said the star.\n\n"Oh dear," said Leo. "Are you alright?"\n\nThe star wobbled. "I slipped off my constellation. I don't know the way home."\n\nLeo wasn't sure what a constellation was, but he did know what lost felt like. Very gently, he scooped the star into an empty biscuit tin and carried it up to his bedroom. He looked through his dad's old astronomy book until he found a picture that matched.\n\n"I think you're from the Plough," he said. "Up there. See?"\n\nThe star brightened happily. But when Leo opened his window, it couldn't quite reach.\n\nLeo thought for a long moment. Then he tied the star carefully to a kite, waited for a breezy night, and ran down the garden path. Up, up, up the kite went — and with one last, happy hiccup, the star unhooked itself and zipped back to its place in the sky.\n\nLeo watched for a long time. He thought the Plough looked just a tiny bit brighter that night. Perhaps, he thought, it was the star waving goodnight.`,
    questions: [
      {q:"Where did the star land?", options:["On the roof","In the vegetable patch","In the tree","On the road"], correct:1},
      {q:"What sound did the star keep making?", options:["Singing","Hiccuping","Crying","Laughing"], correct:1},
      {q:"How did Leo help the star get home?", options:["He threw it","He tied it to a kite","He climbed a ladder","He called a rocket"], correct:1},
      {q:"Why did the Plough look brighter to Leo at the end?", options:["It was a full moon","He thought the star was waving goodnight","His eyes adjusted","It was closer"], correct:1}
    ]
  },
  {
    title: 'The Lost Postman',
    story: `Mr Dibbin had been the village postman for thirty years. He knew every house. He knew every dog. He knew which letterboxes nipped your fingers. Which gardens had slippery paths. Which gates you had to lift as well as push.\n\nBut one foggy morning, something went wrong. The fog was so thick that Mr Dibbin couldn't see two steps ahead of him. He tried to feel his way with his boots. He counted lampposts. He counted turns. And slowly, he realised he was, for the first time in his life, completely lost.\n\nHe stopped by what he thought was a hedge and sat down on his postbag. He had four letters left and not a clue where he was.\n\nJust then, a small voice piped up from somewhere near his knee. "Are you alright, sir?"\n\nMr Dibbin peered down. A little girl in wellies was looking up at him, very concerned.\n\n"Oh dear," he said. "I rather think I'm lost."\n\n"I know where you are," the girl said proudly. "You're outside Mrs Willow's cottage. That's number seven. I live at number three. I can show you the way."\n\nShe took his hand and, very slowly, walked him along the foggy lane, pointing out each garden gate. "That's number six, where the Jack Russell lives. That's number five, with the wonky mailbox." By the time they reached the end, Mr Dibbin had delivered every letter.\n\n"How did you know every house?" he asked.\n\nThe girl grinned. "You taught me. I watch you every morning from the window."\n\nMr Dibbin walked home smiling. Sometimes, he thought, the ones who look small are paying the most attention of all.`,
    questions: [
      {q:"How long had Mr Dibbin been a postman?", options:["Three years","Thirty years","Thirteen years","Thirty-three years"], correct:1},
      {q:"Why did he get lost that morning?", options:["He forgot the way","The fog was too thick to see","He was ill","He took a wrong turn"], correct:1},
      {q:"How did the little girl know where every house was?", options:["She was the other postman","She watched Mr Dibbin every morning","She had a map","She lived in every house"], correct:1},
      {q:"What is the main point of the story?", options:["Postmen get lost","Children pay close attention even when adults don't notice","Fog is dangerous","Villages are small"], correct:1}
    ]
  }
];
