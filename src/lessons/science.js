/* ==========================================================================
   SCIENCE CURRICULUM — 60 lessons, Year 2 → Year 7 UK curriculum
   ========================================================================== */

export const SCIENCE_TOPICS = [
  // DAYS 1-15 hardcoded — KS1/early KS2 foundational
  'Living Things and Habitats',                   // 1
  'Plants: How They Grow',                        // 2
  'The Human Body: Amazing Machine',              // 3
  'Our Five Senses',                              // 4
  'Materials All Around Us',                      // 5
  'Solids, Liquids, and Gases',                   // 6
  'Forces: Push and Pull',                        // 7
  'Magnets and Magnetism',                        // 8
  'Light and Shadows',                            // 9
  'Sound: How We Hear',                           // 10
  'Electricity: The Invisible Power',             // 11
  'The Solar System',                             // 12
  'The Moon and the Stars',                       // 13
  'Rocks and Fossils',                            // 14
  'Dinosaurs and Extinct Animals',                // 15

  // DAYS 16-30 — KS2 broadening
  'Animal Life Cycles',                           // 16
  'Food Chains and Webs',                         // 17
  'The Digestive System',                         // 18
  'Teeth and How to Care for Them',               // 19
  'Skeletons and Muscles',                        // 20
  'The Heart and Blood',                          // 21
  'The Lungs and Breathing',                      // 22
  'Reversible and Irreversible Changes',          // 23
  'Separating Mixtures',                          // 24
  'Sound Travels in Waves',                       // 25
  'How the Eye Sees',                             // 26
  'Colour and the Rainbow',                       // 27
  'Simple Machines: Levers and Pulleys',          // 28
  'Floating and Sinking',                         // 29
  'Friction and Air Resistance',                  // 30

  // DAYS 31-45 — KS3 Year 7 territory
  'Cells: The Tiny Building Blocks',              // 31
  'Evolution: How Life Changes',                  // 32
  'Classifying Living Things',                    // 33
  'Microorganisms: Good and Bad',                 // 34
  'Immune System: The Body\'s Defenders',          // 35
  'Reproduction in Plants',                       // 36
  'Reproduction in Animals',                      // 37
  'Genes and Inheritance',                        // 38
  'Ecosystems and Biodiversity',                  // 39
  'States of Matter and Particles',               // 40
  'Elements and the Periodic Table',              // 41
  'Atoms and Molecules',                          // 42
  'Acids and Alkalis',                            // 43
  'Chemical Reactions',                           // 44
  'Metals and Non-metals',                        // 45

  // DAYS 46-60 — KS3 Year 8-9 territory
  'Energy: Forms and Transfers',                  // 46
  'Heat and Temperature',                         // 47
  'Electric Circuits',                            // 48
  'Space: Beyond Our Solar System',               // 49
  'Gravity and Mass',                             // 50
  'Speed, Distance, and Time',                    // 51
  'The Earth\'s Layers',                           // 52
  'Weather Science: Clouds and Storms',           // 53
  'Climate Science and Our Planet\'s Future',      // 54
  'Renewable vs Non-renewable Energy',            // 55
  'Plastics, Pollution, and Recycling',           // 56
  'Great Scientists Who Changed the World',       // 57
  'How Science Works: Experiments & Proof',       // 58
  'Future Technology: AI, Robots, Space',         // 59
  'Being a Scientist: It Could Be You!'           // 60
];

export const SCIENCE_LESSONS = {
  1: {
    title: 'Living Things and Habitats',
    intro: 'How do we know if something is alive? And where do living things like to live? Let\'s find out!',
    slides: [
      { title: 'What makes something alive?', text: 'All living things do seven things: they Move, breathe (Respire), are Sensitive to their surroundings, Grow, Reproduce (have babies), get rid of waste (Excrete), and Eat or make food (Nutrition). Remember the word "MRS GREN"!',
        imageQuery: 'living things characteristics diagram' },
      { title: 'Plants are alive too!', text: 'Plants don\'t walk around or make noise, but they\'re definitely alive. They grow, make their own food from sunlight, reproduce through seeds, breathe in through their leaves, and respond to light by turning towards it.',
        imageQuery: 'plant growing sunlight sprout' },
      { title: 'What is a habitat?', text: 'A habitat is the place where a living thing lives. An oak tree is a habitat for squirrels, birds, and insects. A pond is a habitat for frogs and fish. The Arctic ice is a habitat for polar bears. Each habitat has the food, water, and shelter its animals need.',
        imageQuery: 'pond habitat frog fish plants' },
      { title: 'Microhabitats: tiny homes', text: 'Some habitats are very small — we call them microhabitats. A rotting log can be a microhabitat for woodlice, beetles, and fungi. Under a stone, you might find worms, millipedes, and tiny spiders. Even a small puddle can be a microhabitat!',
        imageQuery: 'rotting log insects beetles microhabitat' },
      { title: 'Adaptations: fitting in', text: 'Living things have special features that help them live in their habitat. A polar bear has thick white fur for cold and camouflage. A camel has big feet that don\'t sink in sand, and humps to store fat. A fish has gills to breathe underwater. These clever features are called adaptations.',
        imageQuery: 'polar bear camel adaptations' },
      { title: 'Food chains: eating and being eaten', text: 'In every habitat, living things eat each other in a chain! Grass is eaten by rabbits, rabbits are eaten by foxes. That\'s a food chain. The grass is called the producer (it makes its own food), and the rabbit and fox are consumers. Most food chains start with plants and the Sun!',
        imageQuery: 'food chain grass rabbit fox diagram' }
    ],
    questions: [
      { q: 'What word helps remember the 7 things living things do?', options: ['ABC DEF', 'MRS GREN', 'HELLO', 'ALIVE'], correct: 1, cheer: 'Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition!' },
      { q: 'Are plants living?', options: ['Yes', 'No', 'Only in summer', 'Only when flowering'], correct: 0, cheer: 'Yes! They do all 7 things.' },
      { q: 'What is a habitat?', options: ['A type of food', 'The place where a living thing lives', 'A tool', 'A colour'], correct: 1, cheer: 'Spot on!' },
      { q: 'A rotting log can be home to...', options: ['Only birds', 'Only people', 'Woodlice and beetles', 'Only fish'], correct: 2, cheer: 'Microhabitat!' },
      { q: 'Why is a polar bear\'s fur white?', options: ['It\'s bleached', 'For warmth and camouflage', 'No reason', 'Magic'], correct: 1, cheer: 'Clever adaptation!' },
      { q: 'What\'s an adaptation?', options: ['A feature that helps an animal survive', 'A type of food', 'A kind of cage', 'An experiment'], correct: 0, cheer: 'Exactly!' },
      { q: 'Why do camels have big feet?', options: ['For running fast', 'So they don\'t sink in sand', 'For kicking', 'Decoration'], correct: 1, cheer: 'Built for deserts!' },
      { q: 'What is a food chain?', options: ['A shopping list', 'Shows what eats what', 'A recipe', 'A shop'], correct: 1, cheer: 'Who eats whom!' },
      { q: 'In a food chain, what\'s a "producer"?', options: ['A movie maker', 'Plant that makes its own food', 'An animal', 'A pond'], correct: 1, cheer: 'Plants!' },
      { q: 'What starts most food chains?', options: ['Fire', 'The Sun', 'Water', 'Wind'], correct: 1, cheer: 'Solar power!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'living things habitats ks2'
  },

  2: {
    title: 'Plants: How They Grow',
    intro: 'Plants are the quiet heroes of our world. They feed us, give us oxygen, and start every meal.',
    slides: [
      { title: 'From a tiny seed', text: 'Every big plant started as a tiny seed. Inside each seed is a baby plant with a little packed lunch of food. When a seed gets water and warmth, it starts to grow — we call this "germination". The root grows down, and the shoot pushes up!',
        imageQuery: 'seed germination roots shoots' },
      { title: 'Parts of a plant', text: 'A typical plant has: Roots (that grip the soil and drink water), a Stem (that holds the plant up and carries water up), Leaves (that make food), and Flowers (which become fruits and seeds). Each part has a special job.',
        imageQuery: 'plant parts diagram labeled' },
      { title: 'Photosynthesis: food from sunlight', text: 'Plants do something amazing — they make their own food! Using energy from sunlight, water from their roots, and a gas called carbon dioxide from the air, leaves make sugar (food) and oxygen (which we breathe!). This magic is called photosynthesis.',
        imageQuery: 'photosynthesis diagram sunlight leaves' },
      { title: 'Flowers, bees, and fruit', text: 'Flowers aren\'t just pretty — they\'re how plants make seeds! Bees and other insects visit flowers for sweet nectar, and by accident carry pollen from flower to flower. This is called pollination. Then the flower becomes a fruit with seeds inside. Apples, tomatoes, pumpkins — all fruits!',
        imageQuery: 'bee flower pollination' },
      { title: 'Seeds on the move', text: 'Plants can\'t walk, so they spread their seeds in clever ways. Dandelion seeds have fluff and ride the wind. Burrs stick to animal fur. Cherries get eaten by birds and the seeds come out… later, somewhere else! Some seeds float on water. Some even explode out of pods!',
        imageQuery: 'dandelion seeds wind dispersal' },
      { title: 'Why plants matter', text: 'Plants make the oxygen we breathe, the food we eat, the wood we build with, the paper we write on, and the cotton in our clothes. They cool the planet, feed every animal on Earth, and make our world beautiful. Without plants, life as we know it would be impossible.',
        imageQuery: 'forest canopy oxygen trees' }
    ],
    questions: [
      { q: 'What does a seed need to start growing?', options: ['Electricity', 'Water and warmth', 'Paint', 'Noise'], correct: 1, cheer: 'Germination!' },
      { q: 'Which part of a plant drinks water?', options: ['Leaves', 'Flowers', 'Roots', 'Stem'], correct: 2, cheer: 'Correct!' },
      { q: 'What job do leaves do?', options: ['Make food', 'Drink water', 'Attract bees', 'Hold the plant up'], correct: 0, cheer: 'Solar-powered chefs!' },
      { q: 'What is photosynthesis?', options: ['Plants talking', 'Making food from sunlight', 'Growing taller', 'Shedding leaves'], correct: 1, cheer: 'Amazing!' },
      { q: 'What gas do plants release that we breathe?', options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Hydrogen'], correct: 1, cheer: 'Thanks, plants!' },
      { q: 'What do bees do for flowers?', options: ['Paint them', 'Pollinate them', 'Water them', 'Cut them'], correct: 1, cheer: 'Essential helpers!' },
      { q: 'What is a tomato?', options: ['A vegetable', 'A fruit (seeds inside)', 'A flower', 'A root'], correct: 1, cheer: 'Surprising but true!' },
      { q: 'How do dandelions spread their seeds?', options: ['By rain', 'By wind', 'By birds carrying them', 'Underground'], correct: 1, cheer: 'Fluffy parachutes!' },
      { q: 'Burrs spread by...', options: ['Floating', 'Exploding', 'Sticking to animal fur', 'Bouncing'], correct: 2, cheer: 'Hitchhikers!' },
      { q: 'Why are plants so important?', options: ['Oxygen, food, materials', 'Only for flowers', 'Only for decoration', 'Not important'], correct: 0, cheer: 'Vital to life!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'plants growth photosynthesis ks2'
  },

  3: {
    title: 'The Human Body: Amazing Machine',
    intro: 'Your body is the most amazing machine in the world — and you get to use it every day!',
    slides: [
      { title: 'Organ systems working together', text: 'Your body is made up of different systems that all work together: the skeleton holds you up, muscles move you, your heart pumps blood, lungs breathe air, stomach digests food, and brain runs the whole show. A team of trillions of cells!',
        imageQuery: 'human body systems diagram' },
      { title: 'Your incredible brain', text: 'Your brain has about 86 billion cells called neurons, connected by trillions of links. It controls everything you do — thinking, moving, remembering, dreaming. It uses about 20% of your energy even though it\'s only 2% of your weight!',
        imageQuery: 'human brain anatomy neurons' },
      { title: 'Skeleton: your body\'s frame', text: 'You have 206 bones! Your biggest bone is the femur (thigh bone) — about the length of your foot. Your smallest bones are in your ear, tiny as a grain of rice. Bones are alive and can heal if broken. Babies have more bones (around 300) — some fuse together as you grow!',
        imageQuery: 'human skeleton bones labeled' },
      { title: 'Muscles: movers and shakers', text: 'You have over 600 muscles! The strongest for its size is the masseter (the jaw muscle) — try it by biting! The tiniest muscles move your eyes, over 100 times per second. Your heart is actually a special muscle that works non-stop for your whole life!',
        imageQuery: 'human muscles anatomy' },
      { title: 'Blood and the heart', text: 'Your heart pumps about 5 litres of blood around your body every minute — filling a big bottle! Blood carries oxygen from your lungs and food from your stomach to every single cell. If you stretched all your blood vessels end to end, they\'d wrap around the Earth TWICE!',
        imageQuery: 'heart anatomy blood vessels' },
      { title: 'Skin: the biggest organ', text: 'Your skin is actually your largest organ! It weighs about as much as a bag of sugar. It protects you from germs, stops you from drying out, helps control your temperature (by sweating), and makes vitamin D when sunlight touches it. It replaces itself every month!',
        imageQuery: 'human skin layers anatomy' }
    ],
    questions: [
      { q: 'How many bones does an adult have?', options: ['20', '206', '1,000', '50'], correct: 1, cheer: 'Correct!' },
      { q: 'Why do babies have more bones than adults?', options: ['They grow extra', 'Some fuse together as you grow', 'They just do', 'They eat too much'], correct: 1, cheer: 'Fusing together!' },
      { q: 'What is your brain mostly made of?', options: ['Water', 'Cells called neurons', 'Muscle', 'Fat'], correct: 1, cheer: 'Thinking cells!' },
      { q: 'How much energy does your brain use?', options: ['1%', '5%', '20%', '50%'], correct: 2, cheer: 'Hungry brain!' },
      { q: 'What\'s the longest bone in your body?', options: ['Arm', 'Spine', 'Thigh (femur)', 'Skull'], correct: 2, cheer: 'Big strong bone!' },
      { q: 'How many muscles do you have?', options: ['10', '100', 'Over 600', 'A million'], correct: 2, cheer: 'Lots!' },
      { q: 'What is the heart made of?', options: ['Bone', 'A special muscle', 'Fat', 'Blood'], correct: 1, cheer: 'Non-stop muscle!' },
      { q: 'How much blood does the heart pump per minute?', options: ['A teaspoon', 'A cup', '5 litres', '50 litres'], correct: 2, cheer: 'Amazing pump!' },
      { q: 'What\'s your biggest organ?', options: ['Heart', 'Lungs', 'Stomach', 'Skin'], correct: 3, cheer: 'Surprising!' },
      { q: 'How often does skin replace itself?', options: ['Never', 'Once a year', 'Every month', 'Every 100 years'], correct: 2, cheer: 'New skin regularly!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'human body organs ks2'
  },

  4: {
    title: 'Our Five Senses',
    intro: 'Sight, hearing, smell, taste, touch — your senses help you explore the world!',
    slides: [
      { title: 'Five windows to the world', text: 'Your senses are how your brain knows about the world. You have five main senses: sight (eyes), hearing (ears), smell (nose), taste (tongue), and touch (skin). Each gives your brain different information so you can understand what\'s around you.',
        imageQuery: 'five senses diagram illustration' },
      { title: 'Your amazing eyes', text: 'Eyes work like cameras. Light bounces off things and enters your eye through the pupil (the black circle). A lens focuses the image onto the back of your eye, and nerves send the picture to your brain. You see about 10 million colours — but bees see more than us!',
        imageQuery: 'eye anatomy pupil retina' },
      { title: 'How ears hear', text: 'Sound is tiny vibrations in the air. These wiggle into your ear, hit your eardrum, and the eardrum wobbles. Tiny bones pass the wobble to a fluid-filled snail-shaped tube full of hairs that turn the vibration into signals for your brain. All that from vibrating air!',
        imageQuery: 'ear anatomy eardrum cochlea' },
      { title: 'Smell: invisible chemistry', text: 'When you sniff a rose or a stinky sock, you\'re actually sucking tiny chemical molecules up your nose. Special cells at the top of your nose detect these molecules and tell your brain. Humans can identify around 10,000 different smells!',
        imageQuery: 'nose anatomy smell molecules' },
      { title: 'Taste: just five flavours', text: 'Surprisingly, your tongue only detects five basic tastes: sweet, sour, salty, bitter, and umami (savoury). All the amazing flavours of food come from these five combined with smell. That\'s why food tastes bland when you have a cold — your nose is blocked!',
        imageQuery: 'tongue taste buds diagram' },
      { title: 'Touch: many kinds in one', text: 'Touch is actually many senses: pressure, heat, cold, pain, and texture. Your skin has different sensors for each. Your fingertips are very sensitive (good for picking up small things), while your back is less so (hard to tell if someone taps you with one finger or two!).',
        imageQuery: 'skin sensors fingertips' }
    ],
    questions: [
      { q: 'How many main senses do we have?', options: ['3', '5', '7', '10'], correct: 1, cheer: 'Correct!' },
      { q: 'What does the eye\'s pupil do?', options: ['Smells things', 'Lets light in', 'Hears things', 'Blinks'], correct: 1, cheer: 'Light door!' },
      { q: 'Where does sound hit first in your ear?', options: ['Eardrum', 'Brain', 'Eyes', 'Nose'], correct: 0, cheer: 'Vibrating drum!' },
      { q: 'What are smells made of?', options: ['Magic', 'Tiny chemical molecules', 'Light', 'Electricity'], correct: 1, cheer: 'Flying molecules!' },
      { q: 'How many main tastes are there?', options: ['2', '3', '5', '100'], correct: 2, cheer: 'Just five!' },
      { q: 'Which is NOT one of the five basic tastes?', options: ['Sweet', 'Sour', 'Spicy', 'Salty'], correct: 2, cheer: 'Tricky — spicy is actually pain!' },
      { q: 'Why does food taste bland with a cold?', options: ['Your tongue gets sick', 'Your blocked nose can\'t help with flavour', 'Food changes', 'Ears are blocked'], correct: 1, cheer: 'Smell and taste team up!' },
      { q: 'What does your skin sense?', options: ['Only touch', 'Touch, heat, cold, pain', 'Only pain', 'Only cold'], correct: 1, cheer: 'Many sensors!' },
      { q: 'Which body part is most sensitive to touch?', options: ['Back', 'Knee', 'Fingertips', 'Ear lobe'], correct: 2, cheer: 'Great for little things!' },
      { q: 'What is umami?', options: ['A kind of fish', 'A savoury taste', 'A colour', 'A sound'], correct: 1, cheer: 'The fifth taste!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'five senses human body'
  },

  5: {
    title: 'Materials All Around Us',
    intro: 'Everything in the world is made of something. Let\'s explore the materials we use every day!',
    slides: [
      { title: 'What is a material?', text: 'A material is what something is made of. Wood, glass, metal, plastic, fabric, paper, rubber — these are all materials. Look around you right now: your chair might be wood or plastic, your clothes fabric, your window glass. So many materials!',
        imageQuery: 'different materials wood metal plastic' },
      { title: 'Natural vs man-made', text: 'Some materials come from nature: wood from trees, wool from sheep, cotton from plants, metal from rocks. Others are man-made: plastic is created in factories from oil, glass is made from melted sand, and concrete from cement and stones.',
        imageQuery: 'natural materials wood wool cotton' },
      { title: 'Properties: what materials are like', text: 'Every material has properties — words that describe it. Hard, soft, bendy, stiff, heavy, light, waterproof, transparent (see-through), shiny, stretchy. A window needs to be transparent. A raincoat needs to be waterproof. Picking the right material matters!',
        imageQuery: 'material properties chart kids' },
      { title: 'Wood: strong and warm', text: 'Wood comes from trees. It\'s strong but light, easy to cut and shape, and can be beautiful. We use it for houses, furniture, floors, paper, and pencils. Different trees give different woods — oak is hard and strong, pine is softer and cheaper.',
        imageQuery: 'wood furniture grain texture' },
      { title: 'Metal: strong and shiny', text: 'Metals come from rocks in the ground. They\'re strong, can bend without breaking, and conduct electricity (which means electricity flows through them). That\'s why wires are metal. Steel (made from iron) is used in cars, buildings, and bridges. Gold and silver are used for jewellery.',
        imageQuery: 'steel bridge metal' },
      { title: 'Plastic: useful but a problem', text: 'Plastic is light, waterproof, cheap, and can be any shape or colour. It\'s used for bottles, toys, bags, and thousands more things. But plastic takes hundreds of years to break down, and waste plastic is polluting our oceans. That\'s why we recycle and try to use less.',
        imageQuery: 'plastic bottles recycling' }
    ],
    questions: [
      { q: 'What is a material?', options: ['A type of weather', 'What something is made of', 'A shape', 'A colour'], correct: 1, cheer: 'Correct!' },
      { q: 'Which is a natural material?', options: ['Plastic', 'Glass', 'Wood', 'Polyester'], correct: 2, cheer: 'From trees!' },
      { q: 'Where does wool come from?', options: ['Rocks', 'Sheep', 'Oil', 'Sand'], correct: 1, cheer: 'Yes!' },
      { q: 'What is glass made from?', options: ['Plastic', 'Rocks', 'Melted sand', 'Water'], correct: 2, cheer: 'Surprising, right?' },
      { q: 'What does "transparent" mean?', options: ['See-through', 'Hard', 'Colourful', 'Flexible'], correct: 0, cheer: 'Like a window!' },
      { q: 'A raincoat needs to be...', options: ['Transparent', 'Waterproof', 'Magnetic', 'Heavy'], correct: 1, cheer: 'Essential property!' },
      { q: 'What\'s special about metals with electricity?', options: ['They block it', 'They conduct it (let it flow)', 'They magnetise it', 'Nothing'], correct: 1, cheer: 'That\'s why wires are metal!' },
      { q: 'What is steel made from mostly?', options: ['Iron', 'Wood', 'Glass', 'Water'], correct: 0, cheer: 'Strong building material!' },
      { q: 'How long can plastic take to break down?', options: ['A day', 'A year', '10 years', 'Hundreds of years'], correct: 3, cheer: 'That\'s why it pollutes!' },
      { q: 'What can we do about plastic pollution?', options: ['Ignore it', 'Recycle and use less', 'Only use plastic', 'Throw it in the sea'], correct: 1, cheer: 'We can help!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'materials properties ks1'
  },

  6: {
    title: 'Solids, Liquids, and Gases',
    intro: 'Water is wet, ice is hard, steam rises up. They\'re all water — just in different forms! Let\'s explore.',
    slides: [
      { title: 'The three states of matter', text: 'Every material on Earth is either a solid, liquid, or gas. These are called the "three states of matter". Solids have a fixed shape (like a rock). Liquids flow and take the shape of their container (like water in a cup). Gases spread out and fill any space (like air in a room).',
        imageQuery: 'states of matter solid liquid gas' },
      { title: 'Solids: stay put', text: 'Solids keep their shape because their tiny particles are packed tightly together and can\'t move around much — they can only wobble in place. A brick is a brick whether it\'s on a wall or on the floor. You can stack solids, cut them, or break them.',
        imageQuery: 'solid bricks stones particles' },
      { title: 'Liquids: take the container\'s shape', text: 'In liquids, the particles are close together but can slide past each other. That\'s why water pours and fills whatever container you pour it into — a cup, a bath, a glass. Liquids have a fixed amount but no fixed shape.',
        imageQuery: 'water pouring glass liquid' },
      { title: 'Gases: fill the whole space', text: 'In gases, particles are far apart and zoom around at high speed. That\'s why if you open a bottle of fizzy drink, the gas rushes out with a PSSSS. Gases have no fixed shape AND no fixed volume — they expand to fill any container.',
        imageQuery: 'balloon gas helium' },
      { title: 'Changing between states', text: 'The same material can change from one state to another. Ice (solid) + heat = water (liquid). Water + more heat = steam (gas). And it works backwards too: cool steam and it turns to water, cool water and it turns to ice. It\'s still H₂O — just different speeds of particles!',
        imageQuery: 'ice water steam states change' },
      { title: 'Why this matters', text: 'Understanding states of matter explains so much! Why puddles disappear (water evaporates to gas). Why cooking works (heat changes food). Why clouds rain (water vapour condenses). Why butter melts. Why soda fizzes. Science is everywhere!',
        imageQuery: 'puddle evaporating rain cycle' }
    ],
    questions: [
      { q: 'How many states of matter are there (basic)?', options: ['1', '3', '5', '10'], correct: 1, cheer: 'Solid, liquid, gas!' },
      { q: 'Which has a fixed shape?', options: ['Solid', 'Liquid', 'Gas', 'None'], correct: 0, cheer: 'Correct!' },
      { q: 'Which takes the shape of its container?', options: ['Solid', 'Liquid', 'Gas', 'None'], correct: 1, cheer: 'Pours!' },
      { q: 'Which fills all available space?', options: ['Solid', 'Liquid', 'Gas', 'None'], correct: 2, cheer: 'Spreads out!' },
      { q: 'In solids, particles...', options: ['Zoom around fast', 'Wobble in place', 'Fly in all directions', 'Are missing'], correct: 1, cheer: 'Tight-packed!' },
      { q: 'When ice melts, what does it become?', options: ['Gas', 'Liquid water', 'Another solid', 'Powder'], correct: 1, cheer: 'From solid to liquid!' },
      { q: 'When water boils, what does it become?', options: ['Ice', 'Steam (gas)', 'Dust', 'Rock'], correct: 1, cheer: 'To gas!' },
      { q: 'Why does a puddle disappear?', options: ['The ground eats it', 'Water evaporates to gas', 'It turns solid', 'Magic'], correct: 1, cheer: 'Evaporation!' },
      { q: 'Is ice still H₂O?', options: ['No, it\'s different', 'Yes, same stuff different state', 'Only half', 'Not sure'], correct: 1, cheer: 'Same molecules!' },
      { q: 'What happens when you cool steam?', options: ['It disappears', 'Turns into water', 'Gets hotter', 'Becomes solid'], correct: 1, cheer: 'Condensation!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'solids liquids gases ks2'
  },

  7: {
    title: 'Forces: Push and Pull',
    intro: 'Every time you open a door, kick a ball, or lift a cup, you\'re using forces — let\'s meet them!',
    slides: [
      { title: 'What is a force?', text: 'A force is a push or a pull. Every time something moves, speeds up, slows down, or changes direction, a force is at work. Pushing a door, pulling a rope, kicking a ball, catching a ball — all forces!',
        imageQuery: 'forces push pull examples' },
      { title: 'Gravity: the big pulldown', text: 'Gravity is the invisible force that pulls things towards Earth. It\'s why things fall when you drop them and why you stay on the ground instead of floating off. Everything with mass has gravity — even you! Earth just has WAY more than us, so it wins.',
        imageQuery: 'gravity apple falling newton' },
      { title: 'Friction: the slow-down', text: 'Friction is the force that makes things slow down when they rub together. Running shoes have rubber soles with friction so you don\'t slip. A sliding book stops because of friction between it and the table. Icy paths are slippery — less friction!',
        imageQuery: 'friction shoes ground grip' },
      { title: 'Air resistance: the sky\'s push', text: 'When you move through air, the air pushes back — that\'s air resistance. A parachute uses LOTS of air resistance to slow down falling. Cars are designed with smooth curves to reduce air resistance and go faster. A crumpled paper falls faster than a flat one!',
        imageQuery: 'parachute falling air resistance' },
      { title: 'Balanced and unbalanced forces', text: 'When forces are balanced (equal and opposite), nothing moves — like tug-of-war with equal teams. When forces are unbalanced (one side wins), something moves in that direction. Most exciting things happen when forces are unbalanced!',
        imageQuery: 'tug of war children' },
      { title: 'Measuring forces', text: 'Forces are measured in newtons (N) — named after scientist Isaac Newton. A small apple weighs about 1 newton. A 1 kg bag of sugar weighs about 10 newtons. Gravity pulls on you with about 300-400 newtons if you\'re a child!',
        imageQuery: 'newton force meter spring' }
    ],
    questions: [
      { q: 'What is a force?', options: ['A type of food', 'A push or pull', 'A colour', 'A sound'], correct: 1, cheer: 'Correct!' },
      { q: 'What is gravity?', options: ['A rope', 'A force pulling things down to Earth', 'A type of wind', 'A rocket'], correct: 1, cheer: 'Invisible pull!' },
      { q: 'What does friction do?', options: ['Makes things speed up', 'Slows things down when rubbing', 'Makes things float', 'Freezes things'], correct: 1, cheer: 'Slowing force!' },
      { q: 'Why don\'t you slip on a normal path?', options: ['Magic', 'Friction between shoes and ground', 'Gravity', 'Balance only'], correct: 1, cheer: 'Grip!' },
      { q: 'What does a parachute use?', options: ['Gravity only', 'Air resistance', 'Magnets', 'Electricity'], correct: 1, cheer: 'Slows the fall!' },
      { q: 'Why are cars smooth and curved?', options: ['Looks nice', 'Reduces air resistance', 'Heavier', 'Easier to paint'], correct: 1, cheer: 'Speed design!' },
      { q: 'When forces are balanced, what happens?', options: ['Explosion', 'Nothing moves', 'Speed up', 'Slow down'], correct: 1, cheer: 'Equal pull!' },
      { q: 'Who is the force unit named after?', options: ['Einstein', 'Newton', 'Darwin', 'Edison'], correct: 1, cheer: 'Isaac Newton!' },
      { q: 'What is a force measured in?', options: ['Metres', 'Seconds', 'Newtons', 'Litres'], correct: 2, cheer: 'N for newtons!' },
      { q: 'Why does crumpled paper fall faster than flat paper?', options: ['It\'s heavier', 'Less air resistance', 'It\'s hotter', 'Magic'], correct: 1, cheer: 'Smaller surface!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'forces push pull gravity'
  },

  8: {
    title: 'Magnets and Magnetism',
    intro: 'Some rocks can move metal without touching it. That\'s not magic — that\'s magnetism!',
    slides: [
      { title: 'What is a magnet?', text: 'A magnet is an object that can attract (pull towards itself) certain metals. Magnets were first discovered in rocks called lodestones thousands of years ago. Today we can make magnets out of iron, steel, and other special metal mixes.',
        imageQuery: 'horseshoe magnet bar magnet' },
      { title: 'North and south poles', text: 'Every magnet has two ends called poles — a North pole and a South pole. Opposite poles attract each other (N and S pull together). Same poles repel each other (N and N push apart). Try it with two magnets and you\'ll feel the invisible force!',
        imageQuery: 'magnet poles north south' },
      { title: 'What do magnets attract?', text: 'Magnets only attract certain metals: iron, steel, nickel, and cobalt. They do NOT attract wood, plastic, paper, glass, copper, aluminium, gold, or silver. So a steel paperclip sticks, but an aluminium can doesn\'t!',
        imageQuery: 'magnet paperclips attraction' },
      { title: 'Magnetic fields', text: 'Around every magnet is an invisible area of magnetic force called the magnetic field. You can see its shape by sprinkling iron filings (tiny iron bits) around a magnet — they line up in curves showing the field pattern. Cool!',
        imageQuery: 'magnetic field iron filings lines' },
      { title: 'Earth: a giant magnet!', text: 'Amazing fact: the whole Earth is a giant magnet! Deep inside Earth, spinning molten iron creates a magnetic field. This field protects us from harmful rays from the Sun, and it\'s also what makes compasses work — the compass needle lines up with Earth\'s field.',
        imageQuery: 'earth magnetic field diagram' },
      { title: 'Magnets at work', text: 'Magnets do important jobs: compasses guide sailors and hikers, fridges have magnets in their doors to seal them shut, speakers use magnets to make sound, and even credit cards and train tickets have magnetic strips with information on them!',
        imageQuery: 'compass pointing north' }
    ],
    questions: [
      { q: 'What can a magnet do?', options: ['Float', 'Attract certain metals', 'Glow', 'Make sound'], correct: 1, cheer: 'Correct!' },
      { q: 'How many poles does a magnet have?', options: ['1', '2', '4', '10'], correct: 1, cheer: 'North and south!' },
      { q: 'What happens when two North poles meet?', options: ['Attract', 'Repel (push apart)', 'Nothing', 'Explode'], correct: 1, cheer: 'Same poles push apart!' },
      { q: 'Which does a magnet attract?', options: ['Wood', 'Plastic', 'Iron', 'Glass'], correct: 2, cheer: 'Yes!' },
      { q: 'Which does a magnet NOT attract?', options: ['Steel', 'Iron', 'Paper', 'Nickel'], correct: 2, cheer: 'Correct!' },
      { q: 'What is a magnetic field?', options: ['A farm', 'The invisible force area around a magnet', 'A type of football pitch', 'A type of rock'], correct: 1, cheer: 'Invisible force!' },
      { q: 'What can show a magnetic field\'s shape?', options: ['Water', 'Iron filings', 'Candles', 'Cotton'], correct: 1, cheer: 'Iron bits align!' },
      { q: 'Is Earth a magnet?', options: ['No', 'Yes!', 'Only at the poles', 'Only in winter'], correct: 1, cheer: 'A giant one!' },
      { q: 'What does Earth\'s magnetism do?', options: ['Nothing', 'Protects us and helps compasses', 'Makes the sky blue', 'Causes rain'], correct: 1, cheer: 'Very useful!' },
      { q: 'What does a compass point to?', options: ['South', 'North (Earth\'s magnetic field)', 'Up', 'The Moon'], correct: 1, cheer: 'Navigation tool!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'magnets magnetism ks2'
  },

  9: {
    title: 'Light and Shadows',
    intro: 'Light travels at the fastest speed in the universe. It also makes shadows — let\'s see how!',
    slides: [
      { title: 'Sources of light', text: 'Light comes from things called light sources. The biggest is the Sun. Other light sources include fire, lamps, torches, and even some animals like fireflies and glow-worms! The Moon is NOT a light source — it just reflects the Sun\'s light.',
        imageQuery: 'light sources sun torch fire' },
      { title: 'Light travels in straight lines', text: 'Light always travels in perfectly straight lines (scientists call these "rays"). That\'s why you can\'t see around corners and why a beam of light from a torch goes straight ahead. Light is also the fastest thing ever — 300,000 km per second!',
        imageQuery: 'torch light beam straight rays' },
      { title: 'How shadows form', text: 'A shadow happens when an object blocks light. Light can\'t go through the object, so behind it there\'s a shadow — a dark area where the light doesn\'t reach. Try it: stand in sunshine and see your shadow on the ground!',
        imageQuery: 'shadow sunlight ground child' },
      { title: 'Transparent, translucent, opaque', text: 'Materials let through different amounts of light. Transparent (like clear glass) lets all light through — you can see perfectly. Translucent (like tracing paper) lets some light through but blurs it. Opaque (like a brick) blocks all light — that\'s when you get a dark shadow.',
        imageQuery: 'transparent translucent opaque comparison' },
      { title: 'Reflection: bouncing light', text: 'When light hits most objects, it bounces off — this is called reflection. That\'s how we see things! Mirrors reflect light perfectly, so you see a clear image. Rough things scatter light in all directions. Shiny smooth things reflect like mirrors.',
        imageQuery: 'mirror reflection light' },
      { title: 'The speed of light', text: 'Light is the fastest thing in the universe — it zooms at 300,000 kilometres every second! That\'s fast enough to circle Earth 7 times in one second. Light from the Sun takes just over 8 minutes to reach us. So you\'re always seeing the Sun as it was 8 minutes ago!',
        imageQuery: 'sun light rays space' }
    ],
    questions: [
      { q: 'What is a light source?', options: ['Something that gives off light', 'Something that blocks light', 'A shadow', 'A dark place'], correct: 0, cheer: 'Correct!' },
      { q: 'Is the Moon a light source?', options: ['Yes', 'No, it reflects the Sun', 'Only in summer', 'Only sometimes'], correct: 1, cheer: 'Mirror of the Sun!' },
      { q: 'How does light travel?', options: ['In curves', 'In straight lines', 'In circles', 'Randomly'], correct: 1, cheer: 'Straight as an arrow!' },
      { q: 'Why do shadows form?', options: ['Objects block light', 'It\'s colder', 'Magic', 'Gravity'], correct: 0, cheer: 'Light blocked!' },
      { q: 'What does "transparent" mean?', options: ['Blocks all light', 'Lets all light through', 'Rainbow coloured', 'Reflects everything'], correct: 1, cheer: 'Like clear glass!' },
      { q: 'What does "opaque" mean?', options: ['See-through', 'Blocks all light', 'Lets some light', 'Glows'], correct: 1, cheer: 'Makes shadows!' },
      { q: 'Tracing paper is...', options: ['Transparent', 'Opaque', 'Translucent', 'Invisible'], correct: 2, cheer: 'Some light through!' },
      { q: 'What does a mirror do?', options: ['Absorbs light', 'Reflects light', 'Blocks light', 'Hides light'], correct: 1, cheer: 'Bounces it back!' },
      { q: 'How fast does light travel?', options: ['Walking speed', '100 km/h', '300,000 km/sec', '1 m/sec'], correct: 2, cheer: 'Fastest ever!' },
      { q: 'How long does Sun\'s light take to reach Earth?', options: ['Instantly', '8 minutes', '1 hour', '1 day'], correct: 1, cheer: 'Yes!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'light shadows ks2'
  },

  10: {
    title: 'Sound: How We Hear',
    intro: 'Music, voices, thunder — they\'re all vibrations travelling through the air to your ears!',
    slides: [
      { title: 'Sound is vibration', text: 'Every sound is made by something vibrating — wobbling back and forth very fast. A guitar string vibrates when you pluck it. Your vocal cords vibrate when you talk. A drum skin vibrates when you hit it. Without vibration, there is no sound!',
        imageQuery: 'guitar string vibration drumhead' },
      { title: 'Sound needs stuff to travel', text: 'Sound can\'t travel through empty space — it needs something to wobble through. It travels through air (that\'s normal), water (whales hear each other across oceans!), and even solids like walls (you can hear someone through a door). In space, there\'s no sound at all — silent!',
        imageQuery: 'whale sound underwater' },
      { title: 'Sound waves', text: 'When something vibrates, it pushes the air around it, making invisible waves — like ripples in a pond when you throw a stone. These sound waves travel outwards until they reach your ears. Then your ears turn the vibrations into signals for your brain.',
        imageQuery: 'sound waves ripples diagram' },
      { title: 'Pitch: high and low', text: 'Some sounds are high-pitched (like a whistle or a bird tweeting), others are low (like a drum or a growl). The speed of the vibration decides the pitch — faster vibrations = higher pitch. Slower vibrations = lower pitch.',
        imageQuery: 'piano keys high low pitch' },
      { title: 'Volume: loud and quiet', text: 'How loud or quiet a sound is depends on how BIG the vibration is. A gentle tap = small vibration = quiet sound. A BANG = big vibration = loud sound. Volume is measured in decibels (dB). A whisper is about 30 dB, a jet plane taking off is about 140 dB!',
        imageQuery: 'sound volume loud speakers' },
      { title: 'How your ear works', text: 'Sound waves enter your ear and hit your eardrum (a tiny stretched skin). The eardrum wobbles. This wobble passes to three tiny bones (the smallest bones in your body) which shake a fluid-filled tube covered in tiny hairs. The hairs turn movement into nerve signals for your brain!',
        imageQuery: 'ear anatomy cochlea diagram' }
    ],
    questions: [
      { q: 'What causes sound?', options: ['Light', 'Vibration', 'Gravity', 'Magnets'], correct: 1, cheer: 'Correct!' },
      { q: 'Can sound travel through empty space?', options: ['Yes', 'No — needs something to travel through', 'Only on Mondays', 'Only loud sounds'], correct: 1, cheer: 'Silent space!' },
      { q: 'Which CAN sound travel through?', options: ['Only air', 'Only water', 'Air, water, and solids', 'Nothing'], correct: 2, cheer: 'All three!' },
      { q: 'What decides pitch (high or low)?', options: ['Colour', 'Speed of vibration', 'Size of room', 'Time of day'], correct: 1, cheer: 'Fast = high!' },
      { q: 'Which is high-pitched?', options: ['Thunder', 'Bird tweet', 'Bass drum', 'Growl'], correct: 1, cheer: 'Tweet tweet!' },
      { q: 'What decides loudness?', options: ['Colour', 'Size of vibration', 'Time', 'Weight'], correct: 1, cheer: 'Big wave = loud!' },
      { q: 'What measures sound volume?', options: ['Metres', 'Kilos', 'Decibels (dB)', 'Litres'], correct: 2, cheer: 'Right!' },
      { q: 'What hits the eardrum first?', options: ['Sound waves', 'Light', 'Magnets', 'Water'], correct: 0, cheer: 'Vibration!' },
      { q: 'How many tiny bones are in the ear?', options: ['1', '3', '10', '50'], correct: 1, cheer: 'Smallest in body!' },
      { q: 'What do the hair cells in the ear do?', options: ['Make hair grow', 'Turn vibrations into nerve signals', 'Keep water out', 'Nothing'], correct: 1, cheer: 'Sending to brain!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'sound vibrations hearing'
  },

  11: {
    title: 'Electricity: The Invisible Power',
    intro: 'You can\'t see it, but electricity powers almost everything around you. Let\'s find out how!',
    slides: [
      { title: 'What is electricity?', text: 'Electricity is the flow of tiny particles called electrons. Electrons live inside atoms — the building blocks of everything. When electrons move together in the same direction through a wire, we get a flow of electricity called a current.',
        imageQuery: 'electricity electrons atoms diagram' },
      { title: 'Where we get electricity', text: 'Electricity comes from two main places: power stations (through cables to your house) and batteries (portable, for things like torches and phones). Power stations generate electricity by spinning giant magnets — using coal, gas, wind, water, or nuclear energy.',
        imageQuery: 'power station wind turbine' },
      { title: 'Circuits: a loop for electrons', text: 'For electricity to flow, it needs a complete loop called a circuit. A simple circuit has a battery (power), wires (roads), and something that uses power (like a bulb). Break the loop — for example, with a switch — and the current stops. That\'s how light switches work!',
        imageQuery: 'simple circuit battery bulb wires' },
      { title: 'Conductors and insulators', text: 'Some things let electricity flow through them — these are conductors (mostly metals: copper, iron, steel, gold). Others block electricity — these are insulators (plastic, rubber, wood, glass). That\'s why electrical wires have a metal core wrapped in plastic — metal conducts, plastic keeps you safe!',
        imageQuery: 'electrical wire copper plastic insulation' },
      { title: 'Electricity and safety', text: 'Electricity is useful but dangerous. It can give you a nasty shock or start a fire. Never put fingers or metal in plug sockets. Don\'t use electrical things near water. Always tell an adult if a wire is damaged. Lightning is natural electricity — stay inside in thunderstorms!',
        imageQuery: 'electricity warning safety' },
      { title: 'Static electricity: zap!', text: 'Have you ever had your hair stand up after taking off a jumper, or felt a little shock touching a door handle? That\'s static electricity — electrons jumping between things. Rub a balloon on your hair, then stick it to a wall — that\'s static at work!',
        imageQuery: 'static electricity balloon hair' }
    ],
    questions: [
      { q: 'What is electricity?', options: ['Water', 'Flow of tiny particles (electrons)', 'Light only', 'Wind'], correct: 1, cheer: 'Correct!' },
      { q: 'Where do we get electricity from?', options: ['Power stations and batteries', 'Only sun', 'Only wind', 'It appears'], correct: 0, cheer: 'Two sources!' },
      { q: 'What is a circuit?', options: ['A type of race', 'A complete loop for electricity to flow', 'A shape', 'A song'], correct: 1, cheer: 'Must be complete!' },
      { q: 'What does a switch do?', options: ['Makes things louder', 'Breaks or completes a circuit', 'Adds power', 'Changes colours'], correct: 1, cheer: 'On/off!' },
      { q: 'Which is a conductor?', options: ['Wood', 'Rubber', 'Copper', 'Plastic'], correct: 2, cheer: 'Metal flows!' },
      { q: 'Which is an insulator?', options: ['Iron', 'Plastic', 'Steel', 'Gold'], correct: 1, cheer: 'Blocks electricity!' },
      { q: 'Why are wires made of metal with plastic around?', options: ['Looks nice', 'Metal conducts inside, plastic keeps us safe', 'Heavier', 'Cheaper'], correct: 1, cheer: 'Two-layer design!' },
      { q: 'What should you never put in a plug socket?', options: ['Plug', 'Fingers or metal', 'Nothing', 'Anything'], correct: 1, cheer: 'Stay safe!' },
      { q: 'What is lightning?', options: ['Light bulb', 'Natural electricity', 'A plane', 'A bird'], correct: 1, cheer: 'Nature\'s spark!' },
      { q: 'What is static electricity?', options: ['Moving cars', 'Electrons jumping between things', 'Running water', 'Wind'], correct: 1, cheer: 'Little zap!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'electricity circuits ks2'
  },

  12: {
    title: 'The Solar System',
    intro: 'Our Sun and the planets that go around it are a family in space called the Solar System!',
    slides: [
      { title: 'The Sun: our star', text: 'The Sun is a giant ball of hot gas at the centre of our Solar System — it\'s actually a star! It\'s about 109 times wider than Earth, and you could fit over a million Earths inside it. Its heat and light travel 150 million km to reach us.',
        imageQuery: 'sun star solar system' },
      { title: 'The eight planets', text: 'There are eight planets going around the Sun. In order from nearest to farthest: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Try this: "My Very Easy Method Just Speeds Up Names" — the first letters match the planets!',
        imageQuery: 'solar system planets order' },
      { title: 'Rocky planets, gas giants', text: 'The first four planets (Mercury, Venus, Earth, Mars) are small and rocky — called the rocky planets. The next four (Jupiter, Saturn, Uranus, Neptune) are huge and mostly made of gas — the gas giants. Jupiter is so big that all other planets could fit inside it!',
        imageQuery: 'jupiter saturn gas giants' },
      { title: 'Earth: our special home', text: 'Earth is the only planet we know with liquid water, breathable air, and life. We\'re at just the right distance from the Sun — not too hot, not too cold. Earth has one moon, one magnetic field, and everything we need to survive.',
        imageQuery: 'earth from space blue' },
      { title: 'Mars: the red planet', text: 'Mars is nicknamed the Red Planet because iron in its soil makes it look rusty. It has two tiny moons, giant volcanoes (including Olympus Mons — three times taller than Everest!), and the biggest canyon in the Solar System. Robot rovers are exploring it right now!',
        imageQuery: 'mars red planet rover' },
      { title: 'Beyond the planets', text: 'After Neptune, there\'s a region of icy rocks and dwarf planets like Pluto (which used to be called the 9th planet!). Then comes the vast empty space between stars. Our Sun is just ONE of about 100 billion stars in our galaxy, the Milky Way. Space is huge!',
        imageQuery: 'milky way galaxy stars' }
    ],
    questions: [
      { q: 'Is the Sun a planet?', options: ['Yes', 'No, it\'s a star', 'A moon', 'An asteroid'], correct: 1, cheer: 'Hot star!' },
      { q: 'How many planets are in our Solar System?', options: ['5', '8', '10', '100'], correct: 1, cheer: 'Eight!' },
      { q: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correct: 1, cheer: 'First in line!' },
      { q: 'Which planet do we live on?', options: ['Mars', 'Mercury', 'Earth', 'Jupiter'], correct: 2, cheer: 'Home!' },
      { q: 'What is the biggest planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correct: 2, cheer: 'Giant!' },
      { q: 'What are the first four planets made of?', options: ['Rock', 'Gas', 'Ice', 'Water'], correct: 0, cheer: 'Rocky planets!' },
      { q: 'What are the last four planets called?', options: ['Rocky planets', 'Gas giants', 'Ice cubes', 'Little ones'], correct: 1, cheer: 'Gassy!' },
      { q: 'Why is Mars red?', options: ['Painted red', 'Iron in the soil (rusty)', 'It\'s hot', 'It\'s sunset'], correct: 1, cheer: 'Rusty!' },
      { q: 'Is Pluto a planet?', options: ['Yes still', 'No, dwarf planet since 2006', 'Never was', 'Only at night'], correct: 1, cheer: 'Demoted!' },
      { q: 'Our galaxy is called...', options: ['Andromeda', 'The Milky Way', 'Orion', 'Cosmo'], correct: 1, cheer: 'Our galaxy!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'solar system planets ks2'
  },

  13: {
    title: 'The Moon and the Stars',
    intro: 'Every night, the Moon and stars light up our sky. Let\'s learn their secrets!',
    slides: [
      { title: 'The Moon: our only moon', text: 'The Moon is Earth\'s only natural satellite — it orbits around us. It\'s about a quarter of Earth\'s size and 384,000 km away. That\'s close enough that astronauts have actually walked on it! The Moon is mostly grey rock and dust, with no air and no water.',
        imageQuery: 'moon surface craters' },
      { title: 'Phases of the Moon', text: 'The Moon seems to change shape over about 29 days — from thin crescent, to half, to full circle, then shrinking again. It\'s not really changing shape! The Moon shines by reflecting the Sun\'s light, and from Earth we see different parts lit up depending on where it is in its orbit.',
        imageQuery: 'moon phases new full crescent' },
      { title: 'Why we only see one side', text: 'Fun fact: the Moon always shows the same face to Earth! It spins at exactly the same rate as it orbits us — so its "far side" never points towards us. Only in 1959 did humans first see the far side, when a spacecraft flew around it.',
        imageQuery: 'moon far side nasa' },
      { title: 'Men on the Moon', text: 'On 20th July 1969, astronaut Neil Armstrong became the first person to walk on the Moon, from the spacecraft Apollo 11. He said: "That\'s one small step for man, one giant leap for mankind." Only 12 people have ever walked on the Moon, all between 1969 and 1972!',
        imageQuery: 'apollo 11 moon landing footprint' },
      { title: 'Stars: distant Suns', text: 'Every star in the sky is a huge ball of hot gas, just like our Sun — but so far away they look tiny. The nearest star (after our Sun) is about 40 TRILLION km away! The stars make patterns called constellations — like the Plough, Orion, and the Big Dipper.',
        imageQuery: 'night sky stars constellations' },
      { title: 'Shooting stars and comets', text: 'A "shooting star" isn\'t a star at all! It\'s a tiny bit of space rock (a meteor) burning up as it enters Earth\'s atmosphere. Comets are dirty snowballs of ice and rock that loop around the Sun, growing long tails of gas when they come close. Halley\'s Comet passes Earth every 76 years!',
        imageQuery: 'meteor shower comet tail' }
    ],
    questions: [
      { q: 'How many moons does Earth have?', options: ['1', '2', '5', '0'], correct: 0, cheer: 'Just ours!' },
      { q: 'About how far is the Moon from Earth?', options: ['1 km', '1,000 km', '384,000 km', '1 million km'], correct: 2, cheer: 'Far!' },
      { q: 'What is the Moon\'s surface like?', options: ['Green and lush', 'Grey rock and dust', 'Blue water', 'Red sand'], correct: 1, cheer: 'Grey and dusty!' },
      { q: 'Does the Moon make its own light?', options: ['Yes', 'No, reflects the Sun', 'Only at full moon', 'Only at night'], correct: 1, cheer: 'Sun\'s helper!' },
      { q: 'How many sides of the Moon do we see?', options: ['Only one', 'Both', 'Three', 'None'], correct: 0, cheer: 'Same face always!' },
      { q: 'Who first walked on the Moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Elon Musk'], correct: 1, cheer: 'Famous first!' },
      { q: 'What year did humans first walk on the Moon?', options: ['1939', '1959', '1969', '1999'], correct: 2, cheer: 'Apollo 11!' },
      { q: 'What is a star?', options: ['A flashing light', 'A ball of hot gas like our Sun', 'A planet', 'A satellite'], correct: 1, cheer: 'Distant Suns!' },
      { q: 'What is a shooting star really?', options: ['A star falling', 'Small space rock burning up in the atmosphere', 'A plane', 'Magic'], correct: 1, cheer: 'A meteor!' },
      { q: 'What is a comet?', options: ['A star', 'A dirty snowball orbiting the Sun', 'A plane', 'A planet'], correct: 1, cheer: 'Icy visitor!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'moon stars space ks2'
  },

  14: {
    title: 'Rocks and Fossils',
    intro: 'Rocks can tell us stories millions of years old. And some of them even hold ancient treasures!',
    slides: [
      { title: 'Earth\'s crust: made of rock', text: 'The outside of Earth is a rocky layer called the crust. Deep inside, it gets so hot that rock melts into a runny liquid called magma. Rocks come up from deep inside through volcanoes, get pushed up into mountains, and worn down into sand by wind and water.',
        imageQuery: 'earth crust layers diagram' },
      { title: 'Three types of rock', text: 'There are three main types of rock. Igneous rocks form when hot magma cools and hardens (like granite). Sedimentary rocks form in layers from bits of other rocks pressed together over millions of years (like sandstone). Metamorphic rocks are rocks that changed under heat and pressure (like marble).',
        imageQuery: 'three rock types igneous sedimentary metamorphic' },
      { title: 'Soil: from rock to life', text: 'Soil isn\'t just dirt — it\'s broken-down rock mixed with bits of dead plants and animals (called humus). It takes thousands of years for rock to become soil. Without soil, plants couldn\'t grow, and without plants, no animals. Soil is the foundation of life!',
        imageQuery: 'soil plants roots earth' },
      { title: 'What is a fossil?', text: 'A fossil is the preserved remains of an animal or plant that lived millions of years ago. When a creature died in the right conditions, its body could be covered in mud, which slowly turned to rock — with the creature\'s shape turned to stone inside!',
        imageQuery: 'fossil dinosaur bones in rock' },
      { title: 'Dinosaur fossils', text: 'Most of what we know about dinosaurs comes from fossils! Scientists called palaeontologists dig them up very carefully. We\'ve found T-rex teeth, Triceratops skulls, Velociraptor claws — and even fossilised dinosaur eggs and footprints. It\'s like reading a book that\'s 65 million years old!',
        imageQuery: 'trex skeleton museum fossil' },
      { title: 'Fossil fuels: buried energy', text: 'Some fossils become something else entirely: fossil fuels! Coal, oil, and gas are all formed from ancient plants and animals buried millions of years ago, squashed and heated until they became energy-rich. We burn them for power — but they cause climate change, so we\'re moving to cleaner energy.',
        imageQuery: 'coal oil gas fossil fuels' }
    ],
    questions: [
      { q: 'What is Earth\'s outer layer called?', options: ['Core', 'Mantle', 'Crust', 'Surface'], correct: 2, cheer: 'Correct!' },
      { q: 'What is molten rock called?', options: ['Magma', 'Water', 'Soil', 'Coal'], correct: 0, cheer: 'Hot liquid rock!' },
      { q: 'Which rock forms from cooled magma?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Fossil'], correct: 2, cheer: 'Fire rock!' },
      { q: 'Which rock forms in layers?', options: ['Igneous', 'Sedimentary', 'Metamorphic', 'None'], correct: 1, cheer: 'Built up over time!' },
      { q: 'What is soil?', options: ['Just dirt', 'Broken rock + dead plants/animals', 'Fossils', 'Sand only'], correct: 1, cheer: 'Life-giving!' },
      { q: 'What is a fossil?', options: ['A living plant', 'Preserved remains of ancient life', 'A type of coin', 'A rock painting'], correct: 1, cheer: 'Ancient treasure!' },
      { q: 'Who studies fossils?', options: ['Zoologists', 'Palaeontologists', 'Astronomers', 'Chefs'], correct: 1, cheer: 'Fossil hunters!' },
      { q: 'How old are dinosaur fossils?', options: ['1,000 years', '100,000 years', '65 million years', '1 billion years'], correct: 2, cheer: 'Seriously old!' },
      { q: 'Which is NOT a fossil fuel?', options: ['Coal', 'Oil', 'Gas', 'Wind'], correct: 3, cheer: 'Wind is free and clean!' },
      { q: 'Why are we moving away from fossil fuels?', options: ['They cost too much', 'They cause climate change', 'They\'re pretty', 'They smell bad'], correct: 1, cheer: 'For the planet!' }
    ],
    hasVideo: false,
    bitesizeQuery: 'rocks fossils ks2'
  },

  15: {
    title: 'Dinosaurs and Extinct Animals',
    intro: 'Giant creatures once roamed Earth — and then they vanished. Let\'s meet the dinosaurs!',
    slides: [
      { title: 'When dinosaurs ruled', text: 'Dinosaurs lived on Earth for about 165 million years — way longer than humans have been around! They existed during the Mesozoic Era, split into three parts: the Triassic, Jurassic, and Cretaceous. Different dinosaurs lived in different periods.',
        imageQuery: 'dinosaur mesozoic era timeline' },
      { title: 'Giants of the land', text: 'Some dinosaurs were massive! Brachiosaurus was as tall as a four-storey building and weighed as much as 15 elephants. Tyrannosaurus Rex (T-rex) was 12 metres long with teeth like bananas. Others were tiny — some dinosaurs were the size of chickens!',
        imageQuery: 'brachiosaurus t rex size comparison' },
      { title: 'Meat-eaters and plant-eaters', text: 'Just like animals today, dinosaurs ate different things. Carnivores (meat-eaters) like T-rex and Velociraptor had sharp teeth and claws. Herbivores (plant-eaters) like Diplodocus and Triceratops had flat teeth for chewing leaves. You can tell what a dinosaur ate from its teeth!',
        imageQuery: 'dinosaur teeth meat plant eater' },
      { title: 'The big goodbye', text: 'About 66 million years ago, the dinosaurs (except birds) suddenly vanished. The main theory: a huge asteroid, about 10 km wide, smashed into Earth near Mexico. It threw dust into the air, blocking the Sun for years. Plants died. Dinosaurs that ate plants starved. Dinosaurs that ate them starved too.',
        imageQuery: 'asteroid impact dinosaur extinction' },
      { title: 'Birds are dinosaurs!', text: 'Here\'s the amazing bit: not ALL dinosaurs died. Some tiny feathered dinosaurs survived and evolved into... birds! Every bird you see today — sparrows, eagles, chickens, ducks — is a direct descendant of dinosaurs. T-rex\'s closest living relative is actually a chicken!',
        imageQuery: 'chicken feathers dinosaur evolution' },
      { title: 'Other extinct animals', text: 'Many other animals have gone extinct too. Woolly mammoths (giant hairy elephants) lived during the Ice Age and died out only 4,000 years ago. The dodo bird was hunted to extinction in the 1600s. Today, many species are in danger — it\'s our job to protect them!',
        imageQuery: 'woolly mammoth dodo bird extinct' }
    ],
    questions: [
      { q: 'How long did dinosaurs rule Earth?', options: ['100 years', '1,000 years', 'About 165 million years', 'Forever'], correct: 2, cheer: 'So long!' },
      { q: 'How big was a Brachiosaurus?', options: ['Dog-sized', 'Horse-sized', '4-storey building', 'Moon-sized'], correct: 2, cheer: 'Massive!' },
      { q: 'How long was T-rex?', options: ['1 m', '5 m', '12 m', '50 m'], correct: 2, cheer: 'Huge predator!' },
      { q: 'What is a carnivore?', options: ['Plant-eater', 'Meat-eater', 'Water-drinker', 'Flower-picker'], correct: 1, cheer: 'Hunter!' },
      { q: 'What is a herbivore?', options: ['Plant-eater', 'Meat-eater', 'Mountain-climber', 'Sleeper'], correct: 0, cheer: 'Veggie!' },
      { q: 'What likely killed the dinosaurs?', options: ['Volcanoes only', 'An asteroid impact', 'A flood', 'Each other'], correct: 1, cheer: 'Space rock!' },
      { q: 'How long ago did non-bird dinosaurs go extinct?', options: ['6,000 years', '660,000 years', '66 million years', '6 billion years'], correct: 2, cheer: 'Correct!' },
      { q: 'Which dinosaurs survived?', options: ['None', 'The ones that became birds', 'T-rex only', 'Only plant-eaters'], correct: 1, cheer: 'Look out of your window — you might spot one!' },
      { q: 'T-rex\'s closest relative alive today?', options: ['Crocodile', 'Chicken', 'Lion', 'Shark'], correct: 1, cheer: 'Surprising!' },
      { q: 'What is a woolly mammoth?', options: ['A sheep', 'A hairy ice age elephant', 'A dinosaur', 'A yeti'], correct: 1, cheer: 'Extinct only 4,000 years ago!' }
    ],
    hasVideo: true,
    bitesizeQuery: 'dinosaurs extinction fossils'
  }
};

export const SCIENCE_BRIEFS = {
  16: 'Animal life cycles — egg→tadpole→frog (amphibian); egg→caterpillar→chrysalis→butterfly (insect); mammal pregnancy→birth.',
  17: 'Food chains & webs — producers (plants), primary/secondary consumers, decomposers (fungi/bacteria), energy flows up.',
  18: 'Digestive system — mouth (chew), oesophagus (tube), stomach (acid/churning), small intestine (absorb nutrients), large intestine (water), out!',
  19: 'Teeth — incisors (cutting), canines (tearing), molars (grinding); milk teeth 20 then adult teeth 32; brushing twice a day; sugar causes decay.',
  20: 'Skeleton & muscles — skeleton protects/supports/allows movement; muscles pull in pairs (biceps/triceps), connected by tendons.',
  21: 'Heart & circulation — four chambers, pumps blood through arteries (away) and veins (back); red blood cells carry oxygen.',
  22: 'Lungs & breathing — ribs + diaphragm; oxygen in, CO2 out; alveoli tiny sacs where gases swap; exercise breathes faster.',
  23: 'Reversible vs irreversible changes — melting ice (reversible) vs baking a cake (irreversible); rust, burning, cooking eggs.',
  24: 'Separating mixtures — sieving (big from small), filtering (solids from liquids), evaporation (dissolved solids like salt from water), magnet (iron).',
  25: 'Sound waves — vibrations through materials, pitch=frequency, loudness=amplitude; echoes; ultrasound used in medicine.',
  26: 'How the eye sees — pupil (iris controls size), lens focuses, retina detects, optic nerve to brain; rods (light) vs cones (colour).',
  27: 'Colour & rainbow — white light is all colours mixed, prism/rainbow splits it: red/orange/yellow/green/blue/indigo/violet (ROYGBIV).',
  28: 'Simple machines — lever (seesaw, crowbar), pulley (flagpole), wheel/axle, inclined plane (ramp), wedge, screw; make work easier.',
  29: 'Floating & sinking — upthrust from water; denser than water = sinks; boats float despite being steel because of shape.',
  30: 'Friction & air resistance — grippy shoes/bike tyres rely on friction; streamlined shapes reduce air resistance (cars, planes, fish).',
  31: 'Cells — tiny building blocks of life; animal cells (nucleus, cytoplasm, membrane); plant cells also have cell wall and chloroplasts.',
  32: 'Evolution — Darwin\'s theory, natural selection, fittest survive and reproduce, variation within species, slow changes over millions of years.',
  33: 'Classifying living things — 5 kingdoms: animals, plants, fungi, protists, bacteria; vertebrates (with spine) vs invertebrates; mammals, birds, reptiles, amphibians, fish.',
  34: 'Microorganisms — bacteria, viruses, fungi; some harmful (diseases) some helpful (yogurt, bread, compost); Louis Pasteur and germ theory.',
  35: 'Immune system — white blood cells fight germs, antibodies, vaccines train the body; how washing hands and sneezing into elbows help.',
  36: 'Plant reproduction — flowers, pollen, pollinators (bees, butterflies, wind), seeds, dispersal strategies (wind, water, animals).',
  37: 'Animal reproduction — mammals (internal, live birth), birds (eggs in nest), fish (many eggs in water), amphibians (eggs in water then metamorphosis).',
  38: 'Genes & inheritance — DNA in cells, children inherit from parents, dominant vs recessive (brown eyes usually beat blue), twins.',
  39: 'Ecosystems — plants, animals, air, water, soil all connected; biodiversity = variety; losing species damages whole systems.',
  40: 'Particles — everything made of tiny particles; solids vibrate, liquids slide, gases zoom; explains pressure, expansion, diffusion.',
  41: 'Periodic table — 118 elements, organised by atomic number, metals on left, non-metals on right, noble gases on far right.',
  42: 'Atoms & molecules — atom = smallest piece of an element (proton/neutron/electron); molecule = 2+ atoms joined (H2O).',
  43: 'Acids & alkalis — pH scale 0-14, 7=neutral, acids sour (lemon, vinegar), alkalis bitter (soap, bleach), indicators like litmus paper.',
  44: 'Chemical reactions — new substances made, irreversible; combustion (burning), rusting, neutralisation (acid+alkali=salt+water).',
  45: 'Metals vs non-metals — metals: shiny, conduct heat/electricity, bendy, strong; non-metals: dull, insulators, brittle.',
  46: 'Energy forms — kinetic (movement), potential (stored), thermal, light, sound, electrical, chemical; transfers not destroyed.',
  47: 'Heat & temperature — heat is energy, temperature measures how much; conduction (through solids), convection (in fluids), radiation (through space).',
  48: 'Electric circuits — series (one path, all bulbs affected) vs parallel (multiple paths, one can break); voltage, current, resistance.',
  49: 'Space beyond — our galaxy Milky Way, 100 billion stars; observable universe 2 trillion galaxies; light-year distance unit.',
  50: 'Gravity & mass — mass is how much stuff; weight = mass x gravity; you weigh 6x less on Moon but mass same; Newton & apple.',
  51: 'Speed & motion — speed = distance ÷ time, measured m/s or mph; acceleration = changing speed; Galileo dropped balls from tower.',
  52: 'Earth\'s layers — crust (thin rocky), mantle (hot semi-molten), outer core (liquid iron/nickel), inner core (solid metal, hotter than Sun surface).',
  53: 'Weather science — clouds (cumulus, stratus, cirrus), fronts, air pressure, precipitation types; weather forecasting with satellites.',
  54: 'Climate change — CO2 greenhouse effect, temperatures rising, ice melting, extreme weather, species at risk, renewable energy solutions.',
  55: 'Renewable vs non-renewable — renewables (solar, wind, hydro, geothermal, wave) vs fossil fuels (coal, oil, gas) and nuclear.',
  56: 'Plastics & pollution — takes 500+ yrs to break down, ocean gyres, microplastics in food chain, 3 Rs: reduce, reuse, recycle.',
  57: 'Great scientists — Isaac Newton (gravity), Marie Curie (radioactivity), Einstein (relativity), Darwin (evolution), Rosalind Franklin (DNA).',
  58: 'Scientific method — question, research, hypothesis, experiment, observe, conclude; fair tests, variables, repeating to check.',
  59: 'Future tech — AI, robots in factories/homes, electric cars, Mars missions, renewable everything, gene therapy, quantum computing.',
  60: 'Being a scientist — curiosity, asking why, notebooks, experiments at home, school science, science careers: medicine, engineering, research.'
};
