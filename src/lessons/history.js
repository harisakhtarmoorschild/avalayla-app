/* ==========================================================================
   HISTORY CURRICULUM — 60 lessons, Year 2 → Year 7 UK curriculum
   ========================================================================== */

// Topic index — used to generate lessons 16-60 via API
export const HISTORY_TOPICS = [
  // DAYS 1-15 (hardcoded below) — foundational, KS1/early KS2
  'Who were the first humans?',                              // 1
  'Stone Age Britain',                                       // 2
  'The Bronze Age and Iron Age',                             // 3
  'Ancient Egypt: Pharaohs and Pyramids',                    // 4
  'Ancient Egypt: Daily Life by the Nile',                   // 5
  'The Ancient Greeks: City-states and Gods',                // 6
  'The Ancient Greeks: Democracy and the Olympics',          // 7
  'The Romans: The Rise of an Empire',                       // 8
  'The Romans in Britain',                                   // 9
  'The Vikings: Longships and Raiders',                      // 10
  'Anglo-Saxon Britain',                                     // 11
  'The Norman Conquest of 1066',                             // 12
  'Life in a Medieval Castle',                               // 13
  'Knights, Jousts, and Chivalry',                           // 14
  'The Black Death',                                         // 15

  // DAYS 16-30 — KS2 deepening (API-generated from these topics)
  'The Magna Carta',                                         // 16
  'The Wars of the Roses',                                   // 17
  'The Tudors: King Henry VIII and his Six Wives',           // 18
  'Elizabeth I and the Spanish Armada',                      // 19
  'Shakespeare and the Globe Theatre',                       // 20
  'The Gunpowder Plot',                                      // 21
  'The English Civil War',                                   // 22
  'The Great Fire of London',                                // 23
  'The Plague in London',                                    // 24
  'Pirates of the Caribbean',                                // 25
  'Captain Cook and the Exploration of the Pacific',         // 26
  'The Industrial Revolution Begins',                        // 27
  'Life in a Victorian Factory',                             // 28
  'Queen Victoria and the British Empire',                   // 29
  'Brunel and the Age of Engineering',                       // 30

  // DAYS 31-45 — KS3 territory (Years 7-8), broadening scope
  'Ancient China: The Great Wall and the Silk Road',         // 31
  'The Mayans and their Calendar',                           // 32
  'The Aztecs of Mexico',                                    // 33
  'The Inca Empire of the Andes',                            // 34
  'The Mughal Empire of India',                              // 35
  'The Ottoman Empire',                                      // 36
  'The Renaissance in Italy',                                // 37
  'The Age of Exploration: Columbus and Magellan',           // 38
  'The Slave Trade and its Abolition',                       // 39
  'The American Revolution',                                 // 40
  'The French Revolution',                                   // 41
  'Napoleon and the Battle of Waterloo',                     // 42
  'The American Civil War',                                  // 43
  'The Suffragettes and Votes for Women',                    // 44
  'The First World War',                                     // 45

  // DAYS 46-60 — later KS3 (Year 8-9) — modern history
  'Life in the Trenches',                                    // 46
  'The Russian Revolution',                                  // 47
  'The Roaring Twenties',                                    // 48
  'The Great Depression',                                    // 49
  'The Rise of Hitler and Nazi Germany',                     // 50
  'The Second World War Begins',                             // 51
  'The Blitz and Evacuation',                                // 52
  'D-Day and the Liberation of Europe',                      // 53
  'The Holocaust: Remembering the Victims',                  // 54
  'The Atom Bomb and the End of WWII',                       // 55
  'The Cold War: A World Divided',                           // 56
  'The Space Race',                                          // 57
  'The Civil Rights Movement',                               // 58
  'The Fall of the Berlin Wall',                             // 59
  'Britain and the World Today'                              // 60
];

/* ---------- Hardcoded rich lessons for days 1-15 ---------------------------
   Each has: title, topic, slides (title, text, imageQuery OR imageUrl,
   optional animation key), quiz (10 MCQ with 4 options + correct idx + cheer),
   hasVideo (odd-numbered), bitesizeQuery (for "Learn more" link).
   ------------------------------------------------------------------------ */

export const HISTORY_LESSONS = {
  1: {
    title: 'Who were the first humans?',
    intro: 'Long, long ago — before there were any towns or schools or even farms — the very first people walked the Earth. Let\'s discover who they were!',
    slides: [
      { title: 'A very, very long time ago', text: 'About 300,000 years ago, the first humans lived in Africa. They looked a bit like us but their lives were completely different — no houses, no phones, no chocolate! They were called Homo sapiens, which means "wise human".',
        imageQuery: 'early humans africa illustration',
        imageFallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Homo_sapiens_lived_throughout_Africa.jpg/640px-Homo_sapiens_lived_throughout_Africa.jpg' },
      { title: 'Hunters and gatherers', text: 'Early humans moved around in small groups, hunting animals like deer and gathering berries, nuts, and roots to eat. They didn\'t stay in one place for long — they followed the food!',
        imageQuery: 'prehistoric hunter gatherers cave painting' },
      { title: 'The amazing power of fire', text: 'One of the biggest discoveries ever was how to control fire. Fire kept them warm, cooked their food, scared away wild animals, and gave them light in dark caves at night. Imagine cold nights with no fire!',
        imageQuery: 'early humans fire cave',
        animation: 'fire' },
      { title: 'Tools made from stone', text: 'They didn\'t have metal yet, so they made tools from stone — sharp blades for cutting meat, heavy hammers for breaking things, and pointed tips for their spears. That\'s why we call it the Stone Age.',
        imageQuery: 'stone age tools flint' },
      { title: 'Amazing cave art', text: 'In caves all across the world, early humans painted beautiful pictures of animals like bison, horses, and mammoths. Some of these paintings are over 30,000 years old and we can still see them today!',
        imageQuery: 'lascaux cave paintings horses' },
      { title: 'They became us!', text: 'Slowly, over thousands of years, humans spread all over the Earth. Every single person alive today — you, me, everyone — is descended from those very first humans in Africa. Isn\'t that amazing?',
        imageQuery: 'world map human migration' }
    ],
    questions: [
      { q: 'Where did the first humans live?', options: ['Africa', 'Antarctica', 'Australia', 'America'], correct: 0, cheer: 'Exactly! Africa is where it all began.' },
      { q: 'About how long ago did Homo sapiens first appear?', options: ['100 years', '1,000 years', '10,000 years', '300,000 years'], correct: 3, cheer: 'Wow — that\'s a LOT of birthdays!' },
      { q: 'What does "Homo sapiens" mean?', options: ['Cave person', 'Wise human', 'Tall hunter', 'First one'], correct: 1, cheer: 'Yes! We\'re the "wise humans" — clever us!' },
      { q: 'What did early humans mostly eat?', options: ['Pizza', 'Bread from shops', 'Hunted animals and gathered plants', 'Cake'], correct: 2, cheer: 'Right — they were hunter-gatherers.' },
      { q: 'Why was fire so important?', options: ['To make phones work', 'To warm them and cook food', 'To water plants', 'To send letters'], correct: 1, cheer: 'Spot on! Fire changed everything.' },
      { q: 'What were their tools made of?', options: ['Plastic', 'Metal', 'Stone', 'Wood only'], correct: 2, cheer: 'Yes — that\'s why we call it the Stone Age!' },
      { q: 'Where did early humans paint pictures?', options: ['On paper', 'On cave walls', 'On sand', 'On trees'], correct: 1, cheer: 'Brilliant — and some paintings are still there today!' },
      { q: 'Why did early people move around so much?', options: ['They liked holidays', 'To follow food', 'They had cars', 'For fun'], correct: 1, cheer: 'Correct! They followed the herds and the seasons.' },
      { q: 'Who is descended from the first humans?', options: ['Only some people', 'Everyone alive today', 'No one', 'Only people in Africa'], correct: 1, cheer: 'That\'s right — we\'re all cousins!' },
      { q: 'What animals did early humans paint in caves?', options: ['Dragons', 'Cars', 'Bison, horses, mammoths', 'Cats only'], correct: 2, cheer: 'Yes! Amazing real animals.' }
    ],
    hasVideo: true,
    videoId: 'kMHDvAiHxWc',
    bitesizeQuery: 'early humans prehistoric'
  },

  2: {
    title: 'Stone Age Britain',
    intro: 'Before Britain had castles or cities, it was home to people we call the Stone Age Britons. Let\'s travel back in time!',
    slides: [
      { title: 'Britain covered in ice', text: 'About 12,000 years ago, Britain was a very cold place, covered in ice sheets like Antarctica is today. When the ice melted, grassy land and forests appeared, and people slowly moved in.',
        imageQuery: 'ice age britain landscape illustration' },
      { title: 'Walking to Britain', text: 'You couldn\'t sail to Britain back then — you didn\'t need to! Britain was joined to Europe by land, a place called Doggerland. People and animals simply walked across from what is now France and the Netherlands.',
        imageQuery: 'doggerland map prehistoric britain' },
      { title: 'Farming changes everything', text: 'Around 6,000 years ago, people learned to farm. Instead of chasing animals for dinner, they kept sheep, cows, and pigs. Instead of hunting wild plants, they grew wheat and barley. This meant they could stay in one place and build homes.',
        imageQuery: 'neolithic farming ancient britain' },
      { title: 'Stonehenge: a mysterious circle', text: 'Around 5,000 years ago, people in southern Britain built a huge circle of stones called Stonehenge. Some of the stones weigh more than a bus! Nobody knows exactly why they built it, but it might have been to track the seasons or worship the sun.',
        imageQuery: 'stonehenge sunrise wiltshire',
        animation: 'stonehenge' },
      { title: 'Stone Age homes', text: 'Stone Age families lived in roundhouses with thatched roofs made of straw. In the middle was a fire where they cooked. They slept on animal skins. At a place called Skara Brae in Scotland, you can still see a whole Stone Age village buried under sand for 5,000 years!',
        imageQuery: 'skara brae orkney stone age village' },
      { title: 'Clever, creative people', text: 'Stone Age people were clever! They made beautiful jewellery from shells, built boats from hollowed-out trees, and even performed brain surgery! They were much more than "cavemen".',
        imageQuery: 'stone age jewellery artefacts museum' }
    ],
    questions: [
      { q: 'About how long ago was Britain covered in ice?', options: ['100 years', '1,000 years', '12,000 years', '1 million years'], correct: 2, cheer: 'A seriously chilly time!' },
      { q: 'How did the first people get to Britain?', options: ['By plane', 'By boat', 'They walked across land', 'They swam'], correct: 2, cheer: 'Yes — Britain was joined to Europe then!' },
      { q: 'What is the name of the lost land that linked Britain to Europe?', options: ['Atlantis', 'Doggerland', 'Britannia', 'Iceland'], correct: 1, cheer: 'Correct — now under the North Sea!' },
      { q: 'What huge change happened about 6,000 years ago?', options: ['People invented cars', 'People learned to farm', 'Ice returned', 'Phones were made'], correct: 1, cheer: 'Brilliant — farming changed life forever.' },
      { q: 'What famous stone circle sits in southern Britain?', options: ['Stonehenge', 'Big Ben', 'The Eiffel Tower', 'The Colosseum'], correct: 0, cheer: 'That\'s the one!' },
      { q: 'Why might people have built Stonehenge?', options: ['To park cars', 'To track the seasons and worship', 'As a swimming pool', 'For sport'], correct: 1, cheer: 'Well done — nobody knows for sure, but this is a good guess.' },
      { q: 'What is Skara Brae?', options: ['A type of food', 'A stone circle', 'A Stone Age village in Scotland', 'A cave painting'], correct: 2, cheer: 'Exactly — buried for 5,000 years!' },
      { q: 'What animals did Stone Age farmers keep?', options: ['Lions', 'Sheep, cows, pigs', 'Dragons', 'Penguins'], correct: 1, cheer: 'Yes — the start of British farming.' },
      { q: 'What did Stone Age homes have for heating and cooking?', options: ['Radiators', 'A fire in the middle', 'Microwaves', 'Electric heaters'], correct: 1, cheer: 'Correct — simple but effective.' },
      { q: 'What were Stone Age people actually like?', options: ['Silly and lazy', 'Not very clever', 'Skilled and creative', 'Afraid of everything'], correct: 2, cheer: 'Exactly! They were very impressive.' }
    ],
    hasVideo: true,
    videoId: 'pWHCyyWCCLc',
    bitesizeQuery: 'stone age britain'
  },

  3: {
    title: 'The Bronze Age and Iron Age',
    intro: 'One day, someone discovered that hot metal could be shaped into almost anything. That changed the world forever.',
    slides: [
      { title: 'A shiny new idea', text: 'About 4,500 years ago, people in Britain learned a magical trick — they could heat rocks until they turned into liquid metal, and then shape that metal into tools and weapons. The first metal they used was bronze, made by mixing copper and tin.',
        imageQuery: 'bronze age metalworking' },
      { title: 'Why bronze was better', text: 'Bronze tools were much better than stone ones — sharper, stronger, and easier to replace. Bronze farmers could plough bigger fields, and bronze warriors could make fierce swords. This time is called the Bronze Age.',
        imageQuery: 'bronze age sword artefact',
        animation: 'metal-forge' },
      { title: 'Iron: even stronger!', text: 'About 2,800 years ago, people learned to work with iron. Iron is much more common than the metals for bronze, so tools became cheaper and more people could have them. This was the Iron Age.',
        imageQuery: 'iron age blacksmith reenactment' },
      { title: 'Hill forts everywhere', text: 'Iron Age Britons built huge hill forts — villages surrounded by deep ditches and tall wooden walls on top of hills. You can still see the shapes of many hill forts today, like Maiden Castle in Dorset.',
        imageQuery: 'maiden castle dorset hill fort' },
      { title: 'The Celts', text: 'The people living in Britain during the Iron Age are often called Celts. They were famous for their beautiful swirling art, their warrior culture, and their druids — wise priests who knew stories, laws, and medicine.',
        imageQuery: 'celtic art swirls jewellery' },
      { title: 'Life in an Iron Age village', text: 'Iron Age families lived in big round houses with one room inside for the whole family. They grew wheat, kept animals, and traded with other villages for salt, tin, and fancy pottery from far away. Life was hard but exciting!',
        imageQuery: 'iron age village roundhouse reconstruction' }
    ],
    questions: [
      { q: 'What is bronze made from?', options: ['Iron and gold', 'Copper and tin', 'Silver and lead', 'Stone and clay'], correct: 1, cheer: 'Correct — clever chemistry!' },
      { q: 'About how long ago did the Bronze Age begin in Britain?', options: ['1,000 years', '4,500 years', '100 years', '20 years'], correct: 1, cheer: 'Yes — a long time before Romans!' },
      { q: 'Why were bronze tools better than stone ones?', options: ['Heavier', 'Prettier only', 'Sharper and stronger', 'They made noise'], correct: 2, cheer: 'Exactly right.' },
      { q: 'Which metal came after bronze?', options: ['Gold', 'Silver', 'Plastic', 'Iron'], correct: 3, cheer: 'Yes! The Iron Age started next.' },
      { q: 'Why did iron change more lives than bronze?', options: ['It was rarer', 'It was prettier', 'It was more common, so cheaper', 'It was invisible'], correct: 2, cheer: 'Spot on!' },
      { q: 'What are hill forts?', options: ['Beach huts', 'Villages on hills with walls and ditches', 'Forts in space', 'Tiny castles for toys'], correct: 1, cheer: 'Yes — they were defensive villages.' },
      { q: 'What were the Iron Age people in Britain often called?', options: ['Vikings', 'Romans', 'Celts', 'Saxons'], correct: 2, cheer: 'That\'s right!' },
      { q: 'Who were druids?', options: ['Soldiers', 'Merchants', 'Priests and wise people', 'Bakers'], correct: 2, cheer: 'Excellent!' },
      { q: 'What shape were Celtic houses?', options: ['Square', 'Round', 'Triangle', 'Star'], correct: 1, cheer: 'Yes — big friendly circles.' },
      { q: 'What were the Celts famous for making in their art?', options: ['Photos', 'Swirling patterns', 'Plain lines', 'Stick figures'], correct: 1, cheer: 'Beautiful, curvy Celtic art!' }
    ],
    hasVideo: true,
    videoId: 'cH_uowNBJno',
    bitesizeQuery: 'iron age celts britain'
  },

  4: {
    title: 'Ancient Egypt: Pharaohs and Pyramids',
    intro: 'Long ago, in the hot sands of Egypt, one of the most amazing civilizations in history built giant pyramids that still stand today.',
    slides: [
      { title: 'A gift of the river', text: 'Ancient Egypt was built along the River Nile, the longest river in the world. Every year the Nile flooded, leaving behind rich black mud that was perfect for growing food. Without the Nile, there would have been no Egypt — just desert.',
        imageQuery: 'river nile egypt ancient farming' },
      { title: 'Pharaohs: god-kings', text: 'Egypt was ruled by a Pharaoh — a king who was believed to be part god. Pharaohs wore a special double crown showing that they ruled both Upper and Lower Egypt. Their word was law, and they were treated almost like living gods.',
        imageQuery: 'egyptian pharaoh double crown statue' },
      { title: 'The Great Pyramids', text: 'The Pharaohs built enormous stone tombs to be buried in. The Great Pyramid of Giza was built for Pharaoh Khufu about 4,500 years ago. It has over 2 million stone blocks, some weighing as much as an elephant. It was the tallest building in the world for over 3,800 years!',
        imageQuery: 'great pyramid giza khufu',
        animation: 'pyramid-build' },
      { title: 'Mummies', text: 'Egyptians believed in life after death. When a Pharaoh died, they carefully preserved the body as a mummy — drying it out and wrapping it in cloth. They filled the tomb with gold, food, and treasure for the Pharaoh\'s journey to the afterlife.',
        imageQuery: 'egyptian mummy sarcophagus museum' },
      { title: 'Tutankhamun: the boy king', text: 'Tutankhamun became Pharaoh when he was only 9 years old! He died young and was almost forgotten — until 1922, when an explorer named Howard Carter found his tomb still packed with treasure, including his famous gold mask.',
        imageQuery: 'tutankhamun golden mask' },
      { title: 'Gods with animal heads', text: 'Ancient Egyptians worshipped many gods. Some had human bodies and animal heads: Anubis the jackal guided the dead, Horus the falcon watched over the Pharaoh, and Bastet the cat protected homes. Cats were so loved that harming one was punishable by death!',
        imageQuery: 'egyptian gods anubis horus hieroglyphs' }
    ],
    questions: [
      { q: 'What river was Ancient Egypt built along?', options: ['Thames', 'Nile', 'Amazon', 'Ganges'], correct: 1, cheer: 'Yes — the life-giving Nile!' },
      { q: 'What was a Pharaoh?', options: ['A type of bread', 'Egypt\'s king', 'A pet', 'A pyramid'], correct: 1, cheer: 'Correct!' },
      { q: 'Why did the Nile make Egypt special?', options: ['Its floods left rich mud for crops', 'It was colourful', 'It had gold in it', 'It could fly'], correct: 0, cheer: 'Exactly — the flood was a blessing.' },
      { q: 'What were pyramids built as?', options: ['Restaurants', 'Tombs for pharaohs', 'Houses', 'Schools'], correct: 1, cheer: 'Spot on — giant tombs.' },
      { q: 'About how old is the Great Pyramid of Giza?', options: ['4,500 years', '500 years', '100 years', '50 years'], correct: 0, cheer: 'Ancient indeed!' },
      { q: 'What is a mummy?', options: ['A mother', 'A preserved dead body wrapped in cloth', 'A type of fruit', 'A dance'], correct: 1, cheer: 'Yes — wrapped up for the afterlife!' },
      { q: 'How old was Tutankhamun when he became Pharaoh?', options: ['30', '50', '9', '70'], correct: 2, cheer: 'Just a boy!' },
      { q: 'Who discovered Tutankhamun\'s tomb in 1922?', options: ['Indiana Jones', 'Howard Carter', 'Cleopatra', 'Julius Caesar'], correct: 1, cheer: 'Right — real-life treasure hunter!' },
      { q: 'Which Egyptian god had the head of a jackal?', options: ['Horus', 'Bastet', 'Anubis', 'Ra'], correct: 2, cheer: 'Excellent.' },
      { q: 'What animal was especially loved in Ancient Egypt?', options: ['Dogs', 'Cats', 'Sheep', 'Snakes'], correct: 1, cheer: 'Yes — cats were almost holy!' }
    ],
    hasVideo: true,
    videoId: 'DklFWjDJMzA',
    bitesizeQuery: 'ancient egypt pyramids'
  },

  5: {
    title: 'Ancient Egypt: Daily Life by the Nile',
    intro: 'What was it really like to be a normal Egyptian, not a king? Let\'s find out!',
    slides: [
      { title: 'Life in a mud-brick house', text: 'Most Egyptians lived in small houses made of mud bricks, dried hard by the sun. The flat rooftops were used like extra rooms — people dried food up there, slept there on hot nights, and chatted with neighbours.',
        imageQuery: 'egyptian village mud brick houses' },
      { title: 'Breakfast, lunch, and dinner', text: 'Egyptians ate lots of bread made from wheat, and drank beer even at breakfast (don\'t try this at home!). Rich Egyptians had meat, duck, figs, dates, and honey cakes. Everyone ate fish from the Nile and vegetables like onions, garlic, and leeks.',
        imageQuery: 'ancient egyptian food bread beer' },
      { title: 'Fashion and make-up', text: 'Egyptians loved looking good! They wore white linen clothes because it was so hot. Both men and women wore eye make-up — black kohl around their eyes — partly for beauty and partly to protect from the fierce desert sun.',
        imageQuery: 'egyptian eye makeup kohl painting' },
      { title: 'Fun and games', text: 'Children played with wooden toys, leather balls, dolls with real hair, and board games. A game called Senet was like chess and snakes-and-ladders mixed together. Adults loved music, dancing, and hunting in the marshes.',
        imageQuery: 'ancient egyptian senet board game' },
      { title: 'Hieroglyphs: picture writing', text: 'Egyptians wrote using tiny pictures called hieroglyphs — over 700 of them! Only a few people could read and write; they were called scribes, and they had important, well-paid jobs. Writing was done on paper made from a reed called papyrus.',
        imageQuery: 'egyptian hieroglyphs papyrus',
        animation: 'hieroglyphs' },
      { title: 'Jobs for everyone', text: 'Most Egyptians were farmers. Others were bakers, weavers, carpenters, jewellers, boat-builders, or priests. Kids often learned their parent\'s job. School was only for boys from important families, and the lessons were tough — but becoming a scribe was worth it!',
        imageQuery: 'ancient egyptian scribe painting' }
    ],
    questions: [
      { q: 'What were Egyptian houses made from?', options: ['Stone blocks', 'Mud bricks dried in the sun', 'Wood', 'Ice'], correct: 1, cheer: 'Correct!' },
      { q: 'Why did they use rooftops so much?', options: ['To grow flowers only', 'For sleeping and drying food', 'For swimming', 'To fly kites'], correct: 1, cheer: 'Spot on — handy in the heat.' },
      { q: 'What did Egyptians drink even at breakfast?', options: ['Coffee', 'Beer', 'Milkshakes', 'Juice'], correct: 1, cheer: 'Surprising but true!' },
      { q: 'What colour were most Egyptian clothes?', options: ['Black', 'Red', 'White', 'Blue'], correct: 2, cheer: 'Yes — cool linen to beat the heat.' },
      { q: 'What was kohl used for?', options: ['Eating', 'Drawing on walls', 'Eye make-up and sun protection', 'Washing hair'], correct: 2, cheer: 'Right — practical AND pretty!' },
      { q: 'What is Senet?', options: ['A type of food', 'An ancient board game', 'A boat', 'A king'], correct: 1, cheer: 'Yes — ancient gaming!' },
      { q: 'What is hieroglyphs writing made up of?', options: ['Letters like ours', 'Tiny pictures', 'Numbers', 'Music notes'], correct: 1, cheer: 'That\'s right!' },
      { q: 'What is papyrus?', options: ['A paper made from reeds', 'A type of pet', 'A god', 'A musical instrument'], correct: 0, cheer: 'Exactly!' },
      { q: 'What job did scribes do?', options: ['Cooking', 'Fishing', 'Reading and writing', 'Farming'], correct: 2, cheer: 'Yes — very respected!' },
      { q: 'Who mostly went to school?', options: ['Everyone', 'Boys from important families', 'Only girls', 'Nobody'], correct: 1, cheer: 'Correct — school wasn\'t open to all yet.' }
    ],
    hasVideo: true,
    videoId: '04cs4-BMsHo',
    bitesizeQuery: 'ancient egypt daily life'
  },

  6: {
    title: 'The Ancient Greeks: City-states and Gods',
    intro: 'In Ancient Greece, every city was like its own country! Let\'s meet them and their amazing gods.',
    slides: [
      { title: 'A land of many cities', text: 'Ancient Greece wasn\'t one big country. Instead, it was made up of hundreds of small city-states, each with its own government, army, and rules. The two most famous were Athens and Sparta — and they were very different!',
        imageQuery: 'ancient greece map city states' },
      { title: 'Athens: thinkers and artists', text: 'Athens was the city of ideas, art, and learning. People called philosophers would sit in the marketplace asking big questions — like "What is truth?" and "How should people live?". Socrates, Plato, and Aristotle were three of the greatest thinkers ever.',
        imageQuery: 'athens parthenon acropolis ancient greek' },
      { title: 'Sparta: the warrior city', text: 'Sparta was almost the opposite of Athens. Spartans were tough warriors who trained for battle from the age of seven. They lived in simple houses and ate plain food. A Spartan mother\'s proudest moment was seeing her son become a brave soldier.',
        imageQuery: 'spartan warrior helmet statue' },
      { title: 'Mount Olympus and the Twelve Gods', text: 'Greeks believed that twelve main gods lived on top of Mount Olympus. Zeus was king of the gods and threw lightning bolts. Poseidon ruled the seas. Athena was the goddess of wisdom. Each god had their own powers, symbols, and favourite animals.',
        imageQuery: 'mount olympus zeus greek gods',
        animation: 'olympus' },
      { title: 'Heroes and monsters', text: 'Greek stories are full of amazing heroes — like Hercules, who had super strength; Perseus, who beat a monster called Medusa; and Odysseus, who took ten years to sail home from a war and met giants, witches, and a one-eyed cyclops on the way.',
        imageQuery: 'greek mythology hercules medusa illustration' },
      { title: 'Why it still matters', text: 'Ideas from Ancient Greece shape our world today. Our word "democracy" comes from the Greek "demos-kratos" — people-power. The Olympic Games started in Greece. Many English words — like "mystery", "cinema", and "dinosaur" — come from Greek too!',
        imageQuery: 'olympic games ancient greece pottery' }
    ],
    questions: [
      { q: 'Was Ancient Greece one big country?', options: ['Yes', 'No, it was many city-states', 'It was a small village', 'It was empty'], correct: 1, cheer: 'Correct!' },
      { q: 'Which city was famous for thinkers and art?', options: ['Sparta', 'London', 'Athens', 'Rome'], correct: 2, cheer: 'Yes — the city of ideas!' },
      { q: 'What did Spartans train to be from age 7?', options: ['Scholars', 'Traders', 'Warriors', 'Farmers'], correct: 2, cheer: 'Tough start!' },
      { q: 'Who are Socrates, Plato, and Aristotle?', options: ['Warriors', 'Great philosophers', 'Kings of Sparta', 'Monsters'], correct: 1, cheer: 'Spot on — deep thinkers.' },
      { q: 'Where did Greek gods live?', options: ['Underwater', 'On Mount Olympus', 'In Egypt', 'In the Moon'], correct: 1, cheer: 'Right!' },
      { q: 'Who was the king of the Greek gods?', options: ['Zeus', 'Apollo', 'Poseidon', 'Ares'], correct: 0, cheer: 'Yes — and he threw lightning!' },
      { q: 'Who had super strength in Greek stories?', options: ['Hercules', 'Athena', 'Zeus', 'Medusa'], correct: 0, cheer: 'The famous strongman!' },
      { q: 'Who was Medusa?', options: ['A goddess', 'A monster with snakes for hair', 'A queen', 'A hero'], correct: 1, cheer: 'Spooky!' },
      { q: 'Where does the word "democracy" come from?', options: ['English', 'Latin', 'Greek', 'Egyptian'], correct: 2, cheer: 'Yes — demos-kratos, people-power!' },
      { q: 'What famous games started in Ancient Greece?', options: ['Video games', 'The Olympic Games', 'Football', 'Cricket'], correct: 1, cheer: 'Exactly right!' }
    ],
    hasVideo: true,
    videoId: 'qYdoBzgtlCw',
    bitesizeQuery: 'ancient greece athens sparta'
  },

  7: {
    title: 'The Ancient Greeks: Democracy and the Olympics',
    intro: 'The Ancient Greeks came up with two amazing ideas that we still use today — and both started in the city of Athens.',
    slides: [
      { title: 'Rule by the people', text: 'In most of the ancient world, a single king or queen made all the rules. But in Athens, about 2,500 years ago, they tried something brand new: ordinary men could vote on new laws and choose their leaders. They called it democracy — "people-power".',
        imageQuery: 'athenian democracy assembly pnyx' },
      { title: 'Voting with pebbles', text: 'Athenians voted by dropping coloured pebbles into a pot — white for yes, black for no. If they wanted to kick a nasty politician out of the city for ten years, they scratched his name on a broken piece of pottery called an ostracon (that\'s where we get the word "ostracised"!).',
        imageQuery: 'athenian voting ostracon pottery' },
      { title: 'Not quite fair yet', text: 'Athenian democracy was a great start, but it wasn\'t perfect. Only adult men born in Athens could vote. Women, children, slaves, and foreigners couldn\'t. It would take over 2,000 years before countries like Britain gave women the right to vote!',
        imageQuery: 'ancient greek women pottery daily life' },
      { title: 'The first Olympic Games', text: 'In 776 BC, the first Olympic Games were held at Olympia, a sacred site in Greece. Athletes came from every city-state, and even if they were at war, they paused the fighting to compete! The Olympics happened every four years — just like today.',
        imageQuery: 'ancient greek olympics pottery athletes',
        animation: 'olympic-torch' },
      { title: 'What they did at the Olympics', text: 'The Ancient Olympics included running, wrestling, boxing, discus, javelin, long jump, and chariot racing. The winners got no medals — they received olive wreaths and huge fame back home. Only men could compete, and they did so wearing… nothing at all!',
        imageQuery: 'ancient olympic games discus throw statue' },
      { title: 'The Olympic flame', text: 'Before each modern Olympics, a flame is lit in Greece at the ancient site of Olympia and carried by runners all around the world to the host city. It\'s a 3,000-year-old tradition connecting us to those first ancient games.',
        imageQuery: 'olympic flame torch relay ceremony' }
    ],
    questions: [
      { q: 'What does "democracy" mean?', options: ['King-power', 'People-power', 'Money-power', 'God-power'], correct: 1, cheer: 'Correct!' },
      { q: 'In which Greek city did democracy begin?', options: ['Sparta', 'Athens', 'Troy', 'Olympia'], correct: 1, cheer: 'Yes — thanks, Athens!' },
      { q: 'How did Athenians vote?', options: ['Raised hands only', 'Coloured pebbles in a pot', 'Phones', 'Shouting'], correct: 1, cheer: 'Clever system!' },
      { q: 'What was an "ostracon"?', options: ['A type of pasta', 'Broken pottery used to kick politicians out', 'A Greek god', 'A temple'], correct: 1, cheer: 'Right — that\'s where "ostracised" comes from!' },
      { q: 'Who could vote in Ancient Athens?', options: ['Everyone', 'Only adult men from Athens', 'Only women', 'Only children'], correct: 1, cheer: 'Correct — early days of democracy.' },
      { q: 'When were the first Olympic Games held?', options: ['776 BC', '1800 AD', '100 years ago', '10 years ago'], correct: 0, cheer: 'Very long ago indeed!' },
      { q: 'How often did (and do) the Olympics happen?', options: ['Every year', 'Every 4 years', 'Every 10 years', 'Once ever'], correct: 1, cheer: 'Yes!' },
      { q: 'What did ancient winners receive?', options: ['Gold medals', 'Money', 'Olive wreaths', 'Trophies'], correct: 2, cheer: 'Green crowns of fame.' },
      { q: 'During the Olympics, cities at war would…', options: ['Fight harder', 'Pause the fighting', 'Ignore the games', 'Send spies'], correct: 1, cheer: 'A peaceful pause!' },
      { q: 'What happens before each modern Olympics?', options: ['A flame is carried from Olympia', 'A parade through Paris', 'Football match', 'Boat race'], correct: 0, cheer: 'Keeping the ancient spirit alive!' }
    ],
    hasVideo: true,
    videoId: 'adpEGAh0GFw',
    bitesizeQuery: 'ancient greece democracy olympics'
  },

  8: {
    title: 'The Romans: The Rise of an Empire',
    intro: 'From a tiny village in Italy, the Romans built one of the biggest empires the world has ever seen.',
    slides: [
      { title: 'A city on seven hills', text: 'Legend says Rome was founded in 753 BC by two twin brothers, Romulus and Remus, who were raised by a wolf! Real Rome started as a small village on seven hills next to the River Tiber in Italy, and grew into a mighty city.',
        imageQuery: 'rome seven hills ancient map' },
      { title: 'The Roman Republic', text: 'For hundreds of years, Rome was a republic — run by elected leaders, not a king. Important decisions were made by the Senate, a group of wise older men. This gave us the word "senate" that many countries still use today.',
        imageQuery: 'roman senate cicero painting' },
      { title: 'Julius Caesar', text: 'In 49 BC, a brilliant general named Julius Caesar led his army into Rome and made himself the most powerful man in the Roman world. He was clever and popular but also made enemies. On 15th March 44 BC — the "Ides of March" — he was assassinated in the Senate by those enemies, including his friend Brutus.',
        imageQuery: 'julius caesar bust roman statue' },
      { title: 'The first Emperor', text: 'After Caesar\'s death came years of civil war, then a man called Augustus became the very first Roman Emperor. Rome was no longer a republic — it was an empire, ruled by one man. The month of August is named after him!',
        imageQuery: 'augustus statue prima porta' },
      { title: 'Roads that spanned a world', text: 'The Romans built 250,000 miles of straight, paved roads connecting their empire — from Britain to Egypt, Spain to Syria. That\'s like circling the Earth ten times! These roads helped armies march fast, goods travel, and news spread. Some Roman roads are still used today!',
        imageQuery: 'roman road appia italy paved stones',
        animation: 'roman-roads' },
      { title: 'One people, many languages', text: 'At its biggest, the Roman Empire stretched 3,000 miles wide and ruled over 60 million people speaking dozens of languages. They were united by Roman laws, Roman coins, and the Latin language. Latin is why English words like "language", "army", and "family" sound the way they do!',
        imageQuery: 'roman empire map greatest extent' }
    ],
    questions: [
      { q: 'Who, according to legend, founded Rome?', options: ['Julius Caesar', 'Romulus and Remus', 'Augustus', 'Hercules'], correct: 1, cheer: 'Yes — the twins raised by a wolf!' },
      { q: 'Rome was first a…', options: ['Kingdom', 'Republic', 'Dictatorship', 'Democracy like Athens'], correct: 1, cheer: 'That\'s right — elected leaders.' },
      { q: 'What was the Senate?', options: ['A temple', 'A group of wise leaders', 'An army', 'A school'], correct: 1, cheer: 'Exactly!' },
      { q: 'Who made himself ruler of Rome in 49 BC?', options: ['Romulus', 'Julius Caesar', 'Augustus', 'Cicero'], correct: 1, cheer: 'Yes!' },
      { q: 'What happened on the "Ides of March"?', options: ['Caesar was crowned', 'Caesar was assassinated', 'Rome burned', 'War began'], correct: 1, cheer: 'A famous date in history.' },
      { q: 'Who was Rome\'s first Emperor?', options: ['Julius Caesar', 'Romulus', 'Augustus', 'Nero'], correct: 2, cheer: 'And August is named after him!' },
      { q: 'Roughly how many miles of roads did the Romans build?', options: ['250 miles', '2,500 miles', '25,000 miles', '250,000 miles'], correct: 3, cheer: 'Mind-boggling!' },
      { q: 'Why were Roman roads so useful?', options: ['They glowed in the dark', 'They let armies and goods move fast', 'They floated', 'Only for tourists'], correct: 1, cheer: 'Exactly.' },
      { q: 'Roughly how many people lived in the Roman Empire at its biggest?', options: ['60 thousand', '600 thousand', '6 million', '60 million'], correct: 3, cheer: 'Huge!' },
      { q: 'What language did the Romans speak?', options: ['Greek', 'Latin', 'English', 'Italian'], correct: 1, cheer: 'Yes — and it shaped many modern languages!' }
    ],
    hasVideo: true,
    videoId: '3X7D8yz6QFg',
    bitesizeQuery: 'ancient rome empire caesar'
  },

  9: {
    title: 'The Romans in Britain',
    intro: 'In 43 AD, Roman legions crossed the sea and invaded Britain. They stayed for nearly 400 years!',
    slides: [
      { title: 'Caesar came first', text: 'Julius Caesar actually visited Britain twice — in 55 and 54 BC — but he didn\'t stay. About 100 years later, in 43 AD, the Emperor Claudius sent a huge army of 40,000 Roman soldiers across the Channel to conquer Britain for real.',
        imageQuery: 'roman invasion britain ships claudius' },
      { title: 'Boudicca fights back', text: 'Not all Britons were happy. Boudicca, the warrior queen of the Iceni tribe, led a huge rebellion in 60 AD. Her army burned Roman cities including London. She was eventually defeated but is still remembered as a British hero. A statue of her stands near Parliament today!',
        imageQuery: 'boudicca statue london queen warrior' },
      { title: 'Roman Britain: towns and baths', text: 'The Romans changed Britain completely. They built the first proper towns — like London (Londinium), York (Eboracum), and Bath (Aquae Sulis). They had running water, underfloor heating, and public baths where everyone went to wash, gossip, and relax.',
        imageQuery: 'roman baths bath england ancient' },
      { title: 'Hadrian\'s Wall', text: 'The Romans never conquered all of Britain. The wild tribes of Scotland kept raiding south, so Emperor Hadrian ordered a huge wall built in 122 AD. Hadrian\'s Wall stretches 73 miles across northern England. Large sections still stand — you can walk along it today!',
        imageQuery: 'hadrians wall northumberland',
        animation: 'hadrians-wall' },
      { title: 'Roman roads, Roman rules', text: 'The Romans built straight paved roads across Britain — Watling Street, Ermine Street, the Fosse Way. They introduced coins, Latin writing, new foods (cabbages, carrots, apples!), and grand stone architecture. Our calendar comes from Rome, along with words like "wine", "street", and "mile".',
        imageQuery: 'roman britain coin road mosaic' },
      { title: 'The end of Roman Britain', text: 'Around 410 AD, the Roman Empire was under attack from all sides and the Emperor called the legions home. Roman Britain ended almost overnight. The towns emptied, the roads crumbled, and new people called the Anglo-Saxons started arriving. But the Roman legacy in Britain would never fade.',
        imageQuery: 'roman departure britain sunset legion' }
    ],
    questions: [
      { q: 'In what year did the Romans properly invade Britain?', options: ['43 AD', '1066', '55 BC', '410 AD'], correct: 0, cheer: 'Correct!' },
      { q: 'Which emperor sent the invasion force?', options: ['Julius Caesar', 'Claudius', 'Augustus', 'Nero'], correct: 1, cheer: 'Yes!' },
      { q: 'Who was Boudicca?', options: ['A Roman soldier', 'A warrior queen who rebelled', 'A goddess', 'A farmer'], correct: 1, cheer: 'A fierce British hero.' },
      { q: 'What was London called in Roman times?', options: ['Londinium', 'Eboracum', 'Lundun', 'Britannicus'], correct: 0, cheer: 'Exactly!' },
      { q: 'What was a Roman bath used for?', options: ['Only washing', 'Washing, chatting, relaxing', 'Sport only', 'Cooking'], correct: 1, cheer: 'A social hub!' },
      { q: 'Who ordered a giant wall across northern Britain?', options: ['Caesar', 'Claudius', 'Hadrian', 'Constantine'], correct: 2, cheer: 'Yes — and it\'s named after him.' },
      { q: 'How long is Hadrian\'s Wall?', options: ['10 miles', '73 miles', '500 miles', '1,000 miles'], correct: 1, cheer: 'A serious build!' },
      { q: 'What vegetables did the Romans bring to Britain?', options: ['Potatoes', 'Carrots and cabbages', 'Tomatoes', 'Chocolate'], correct: 1, cheer: 'Roman veg!' },
      { q: 'When did Roman rule in Britain end?', options: ['43 AD', 'Around 410 AD', '1066', '1800'], correct: 1, cheer: 'Yes.' },
      { q: 'Why did the Romans leave Britain?', options: ['They ran out of food', 'Their empire was under attack elsewhere', 'A storm', 'Boudicca\'s ghost'], correct: 1, cheer: 'Correct.' }
    ],
    hasVideo: true,
    videoId: 'nN_x9o8MV1o',
    bitesizeQuery: 'romans in britain'
  },

  10: {
    title: 'The Vikings: Longships and Raiders',
    intro: 'From the icy north came fierce warriors with painted shields and swift ships. The Vikings are coming!',
    slides: [
      { title: 'Where the Vikings came from', text: 'The Vikings came from Scandinavia — modern-day Norway, Sweden, and Denmark. Their homeland was cold and mountainous with poor farming land, which pushed them to look elsewhere for riches.',
        imageQuery: 'viking scandinavia fjord norway' },
      { title: 'Longships: ocean dragons', text: 'Vikings built the most amazing ships of their time — longships with curved dragon prows, made of overlapping wooden planks. They had a single square sail and rows of oars. Longships were fast, strong, and shallow enough to sail up rivers — perfect for sudden attacks.',
        imageQuery: 'viking longship dragon head prow',
        animation: 'longship' },
      { title: 'The raid on Lindisfarne', text: 'In 793 AD, three Viking ships suddenly appeared off the coast of Lindisfarne, a peaceful monastery in northern England. Vikings stormed ashore, killing monks and stealing gold and holy books. This terrifying attack shocked all of Europe and marked the start of the Viking Age.',
        imageQuery: 'lindisfarne holy island england monastery' },
      { title: 'Warriors, farmers, traders', text: 'Not every Viking was a raider! Most were farmers and fishermen. Some were skilled traders who travelled as far as Baghdad, Constantinople, and Russia — trading furs, amber, and slaves for silver and silk.',
        imageQuery: 'viking village farming reenactment' },
      { title: 'The Viking gods', text: 'Vikings worshipped many gods. Odin was king of the gods, known for his wisdom. Thor, the red-bearded god of thunder, carried a hammer called Mjölnir. Freya was the goddess of love. Our words Wednesday (Odin\'s day) and Thursday (Thor\'s day) come from Viking gods!',
        imageQuery: 'thor norse hammer mjolnir art' },
      { title: 'Vikings settle down', text: 'The Vikings didn\'t just raid — they also settled. They conquered large parts of Britain (an area called the Danelaw), founded Dublin in Ireland, settled Iceland, and even reached America 500 years before Columbus! Their blood runs in many British families today.',
        imageQuery: 'viking ship landing iceland' }
    ],
    questions: [
      { q: 'Where did the Vikings come from?', options: ['Africa', 'Asia', 'Scandinavia', 'America'], correct: 2, cheer: 'Correct — Norway, Sweden, Denmark!' },
      { q: 'What is a longship?', options: ['A long train', 'A Viking wooden ship', 'A building', 'A weapon'], correct: 1, cheer: 'Yes!' },
      { q: 'What was on the front of many longships?', options: ['Flowers', 'A dragon head', 'A clock', 'A flag only'], correct: 1, cheer: 'Fierce!' },
      { q: 'Where did the Vikings attack in 793 AD?', options: ['Lindisfarne monastery', 'London', 'Paris', 'Rome'], correct: 0, cheer: 'That raid shocked Europe.' },
      { q: 'Most Vikings were actually…', options: ['Wizards', 'Farmers and fishermen', 'Kings', 'Monks'], correct: 1, cheer: 'True — everyday people!' },
      { q: 'Who was the king of the Viking gods?', options: ['Thor', 'Odin', 'Freya', 'Loki'], correct: 1, cheer: 'Right!' },
      { q: 'Which Viking god had a thunder hammer?', options: ['Odin', 'Freya', 'Thor', 'Loki'], correct: 2, cheer: 'Thor!' },
      { q: 'Which day of the week is named after Thor?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Sunday'], correct: 2, cheer: 'Yes!' },
      { q: 'What was the Viking-controlled part of England called?', options: ['Vikingland', 'The Danelaw', 'Northumbria', 'Mercia'], correct: 1, cheer: 'Correct!' },
      { q: 'How long before Columbus did Vikings reach America?', options: ['A year', '10 years', '100 years', '500 years'], correct: 3, cheer: 'First Europeans there!' }
    ],
    hasVideo: true,
    videoId: 'X0QnGvl3rJo',
    bitesizeQuery: 'vikings raid lindisfarne'
  },

  11: {
    title: 'Anglo-Saxon Britain',
    intro: 'After the Romans left Britain, new people came from across the sea and changed the land forever.',
    slides: [
      { title: 'The Angles, Saxons, and Jutes', text: 'When the Romans left Britain around 410 AD, new tribes came from modern-day Germany, Denmark, and the Netherlands. They were the Angles, the Saxons, and the Jutes. Over time they became known together as the Anglo-Saxons — and the land they settled became "Angle-land", or England!',
        imageQuery: 'anglo saxon migration map britain' },
      { title: 'Seven kingdoms', text: 'For hundreds of years, England was divided into seven kingdoms: Northumbria, Mercia, East Anglia, Essex, Sussex, Wessex, and Kent. Each had its own king. They often fought each other — and later had to fight the Vikings together.',
        imageQuery: 'anglo saxon kingdoms map heptarchy' },
      { title: 'Life in an Anglo-Saxon village', text: 'Most Anglo-Saxons were farmers living in small wooden villages. The most important building was the great hall, a huge wooden hall where the chief feasted with his warriors, told stories, and sometimes slept. Entertainment meant songs, riddles, and long epic poems.',
        imageQuery: 'anglo saxon village reconstruction hall',
        animation: 'saxon-hall' },
      { title: 'The story of Beowulf', text: 'The Anglo-Saxons told a famous poem called Beowulf about a brave warrior who fights a horrible monster called Grendel, and then Grendel\'s mother, and finally a fire-breathing dragon! Written about 1,300 years ago, it\'s the oldest long poem in English.',
        imageQuery: 'beowulf grendel viking warrior illustration' },
      { title: 'Christian monks and beautiful books', text: 'Missionaries from Ireland and Rome taught the Anglo-Saxons about Christianity. Monks in quiet monasteries spent years hand-writing beautifully decorated books. The Lindisfarne Gospels, made around 700 AD, is one of the most stunning books ever created.',
        imageQuery: 'lindisfarne gospels illuminated manuscript' },
      { title: 'Alfred the Great', text: 'King Alfred of Wessex (871-899) is the only English king ever called "the Great". He fought off Viking invaders, hid in the marshes and famously burnt some cakes there, and then united England. He also loved learning, translating important Latin books into English himself.',
        imageQuery: 'king alfred the great statue winchester' }
    ],
    questions: [
      { q: 'Who came to Britain after the Romans?', options: ['Vikings', 'Anglo-Saxons', 'Normans', 'Celts'], correct: 1, cheer: 'Yes!' },
      { q: 'Where did the Anglo-Saxons come from?', options: ['Africa', 'Spain', 'Germany, Denmark, Netherlands area', 'Russia'], correct: 2, cheer: 'Right!' },
      { q: 'Where does the name "England" come from?', options: ['Angles = Angle-land', 'A queen called Eng', 'It was always called that', 'From Latin'], correct: 0, cheer: 'Exactly!' },
      { q: 'How many Anglo-Saxon kingdoms were there originally?', options: ['1', '3', '7', '10'], correct: 2, cheer: 'Seven!' },
      { q: 'What was a "great hall"?', options: ['A school', 'A farm', 'The chief\'s big wooden hall for feasting and sleeping', 'A boat'], correct: 2, cheer: 'Right on!' },
      { q: 'What is Beowulf?', options: ['A kind of bread', 'An Anglo-Saxon hero poem', 'A town', 'A weapon'], correct: 1, cheer: 'Yes — ancient epic!' },
      { q: 'What did monks spend years creating?', options: ['Gold coins', 'Beautifully decorated books', 'Weapons', 'Castles'], correct: 1, cheer: 'Incredible patience!' },
      { q: 'Who was called "the Great"?', options: ['Alfred', 'Edward', 'Harold', 'Ethelred'], correct: 0, cheer: 'The only English king with that title!' },
      { q: 'Which kingdom did Alfred rule?', options: ['Wessex', 'Mercia', 'Kent', 'Northumbria'], correct: 0, cheer: 'Correct!' },
      { q: 'What famous (if clumsy) thing is Alfred said to have done?', options: ['Lost a battle', 'Burnt some cakes', 'Fallen off a horse', 'Slept all day'], correct: 1, cheer: 'Legendary cakes!' }
    ],
    hasVideo: true,
    videoId: '-cKGz-st75w',
    bitesizeQuery: 'anglo saxons alfred the great'
  },

  12: {
    title: 'The Norman Conquest of 1066',
    intro: '1066 — the most famous date in English history. One year, three battles, and a new ruling family.',
    slides: [
      { title: 'A king with no children', text: 'In January 1066, the English king Edward the Confessor died without a son. Three men claimed the crown: Harold Godwinson (an English earl), Harald Hardrada (a Viking king of Norway), and William, Duke of Normandy (from France). Only one could win — and a war was inevitable.',
        imageQuery: 'edward confessor tomb king' },
      { title: 'Harold becomes king', text: 'The English nobles chose Harold Godwinson, and he was crowned in Westminster Abbey the very day Edward was buried. But across the sea, William and Harald were furious — they each believed the crown had been promised to them.',
        imageQuery: 'bayeux tapestry harold crowned' },
      { title: 'Victory in the north', text: 'In September, Harald Hardrada invaded the north of England with 300 Viking longships. King Harold marched his exhausted army 200 miles north in just four days and smashed the Vikings at the Battle of Stamford Bridge. Hardrada was killed. But before Harold could celebrate, terrible news arrived…',
        imageQuery: 'battle stamford bridge vikings' },
      { title: 'William lands at Hastings', text: '…William of Normandy had landed on the south coast with 7,000 men! Harold marched his tired army 250 miles back south. On 14th October 1066, the two armies met at the Battle of Hastings. It was brutal, lasting all day.',
        imageQuery: 'battle hastings bayeux tapestry',
        animation: 'hastings-battle' },
      { title: 'An arrow in the eye', text: 'Legend says King Harold was killed by an arrow to the eye. However it happened, when Harold fell, the English army broke and fled. William — from that day called William the Conqueror — had won.',
        imageQuery: 'harold arrow eye bayeux tapestry' },
      { title: 'The land transformed', text: 'William became king on Christmas Day 1066. He crushed English rebellions, took land from English lords and gave it to his Norman knights, and ordered the Domesday Book — a massive survey of the whole country. He also built over 500 castles, including the Tower of London. Britain was changed forever.',
        imageQuery: 'tower of london white tower' }
    ],
    questions: [
      { q: 'What year was the Norman Conquest?', options: ['1066', '1216', '1501', '1800'], correct: 0, cheer: 'The most famous date!' },
      { q: 'Why was there a battle for the throne?', options: ['Edward had no son', 'A storm broke the old crown', 'The royal family moved', 'Nobody wanted the job'], correct: 0, cheer: 'Correct!' },
      { q: 'Who did the English choose as king first?', options: ['William', 'Harald Hardrada', 'Harold Godwinson', 'Edward again'], correct: 2, cheer: 'Yes!' },
      { q: 'Where did Harold defeat the Vikings?', options: ['Hastings', 'Stamford Bridge', 'London', 'Dover'], correct: 1, cheer: 'Right!' },
      { q: 'Where was the second, decisive battle?', options: ['Stamford Bridge', 'Hastings', 'London', 'York'], correct: 1, cheer: 'Exactly!' },
      { q: 'How is Harold said to have died?', options: ['Drowned', 'Arrow in the eye', 'Poisoned', 'Fell off his horse'], correct: 1, cheer: 'Legendary story!' },
      { q: 'What is William forever known as?', options: ['William the Wise', 'William the Conqueror', 'William the Red', 'William the Kind'], correct: 1, cheer: 'He conquered England!' },
      { q: 'When was William crowned king?', options: ['Christmas Day 1066', 'New Year\'s Day', 'Easter 1067', 'Summer 1066'], correct: 0, cheer: 'A Christmas coronation!' },
      { q: 'What huge survey did William order?', options: ['The Big Book', 'Domesday Book', 'The Census', 'The Magna Carta'], correct: 1, cheer: 'Yes!' },
      { q: 'Roughly how many castles did William build?', options: ['5', '50', '500', '5,000'], correct: 2, cheer: 'Lots! Including the Tower of London.' }
    ],
    hasVideo: true,
    videoId: 'bxpTxuPTklA',
    bitesizeQuery: 'norman conquest 1066 battle hastings'
  },

  13: {
    title: 'Life in a Medieval Castle',
    intro: 'Stone walls, drawbridges, jousting knights — let\'s step inside a medieval castle!',
    slides: [
      { title: 'Why castles?', text: 'After the Normans conquered England, they built castles everywhere to control the land. A castle was both a home for a lord and his family, and a mighty fortress to keep enemies out. Early castles were wooden, but soon they were rebuilt in strong stone.',
        imageQuery: 'medieval castle keep england' },
      { title: 'Parts of a castle', text: 'A typical castle had huge stone walls with a walkway on top, sturdy towers, arrow-slits for archers, and a gatehouse with a drawbridge over a moat. Inside, the great hall was where feasts happened. There were bedchambers, kitchens, a chapel, stables, and often a deep dungeon.',
        imageQuery: 'medieval castle diagram parts',
        animation: 'castle-drawbridge' },
      { title: 'The lord and lady', text: 'The castle was run by a lord and lady. The lord managed the land, collected taxes, led soldiers into battle, and sorted out quarrels among his people. The lady ran the household — a huge job — supervised cooking, sewing, and raising children, and took over completely when her lord was away at war.',
        imageQuery: 'medieval lord lady feast painting' },
      { title: 'A feast in the hall', text: 'Medieval feasts were spectacular. Long tables filled the great hall. Roast boar, swan, peacock, pies, and huge loaves of bread were served. People ate with their hands and a knife — forks weren\'t used yet! Musicians played, jesters told jokes, and jugglers entertained between courses.',
        imageQuery: 'medieval feast great hall banquet' },
      { title: 'Under attack!', text: 'When enemies attacked, defenders hid inside and fired arrows down. Attackers used battering rams to break gates, tall siege towers to climb walls, and catapults to hurl huge stones. A siege could last months — the defenders would win if their food and water held out.',
        imageQuery: 'medieval castle siege catapult battering ram' },
      { title: 'Life for the servants', text: 'Castles had dozens of servants — cooks, butlers, blacksmiths, grooms, maids, pages, and men-at-arms. Servants worked from dawn to dusk, slept on the floor of the hall or in tiny rooms, and ate after their lord. It was hard work but, for many, better than farming the fields outside.',
        imageQuery: 'medieval castle servants cooks kitchen' }
    ],
    questions: [
      { q: 'Why did the Normans build so many castles?', options: ['For holidays', 'To control the land and defend it', 'For storage', 'For fun'], correct: 1, cheer: 'Yes!' },
      { q: 'Early castles were often made of…', options: ['Glass', 'Plastic', 'Wood', 'Ice'], correct: 2, cheer: 'Before the stone ones were built!' },
      { q: 'A drawbridge crosses a…', options: ['Hill', 'Moat', 'Garden', 'Courtyard'], correct: 1, cheer: 'A watery defence!' },
      { q: 'Who ran the castle when the lord was away?', options: ['The cook', 'The lady', 'The jester', 'No one'], correct: 1, cheer: 'A huge responsibility.' },
      { q: 'What did people eat with at medieval feasts?', options: ['Fork and knife', 'Hands and a knife', 'Chopsticks', 'Spoon only'], correct: 1, cheer: 'No forks yet!' },
      { q: 'What exotic birds were served at feasts?', options: ['Robins', 'Peacock and swan', 'Parrots', 'Penguins'], correct: 1, cheer: 'Fancy!' },
      { q: 'What was used to break down castle gates?', options: ['Laser', 'Battering ram', 'Explosives', 'A key'], correct: 1, cheer: 'Exactly.' },
      { q: 'What was a siege?', options: ['A type of song', 'An attack that lasts weeks or months', 'A meal', 'A tournament'], correct: 1, cheer: 'Yes — a long attack.' },
      { q: 'Where did many servants sleep?', options: ['In the king\'s bed', 'On the floor of the hall', 'Outside', 'In the moat'], correct: 1, cheer: 'Not very comfy!' },
      { q: 'What was a "page"?', options: ['A page in a book', 'A young boy training for knighthood', 'A fast messenger', 'A clown'], correct: 1, cheer: 'Boys serving in castles.' }
    ],
    hasVideo: true,
    videoId: 'AesgRREuCQI',
    bitesizeQuery: 'medieval castle life'
  },

  14: {
    title: 'Knights, Jousts, and Chivalry',
    intro: 'Gleaming armour, thundering horses, swords clashing — welcome to the age of knights!',
    slides: [
      { title: 'Becoming a knight', text: 'Becoming a knight took 14 years! A boy from a noble family started at age 7 as a page, running errands in a lord\'s castle. At 14 he became a squire, serving a real knight and training with weapons. If he did well, at 21 he was "dubbed" a knight with a sword tap on each shoulder.',
        imageQuery: 'medieval knight dubbing ceremony' },
      { title: 'Armour that clanked', text: 'Early knights wore chainmail — thousands of tiny metal rings linked together. Later, full plate armour was developed: shining steel that covered the knight head-to-toe. A full suit weighed about 25 kg — like carrying a small child!',
        imageQuery: 'medieval plate armour suit museum' },
      { title: 'Weapons of war', text: 'Knights fought with swords, lances (long spears), maces (heavy clubs), and battleaxes. They carried a shield painted with their own special design called a coat of arms — like a family badge — so others could recognise them in battle.',
        imageQuery: 'medieval knight coat of arms shield' },
      { title: 'Jousting tournaments', text: 'Tournaments were like giant sporting events. The most exciting part was the joust — two knights on horseback charged at each other down a barrier with long wooden lances, trying to knock each other off! It was dangerous (lances shattered, knights got hurt), but the winner got prize money and huge fame.',
        imageQuery: 'medieval jousting tournament knights horses',
        animation: 'jousting' },
      { title: 'The code of chivalry', text: 'Knights were supposed to follow a code called chivalry: be brave in battle, loyal to their lord, honest, generous to the poor, protective of women and children, and Christian in their faith. In reality, many knights weren\'t anywhere near as noble — but the ideal inspired poetry and stories for hundreds of years.',
        imageQuery: 'medieval knight chivalry painting' },
      { title: 'King Arthur and his knights', text: 'The most famous knights of all are made up! King Arthur, Sir Lancelot, Sir Gawain, and the Knights of the Round Table are from old British legends. They searched for the Holy Grail, fought evil, and met the wizard Merlin. Even today, their stories inspire books, films, and games.',
        imageQuery: 'king arthur round table legend art' }
    ],
    questions: [
      { q: 'How old were boys when they began training as pages?', options: ['7', '14', '21', '30'], correct: 0, cheer: 'Just little ones!' },
      { q: 'What came between page and knight?', options: ['Squire', 'Lord', 'Bishop', 'King'], correct: 0, cheer: 'Exactly!' },
      { q: 'How did a squire become a knight?', options: ['By passing a test', 'By being "dubbed" with a sword', 'By paying money', 'By inheritance'], correct: 1, cheer: 'A famous ceremony.' },
      { q: 'What is chainmail?', options: ['Letters on a chain', 'Armour of linked metal rings', 'A type of sword', 'A horse'], correct: 1, cheer: 'Yes!' },
      { q: 'How heavy was a full suit of plate armour?', options: ['1 kg', '25 kg', '100 kg', '500 kg'], correct: 1, cheer: 'Heavy but manageable!' },
      { q: 'What is a coat of arms?', options: ['A jumper with sleeves', 'A family badge on a shield', 'A fancy coat', 'A type of weapon'], correct: 1, cheer: 'Identity badge!' },
      { q: 'What happens in a joust?', options: ['Two knights race horses', 'Two knights charge with lances', 'Two knights wrestle', 'They dance'], correct: 1, cheer: 'Dangerous sport!' },
      { q: 'What is chivalry?', options: ['A type of horse', 'A code knights tried to follow', 'A weapon', 'A castle'], correct: 1, cheer: 'An ideal!' },
      { q: 'What did King Arthur\'s knights search for?', options: ['Gold', 'The Holy Grail', 'A dragon', 'A princess'], correct: 1, cheer: 'A sacred quest!' },
      { q: 'Who was King Arthur\'s wizard friend?', options: ['Gandalf', 'Dumbledore', 'Merlin', 'Harry'], correct: 2, cheer: 'The legendary Merlin!' }
    ],
    hasVideo: true,
    videoId: 'g9LDqw1dFMk',
    bitesizeQuery: 'medieval knights chivalry'
  },

  15: {
    title: 'The Black Death',
    intro: 'Sometimes history has dark chapters. The Black Death was one of the darkest — but it changed the world forever.',
    slides: [
      { title: 'A deadly disease', text: 'In 1348, a terrible disease called the plague — or Black Death — reached England. People got huge black swellings called buboes, high fever, and most died within a week. No one knew what caused it or how to stop it. It was the scariest thing that had ever happened.',
        imageQuery: 'medieval plague illustration manuscript' },
      { title: 'Rats, fleas, and germs', text: 'We now know the Black Death was caused by tiny bacteria carried by fleas that lived on black rats. Merchant ships spread both rats and fleas from port to port. Of course, medieval people had no idea about germs, rats or microscopes — they could only guess.',
        imageQuery: 'medieval ship port rats trading' },
      { title: 'Wild theories', text: 'People thought the plague was a punishment from God, bad air, an evil alignment of the planets, or a poisoning by enemies. Some walked through the streets whipping themselves to say sorry to God. Others wore herbs around their necks. Doctors wore strange beaked masks filled with flowers.',
        imageQuery: 'plague doctor mask beak',
        animation: 'plague-doctor' },
      { title: 'A third of Europe gone', text: 'The Black Death killed around 25 million people in Europe — about one in three! Whole villages emptied. Families died together. Priests ran out of space to bury the dead. Towns that had bustled for centuries went silent. It\'s hard to imagine the sadness.',
        imageQuery: 'medieval plague village empty' },
      { title: 'The world changed', text: 'With so many dead, there weren\'t enough workers. Surviving farmers and craftspeople could demand higher wages, and lords who refused lost them to better-paying neighbours. The old system where peasants were almost trapped on one lord\'s land started to crack. The modern world was being born out of tragedy.',
        imageQuery: 'medieval peasants revolt painting' },
      { title: 'Lessons for today', text: 'We now have antibiotics that can cure the plague. We know how germs spread and how to stop them. When diseases appear today — like COVID-19 — doctors and scientists work together to help quickly. But the Black Death reminds us that we must always stay prepared and look after each other.',
        imageQuery: 'modern science laboratory medicine' }
    ],
    questions: [
      { q: 'When did the Black Death arrive in England?', options: ['1066', '1348', '1666', '1900'], correct: 1, cheer: 'Correct.' },
      { q: 'What are buboes?', options: ['A type of food', 'Swellings caused by the plague', 'Medicine', 'A type of ship'], correct: 1, cheer: 'Yes — horrible.' },
      { q: 'What actually caused the Black Death?', options: ['Bad magic', 'Bacteria spread by fleas on rats', 'Too much sun', 'Cold weather'], correct: 1, cheer: 'Tiny germs!' },
      { q: 'How did medieval people try to avoid the plague?', options: ['Wore herbs and prayed', 'Took antibiotics', 'Video-called doctors', 'Quarantine zones'], correct: 0, cheer: 'They tried their best.' },
      { q: 'What did doctors wear?', options: ['Normal coats', 'Beaked masks filled with herbs', 'Crowns', 'Wizard hats'], correct: 1, cheer: 'Eerie costumes!' },
      { q: 'About how much of Europe\'s population died?', options: ['1 in 100', '1 in 10', '1 in 3', 'Everyone'], correct: 2, cheer: 'Devastating.' },
      { q: 'What happened to wages after so many died?', options: ['Went down', 'Stayed the same', 'Went up because workers were rare', 'Disappeared'], correct: 2, cheer: 'Basic economics!' },
      { q: 'What is an antibiotic?', options: ['A medicine that fights bacteria', 'A type of food', 'A doctor\'s mask', 'A prayer'], correct: 0, cheer: 'Modern miracle!' },
      { q: 'Why is it important to remember the Black Death?', options: ['It changed society and reminds us about disease', 'It was fun', 'We can copy it', 'No reason'], correct: 0, cheer: 'Lessons to learn.' },
      { q: 'What should we do when a new disease appears today?', options: ['Panic', 'Work together with scientists and doctors', 'Ignore it', 'Run away'], correct: 1, cheer: 'Teamwork saves lives.' }
    ],
    hasVideo: true,
    videoId: 'myw23rX5mVo',
    bitesizeQuery: 'black death plague medieval'
  }
};

/* ---------- Partial topic metadata for days 16-60 ----------
   These are used when generating lessons via the API. Each entry is a brief
   guide to keep the lesson focused. ----------------------------------- */
export const HISTORY_BRIEFS = {
  16: 'The Magna Carta, 1215 — King John forced to sign, limits on royal power, roots of modern rights.',
  17: 'Wars of the Roses 1455-1487 — Lancaster (red) vs York (white), cousins fighting, Henry VII unites both.',
  18: 'Henry VIII and his six wives — divorced, beheaded, died, divorced, beheaded, survived; Church of England.',
  19: 'Elizabeth I and the Spanish Armada 1588 — Virgin Queen, Spanish invasion fleet defeated by storms and English ships.',
  20: 'Shakespeare and the Globe Theatre — plays, quill pens, groundlings, the Thames, world\'s greatest playwright.',
  21: 'Gunpowder Plot 1605 — Guy Fawkes and Catholic plotters try to blow up Parliament; bonfire night origin.',
  22: 'English Civil War 1642-1651 — Cavaliers (King Charles I) vs Roundheads (Cromwell); King executed.',
  23: 'Great Fire of London 1666 — Pudding Lane bakery, wooden houses, Samuel Pepys diary, Christopher Wren rebuilt St Paul\'s.',
  24: 'Great Plague of London 1665 — last major plague outbreak, quarantine houses, 100,000 died.',
  25: 'Golden Age of Piracy — Caribbean, Blackbeard, Anne Bonny, treasure, Jolly Roger, life on a pirate ship.',
  26: 'Captain Cook — Endeavour voyages, mapped Australia, New Zealand, Pacific islands, killed in Hawaii.',
  27: 'Industrial Revolution begins (~1760) — steam engines, spinning jenny, factories, James Watt, coal power.',
  28: 'Victorian factory life — children working in mills, long hours, dangerous machines, Factory Acts, school reform.',
  29: 'Queen Victoria (1837-1901) — longest reign until Elizabeth II, British Empire covering a quarter of the world.',
  30: 'Isambard Kingdom Brunel — Great Western Railway, SS Great Britain, huge bridges, engineering genius.',
  31: 'Ancient China — Great Wall built over centuries, Silk Road trade, paper, printing, compass, gunpowder.',
  32: 'Maya civilization — Mexico/Guatemala, pyramids, hieroglyphic writing, incredibly accurate calendar, disappeared mysteriously.',
  33: 'Aztec Empire — Tenochtitlán built on a lake, Montezuma, chocolate discovered, conquered by Cortés in 1521.',
  34: 'Inca Empire — Andes mountains, Machu Picchu, no wheels but amazing roads, conquered by Pizarro in 1533.',
  35: 'Mughal Empire (1526-1857) India — Akbar, Shah Jahan built Taj Mahal for his wife, rich arts and architecture.',
  36: 'Ottoman Empire — Istanbul (Constantinople) captured 1453, sultans, Suleiman the Magnificent, lasted 600 years.',
  37: 'Renaissance — Italy 14th-16th c., Leonardo da Vinci (Mona Lisa), Michelangelo (Sistine Chapel), rebirth of learning.',
  38: 'Age of Exploration — Columbus 1492, Magellan sailed around world 1519-1522, spices, gold, meeting new peoples.',
  39: 'Atlantic Slave Trade & abolition — horror of slavery, William Wilberforce, Britain banned slavery 1807, 1833.',
  40: 'American Revolution 1775-1783 — 13 colonies rebel against Britain, Boston Tea Party, George Washington, Declaration of Independence.',
  41: 'French Revolution 1789 — storming Bastille, liberty/equality/fraternity, Marie Antoinette beheaded, Reign of Terror.',
  42: 'Napoleon — French general who became emperor, conquered most of Europe, defeated at Waterloo 1815 by Wellington.',
  43: 'American Civil War 1861-1865 — North vs South, slavery, Abraham Lincoln, emancipation, Gettysburg.',
  44: 'Suffragettes 1903-1918 — Emmeline Pankhurst, Emily Davison, chained to railings, women finally got the vote.',
  45: 'First World War 1914-1918 — assassination in Sarajevo, trenches, tanks, poison gas, 20 million dead.',
  46: 'Life in WWI trenches — mud, rats, lice, no man\'s land, going over the top, Christmas truce 1914.',
  47: 'Russian Revolution 1917 — Tsar overthrown, Lenin and the Bolsheviks, birth of Soviet Union.',
  48: 'Roaring Twenties — jazz, flappers, Charleston, first talking films, cars, radio, great optimism.',
  49: 'Great Depression 1929-1939 — Wall Street Crash, mass unemployment, soup kitchens, dust bowl, hardship.',
  50: 'Rise of Hitler — Weimar Germany, Nazi Party, 1933 Chancellor, persecution begins, preparing for war.',
  51: 'WWII begins 1939 — Blitzkrieg, Poland invaded, Britain declares war, fall of France, Dunkirk evacuation.',
  52: 'The Blitz & evacuation — German bombing of British cities, children evacuated to countryside, gas masks, rationing.',
  53: 'D-Day 6 June 1944 — Normandy landings, largest seaborne invasion ever, beginning of liberation of Europe.',
  54: 'The Holocaust — Nazi persecution and murder of 6 million Jews and others, remembering Anne Frank, never again.',
  55: 'Atom bomb & end of WWII — Hiroshima/Nagasaki August 1945, Japan surrenders, new atomic age begins.',
  56: 'Cold War 1947-1991 — USA vs USSR, no direct fighting but nuclear threat, Iron Curtain, Berlin Wall.',
  57: 'Space Race — Sputnik 1957, Yuri Gagarin 1961, Apollo 11 Moon landing 1969, Neil Armstrong\'s giant leap.',
  58: 'Civil Rights Movement — Rosa Parks, Martin Luther King "I Have a Dream" 1963, ending legal segregation in USA.',
  59: 'Fall of Berlin Wall 1989 — end of Cold War, reunification of Germany, collapse of Soviet Union 1991.',
  60: 'Modern Britain — multicultural, technology, climate change, Commonwealth, looking to the future together.'
};
