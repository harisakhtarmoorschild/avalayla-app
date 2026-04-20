/* ==========================================================================
   GEOGRAPHY CURRICULUM — 60 lessons, Year 2 → Year 7 UK curriculum
   ========================================================================== */

export const GEOGRAPHY_TOPICS = [
  // DAYS 1-15 hardcoded
  'Our Amazing Planet Earth',                    // 1
  'The Seven Continents',                        // 2
  'The Five Oceans',                             // 3
  'Mountains and Volcanoes',                     // 4
  'Rivers and Waterfalls',                       // 5
  'The United Kingdom',                          // 6
  'Europe: Our Continent',                       // 7
  'Africa: Land of Contrasts',                   // 8
  'Asia: The Biggest Continent',                 // 9
  'The Americas: North and South',               // 10
  'Australia and Oceania',                       // 11
  'Antarctica: The Frozen Continent',            // 12
  'Weather and Climate',                         // 13
  'Biomes: Life on Earth',                       // 14
  'Maps and How to Read Them',                   // 15

  // DAYS 16-30 — broader physical and human geography
  'Earthquakes and Plate Tectonics',             // 16
  'The Water Cycle',                             // 17
  'Deserts of the World',                        // 18
  'Rainforests: Lungs of the Planet',            // 19
  'Polar Regions: Arctic and Antarctic',         // 20
  'Coasts, Cliffs, and Beaches',                 // 21
  'Islands, Peninsulas, and Archipelagos',       // 22
  'Cities of the World',                         // 23
  'Capital Cities and What They Do',             // 24
  'Population: How Many People?',                // 25
  'Migration: Why People Move',                  // 26
  'Food: Where It Comes From',                   // 27
  'Famous Landmarks of the World',               // 28
  'Time Zones: Why Is It Morning in London but Night in Australia?', // 29
  'Longitude, Latitude, and the Equator',        // 30

  // DAYS 31-45 — KS3 human/physical geography
  'The Rock Cycle',                              // 31
  'Glaciers and Ice Ages',                       // 32
  'The Amazon Rainforest in Danger',             // 33
  'Climate Change: A Warming World',             // 34
  'Natural Disasters and How We Respond',        // 35
  'Renewable Energy Around the World',           // 36
  'Farming: Feeding the World',                  // 37
  'Fishing and the Oceans',                      // 38
  'Tourism: The Traveller\'s World',              // 39
  'Trade: How Goods Move',                       // 40
  'Rich Country, Poor Country: Development',     // 41
  'Megacities of the 21st Century',              // 42
  'Slums and Squatter Settlements',              // 43
  'Sustainable Cities',                          // 44
  'Rivers: From Source to Sea',                  // 45

  // DAYS 46-60 — later KS3 (Year 8-9)
  'Coastal Erosion and Management',              // 46
  'Tsunamis and Warning Systems',                // 47
  'The Ring of Fire',                            // 48
  'Hurricanes, Typhoons, and Cyclones',          // 49
  'The Great Barrier Reef',                      // 50
  'Himalayas: The Roof of the World',            // 51
  'The Sahara Desert',                           // 52
  'The Nile and the Amazon: Great Rivers',       // 53
  'The Mediterranean: Sea of Stories',           // 54
  'Russia: A Vast Country',                      // 55
  'China: Booming Economy',                      // 56
  'India: Many People, Many Cultures',           // 57
  'Brazil: Forests, Cities, and Beaches',        // 58
  'The European Union',                          // 59
  'Our Role in Protecting the Planet'            // 60
];

export const GEOGRAPHY_LESSONS = {
  1: {
    title: 'Our Amazing Planet Earth',
    intro: 'From space, Earth looks like a beautiful blue marble. Let\'s explore our home!',
    slides: [
      { title: 'The blue planet', text: 'Earth is our home in space. From far away it looks mostly blue because almost three-quarters of it is covered in water — the oceans! The white swirls are clouds, and the green and brown patches are land.',
        imageQuery: 'earth from space blue marble nasa',
        imageFallback: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/640px-The_Earth_seen_from_Apollo_17.jpg' },
      { title: 'A huge spinning ball', text: 'Earth is a giant ball of rock and metal that spins round and round. It takes 24 hours to make one full spin — that\'s why we have day and night! When your side of Earth faces the Sun, it\'s daytime. When it faces away, it\'s night.',
        imageQuery: 'earth rotation day night',
        animation: 'earth-rotation' },
      { title: 'A journey round the Sun', text: 'While spinning, Earth also travels around the Sun. It takes 365 days — one year — to make the full journey. That\'s why your birthday only comes once a year. Earth is about 150 million kilometres from the Sun — that\'s really far!',
        imageQuery: 'earth orbit sun diagram solar system' },
      { title: 'Land, sea, and everything between', text: 'Earth has everything — towering mountains, deep oceans, dry deserts, thick forests, icy poles, and hot jungles. Each of these different places is home to different plants and animals, all living together on one planet.',
        imageQuery: 'earth landscapes mountains desert forest' },
      { title: 'The only planet with life', text: 'Earth is very special. Out of all the planets in our Solar System, it\'s the only one we know of that has life. It has the perfect amount of water, the perfect temperature, and the perfect mix of gases in the air. Aren\'t we lucky?',
        imageQuery: 'earth solar system planets comparison' },
      { title: 'Taking care of our home', text: 'Earth is millions of years old, but humans have only been here a tiny while. It\'s our job to look after it — keeping water clean, protecting animals, and not wasting things. A healthy planet means healthy us!',
        imageQuery: 'earth environment protect nature' }
    ],
    questions: [
      { q: 'What covers most of Earth\'s surface?', options: ['Land', 'Water', 'Ice', 'Sand'], correct: 1, cheer: 'Correct — almost three-quarters is water!' },
      { q: 'How long does Earth take to spin once?', options: ['1 hour', '24 hours', '1 month', '1 year'], correct: 1, cheer: 'Yes — one day!' },
      { q: 'Why do we have day and night?', options: ['Earth blinks', 'Earth spins', 'The Sun disappears', 'Magic'], correct: 1, cheer: 'Exactly!' },
      { q: 'How long does Earth take to go around the Sun?', options: ['24 hours', '1 month', '365 days', '10 years'], correct: 2, cheer: 'A full year!' },
      { q: 'About how far is Earth from the Sun?', options: ['1,000 km', '100,000 km', '150 million km', '1 billion km'], correct: 2, cheer: 'Really, really far.' },
      { q: 'Which of these is NOT found on Earth?', options: ['Mountains', 'Deserts', 'Oceans', 'Rings like Saturn'], correct: 3, cheer: 'Yes — we\'re ring-free!' },
      { q: 'Earth is the only planet we know of with…', options: ['Water', 'Life', 'Mountains', 'Wind'], correct: 1, cheer: 'Brilliant!' },
      { q: 'What colour does Earth look from space?', options: ['Red', 'Green', 'Blue', 'Yellow'], correct: 2, cheer: 'Because of the oceans!' },
      { q: 'What are the white swirls on Earth from space?', options: ['Snow', 'Clouds', 'Ice cream', 'Smoke'], correct: 1, cheer: 'Yes!' },
      { q: 'Why should we look after Earth?', options: ['It\'s our only home', 'It\'s shiny', 'For fun', 'The Sun will fall'], correct: 0, cheer: 'Exactly — take care!' }
    ],
    hasVideo: true,
    videoId: 'IDhapt7nw4A',
    bitesizeQuery: 'earth our planet primary'
  },

  2: {
    title: 'The Seven Continents',
    intro: 'Earth\'s big areas of land are called continents. There are seven of them — let\'s meet them all!',
    slides: [
      { title: 'What is a continent?', text: 'A continent is a very large piece of land. There are seven continents on Earth: Asia, Africa, North America, South America, Antarctica, Europe, and Australia (also called Oceania). Together, they cover about a quarter of our planet.',
        imageQuery: 'world map seven continents colored' },
      { title: 'Asia: the giant', text: 'Asia is the biggest continent. It has the most people too — over 4 billion! Asia includes huge countries like China, India, Russia, Japan, and Indonesia. It has the highest mountain on Earth (Mount Everest) and amazing cities like Tokyo and Dubai.',
        imageQuery: 'asia map countries mount everest' },
      { title: 'Africa: cradle of humanity', text: 'Africa is the second-biggest continent and where the first humans lived. It has 54 countries, the world\'s longest river (the Nile), the biggest desert (Sahara), and incredible animals — lions, elephants, giraffes, and gorillas.',
        imageQuery: 'africa map wildlife savannah' },
      { title: 'The Americas', text: 'North America has big countries like the USA, Canada, and Mexico. South America has the Amazon rainforest and the Andes mountains. The Americas stretch from icy Alaska in the north all the way to Antarctica\'s doorstep at the tip of Chile!',
        imageQuery: 'americas map north south' },
      { title: 'Europe and Australia', text: 'Europe is small but packed with history — Britain, France, Italy, Germany, Spain, and many more. Australia is the smallest continent, sometimes called Oceania when we add all the Pacific islands. It\'s famous for kangaroos, koalas, and the Great Barrier Reef.',
        imageQuery: 'europe australia map landmarks',
        animation: 'continents-drift' },
      { title: 'Antarctica: the empty continent', text: 'Antarctica, at the very bottom of the world, is covered in a thick sheet of ice. It\'s the coldest, windiest, driest place on Earth, and the only continent with no permanent residents — just scientists visiting to study it. Oh, and lots of penguins!',
        imageQuery: 'antarctica penguins ice continent' }
    ],
    questions: [
      { q: 'How many continents are there?', options: ['5', '6', '7', '10'], correct: 2, cheer: 'Correct!' },
      { q: 'Which is the biggest continent?', options: ['Africa', 'Asia', 'North America', 'Europe'], correct: 1, cheer: 'Yes — enormous!' },
      { q: 'Which continent has the most people?', options: ['Asia', 'Africa', 'Europe', 'Australia'], correct: 0, cheer: 'Over 4 billion!' },
      { q: 'Where did the first humans live?', options: ['Asia', 'Africa', 'Europe', 'America'], correct: 1, cheer: 'Africa — our original home.' },
      { q: 'Which is the world\'s longest river?', options: ['Amazon', 'Thames', 'Nile', 'Yangtze'], correct: 2, cheer: 'In Africa!' },
      { q: 'Which continent has the Amazon rainforest?', options: ['Africa', 'Asia', 'South America', 'Australia'], correct: 2, cheer: 'Spot on!' },
      { q: 'Which is the smallest continent?', options: ['Europe', 'Australia', 'Africa', 'South America'], correct: 1, cheer: 'Tiny but lovely!' },
      { q: 'What is Antarctica covered in?', options: ['Desert', 'Jungle', 'Thick ice', 'Grass'], correct: 2, cheer: 'Frozen!' },
      { q: 'Who lives permanently in Antarctica?', options: ['Farmers', 'No one permanently', 'Cities of people', 'Pirates'], correct: 1, cheer: 'Just visiting scientists.' },
      { q: 'The highest mountain on Earth is in…', options: ['Africa', 'South America', 'Asia', 'Europe'], correct: 2, cheer: 'Everest — in Asia!' }
    ],
    hasVideo: true,
    videoId: '7yXDYvWSswI',
    bitesizeQuery: 'seven continents world'
  },

  3: {
    title: 'The Five Oceans',
    intro: 'Most of Earth is covered in sea water. Let\'s dive into the five oceans of the world!',
    slides: [
      { title: 'One giant ocean, five names', text: 'All the world\'s oceans are actually connected — it\'s really one giant ocean. But to help us talk about different parts, we divide it into five: Pacific, Atlantic, Indian, Southern, and Arctic.',
        imageQuery: 'world map five oceans colored' },
      { title: 'The Pacific: biggest and deepest', text: 'The Pacific Ocean is HUGE. It\'s bigger than all the land on Earth put together! It stretches from Asia to America. Its deepest point, the Mariana Trench, is nearly 11 km straight down — Mount Everest could fit inside it with 2 km to spare!',
        imageQuery: 'pacific ocean map mariana trench' },
      { title: 'The Atlantic: between continents', text: 'The Atlantic separates the Americas from Europe and Africa. It\'s the second-biggest ocean. The Titanic sank here. Also, the Atlantic is growing wider by about 2 cm every year — Europe is slowly moving away from America!',
        imageQuery: 'atlantic ocean map titanic' },
      { title: 'The Indian Ocean: warm and busy', text: 'The Indian Ocean is the third-biggest. It\'s warmer than the others because most of it sits in the tropics. It\'s full of activity — huge cargo ships carry goods between Asia, the Middle East, Africa, and Australia.',
        imageQuery: 'indian ocean tropical beaches maldives' },
      { title: 'The Southern and Arctic', text: 'The Southern Ocean surrounds Antarctica at the bottom of the world — icy, wild, home to whales and albatrosses. The Arctic Ocean is at the very top, mostly covered in floating ice. Polar bears live there but not penguins (penguins are only in the south).',
        imageQuery: 'arctic ocean ice polar bear' },
      { title: 'The life in the oceans', text: 'The oceans are bursting with life — from tiny plankton to huge blue whales, the biggest animal that has ever lived. Coral reefs, like the Great Barrier Reef, are like underwater cities. And we still haven\'t explored 80% of the ocean — there\'s so much more to find!',
        imageQuery: 'coral reef ocean sea life',
        animation: 'ocean-waves' }
    ],
    questions: [
      { q: 'How many oceans are there officially?', options: ['3', '5', '7', '12'], correct: 1, cheer: 'Correct!' },
      { q: 'Which is the biggest ocean?', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1, cheer: 'Enormous!' },
      { q: 'What is the deepest point in the Pacific?', options: ['Mariana Trench', 'Bermuda Triangle', 'Thames', 'Dead Sea'], correct: 0, cheer: 'Nearly 11 km down!' },
      { q: 'Which ocean is between Europe and America?', options: ['Pacific', 'Indian', 'Atlantic', 'Arctic'], correct: 2, cheer: 'Yes!' },
      { q: 'What famous ship sank in the Atlantic?', options: ['Titanic', 'Ark Royal', 'HMS Victory', 'Golden Hind'], correct: 0, cheer: 'Correct.' },
      { q: 'Which ocean is growing 2cm wider each year?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], correct: 1, cheer: 'Continents drifting apart!' },
      { q: 'Which ocean surrounds Antarctica?', options: ['Arctic', 'Atlantic', 'Southern', 'Pacific'], correct: 2, cheer: 'Icy waters!' },
      { q: 'Where do polar bears live?', options: ['South Pole', 'Arctic Ocean area', 'Everywhere', 'Indian Ocean'], correct: 1, cheer: 'North only!' },
      { q: 'Where do penguins live?', options: ['Arctic only', 'Southern regions', 'Everywhere', 'Only in zoos'], correct: 1, cheer: 'Never the Arctic!' },
      { q: 'The biggest animal that ever lived lives in the ocean. What is it?', options: ['Shark', 'Blue whale', 'Octopus', 'Crab'], correct: 1, cheer: 'Huge and gentle!' }
    ],
    hasVideo: true,
    videoId: 'X6BE4VcYngQ',
    bitesizeQuery: 'oceans of the world'
  },

  4: {
    title: 'Mountains and Volcanoes',
    intro: 'Some of Earth\'s most dramatic features are its mountains — and some of them can erupt!',
    slides: [
      { title: 'What is a mountain?', text: 'A mountain is a big lump of land that rises high above the ground around it. Most mountains were made when two pieces of Earth\'s crust crashed slowly into each other, pushing rocks up. This takes millions of years!',
        imageQuery: 'mountain range snow peaks' },
      { title: 'The Himalayas: roof of the world', text: 'The Himalayas in Asia are the tallest mountains on Earth. Mount Everest stands 8,848 metres high — taller than stacking 24 of London\'s tallest buildings on top of each other! They\'re still growing taller by about 5 mm every year.',
        imageQuery: 'mount everest himalayas snow' },
      { title: 'Volcanoes: mountains of fire', text: 'A volcano is a mountain with a hole reaching deep into Earth. Sometimes super-hot melted rock called magma pushes up through this hole and bursts out. When it\'s outside, it\'s called lava — and it can be 1,200°C, hot enough to melt metal!',
        imageQuery: 'volcano eruption lava flowing',
        animation: 'volcano' },
      { title: 'Pompeii: a city frozen in time', text: 'In 79 AD, Mount Vesuvius in Italy erupted and buried the Roman city of Pompeii under ash. Terrible for the people there — but the ash preserved everything, so today we can walk through Roman streets and houses exactly as they were 2,000 years ago!',
        imageQuery: 'pompeii ruins vesuvius italy' },
      { title: 'Active, dormant, extinct', text: 'Volcanoes can be: active (erupting now or recently), dormant (sleeping — could wake up), or extinct (will never erupt again). Earth has about 1,500 active volcanoes. Most of them line a huge horseshoe shape around the Pacific called the Ring of Fire.',
        imageQuery: 'ring of fire volcanoes map pacific' },
      { title: 'Why mountains matter', text: 'Mountains are home to special plants and animals (like snow leopards, mountain goats, and eagles) and provide fresh water for billions of people — rivers start high in the hills! People climb mountains for adventure, ski down them for fun, and mine them for valuable rocks like gold.',
        imageQuery: 'snow leopard mountain wildlife' }
    ],
    questions: [
      { q: 'How are most mountains formed?', options: ['Dug by people', 'Two pieces of Earth\'s crust collide', 'Fall from space', 'Made by animals'], correct: 1, cheer: 'Correct!' },
      { q: 'Where are the Himalayas?', options: ['Africa', 'Europe', 'Asia', 'America'], correct: 2, cheer: 'Roof of the world!' },
      { q: 'How tall is Mount Everest?', options: ['848 m', '8,848 m', '88 km', '88 m'], correct: 1, cheer: 'Very tall!' },
      { q: 'What is melted rock inside a volcano called?', options: ['Lava', 'Magma', 'Mud', 'Clay'], correct: 1, cheer: 'And lava when it\'s outside.' },
      { q: 'How hot can lava be?', options: ['100°C', '500°C', '1,200°C', '10,000°C'], correct: 2, cheer: 'Scorching!' },
      { q: 'What Roman city was buried in 79 AD?', options: ['Rome', 'Pompeii', 'Milan', 'Venice'], correct: 1, cheer: 'Preserved in ash!' },
      { q: 'Which volcano erupted over Pompeii?', options: ['Etna', 'Vesuvius', 'Stromboli', 'Fuji'], correct: 1, cheer: 'Correct!' },
      { q: 'What is a dormant volcano?', options: ['Erupting now', 'Sleeping — could wake up', 'Extinct forever', 'Underwater only'], correct: 1, cheer: 'Yes!' },
      { q: 'Where are most active volcanoes?', options: ['Europe', 'The Ring of Fire (Pacific)', 'Africa', 'Ocean bottom'], correct: 1, cheer: 'Amazing horseshoe shape!' },
      { q: 'Why are mountains important to people?', options: ['They give fresh water', 'They look nice only', 'Nothing much', 'They slow trains'], correct: 0, cheer: 'Rivers start there!' }
    ],
    hasVideo: true,
    videoId: 'lAmqsMQG3RM',
    bitesizeQuery: 'mountains volcanoes'
  },

  5: {
    title: 'Rivers and Waterfalls',
    intro: 'Water travels the world in amazing ways. Let\'s follow a river from the tiny start to the wide sea!',
    slides: [
      { title: 'Where rivers begin', text: 'Most rivers start up in the mountains or hills. Rain falls, or snow melts, and the water starts to trickle downhill. A tiny starting point is called the "source". Gradually, little streams join together to make a proper river.',
        imageQuery: 'river source mountain stream' },
      { title: 'The river\'s journey', text: 'As a river flows down, it speeds up, splashing over rocks. Further down in the middle, it widens and slows a bit, flowing through valleys. At the end, it reaches the sea — this place is called the "mouth". A big journey from a tiny trickle!',
        imageQuery: 'river landscape meadow valley',
        animation: 'river-flow' },
      { title: 'The mighty Nile', text: 'The River Nile in Africa is the longest river in the world at 6,650 km. It flows through 11 countries including Egypt, where ancient civilizations depended on it. Without the Nile flooding every year and leaving rich mud, there would have been no Ancient Egypt!',
        imageQuery: 'river nile egypt aerial' },
      { title: 'The Amazon: a jungle river', text: 'The Amazon in South America is the biggest river by the amount of water it carries. It moves more water than the next seven biggest rivers combined! It flows through the Amazon rainforest and is home to piranhas, river dolphins, and giant anacondas.',
        imageQuery: 'amazon river rainforest south america' },
      { title: 'Waterfalls!', text: 'When a river flows over a high cliff, it becomes a waterfall! The most famous is Niagara Falls on the USA/Canada border. The tallest waterfall in the world is Angel Falls in Venezuela — 979 metres high, that\'s taller than three Eiffel Towers stacked up!',
        imageQuery: 'angel falls venezuela waterfall' },
      { title: 'Why rivers matter to us', text: 'People have always lived near rivers. They give us drinking water, let us water our crops, power mills and factories, let boats travel, and provide fish. London was built on the Thames, Paris on the Seine, Cairo on the Nile. Rivers really are the lifelines of our world.',
        imageQuery: 'london thames river aerial city' }
    ],
    questions: [
      { q: 'Where do most rivers begin?', options: ['In cities', 'In mountains/hills', 'At the sea', 'Underground only'], correct: 1, cheer: 'Correct!' },
      { q: 'What is the start of a river called?', options: ['Mouth', 'Source', 'Tail', 'Top'], correct: 1, cheer: 'Yes!' },
      { q: 'What is the end of a river called?', options: ['Finish', 'Source', 'Mouth', 'Tail'], correct: 2, cheer: 'Mouth!' },
      { q: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Thames', 'Yangtze'], correct: 1, cheer: 'Over 6,600 km!' },
      { q: 'Which river carries the most water?', options: ['Nile', 'Amazon', 'Mississippi', 'Thames'], correct: 1, cheer: 'Massive!' },
      { q: 'Which continent is the Amazon in?', options: ['Africa', 'South America', 'Asia', 'Europe'], correct: 1, cheer: 'Right!' },
      { q: 'Where is Niagara Falls?', options: ['UK', 'USA/Canada', 'Brazil', 'Italy'], correct: 1, cheer: 'Famous cross-border falls.' },
      { q: 'What is the world\'s tallest waterfall?', options: ['Niagara', 'Victoria', 'Angel Falls', 'Iguazu'], correct: 2, cheer: '979 m high!' },
      { q: 'Which river is London built on?', options: ['Seine', 'Thames', 'Nile', 'Danube'], correct: 1, cheer: 'Yes!' },
      { q: 'Why have people always lived near rivers?', options: ['They\'re pretty', 'Water, food, travel, power', 'They\'re cold', 'They\'re warm'], correct: 1, cheer: 'Life-giving!' }
    ],
    hasVideo: true,
    videoId: 'bNWuQD7QHBc',
    bitesizeQuery: 'rivers source mouth'
  },

  6: {
    title: 'The United Kingdom',
    intro: 'You live here! The United Kingdom is a small country with a huge story. Let\'s get to know it.',
    slides: [
      { title: 'Four countries, one family', text: 'The United Kingdom is made of four countries: England, Scotland, Wales, and Northern Ireland. Together they share a king or queen, a parliament, and the pound (£). Each country has its own flag, but together they fly the Union Jack — which combines all their flags!',
        imageQuery: 'union jack uk flag four flags' },
      { title: 'England: the biggest', text: 'England is the biggest of the four countries. Its capital is London, home of Big Ben, the London Eye, and Buckingham Palace. England also has Manchester, Liverpool, Birmingham, and many beautiful old cities like York and Bath.',
        imageQuery: 'london big ben parliament' },
      { title: 'Scotland: mountains and lochs', text: 'Scotland fills the northern third of the island. It\'s famous for its mountains (like Ben Nevis), its lakes called lochs (including mysterious Loch Ness!), and its traditions: tartan patterns, kilts, and bagpipes. Edinburgh is the capital.',
        imageQuery: 'scotland highlands loch ness' },
      { title: 'Wales: dragons and castles', text: 'Wales is on the west side of the island. It has more castles per square mile than any country in the world! Its flag has a fierce red dragon. Cardiff is the capital, and Snowdonia has beautiful mountains. Welsh is still spoken alongside English.',
        imageQuery: 'wales snowdon castle dragon flag' },
      { title: 'Northern Ireland', text: 'Northern Ireland is on the island of Ireland, separate from the mainland UK across the Irish Sea. Its capital is Belfast, where the Titanic was built. The amazing Giant\'s Causeway is there — 40,000 natural hexagonal stone columns along the coast!',
        imageQuery: 'giants causeway northern ireland basalt' },
      { title: 'Famous British things', text: 'Britain has given the world football, cricket, tennis, fish and chips, afternoon tea, the Royal Family, Harry Potter, Shakespeare, The Beatles, and Paddington Bear. Not bad for a small island!',
        imageQuery: 'british icons fish chips double decker bus' }
    ],
    questions: [
      { q: 'How many countries make up the UK?', options: ['2', '3', '4', '5'], correct: 2, cheer: 'Correct!' },
      { q: 'Which of these is NOT part of the UK?', options: ['Scotland', 'Wales', 'Ireland (south)', 'Northern Ireland'], correct: 2, cheer: 'Spot on — Republic of Ireland is separate.' },
      { q: 'What is the capital of the UK?', options: ['Manchester', 'London', 'Edinburgh', 'Cardiff'], correct: 1, cheer: 'Yes!' },
      { q: 'What is the capital of Scotland?', options: ['Glasgow', 'Edinburgh', 'Dundee', 'Inverness'], correct: 1, cheer: 'Right!' },
      { q: 'What is the capital of Wales?', options: ['Swansea', 'Cardiff', 'Newport', 'Bangor'], correct: 1, cheer: 'Correct!' },
      { q: 'What is the capital of Northern Ireland?', options: ['Dublin', 'Belfast', 'Londonderry', 'Armagh'], correct: 1, cheer: 'Yes!' },
      { q: 'What flag is on Wales\'s flag?', options: ['Lion', 'Dragon', 'Horse', 'Rose'], correct: 1, cheer: 'Fiery dragon!' },
      { q: 'What ship was built in Belfast?', options: ['HMS Victory', 'Titanic', 'Cutty Sark', 'Ark Royal'], correct: 1, cheer: 'Famous ship.' },
      { q: 'What natural wonder is in Northern Ireland?', options: ['Giant\'s Causeway', 'Grand Canyon', 'Niagara Falls', 'Loch Ness'], correct: 0, cheer: 'Amazing hexagons!' },
      { q: 'What is the highest mountain in Scotland?', options: ['Snowdon', 'Ben Nevis', 'Scafell', 'Everest'], correct: 1, cheer: 'Correct!' }
    ],
    hasVideo: true,
    videoId: 'kU_SpzWKtqE',
    bitesizeQuery: 'united kingdom four countries'
  },

  7: {
    title: 'Europe: Our Continent',
    intro: 'Europe is the continent where we live — small but full of history, culture, and amazing places!',
    slides: [
      { title: 'A small but mighty continent', text: 'Europe is the second-smallest continent but has over 44 countries and more than 700 million people. It stretches from Iceland in the cold north to Greece and Spain in the sunny south.',
        imageQuery: 'europe map countries highlighted' },
      { title: 'France: food, art, wine', text: 'France is our closest neighbour across the English Channel. Paris is its capital, home to the Eiffel Tower (324 metres tall) and the Louvre Museum, where the Mona Lisa lives. French people love baguettes, croissants, and 400 kinds of cheese!',
        imageQuery: 'paris eiffel tower france' },
      { title: 'Italy: history everywhere', text: 'Italy is shaped like a long boot! Rome is its capital, with the Colosseum where gladiators fought. Italy gave the world pizza, pasta, ice cream (gelato), Leonardo da Vinci, and the Roman Empire!',
        imageQuery: 'italy colosseum rome pasta pizza' },
      { title: 'Germany, Spain, and more', text: 'Germany is famous for cars (BMW, Mercedes), Christmas markets, and amazing castles like Neuschwanstein. Spain has flamenco dancing, bullfights, and tapas. The Netherlands is famous for tulips and windmills. Switzerland has snowy Alps and delicious chocolate.',
        imageQuery: 'neuschwanstein castle germany bavaria' },
      { title: 'Lots of languages', text: 'More than 200 languages are spoken in Europe — English, French, German, Italian, Spanish, Polish, Greek, and many more. The European Union is a group of 27 European countries that work together, trade, and help each other.',
        imageQuery: 'european union flag map' },
      { title: 'Big cities, beautiful countryside', text: 'Europe has exciting capital cities like London, Paris, Berlin, Madrid, Rome, and Amsterdam. But it also has stunning countryside: the Alps mountains, Norwegian fjords, Greek islands, and the tulip fields of Holland. There\'s so much to explore!',
        imageQuery: 'european alps mountains lake' }
    ],
    questions: [
      { q: 'How many countries are in Europe?', options: ['5', '12', 'Over 44', '100'], correct: 2, cheer: 'Lots!' },
      { q: 'What sea is between England and France?', options: ['North Sea', 'English Channel', 'Baltic Sea', 'Irish Sea'], correct: 1, cheer: 'Right!' },
      { q: 'What is the capital of France?', options: ['Marseille', 'Lyon', 'Paris', 'Nice'], correct: 2, cheer: 'Yes!' },
      { q: 'What famous tower is in Paris?', options: ['Eiffel Tower', 'Tower of London', 'Leaning Tower', 'Sears Tower'], correct: 0, cheer: '324m tall!' },
      { q: 'What shape is Italy?', options: ['Triangle', 'Boot', 'Circle', 'Square'], correct: 1, cheer: 'A walking boot!' },
      { q: 'What is the capital of Italy?', options: ['Milan', 'Rome', 'Venice', 'Florence'], correct: 1, cheer: 'Correct!' },
      { q: 'Which country is famous for tulips and windmills?', options: ['Germany', 'Netherlands', 'Spain', 'Italy'], correct: 1, cheer: 'Yes!' },
      { q: 'What is the EU?', options: ['A type of currency', 'European Union — countries working together', 'Empty Union', 'Eastern Union'], correct: 1, cheer: 'Well done!' },
      { q: 'Which country has famous flamenco dancing?', options: ['Germany', 'Spain', 'Italy', 'France'], correct: 1, cheer: 'Olé!' },
      { q: 'Which country has the Alps?', options: ['Only Italy', 'Many countries (Switzerland, France, Italy, Austria)', 'Only Switzerland', 'Only Germany'], correct: 1, cheer: 'Shared mountains!' }
    ],
    hasVideo: true,
    videoId: 'RNx0akt3_XI',
    bitesizeQuery: 'europe countries map'
  },

  8: {
    title: 'Africa: Land of Contrasts',
    intro: 'Africa is huge, beautiful, and full of amazing places, people, and animals.',
    slides: [
      { title: 'A massive continent', text: 'Africa is the second-biggest continent. It has 54 countries, over 1.4 billion people, and over 2,000 languages! From the Sahara desert in the north to the tropical forests in the middle and the Cape of Good Hope in the south — it\'s incredibly varied.',
        imageQuery: 'africa continent map countries' },
      { title: 'The Sahara: world\'s biggest desert', text: 'The Sahara desert stretches across the top of Africa — bigger than the entire USA! It\'s mostly sand, rock, and almost no rain. But it\'s also home to camels, amazing oases where palm trees grow, and ancient trading cities that have stood for centuries.',
        imageQuery: 'sahara desert sand dunes camels' },
      { title: 'The amazing savanna', text: 'Much of Africa is covered by grasslands called savanna. This is where you find the famous African animals: lions, elephants, giraffes, zebras, rhinos, hippos, and cheetahs — all living together. Every year, millions of wildebeest and zebras migrate across the Serengeti looking for fresh grass.',
        imageQuery: 'african savanna lion elephant wildlife',
        animation: 'savanna' },
      { title: 'The mighty Nile', text: 'The Nile, the world\'s longest river, flows through 11 African countries and ends in Egypt. It was the lifeline of Ancient Egypt. Today millions of people still depend on it for drinking, farming, and fishing.',
        imageQuery: 'nile river egypt africa' },
      { title: 'Cities and culture', text: 'Africa has ancient wonders like the Pyramids in Egypt and Great Zimbabwe, and modern mega-cities like Cairo, Lagos (Nigeria), Nairobi (Kenya), and Johannesburg (South Africa). African music — drums, singing, dancing — has influenced music worldwide, especially jazz and hip-hop.',
        imageQuery: 'cairo egypt city skyline' },
      { title: 'Africa today', text: 'Africa is changing fast. Its young population is using mobile phones to bring new businesses to life. Countries are investing in schools and clean energy. African scientists, artists, and sports stars are making waves worldwide. It\'s a continent of incredible potential.',
        imageQuery: 'african market street modern city' }
    ],
    questions: [
      { q: 'How many countries are in Africa?', options: ['10', '25', '54', '100'], correct: 2, cheer: 'Correct!' },
      { q: 'What is the world\'s largest hot desert, in Africa?', options: ['Gobi', 'Sahara', 'Kalahari', 'Namib'], correct: 1, cheer: 'Huge sandy ocean!' },
      { q: 'What are African grasslands called?', options: ['Tundra', 'Savanna', 'Prairie', 'Meadow'], correct: 1, cheer: 'Yes!' },
      { q: 'Which river flows through Egypt?', options: ['Amazon', 'Nile', 'Congo', 'Niger'], correct: 1, cheer: 'Ancient lifeline!' },
      { q: 'Which is the tallest African land animal?', options: ['Lion', 'Elephant', 'Giraffe', 'Zebra'], correct: 2, cheer: 'Long neck!' },
      { q: 'What\'s the famous annual migration of wildebeest called?', options: ['Serengeti migration', 'Kenya walk', 'Zambezi run', 'Nile parade'], correct: 0, cheer: 'Amazing sight!' },
      { q: 'What ancient wonders are in Egypt?', options: ['Stonehenge', 'Pyramids', 'Colosseum', 'Big Ben'], correct: 1, cheer: 'Yes!' },
      { q: 'What is the biggest African city by population?', options: ['Lagos', 'Cairo', 'London', 'Paris'], correct: 0, cheer: 'Nigeria\'s capital!' },
      { q: 'Which music style has African roots?', options: ['Classical', 'Jazz and hip-hop', 'Country', 'Opera'], correct: 1, cheer: 'Deep connection!' },
      { q: 'Africa\'s population is mostly…', options: ['Very old', 'Very young', 'Mostly over 70', 'Mostly over 50'], correct: 1, cheer: 'Youthful continent!' }
    ],
    hasVideo: true,
    videoId: 'PSYHMWmyVfo',
    bitesizeQuery: 'africa continent countries'
  },

  9: {
    title: 'Asia: The Biggest Continent',
    intro: 'Asia is the biggest continent — by a long way. It\'s where half the people on Earth live.',
    slides: [
      { title: 'The giant of continents', text: 'Asia is enormous! It stretches from Turkey in the west to Japan in the east, from icy Siberia in the north to tropical Indonesia in the south. It covers about a third of all land on Earth, and 4.6 billion people live there — more than half the world!',
        imageQuery: 'asia continent map large' },
      { title: 'China: world\'s most populous', text: 'China has around 1.4 billion people — more than any other country! Beijing is its capital. China built the Great Wall (over 20,000 km long!) and gave the world paper, printing, the compass, and gunpowder. Today its cities like Shanghai have some of the tallest buildings on Earth.',
        imageQuery: 'china great wall shanghai skyline' },
      { title: 'India: colourful and diverse', text: 'India has the second-biggest population — 1.4 billion people speaking over 400 languages! Its capital is New Delhi. India is home to the Taj Mahal, tigers, the Himalayas, Bollywood films, and delicious spicy food like curries and samosas.',
        imageQuery: 'india taj mahal tigers' },
      { title: 'Japan: modern meets traditional', text: 'Japan is a chain of islands off the east coast of Asia. Tokyo is the capital — the world\'s biggest city! Japan gave us sushi, karate, origami, anime cartoons, and the bullet train (Shinkansen). Mount Fuji is its beautiful sacred volcano.',
        imageQuery: 'japan mount fuji tokyo' },
      { title: 'Southeast Asia adventures', text: 'Southeast Asia includes Thailand (temples and elephants), Vietnam (rice paddies and pho), Indonesia (17,000 islands!), Singapore (the city in a garden), and Cambodia (Angkor Wat temples hidden in jungle). Warm, colourful, and full of wonder.',
        imageQuery: 'angkor wat cambodia temple' },
      { title: 'The Middle East', text: 'The Middle East is in western Asia — countries like Saudi Arabia, Iran, Iraq, Turkey, and the UAE with shiny Dubai. It\'s where three great religions began: Judaism, Christianity, and Islam. Most of the world\'s oil comes from here.',
        imageQuery: 'dubai skyline burj khalifa',
        animation: 'asia-map' }
    ],
    questions: [
      { q: 'How much of the world\'s population lives in Asia?', options: ['A tenth', 'A quarter', 'Over half', 'All of it'], correct: 2, cheer: 'Most of everyone!' },
      { q: 'Which country has the most people?', options: ['Russia', 'China', 'USA', 'India'], correct: 1, cheer: 'Very close to India!' },
      { q: 'What is the capital of China?', options: ['Shanghai', 'Beijing', 'Hong Kong', 'Tokyo'], correct: 1, cheer: 'Correct!' },
      { q: 'How long is the Great Wall of China?', options: ['20 km', '200 km', 'Over 20,000 km', '200,000 km'], correct: 2, cheer: 'Mind-boggling!' },
      { q: 'Which famous building is in India?', options: ['Taj Mahal', 'Eiffel Tower', 'Pyramids', 'Big Ben'], correct: 0, cheer: 'Beautiful love story!' },
      { q: 'What is Japan\'s capital?', options: ['Kyoto', 'Tokyo', 'Osaka', 'Hiroshima'], correct: 1, cheer: 'Biggest city on Earth!' },
      { q: 'What is Japan\'s sacred volcano?', options: ['Fuji', 'Etna', 'Vesuvius', 'Krakatoa'], correct: 0, cheer: 'Correct!' },
      { q: 'Which country has 17,000 islands?', options: ['Japan', 'Philippines', 'Indonesia', 'Vietnam'], correct: 2, cheer: 'Amazing!' },
      { q: 'In which city is the Burj Khalifa (world\'s tallest building)?', options: ['Shanghai', 'New York', 'Dubai', 'Tokyo'], correct: 2, cheer: '828 m tall!' },
      { q: 'Which continent is the largest?', options: ['Africa', 'Asia', 'America', 'Europe'], correct: 1, cheer: 'The giant!' }
    ],
    hasVideo: true,
    videoId: 'nsOtOye-DJM',
    bitesizeQuery: 'asia continent countries'
  },

  10: {
    title: 'The Americas: North and South',
    intro: 'From frozen Alaska to the tip of Argentina, the Americas stretch half the world.',
    slides: [
      { title: 'Two continents, joined', text: 'The Americas are two continents joined by a narrow strip of land called Central America. North America includes Canada, the USA, and Mexico. South America has 12 countries including Brazil, Argentina, and Peru. The whole stretch is around 16,000 km long!',
        imageQuery: 'americas north south map' },
      { title: 'The USA: 50 states', text: 'The United States of America has 50 states. Washington DC is the capital but New York is the most famous city, with the Statue of Liberty. California has Hollywood and big redwood trees. The USA invented the internet, jeans, jazz, and sent the first people to the Moon.',
        imageQuery: 'new york statue of liberty skyline' },
      { title: 'Canada: the great north', text: 'Canada is the second-biggest country in the world (after Russia), but only about 40 million people live there. Its capital is Ottawa. Canada has bears, beavers, maple syrup, ice hockey, and nearly endless forests. Every winter parts of it get SO cold that waterfalls freeze solid!',
        imageQuery: 'canada maple leaf niagara winter' },
      { title: 'Mexico and Central America', text: 'Mexico is south of the USA. Its capital is Mexico City — a huge city built on top of an old Aztec city called Tenochtitlán! Mexico gave us tacos, nachos, chocolate (yes — it was invented here!), and the spectacular Day of the Dead festival.',
        imageQuery: 'mexico day of the dead festival' },
      { title: 'Brazil and the Amazon', text: 'Brazil is the biggest country in South America. Its capital is Brasília but Rio de Janeiro with the famous Christ the Redeemer statue is its most famous city. Brazil contains most of the Amazon rainforest — so important to the whole world\'s air and weather.',
        imageQuery: 'brazil rio christ redeemer amazon' },
      { title: 'Andes, Amazon, and icy tip', text: 'South America has the Andes, the longest mountain chain on Earth, running down its western edge. It has the driest desert (Atacama in Chile), and at its bottom point, Patagonia, it\'s so close to Antarctica you can almost see the icebergs! Argentina\'s tango, Peru\'s Machu Picchu, Chile\'s mountains — it\'s stunning.',
        imageQuery: 'machu picchu peru andes' }
    ],
    questions: [
      { q: 'How many continents make up "the Americas"?', options: ['1', '2', '3', '4'], correct: 1, cheer: 'North and South!' },
      { q: 'What connects North and South America?', options: ['A big bridge', 'Central America', 'A tunnel', 'Nothing'], correct: 1, cheer: 'Narrow link!' },
      { q: 'How many states in the USA?', options: ['13', '50', '100', '30'], correct: 1, cheer: 'Yes!' },
      { q: 'What is the USA\'s capital?', options: ['New York', 'Washington DC', 'Los Angeles', 'Chicago'], correct: 1, cheer: 'Right!' },
      { q: 'Which is the world\'s 2nd biggest country by land?', options: ['USA', 'Canada', 'China', 'Brazil'], correct: 1, cheer: 'Huge northern neighbour!' },
      { q: 'Where was chocolate invented?', options: ['Switzerland', 'Belgium', 'Mexico', 'France'], correct: 2, cheer: 'Mmm!' },
      { q: 'Which is the biggest country in South America?', options: ['Argentina', 'Peru', 'Brazil', 'Colombia'], correct: 2, cheer: 'Huge!' },
      { q: 'Which statue stands over Rio de Janeiro?', options: ['Liberty', 'Christ the Redeemer', 'Lincoln', 'Buddha'], correct: 1, cheer: 'Arms outstretched!' },
      { q: 'What is the longest mountain range on Earth?', options: ['Rockies', 'Alps', 'Himalayas', 'Andes'], correct: 3, cheer: 'Running down South America!' },
      { q: 'What incredible lost city is in Peru?', options: ['Machu Picchu', 'Pompeii', 'Angkor Wat', 'Troy'], correct: 0, cheer: 'Inca wonder!' }
    ],
    hasVideo: true,
    videoId: 'AOUK3Oit86o',
    bitesizeQuery: 'americas north south continent'
  },

  11: {
    title: 'Australia and Oceania',
    intro: 'Down under at the bottom of the world sits Australia — home to creatures found nowhere else.',
    slides: [
      { title: 'A country that\'s a continent', text: 'Australia is the only country that\'s also a whole continent! It\'s about the same size as all of Europe, but only 26 million people live there (compared to 700 million in Europe). Its capital is Canberra, but Sydney and Melbourne are its famous big cities.',
        imageQuery: 'australia map sydney opera house' },
      { title: 'Weird and wonderful animals', text: 'Australia split from the other continents millions of years ago, so its animals evolved separately. That\'s why it has kangaroos, koalas, wombats, platypuses, Tasmanian devils, and the cuddly quokka — found nowhere else on Earth!',
        imageQuery: 'kangaroo koala platypus australia' },
      { title: 'The Great Barrier Reef', text: 'Just off Australia\'s north-east coast is the Great Barrier Reef — the biggest coral reef in the world, over 2,300 km long! It\'s so big you can see it from space. It\'s home to 1,500 kinds of fish, 400 kinds of coral, sharks, turtles, and octopuses. It\'s the largest living thing on Earth.',
        imageQuery: 'great barrier reef coral fish underwater' },
      { title: 'The Outback', text: 'Most of Australia\'s centre is called the Outback — a huge, almost empty area of red desert, rocky plains, and blue skies. In the middle of it all sits Uluru (also called Ayers Rock) — a gigantic sandstone rock sacred to the Aboriginal people who\'ve lived there for 65,000 years.',
        imageQuery: 'uluru ayers rock australia outback' },
      { title: 'Island nations', text: 'Around Australia are the countries of Oceania — thousands of Pacific islands. New Zealand is the closest neighbour, with its dramatic mountains used as Middle-earth in the Lord of the Rings films. Other island nations include Fiji, Samoa, and Tonga — with white beaches and blue lagoons.',
        imageQuery: 'new zealand mountains fiordland fiji beach' },
      { title: 'Opposite seasons', text: 'Here\'s a fun fact: Australia\'s seasons are opposite to ours! When it\'s summer in Britain, it\'s winter in Australia. When we\'re having a cold Christmas, Australians are eating their Christmas dinner on the beach! That\'s because we\'re on opposite halves of the world.',
        imageQuery: 'australian beach christmas santa',
        animation: 'hemisphere' }
    ],
    questions: [
      { q: 'Is Australia a country, a continent, or both?', options: ['Just a country', 'Just a continent', 'Both!', 'Neither'], correct: 2, cheer: 'Unique!' },
      { q: 'What is Australia\'s capital?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2, cheer: 'Correct!' },
      { q: 'Which animal is native to Australia?', options: ['Lion', 'Kangaroo', 'Tiger', 'Panda'], correct: 1, cheer: 'Hopping!' },
      { q: 'What is the Great Barrier Reef?', options: ['A wall', 'A coral reef', 'A road', 'A mountain'], correct: 1, cheer: 'Biggest living thing on Earth!' },
      { q: 'Can you see the Great Barrier Reef from space?', options: ['Yes', 'No', 'Only with a telescope', 'Only by night'], correct: 0, cheer: 'Amazing!' },
      { q: 'What is the huge sacred rock in the centre of Australia?', options: ['Uluru', 'Everest', 'Kilimanjaro', 'Rushmore'], correct: 0, cheer: 'Aboriginal sacred site.' },
      { q: 'How long have Aboriginal Australians lived there?', options: ['200 years', '2,000 years', '65,000 years', '1 million years'], correct: 2, cheer: 'Incredibly long!' },
      { q: 'What country is Australia\'s close neighbour?', options: ['Japan', 'New Zealand', 'UK', 'USA'], correct: 1, cheer: 'Across the Tasman Sea!' },
      { q: 'Which films were filmed in New Zealand?', options: ['Harry Potter', 'Lord of the Rings', 'Star Wars', 'Toy Story'], correct: 1, cheer: 'Epic scenery!' },
      { q: 'When it\'s Christmas in the UK, it\'s what season in Australia?', options: ['Winter', 'Spring', 'Summer', 'Autumn'], correct: 2, cheer: 'Beach Christmas!' }
    ],
    hasVideo: true,
    videoId: 'f0PvMmTAUAQ',
    bitesizeQuery: 'australia oceania continent'
  },

  12: {
    title: 'Antarctica: The Frozen Continent',
    intro: 'At the very bottom of the world lies Antarctica — the coldest, windiest, emptiest place on Earth.',
    slides: [
      { title: 'A continent of ice', text: 'Antarctica sits around the South Pole. About 98% of it is covered in ice — in some places the ice is 4 km thick! That\'s more frozen water than anywhere else on Earth. If all of Antarctica\'s ice melted, sea levels worldwide would rise by 60 metres — taller than a 15-storey building.',
        imageQuery: 'antarctica ice continent aerial' },
      { title: 'The coldest place on Earth', text: 'Antarctica is the coldest place on the planet. The lowest temperature ever recorded there was −89.2°C! Even in "summer", most of the continent stays below freezing. The wind is so strong it can knock you off your feet — blizzards can last for days.',
        imageQuery: 'antarctica blizzard cold scientists' },
      { title: 'Penguins, whales, and seals', text: 'Despite the cold, Antarctica has amazing wildlife. Emperor penguins huddle together to keep warm and walk for months to breeding grounds. Whales feed in the icy waters. Seals doze on ice floes. And skua birds swoop overhead. No land mammals live there — it\'s too cold!',
        imageQuery: 'emperor penguins antarctica colony' },
      { title: 'No country owns it', text: 'Antarctica is the only continent that doesn\'t belong to any country. In 1959, many countries signed the Antarctic Treaty agreeing that Antarctica would be used only for peaceful science — no armies, no mining, no nuclear weapons. Just research and protection.',
        imageQuery: 'antarctic treaty research station' },
      { title: 'Scientists at the bottom', text: 'Although no one lives there permanently, scientists visit from around the world. They study climate change in the ice, hunt for meteorites (which stand out on the white ice!), and look deep into space — the clear, dry air of Antarctica makes it one of the best places on Earth to see the stars.',
        imageQuery: 'antarctica research station scientist',
        animation: 'aurora' },
      { title: 'Why Antarctica matters', text: 'Antarctica is like Earth\'s refrigerator — it helps cool the whole planet. It holds the record of Earth\'s past climate in its ancient ice layers. And sadly, it\'s melting because of climate change, which is why looking after Antarctica is so important for the whole world.',
        imageQuery: 'antarctica ice melting climate change' }
    ],
    questions: [
      { q: 'Where is Antarctica?', options: ['North Pole', 'South Pole', 'Equator', 'Middle of Pacific'], correct: 1, cheer: 'Very bottom!' },
      { q: 'What percent of Antarctica is covered in ice?', options: ['10%', '50%', '80%', '98%'], correct: 3, cheer: 'Almost all!' },
      { q: 'What was the coldest temperature ever recorded on Earth?', options: ['-20°C', '-50°C', '-89°C', '-150°C'], correct: 2, cheer: 'Ridiculously cold!' },
      { q: 'Which penguin is found in Antarctica?', options: ['Emperor', 'African', 'Galapagos', 'Fairy'], correct: 0, cheer: 'The biggest kind!' },
      { q: 'Do any countries own Antarctica?', options: ['Yes, many', 'Yes, one', 'No, none', 'Yes, UK only'], correct: 2, cheer: 'Protected by treaty.' },
      { q: 'When was the Antarctic Treaty signed?', options: ['1919', '1959', '1989', '2019'], correct: 1, cheer: 'Brilliant international agreement!' },
      { q: 'What do scientists mostly study in Antarctica?', options: ['Penguins only', 'Climate, space, meteorites, wildlife', 'Movies', 'Nothing'], correct: 1, cheer: 'Lots of science!' },
      { q: 'Why are meteorites easy to find in Antarctica?', options: ['They fall more often there', 'They stand out on the white ice', 'Penguins find them', 'Magnets'], correct: 1, cheer: 'Clever hunters!' },
      { q: 'Why is Antarctica like Earth\'s "refrigerator"?', options: ['It chills the whole planet', 'It stores food', 'It makes ice cream', 'It\'s rectangular'], correct: 0, cheer: 'Cooling effect.' },
      { q: 'What\'s happening to Antarctica because of climate change?', options: ['Growing colder', 'Staying the same', 'Melting', 'Turning green'], correct: 2, cheer: 'That\'s why we must act!' }
    ],
    hasVideo: true,
    videoId: 'X3uT89xoKuc',
    bitesizeQuery: 'antarctica south pole ice'
  },

  13: {
    title: 'Weather and Climate',
    intro: 'Sun, rain, snow, wind — why does the weather keep changing? And what\'s the difference between weather and climate?',
    slides: [
      { title: 'Weather vs climate', text: 'Weather is what\'s happening outside right now — sunny, rainy, snowy, windy. Climate is what the weather is USUALLY like in a place over many years. For example, Britain has a mild and rainy climate. The Sahara has a hot and dry climate. Today\'s weather is one thing — climate is the bigger picture.',
        imageQuery: 'weather climate chart comparison' },
      { title: 'Where does rain come from?', text: 'The Sun heats up water in oceans, lakes, and puddles, and the water evaporates — turns to invisible vapour that rises into the sky. High up where it\'s cold, the vapour turns back into tiny drops of water, which gather together as clouds. When drops get too heavy — plop! — it rains.',
        imageQuery: 'water cycle diagram evaporation rain',
        animation: 'water-cycle' },
      { title: 'Why does wind blow?', text: 'Wind is air moving. The Sun heats some parts of Earth more than others. Warm air rises, cool air rushes in to take its place — and we feel that movement as wind! Big areas of moving air create weather systems. A calm day just means the air near you isn\'t moving much.',
        imageQuery: 'wind blowing flag trees' },
      { title: 'Thunder and lightning', text: 'Inside a storm cloud, tiny bits of ice bump around and build up electricity — like rubbing a balloon on your hair! When the charge gets big enough, WHOOSH — a lightning bolt shoots out, heating the air so fast it BANGS, making thunder. Lightning is five times hotter than the Sun\'s surface!',
        imageQuery: 'lightning thunderstorm cloud' },
      { title: 'Different climates', text: 'Earth has many climate zones. Near the Equator it\'s hot and wet all year (tropical). At the Poles it\'s freezing (polar). Between them we have deserts (hot and dry), temperate zones like Britain (mild with four seasons), and mountain climates (colder up high).',
        imageQuery: 'climate zones world map equator' },
      { title: 'Why seasons happen', text: 'Seasons happen because Earth is tilted! As Earth goes around the Sun, different parts get more sunlight at different times. When our half is tilted towards the Sun, we have summer. Six months later, we\'re tilted away and it\'s winter. The Earth is doing the same thing every year!',
        imageQuery: 'earth seasons tilt diagram' }
    ],
    questions: [
      { q: 'What\'s the difference between weather and climate?', options: ['They\'re the same', 'Weather = now; climate = usual pattern over years', 'Climate = now; weather = usual', 'Neither matters'], correct: 1, cheer: 'Correct!' },
      { q: 'What makes water evaporate?', options: ['Wind', 'The Sun\'s heat', 'Rain', 'Cold'], correct: 1, cheer: 'Solar power!' },
      { q: 'What are clouds made of?', options: ['Cotton wool', 'Tiny water droplets', 'Gas', 'Dust'], correct: 1, cheer: 'Water droplets!' },
      { q: 'What makes wind?', options: ['Trees shaking', 'Warm and cool air moving', 'The Moon', 'Mountains'], correct: 1, cheer: 'Air moving!' },
      { q: 'What is lightning?', options: ['Magic', 'A giant electric spark', 'Sun reflecting', 'Angels'], correct: 1, cheer: 'Super-hot spark!' },
      { q: 'How much hotter than the Sun\'s surface is lightning?', options: ['Same', '2x', '5x', '100x'], correct: 2, cheer: 'Incredibly hot!' },
      { q: 'What kind of climate is near the Equator?', options: ['Polar', 'Desert', 'Tropical (hot and wet)', 'Mountain'], correct: 2, cheer: 'Jungle weather!' },
      { q: 'What kind of climate does Britain have?', options: ['Tropical', 'Polar', 'Temperate', 'Desert'], correct: 2, cheer: 'Mild and rainy!' },
      { q: 'Why do we have seasons?', options: ['Moon\'s orbit', 'Earth is tilted', 'Earth stops', 'Wind direction'], correct: 1, cheer: 'That tilt matters!' },
      { q: 'How long does it take Earth to go around the Sun for a full cycle of seasons?', options: ['1 day', '1 month', '1 year', '10 years'], correct: 2, cheer: 'One year!' }
    ],
    hasVideo: true,
    videoId: 'YbAWny7FV3w',
    bitesizeQuery: 'weather climate water cycle'
  },

  14: {
    title: 'Biomes: Life on Earth',
    intro: 'Earth has many different places where plants and animals live — let\'s visit its main biomes!',
    slides: [
      { title: 'What is a biome?', text: 'A biome is a big region of Earth with a certain climate and kinds of plants and animals. Think of it as a giant habitat. Earth\'s main biomes include rainforests, deserts, grasslands, tundra, taiga, temperate forests, and oceans.',
        imageQuery: 'world biomes map colors' },
      { title: 'Tropical rainforest', text: 'Rainforests are hot, wet, and packed with life. Tall trees form a dense roof (canopy), with shorter plants below. The Amazon rainforest alone has more kinds of plants and animals than anywhere else on Earth — jaguars, sloths, parrots, poison dart frogs, and half of the world\'s species!',
        imageQuery: 'amazon rainforest canopy toucan' },
      { title: 'Hot desert', text: 'Deserts get almost no rain — less than 25 cm a year. Daytime can reach 50°C; at night it can drop below freezing! Animals that live there — camels, fennec foxes, snakes, scorpions — have clever ways to save water. Cactus plants store water inside their fat stems.',
        imageQuery: 'desert camel sahara sunset' },
      { title: 'Polar tundra', text: 'The tundra is a cold, treeless biome near the Arctic. The ground is frozen solid below the surface (permafrost). Plants are tiny — mostly mosses and lichens. Animals like Arctic foxes, caribou, snowy owls, and musk oxen have thick fur to survive the long, dark winters.',
        imageQuery: 'arctic tundra caribou wolves' },
      { title: 'Temperate forest', text: 'Temperate forests, like those in Britain, have four clear seasons. Oak, beech, and maple trees grow green in spring, burst with leaves in summer, turn orange and red in autumn, and stand bare in winter. Squirrels, foxes, hedgehogs, and deer live here.',
        imageQuery: 'autumn forest fox deer woodland' },
      { title: 'Ocean biomes', text: 'The oceans are the biggest biome of all. From sunny reefs full of colour, to deep dark trenches where only strange glowing fish live, oceans are a whole world of their own. Whales, sharks, turtles, jellyfish, tiny plankton — the ocean food chain keeps our whole planet going.',
        imageQuery: 'ocean coral reef fish diversity' }
    ],
    questions: [
      { q: 'What is a biome?', options: ['A type of building', 'A big area with a certain climate and life', 'A type of dinosaur', 'A weather pattern'], correct: 1, cheer: 'Exactly!' },
      { q: 'Which biome has the most plant and animal species?', options: ['Desert', 'Tundra', 'Rainforest', 'Ocean'], correct: 2, cheer: 'Teeming with life!' },
      { q: 'How much rain does a desert usually get?', options: ['Loads', 'Less than 25 cm a year', 'Same as forests', 'Only snow'], correct: 1, cheer: 'Dry!' },
      { q: 'Why do cactuses have fat stems?', options: ['To look pretty', 'To store water', 'To house birds', 'To trap insects'], correct: 1, cheer: 'Water tanks!' },
      { q: 'What is permafrost?', options: ['A magic spell', 'Permanently frozen ground', 'Heavy snow', 'A type of ice cream'], correct: 1, cheer: 'Frozen solid!' },
      { q: 'Which of these lives in the Arctic tundra?', options: ['Parrot', 'Arctic fox', 'Camel', 'Giraffe'], correct: 1, cheer: 'Correct!' },
      { q: 'What type of forest is most of Britain?', options: ['Rainforest', 'Tundra', 'Temperate', 'Desert'], correct: 2, cheer: 'Four seasons!' },
      { q: 'What do temperate trees do in autumn?', options: ['Turn colourful and drop leaves', 'Stay green always', 'Flower', 'Die'], correct: 0, cheer: 'Beautiful show!' },
      { q: 'Which is Earth\'s biggest biome?', options: ['Desert', 'Rainforest', 'Ocean', 'Grassland'], correct: 2, cheer: 'Seventy percent of Earth!' },
      { q: 'What is plankton?', options: ['Tiny ocean creatures', 'A big fish', 'A wave', 'Seaweed'], correct: 0, cheer: 'Start of the food chain!' }
    ],
    hasVideo: true,
    videoId: '0fb8143ndo8',
    bitesizeQuery: 'biomes habitats rainforest desert'
  },

  15: {
    title: 'Maps and How to Read Them',
    intro: 'Maps help us see our world and find our way. They\'re like drawings of places from above!',
    slides: [
      { title: 'What is a map?', text: 'A map is a picture of a place drawn from above, as if you were a bird looking down. Maps show how places, rivers, roads, and countries fit together. People have drawn maps for thousands of years — ancient Babylonian maps from 4,000 years ago still exist!',
        imageQuery: 'old world map antique atlas' },
      { title: 'North, south, east, west', text: 'Maps use four main directions: north (up), south (down), east (right), and west (left) — usually shown on a little picture called a compass rose. Remember "Never Eat Shredded Wheat" for North-East-South-West going clockwise!',
        imageQuery: 'compass rose directions map',
        animation: 'compass' },
      { title: 'Symbols and keys', text: 'Maps use small pictures called symbols to show things like schools, hospitals, and churches. Because it would be boring to draw every church, mapmakers use simple symbols. A "key" (or "legend") on the map tells you what each symbol means.',
        imageQuery: 'ordnance survey map symbols key' },
      { title: 'Scale: fitting big onto small', text: 'A map is much smaller than the real place! The "scale" tells you how much smaller. For example, 1:100,000 means 1 cm on the map = 100,000 cm (1 km) in real life. Small-scale maps show big areas with less detail; large-scale maps show small areas with more detail.',
        imageQuery: 'map scale comparison ruler' },
      { title: 'Contour lines: hills on a map', text: 'If a map shows hills and valleys, it uses wiggly lines called contour lines. Each line connects places that are the same height. Lines close together mean a steep slope. Lines far apart mean gentle ground. Clever!',
        imageQuery: 'contour map ordnance survey hill' },
      { title: 'Today\'s maps and GPS', text: 'We still use paper maps for hiking, but most people use digital maps on phones now — Google Maps, Apple Maps, GPS. Satellites high above Earth know exactly where your phone is and show it on the map! Explorers long ago would have loved having that.',
        imageQuery: 'google maps phone satellite earth' }
    ],
    questions: [
      { q: 'What does a map show?', options: ['A place from above', 'A place from the side', 'A person', 'A time'], correct: 0, cheer: 'Bird\'s-eye view!' },
      { q: 'What direction is usually up on a map?', options: ['South', 'East', 'North', 'West'], correct: 2, cheer: 'Yes!' },
      { q: 'What is a compass rose?', options: ['A flower', 'A picture showing directions on a map', 'A type of weather', 'A boat'], correct: 1, cheer: 'Direction helper!' },
      { q: 'What is a map key?', options: ['Unlocks the map', 'Tells you what symbols mean', 'Hides treasure', 'The title'], correct: 1, cheer: 'Spot on!' },
      { q: 'What does "1:100,000" mean?', options: ['The map cost', '1 cm = 100,000 cm in real life', 'Time taken', 'Number of pages'], correct: 1, cheer: 'Scale!' },
      { q: 'What are contour lines?', options: ['Main roads', 'Lines connecting same heights', 'Bus routes', 'Borders'], correct: 1, cheer: 'Hills on maps!' },
      { q: 'Contour lines close together mean…', options: ['Gentle slope', 'Steep slope', 'Water', 'A forest'], correct: 1, cheer: 'Climb carefully!' },
      { q: 'What direction comes between N and E?', options: ['NE', 'NW', 'SE', 'SW'], correct: 0, cheer: 'North-east!' },
      { q: 'What phrase helps remember directions?', options: ['Never Eat Shredded Wheat', 'Silly Old Goats', 'Red Robin Goes', 'Big Wet Noses'], correct: 0, cheer: 'N-E-S-W!' },
      { q: 'Today, what uses satellites to help with maps?', options: ['Paper maps', 'GPS', 'Old compasses', 'None of these'], correct: 1, cheer: 'Satellites tracking us!' }
    ],
    hasVideo: true,
    videoId: 'iHEMOdRo5u8',
    bitesizeQuery: 'maps symbols compass'
  }
};

/* ---------- Topic briefs for days 16-60 ---------- */
export const GEOGRAPHY_BRIEFS = {
  16: 'Earthquakes & plate tectonics — Earth\'s crust in pieces (plates), they move, bump, slide, cause earthquakes; Richter scale; famous quakes.',
  17: 'The water cycle — evaporation, condensation, precipitation, collection; vital to all life; drawn as a diagram.',
  18: 'Deserts — not just hot (Antarctica is a cold desert!), Sahara/Gobi/Atacama/Namib, life in deserts, dune shapes.',
  19: 'Rainforests — 4 layers (emergent, canopy, understorey, forest floor), Amazon vs Congo vs Borneo, half all species live there.',
  20: 'Polar regions — Arctic sea ice vs Antarctic continent, midnight sun, aurora, climate change threats.',
  21: 'Coasts — cliffs, beaches, arches, stacks, tides, erosion over centuries; Britain has 11,000+ miles of coast.',
  22: 'Islands — types (volcanic like Hawaii, continental like UK, coral like Maldives), peninsulas, archipelagos (Japan, Indonesia).',
  23: 'Cities — why people live in cities (jobs, services), top 5 biggest by population (Tokyo, Delhi, Shanghai, São Paulo, Mexico City).',
  24: 'Capital cities — what they do (government, embassies), sometimes not the biggest (Canberra not Sydney; DC not NYC).',
  25: 'Population — 8 billion on Earth, growing fast, not evenly distributed, density maps, megacities vs empty areas.',
  26: 'Migration — why people move (work, safety, family, climate), refugees, diaspora, Britain as a country of migration.',
  27: 'Food & where it comes from — trace a breakfast around the world, climate determines crops, tea from India, bananas from Ecuador.',
  28: 'Famous landmarks — Eiffel Tower, Great Wall, Taj Mahal, Statue of Liberty, Christ the Redeemer, Sydney Opera House.',
  29: 'Time zones — Earth has 24, 1 hour each, why London and Sydney are opposite, the International Date Line.',
  30: 'Longitude/latitude — Equator (0° lat), Greenwich Meridian (0° long), grid covering the world, coordinates.',
  31: 'Rock cycle — three types: igneous (volcanic), sedimentary (layers), metamorphic (pressure); rocks slowly change.',
  32: 'Glaciers — slow rivers of ice, carved valleys (U-shape), fjords, Lake District shaped by glaciers, now retreating.',
  33: 'Amazon rainforest threats — deforestation for cattle/soy/logging, impact on climate, indigenous peoples, conservation.',
  34: 'Climate change — Earth warming since industrial revolution, causes (CO2), effects (sea rise, extreme weather), what we can do.',
  35: 'Natural disasters — earthquakes, tsunamis, hurricanes, floods, droughts; early warning, international aid, preparation.',
  36: 'Renewable energy — sun (solar), wind, water (hydro), geothermal, waves; examples around the world; Britain\'s wind farms.',
  37: 'Farming — arable (crops) vs pastoral (animals); subsistence vs commercial; battery vs free range; organic; British farms.',
  38: 'Fishing & oceans — overfishing crisis, aquaculture (farmed fish), marine protected areas, plastic pollution.',
  39: 'Tourism — world\'s biggest industry, France most visited, pros (income, jobs) and cons (pollution, culture changes).',
  40: 'Trade — countries buy and sell to each other, shipping containers, imports/exports, supply chains, Panama/Suez Canals.',
  41: 'Rich & poor countries — developed (UK, USA, Japan) vs developing (parts of Africa, Asia), causes, ways to help.',
  42: 'Megacities — over 10 million people, Tokyo, Delhi, Shanghai; amazing skylines, transport challenges.',
  43: 'Slums — informal settlements in many cities, Dharavi (Mumbai), Kibera (Nairobi), life and resilience, gradual improvements.',
  44: 'Sustainable cities — bike lanes, green roofs, efficient transport, parks; Copenhagen, Singapore as examples.',
  45: 'Rivers: source to sea — stages (upper/middle/lower), meanders, oxbow lakes, delta (Nile/Mississippi), estuaries.',
  46: 'Coastal erosion — longshore drift, England\'s east coast losing metres per year, sea defences, managed retreat.',
  47: 'Tsunamis — caused by underwater earthquakes, 2004 Indian Ocean and 2011 Japan disasters, warning systems.',
  48: 'Ring of Fire — 75% of world\'s volcanoes, around the Pacific Ocean edge, why: tectonic plates meeting.',
  49: 'Hurricanes/typhoons/cyclones — same storm, different names by ocean; eye of the storm; Saffir-Simpson scale.',
  50: 'Great Barrier Reef — 2,300 km long, 1500 fish species, threats: bleaching from warm seas, protection efforts.',
  51: 'Himalayas — formed by India crashing into Asia, still growing, source of Ganges/Indus, Sherpa climbers.',
  52: 'Sahara desert — 9 million km², bigger than USA, once was green 10,000 years ago, Tuareg people, oases.',
  53: 'Great rivers: Nile (longest), Amazon (largest by volume), Yangtze (China), Mississippi (USA).',
  54: 'Mediterranean — almost closed sea, warm, Greek/Roman history, modern tourism, 22 countries touch it.',
  55: 'Russia — biggest country, 11 time zones!, Trans-Siberian Railway, Moscow, cold north, diverse people.',
  56: 'China — 1.4 billion people, booming economy, mega-cities, factory of the world, Belt and Road.',
  57: 'India — 1.4 billion, many religions/languages, Bollywood, tech hubs (Bangalore), youngest population.',
  58: 'Brazil — biggest South American country, Amazon, Carnival, football, economic contrasts.',
  59: 'European Union — 27 countries, free movement of goods/people, euro currency, parliament in Strasbourg.',
  60: 'Protecting our planet — recycling, reducing waste, renewable energy, conservation, your role matters.'
};
