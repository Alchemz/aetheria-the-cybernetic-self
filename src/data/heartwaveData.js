import {
    Brain,
    Dumbbell,
    Heart,
    Sunrise,
    Zap,
    Eye,
    Target,
    Shield,
    TrendingUp,
    Wind,
    Activity,
    Droplets,
    Sparkles,
    Flame,
    ThermometerSnowflake,
    Timer,
    Dna,
    Atom,
    Mic,
    LayoutGrid,
    Waves
} from 'lucide-react';

export const bioModsData = {
    'neurogenesis': {
        id: 'neurogenesis',
        name: 'Neurogenesis Mode',
        icon: Brain,
        description: 'Force new neural pathway creation through deliberate pattern interruption and targeted training.',
        simpleExplanation: 'Your brain is not fixed; it is a dynamic, evolving landscape. This protocol leverages "neuroplasticity"—the ability to rewire neural pathways—allowing you to break old patterns and accelerate learning. By embracing novelty and struggle, you literally build a newer, sharper brain.',
        color: '#00FFFF', // Cyan
        supplements: [
            { name: "Lion’s Mane Mushroom (8:1 Extract)", dosage: "1000mg with morning coffee (synergistic)" },
            { name: "Psilocybin (Microdose)", dosage: "0.1g - 0.2g (Fadiman protocol: 1 day on, 2 days off) [Subject to local laws]" },
            { name: "Omega-3 (High DHA)", dosage: "2g daily with a fatty meal" },
            { name: "Lithium Orotate", dosage: "5mg daily (micro-dose for grey matter density)" }
        ],
        habits: [
            {
                id: 'neuro-1',
                name: 'Non-Dominant Hand Training',
                category: 'Neuroplasticity',
                duration: 10,
                difficulty: 'Medium',
                why: 'Using your non-dominant hand forces the brain to engage dormant synaptic connections in the motor cortex. This "synaptic friction" releases neurotrophins like BDNF, priming the brain for rapid adaptation and strengthening inter-hemispheric communication.',
                howTo: 'Brush teeth, eat, or write mechanically with your non-dominant hand for 10 minutes. Focus on the frustration—that is the feeling of neural rewiring.'
            },
            {
                id: 'neuro-2',
                name: 'Dual N-Back Training',
                category: 'Neuroplasticity',
                duration: 20,
                difficulty: 'Hard',
                why: 'Unlike standard brain games, Dual N-Back has peer-reviewed efficacy for increasing fluid intelligence (Gf) and expanding working memory capacity. It fundamentally upgrades your brain\'s RAM.',
                howTo: 'Perform 20 minutes daily of Dual N-Back tasks using specialized software. Push to the edge of your ability where accuracy drops to ~80%.'
            },
            {
                id: 'neuro-3',
                name: 'Aerobic Sprints',
                category: 'Neuroplasticity',
                duration: 12,
                difficulty: 'Hard',
                why: 'High-intensity interval training triggers a massive release of BDNF (Brain-Derived Neurotrophic Factor), the "Miracle-Gro" for new neurons. The hypoxic state signals a survival need for sharper cognition.',
                howTo: 'Perform 30-second all-out sprints followed by 90 seconds of rest (repeat 6 times). Best done before a learning block.'
            },
            {
                id: 'neuro-4',
                name: 'Fasting-Mimicking Window',
                category: 'Neuroplasticity',
                duration: 1440,
                difficulty: 'Hard',
                why: 'The metabolic shock of caloric deprivation forces the body to recycle damaged cellular components (autophagy) and triggers stem cell regeneration in neural tissue, clearing "brain fog" at the source.',
                howTo: 'Conduct a 24-hour water-only fast once every 10 days. Electrolytes are permitted.'
            },
            {
                id: 'neuro-5',
                name: 'Novelty Exposure',
                category: 'Neuroplasticity',
                duration: 30,
                difficulty: 'Easy',
                why: 'The brain deletes what is predictable. Novelty triggers dopamine and plasticity. The post-exercise window is the most fertile time to encode new data.',
                howTo: 'Immediately after exercise, expose yourself to a completely new environment or skill (e.g., take a new route, listen to a new genre, learn 5 words of a new language).'
            }
        ]
    },
    'testosterone': {
        id: 'testosterone',
        name: 'Testosterone Optimization',
        icon: Dumbbell,
        description: 'Maximize natural testosterone production through targeted biological interventions and lifestyle protocols.',
        simpleExplanation: 'Testosterone is the biological driver of vitality, confidence, and structural integrity. This bio-mod eliminates endocrine disruptors and uses signaling—thermal, physical, and competitive—to command your body to upgrade its hormonal output.',
        color: '#FF4500', // OrangeRed
        supplements: [
            { name: "Tongkat Ali (LJ100)", dosage: "400mg in the morning (cycle 3 weeks on, 1 week off)" },
            { name: "Fadogia Agrestis", dosage: "600mg daily (monitor liver enzymes/cycle strictly)" },
            { name: "Boron", dosage: "9-12mg daily (cycles of 2 weeks on, 1 week off) to lower SHBG" },
            { name: "Zinc Picolinate", dosage: "30mg before bed" }
        ],
        habits: [
            {
                id: 'test-1',
                name: 'Scrotal Cold Exposure',
                category: 'Hormonal',
                duration: 5,
                difficulty: 'Hard',
                why: 'Leydig cells in the testes operate optimally at temperatures lower than body heat. Direct cooling can significantly pulse testosterone production.',
                howTo: 'Apply an ice pack (wrapped in thin cloth) or direct cold water stream to the testicles for 2-5 minutes twice daily.'
            },
            {
                id: 'test-2',
                name: 'Competitive Dominance',
                category: 'Hormonal',
                duration: 60,
                difficulty: 'Medium',
                why: 'The "Winner Effect" is a biological reality. Winning a contest triggers an acute upregulation of androgen receptors and testosterone release to prepare for the next challenge.',
                howTo: 'Engage in a competitive activity (sports, chess, debate, video games) where you have a tangible chance of winning. You must emotionally connect with the victory.'
            },
            {
                id: 'test-3',
                name: 'Heavy Compound Lifts',
                category: 'Hormonal',
                duration: 45,
                difficulty: 'Hard',
                why: 'Heavy structural loading signals the body that it needs to be stronger to survive. However, training beyond 45 mins spikes cortisol, which kills testosterone. Intensity > Duration.',
                howTo: 'Focus on low-rep (3-5), high-weight deadlifts, squats, or overhead presses. Limit the session strictly to 45 minutes.'
            },
            {
                id: 'test-4',
                name: 'Plastic Detox',
                category: 'Hormonal',
                duration: 1,
                difficulty: 'Medium',
                why: 'Phthalates and BPAs are xenoestrogens—they mimic estrogen in the body and crush testosterone levels. They are the silent killer of male vitality.',
                howTo: 'Eliminate all heating of food in plastic. Switch to glass/steel containers. Never drink from hot soft plastic.'
            },
            {
                id: 'test-5',
                name: 'Sleep Banking',
                category: 'Hormonal',
                duration: 540,
                difficulty: 'Medium',
                why: 'The majority of testosterone is synthesized during REM cycles. Cutting sleep to 5 hours creates the hormonal profile of a man 10 years older.',
                howTo: 'Secure 8-9 hours of sleep in a pitch-black room. Use the Weekend Banking method if weekdays are short.'
            }
        ]
    },
    'memory-palace': {
        id: 'memory-palace',
        name: 'Memory Palace Protocol',
        icon: Brain,
        description: 'Enhance memory encoding, storage, and recall through systematic ancient mnemonic training.',
        simpleExplanation: 'Your spatial memory is millions of years old and incredibly powerful. This protocol hacks that system by encoding abstract data (numbers, names, facts) into vivid spatial images, allowing you to store and recall unlimited information with near-perfect accuracy.',
        color: '#9D4EDD', // Purple
        supplements: [
            { name: "Bacopa Monnieri", dosage: "300mg daily (requires fat source; takes 4-6 weeks to peak)" },
            { name: "Huperzine A", dosage: "200mcg (inhibits breakdown of acetylcholine)" },
            { name: "Alpha-GPC", dosage: "300mg-600mg prior to learning bouts" }
        ],
        habits: [
            {
                id: 'mem-1',
                name: 'Loci Construction',
                category: 'Cognitive',
                duration: 15,
                difficulty: 'Medium',
                why: 'You cannot file data without a cabinet. This step builds the mental infrastructure for information storage using well-known spatial locations.',
                howTo: 'Select a familiar building (your home). Walk through it mentally and establish 10 distinct "stations" (front door, hallway mirror, etc.) in a specific order.'
            },
            {
                id: 'mem-2',
                name: 'Grotesque Imagery Encoding',
                category: 'Cognitive',
                duration: 10,
                difficulty: 'Medium',
                why: 'The brain filters out the mundane but prioritizes the shocking. Encoding data as violent, sexual, or absurd images bypasses the "boring filter" and sticks instantly.',
                howTo: 'Convert items to be memorized into absurd images. E.g., "Milk" becomes a cow exploding in your hallway.'
            },
            {
                id: 'mem-3',
                name: 'Sensory Anchoring',
                category: 'Cognitive',
                duration: 5,
                difficulty: 'Medium',
                why: 'A single neural hook is weak. Engaging multiple senses (sound, smell, touch) creates a rich, multi-dimensional web of associations that is harder to forget.',
                howTo: 'For each image, add a sound, smell, and tactile sensation. Feel the texture and smell the air in that location.'
            },
            {
                id: 'mem-4',
                name: 'Spaced Retrieval',
                category: 'Cognitive',
                duration: 10,
                difficulty: 'Medium',
                why: 'Recalling a sequence in reverse forces the brain to reconstruct the data path, strengthening the synaptic trail far more than rote repetition.',
                howTo: 'Walk through your memory palace backwards, recalling items from #10 to #1.'
            },
            {
                id: 'mem-5',
                name: 'The "Review" Loop',
                category: 'Cognitive',
                duration: 15,
                difficulty: 'Medium',
                why: 'Information decays rapidly without reinforcement. The review loop moves data from short-term RAM to long-term HDD storage before it fades.',
                howTo: 'Revisit the palace immediately after encoding, then 1 hour later, then 24 hours later.'
            }
        ]
    },
    'heart-coherence': {
        id: 'heart-coherence',
        name: 'Heart-Coherence Engine',
        icon: Heart,
        description: 'Synchronize heart-brain communication for emotional regulation and peak physiological coherence.',
        simpleExplanation: 'The heart generates the largest electromagnetic field in the body. When your heart rhythm is smooth (coherent), it entrains the brain into a state of high efficiency and calm. This protocol gives you manual control over your nervous system state.',
        color: '#FF1493', // DeepPink
        supplements: [
            { name: "Taurine", dosage: "1g-2g daily (supports heart muscle contractility)" },
            { name: "Magnesium Glycinate", dosage: "400mg daily (electrolyte balance)" },
            { name: "Hawthorn Berry", dosage: "500mg daily (increases blood flow/pumping efficiency)" }
        ],
        habits: [
            {
                id: 'heart-1',
                name: 'Resonance Frequency Breathing',
                category: 'Coherence',
                duration: 10,
                difficulty: 'Easy',
                why: 'Breathing at exactly 5.5 breaths per minute triggers a resonance between heart rate variability (HRV), blood pressure, and respiration, maximizing autonomic balance.',
                howTo: 'Inhale for 5.5 seconds, exhale for 5.5 seconds. No pause. Smooth, circular breathing.'
            },
            {
                id: 'heart-2',
                name: 'Gratitude Anchoring',
                category: 'Coherence',
                duration: 5,
                difficulty: 'Easy',
                why: 'Mechanical breathing is not enough. Positive emotion (gratitude/care) creates a unique heart rhythm signature that signals safety to the brain.',
                howTo: 'While breathing, actively relive a memory where you felt deep appreciation. Feel it in your chest.'
            },
            {
                id: 'heart-3',
                name: 'HRV Biofeedback',
                category: 'Coherence',
                duration: 20,
                difficulty: 'Medium',
                why: 'What gets measured gets managed. Biofeedback gamifies the process, training your nervous system to recognize and sustain the "coherent" state.',
                howTo: 'Use a sensor (chest strap or device) to train until you can maintain "green" (high coherence) for 20 minutes unbroken.'
            },
            {
                id: 'heart-4',
                name: 'Vagal Braking',
                category: 'Coherence',
                duration: 2,
                difficulty: 'Easy',
                why: 'The exhale activates the vagus nerve (parasympathetic), slowing the heart. Extending the exhale acts as an immediate "brake" on stress.',
                howTo: 'Inhale deeply, then exhale slowly for longer than the inhale (e.g., 4 sec in, 8 sec out). Repeat 5 times.'
            },
            {
                id: 'heart-5',
                name: 'The "Heart Lock-In"',
                category: 'Coherence',
                duration: 5,
                difficulty: 'Easy',
                why: 'Directs focused attention and energy flow through the cardiac center, reinforcing the neural pathways between heart and brain.',
                howTo: 'Before a high-stress event, visualize the energy of your breath entering and leaving directly through the center of your chest area.'
            }
        ]
    },
    'circadian-mastery': {
        id: 'circadian-mastery',
        name: 'Circadian Mastery',
        icon: Sunrise,
        description: 'Align biological rhythms with natural light cycles for optimal hormonal function and sleep quality.',
        simpleExplanation: 'You are a solar-powered organism. Every cell in your body has a clock, synced by your eyes. This protocol aligns your behavior with the sun to optimize sleep, energy, and hormonal release.',
        color: '#FFD700', // Gold
        supplements: [
            { name: "Glycine", dosage: "3g before bed (lowers core body temperature)" },
            { name: "Magnesium Threonate", dosage: "144mg (crosses blood-brain barrier for sleep)" },
            { name: "Apigenin", dosage: "50mg (found in chamomile, sedating effect)" }
        ],
        habits: [
            {
                id: 'circ-1',
                name: 'Solar Loading',
                category: 'Circadian',
                duration: 15,
                difficulty: 'Easy',
                why: 'Morning lux (brightness) hits the SCN in the brain, triggering a cortisol timer for the day and setting a melatonin timer for 16 hours later.',
                howTo: 'View direct sunlight (outdoor, no windows/sunglasses) for 10-20 minutes within 30 minutes of waking.'
            },
            {
                id: 'circ-2',
                name: 'Sunset Calibration',
                category: 'Circadian',
                duration: 10,
                difficulty: 'Easy',
                why: 'The specific light spectrum of sunset signals the SCN that the day is ending, protecting the upcoming melatonin release from artificial light damage.',
                howTo: 'View the sunset (low solar angle) outside.'
            },
            {
                id: 'circ-3',
                name: 'Blue Light Blackout',
                category: 'Circadian',
                duration: 120,
                difficulty: 'Medium',
                why: 'Blue light suppresses melatonin, the hormone of darkness. Seeing blue light at night tells your brain it is noon, destroying sleep quality.',
                howTo: 'After 8:00 PM, all screens must be red-shifted (f.lux/Night Shift) or viewed through blue-blocking glasses. Ensure no overhead LED lights.'
            },
            {
                id: 'circ-4',
                name: 'Temperature Drop',
                category: 'Circadian',
                duration: 5,
                difficulty: 'Medium',
                why: 'The body needs to drop 1-3°F to initiate and maintain deep sleep. A warm environment prevents this physiological trigger.',
                howTo: 'Keep bedroom at 65°F (18°C) or take a warm shower 1 hour before bed (the rapid cooling afterwards signals sleep).'
            },
            {
                id: 'circ-5',
                name: 'Caffeine Cutoff',
                category: 'Circadian',
                duration: 1,
                difficulty: 'Medium',
                why: 'Caffeine blocks adenosine (sleep pressure) receptors. Its half-life is 5-7 hours. Caffeine at 4PM means 50% is active at 10PM, destroying Deep Sleep.',
                howTo: 'Strict zero caffeine intake 10 hours before your intended bedtime.'
            }
        ]
    },
    'mitochondrial': {
        id: 'mitochondrial',
        name: 'Mitochondrial Enhancement',
        icon: Atom,
        description: 'Optimize cellular energy production and metabolic efficiency through stress signaling.',
        simpleExplanation: 'Mitochondria are the power plants in your cells. They burn food to create ATP (energy). This protocol clears out weak mitochondria (autophagy) and stimulates the growth of new, powerful ones, giving you limitless endurance.',
        color: '#32CD32', // LimeGreen
        supplements: [
            { name: "Methylene Blue (USP Grade)", dosage: "0.5mg-1mg per kg of body weight (powerful electron donor)" },
            { name: "CoQ10 (Ubiquinol)", dosage: "200mg daily (crucial for electron transport chain)" },
            { name: "PQQ", dosage: "20mg daily (stimulates mitochondrial biogenesis)" }
        ],
        habits: [
            {
                id: 'mito-1',
                name: 'Zone 2 Training',
                category: 'Energy',
                duration: 45,
                difficulty: 'Medium',
                why: 'Low-intensity steady state cardio specifically builds mitochondrial density and efficiency without creating excessive fatigue.',
                howTo: '3-4 hours per week of cardio where you can maintain a conversation through your nose. Keep HR at 60-70% max.'
            },
            {
                id: 'mito-2',
                name: 'Cold Plunge (Shocks)',
                category: 'Energy',
                duration: 3,
                difficulty: 'Hard',
                why: 'Extreme cold forces mitochondria to burn energy purely to create heat (uncoupling). This transforms white fat into metabolically active brown fat.',
                howTo: 'Full body immersion in <55°F water for 3 minutes. Focus on calm breathing to suppress the panic response.'
            },
            {
                id: 'mito-3',
                name: 'Red / Near-Infrared Light Therapy',
                category: 'Energy',
                duration: 15,
                difficulty: 'Easy',
                why: 'Specific wavelengths (660nm/850nm) stimulate Cytochrome C Oxidase in the mitochondria, directly physically boosting ATP production.',
                howTo: 'Expose bare skin to red light panel for 10-20 minutes daily, preferably in the morning.'
            },
            {
                id: 'mito-4',
                name: 'Intermittent Hypoxia',
                category: 'Energy',
                duration: 10,
                difficulty: 'Hard',
                why: 'Lack of oxygen signals the body to eliminate weak, inefficient mitochondria (mitophagy) and replace them with super-efficient ones.',
                howTo: 'Practice breath-hold walking or Wim Hof style retention (never in water). Push for safe air hunger.'
            },
            {
                id: 'mito-5',
                name: 'Ketogenic Cycling',
                category: 'Energy',
                duration: 1440,
                difficulty: 'Hard',
                why: 'Burning ketones produces fewer Reactive Oxygen Species (ROS) than glucose, burning cleaner and preserving mitochondrial integrity.',
                howTo: 'Spend 1-2 days a week in nutritional ketosis (high fat, zero carb).'
            }
        ]
    },
    'pineal-activation': {
        id: 'pineal-activation',
        name: 'Pineal Activation Protocol',
        icon: Sparkles,
        description: 'Decalcify and activate the pineal gland for enhanced melatonin and spiritual perception.',
        simpleExplanation: 'The pineal gland (the "Third Eye") regulates consciousness and dreams. Modern toxins like fluoride calcify it, turning it to stone. This protocol decalcifies the gland and activates it through light, vibration, and inversion.',
        color: '#8A2BE2', // BlueViolet
        supplements: [
            { name: "Raw Cacao", dosage: "High doses (rich in antioxidants and vaso-dilators)" },
            { name: "Iodine (Lugol’s)", dosage: "Start low, helps displace fluoride/bromide/chlorine from tissues" },
            { name: "Shilajit", dosage: "Resin form (contains fulvic acid, aids in mineral transport)" }
        ],
        habits: [
            {
                id: 'pineal-1',
                name: 'Fluoride Elimination',
                category: 'Consciousness',
                duration: 1,
                difficulty: 'Medium',
                why: 'Fluoride accumulates in the pineal gland more than bone, causing calcification. You must stop the input to begin the cleanup.',
                howTo: 'Install reverse osmosis water filter. Switch strictly to fluoride-free toothpaste.'
            },
            {
                id: 'pineal-2',
                name: 'Sungazing (Safe Hours)',
                category: 'Consciousness',
                duration: 15,
                difficulty: 'Medium',
                why: 'The pineal gland is photosensitive (essentially a vestigial eye). Light exposure creates distinct hormonal signals.',
                howTo: 'Look near (not directly at) the sun only during the first 15 mins of sunrise or last 15 mins of sunset. Safety first.'
            },
            {
                id: 'pineal-3',
                name: 'Darkness Retreating',
                category: 'Consciousness',
                duration: 480,
                difficulty: 'Easy',
                why: 'Even a tiny LED can suppress pineal function. Absolute darkness promotes maximum melatonin synthesis and DMT production potential.',
                howTo: 'Sleep in absolute blackout conditions (tape over LEDs, blackout curtains, eye mask).'
            },
            {
                id: 'pineal-4',
                name: 'Chanting / Vibration',
                category: 'Consciousness',
                duration: 10,
                difficulty: 'Easy',
                why: 'Vibration of the sphenoid bone physically stimulates the pituitary and pineal glands sitting in the saddle above it.',
                howTo: 'Perform "Om" chanting or humming for 10 minutes. Focus the vibration in the center of the head.'
            },
            {
                id: 'pineal-5',
                name: 'Inversion Therapy',
                category: 'Consciousness',
                duration: 5,
                difficulty: 'Medium',
                why: 'Increases blood flow and cerebrospinal fluid pressure in the cranium, flushing the glands.',
                howTo: 'Hang upside down via inversion table, or practice headstands for 5 minutes daily.'
            }
        ]
    },
    'gut-brain-axis': {
        id: 'gut-brain-axis',
        name: 'Gut-Brain Axis Optimization',
        icon: Target,
        description: 'Enhance the bidirectional communication between gut microbiome and brain.',
        simpleExplanation: '90% of your serotonin is made in your gut, not your brain. Your microbiome is your "second brain." This protocol repairs the gut lining and feeds the beneficial bacteria that control your mood, focus, and immunity.',
        color: '#FFA500', // Orange
        supplements: [
            { name: "L-Glutamine", dosage: "5g daily (primary fuel for enterocytes/gut lining)" },
            { name: "Butyrate", dosage: "Sodium Butyrate supplement (fuel for colon cells)" },
            { name: "BPC-157 (Peptide)", dosage: "Oral stable version Arg-BPC (powerful gut healing agent)" }
        ],
        habits: [
            {
                id: 'gut-1',
                name: 'Fermented Loading',
                category: 'Gut Health',
                duration: 5,
                difficulty: 'Easy',
                why: 'Provides living probiotics that signal the vagus nerve to produce neurotransmitters.',
                howTo: 'Consume one serving of living food (kimchi, sauerkraut, kefir) daily. Must be unpasteurized.'
            },
            {
                id: 'gut-2',
                name: 'Glyphosate Avoidance',
                category: 'Gut Health',
                duration: 1,
                difficulty: 'Medium',
                why: 'Glyphosate is a patented antibiotic that decimates the microbiome and weakens the tight junctions of the gut lining (Leaky Gut).',
                howTo: 'Eat organic strictly for the "Dirty Dozen" (berries, leafy greens, oats, wheat).'
            },
            {
                id: 'gut-3',
                name: 'Meal Spacing',
                category: 'Gut Health',
                duration: 240,
                difficulty: 'Hard',
                why: 'The Migrating Motor Complex (MMC) is a wave that cleans bacteria out of the small intestine. It only activates when fasted.',
                howTo: 'Allow 4 hours minimum between meals with zero snacking to let the MMC run.'
            },
            {
                id: 'gut-4',
                name: 'Polyphenol Feasts',
                category: 'Gut Health',
                duration: 15,
                difficulty: 'Easy',
                why: 'Polyphenols act as prebiotics, specifically feeding beneficial keystone bacteria like Akkermansia muciniphila.',
                howTo: 'Eat brightly colored vegetables and berries. The pigment is the medicine.'
            },
            {
                id: 'gut-5',
                name: 'Visceral Massage',
                category: 'Gut Health',
                duration: 5,
                difficulty: 'Easy',
                why: 'Physically stimulates peristalsis and breaks up stagnation in the colon.',
                howTo: 'Perform deep tissue massage of the abdomen in a clockwise motion (following the path of digestion).'
            }
        ]
    },
    'rejuvenation-dna': {
        id: 'rejuvenation-dna',
        name: 'Rejuvenation & DNA Repair',
        icon: Dna,
        description: 'Activate innate repair mechanisms and cellular regeneration.',
        simpleExplanation: 'Aging is largely the accumulation of DNA damage. This protocol activates "longevity genes" (Sirtuins) and clears out "zombie cells" (senescence), literally turning back the biological clock.',
        color: '#4682B4', // SteelBlue
        supplements: [
            { name: "NMN or NR", dosage: "500mg-1g morning (precursors to NAD+)" },
            { name: "Resveratrol", dosage: "500mg (sirtuin activator) taken with fat source" },
            { name: "Spermidine", dosage: "Wheat germ extract (induces autophagy)" }
        ],
        habits: [
            {
                id: 'dna-1',
                name: 'Autophagy Fast',
                category: 'Longevity',
                duration: 2160,
                difficulty: 'Hard',
                why: 'Prolonged fasting triggers autophagy ("self-eating"), where the body scavenges damaged DNA and misfolded proteins for energy.',
                howTo: 'Perform a 36-48 hour water-only fast once a month.'
            },
            {
                id: 'dna-2',
                name: 'Sauna Shock',
                category: 'Longevity',
                duration: 20,
                difficulty: 'Medium',
                why: 'Heat stress increases Heat Shock Proteins (HSP), which repair damaged protein structures and protect DNA structure.',
                howTo: '20 minutes in a sauna at 175°F+ (80°C+), 4 times a week.'
            },
            {
                id: 'dna-3',
                name: 'Glycation Restriction',
                category: 'Longevity',
                duration: 1,
                difficulty: 'Medium',
                why: 'Advanced Glycation End-products (AGEs) form when sugar bonds to protein, "gumming up" cell machinery and DNA replication.',
                howTo: 'Eliminate sugar and avoid charred/fried meats (which contain high AGEs).'
            },
            {
                id: 'dna-4',
                name: 'Deep Sleep Maximization',
                category: 'Longevity',
                duration: 240,
                difficulty: 'Medium',
                why: 'Slow Wave Sleep is the only time the glymphatic system opens up to wash metabolic plaque and waste from the brain.',
                howTo: 'Prioritize the first 4 hours of sleep (where SWS occurs). Cool room, consistent time.'
            },
            {
                id: 'dna-5',
                name: 'UV Hormesis',
                category: 'Longevity',
                duration: 15,
                difficulty: 'Easy',
                why: 'Mild radiation stress triggers intrinsic DNA repair mechanisms that overcompensate, making the system stronger (Hormesis).',
                howTo: 'Get moderate, non-burning natural sun exposure. Do not burn.'
            }
        ]
    },
    'growth-hormone': {
        id: 'growth-hormone',
        name: 'Growth Hormone Activation',
        icon: TrendingUp,
        description: 'Unlock your body\'s natural fountain of youth hormone.',
        simpleExplanation: 'Human Growth Hormone (HGH) heals tissues, burns fat, and builds muscle. It drops as you age. This protocol uses intense stressors (heat, lactate, fasting) to trigger massive natural HGH pulses.',
        color: '#00FA9A', // MediumSpringGreen
        supplements: [
            { name: "GABA", dosage: "3g before bed (can increase HGH spikes)" },
            { name: "L-Arginine + L-Citrulline", dosage: "5g pre-workout (vasodilation and GH signaling)" },
            { name: "Alpha-GPC", dosage: "600mg pre-workout (increases acute GH response)" }
        ],
        habits: [
            {
                id: 'hgh-1',
                name: 'Fasted Training',
                category: 'Hormonal',
                duration: 60,
                difficulty: 'Hard',
                why: 'The combination of low blood glucose and high exercise-induced lactate signals a survival need, triggering massive HGH release.',
                howTo: 'Train roughly 12-16 hours into a fast (e.g., skip breakfast, train before lunch).'
            },
            {
                id: 'hgh-2',
                name: 'The "Sauna Sandwich"',
                category: 'Hormonal',
                duration: 40,
                difficulty: 'Hard',
                why: 'Extreme heat stress post-workout can boost HGH by 200-300% and prolong the release window.',
                howTo: 'Heavy Exercise -> 20 min Sauna -> Cold Plunge.'
            },
            {
                id: 'hgh-3',
                name: 'Avoid Late Eating',
                category: 'Hormonal',
                duration: 180,
                difficulty: 'Medium',
                why: 'Insulin is an antagonist to HGH. High insulin during sleep blunts the nightly repair signal.',
                howTo: 'Do not eat within 3 hours of bed. Go to sleep with low blood sugar.'
            },
            {
                id: 'hgh-4',
                name: 'Lactic Acid Threshold',
                category: 'Hormonal',
                duration: 10,
                difficulty: 'Hard',
                why: 'Systemic acidity (the "burn") signals the pituitary gland to release growth hormone to repair the stress.',
                howTo: 'Perform high-rep "burnout" sets (20+ reps) at the end of a workout until failure.'
            },
            {
                id: 'hgh-5',
                name: 'Deep Sleep Blocks',
                category: 'Hormonal',
                duration: 480,
                difficulty: 'Medium',
                why: '70% of your daily HGH is released in a single pulse during the first cycle of Stage 3 Deep Sleep.',
                howTo: 'Ensure a cool, dark room to prevent micro-wakeups during the first 2 hours of sleep.'
            }
        ]
    },
    'vagus-nerve': {
        id: 'vagus-nerve',
        name: 'Vagus Nerve Tone',
        icon: Mic,
        description: 'Master your nervous system\'s "brake pedal" for calm and recovery.',
        simpleExplanation: 'The Vagus Nerve helps you relax. A "toned" vagus nerve means you bounce back from stress instantly. This protocol exercises that nerve like a muscle.',
        color: '#87CEEB', // SkyBlue
        supplements: [
            { name: "L-Theanine", dosage: "200mg (promotes alpha brain waves)" },
            { name: "Probiotics (L. Rhamnosus)", dosage: "Shown to communicate via vagus nerve" }
        ],
        habits: [
            {
                id: 'vagus-1',
                name: 'Vocal Humming',
                category: 'Nervous System',
                duration: 5,
                difficulty: 'Easy',
                why: 'The vagus nerve passes through the vocal cords. Vibration (humming/chanting) stimulates it directly.',
                howTo: 'Hum deeply from the diaphragm for 5 minutes. You should feel the vibration in your chest.'
            },
            {
                id: 'vagus-2',
                name: 'Gag Reflex Activation',
                category: 'Nervous System',
                duration: 1,
                difficulty: 'Hard',
                why: 'The gag reflex is mediated by the vagus nerve. Stimulating it activates the nerve strongly (causes eyes to water).',
                howTo: 'Gently stimulate the gag reflex (using a toothbrush) when brushing tongue. Unpleasant but effective.'
            },
            {
                id: 'vagus-3',
                name: 'Cold Face Submersion',
                category: 'Nervous System',
                duration: 1,
                difficulty: 'Medium',
                why: 'Triggers the Mammalian Dive Reflex, which instantly drops heart rate and activates the parasympathetic system.',
                howTo: 'Hold breath and dip your face into a bowl of ice water for 30 seconds.'
            },
            {
                id: 'vagus-4',
                name: 'Right-Side Sleeping',
                category: 'Nervous System',
                duration: 480,
                difficulty: 'Easy',
                why: 'The anatomy of the vagus nerve means right-side sleeping can increase vagal activity and HRV.',
                howTo: 'Start your sleep lying on your right side.'
            },
            {
                id: 'vagus-5',
                name: 'Diaphragmatic Breathing',
                category: 'Nervous System',
                duration: 10,
                difficulty: 'Easy',
                why: 'Chest breathing signals stress. Belly expansion activates the vagus nerve.',
                howTo: 'Breathe deep into the belly. Ensure chest does not move. Exhale longer than inhale.'
            }
        ]
    },
    'metabolic-flexibility': {
        id: 'metabolic-flexibility',
        name: 'Metabolic Flexibility',
        icon: Timer,
        description: 'Train your body to switch fuel sources efficiently between glucose and fat.',
        simpleExplanation: 'Most people are stuck running on sugar. This protocol forces your body to become a "hybrid engine," burning fat for endurance and sugar for power. You gain stable energy and freedom from hunger.',
        color: '#FF4500', // OrangeRed
        supplements: [
            { name: "Berberine", dosage: "500mg before carb meals (glucose disposal)" },
            { name: "Chromium Picolinate", dosage: "200mcg (stabilizes blood sugar)" },
            { name: "MCT Oil (C8)", dosage: "1 tbsp in morning coffee (instant ketone production)" }
        ],
        habits: [
            {
                id: 'meta-1',
                name: 'Carb Backloading',
                category: 'Metabolism',
                duration: 1,
                difficulty: 'Medium',
                why: 'By delaying carbs, you force the body to burn fat all day. Insulin sensitivity is highest post-workout, making it the safest time to eat carbs.',
                howTo: 'Eat zero carbs for breakfast and lunch. Save all carbohydrates for the post-workout meal or dinner.'
            },
            {
                id: 'meta-2',
                name: 'Fasted Walking',
                category: 'Metabolism',
                duration: 45,
                difficulty: 'Medium',
                why: 'Low-intensity movement without insulin present drains liver glycogen and forces fat oxidation.',
                howTo: 'Walk 30-45 minutes immediately upon waking before consuming any calories.'
            },
            {
                id: 'meta-3',
                name: 'Cold Thermogenesis',
                category: 'Metabolism',
                duration: 30,
                difficulty: 'Hard',
                why: 'Shivering is a metabolic super-state that forces fuel switching and calorie burn to generate heat.',
                howTo: 'Go for a walk in cold weather wearing one layer less than comfortable, until you shiver.'
            },
            {
                id: 'meta-4',
                name: 'Vinegar Pre-load',
                category: 'Metabolism',
                duration: 1,
                difficulty: 'Easy',
                why: 'Acetic acid improves muscle glucose uptake and reduces the insulin spike of a meal by up to 30%.',
                howTo: 'Drink 1 tbsp Apple Cider Vinegar in water 10 minutes before a carb-heavy meal.'
            },
            {
                id: 'meta-5',
                name: 'Feast/Famine Cycling',
                category: 'Metabolism',
                duration: 1440,
                difficulty: 'Hard',
                why: 'Prevents metabolic adaptation (slowing down). Keeps the body guessing and reactive.',
                howTo: 'Have one "high calorie" re-feed day and one "600 calorie" fasting-mimicking day per week.'
            }
        ]
    },
    'neurotransmitter-balance': {
        id: 'neurotransmitter-balance',
        name: 'Neurotransmitter Balance',
        icon: Waves,
        description: 'Optimize brain chemical messengers for mood, focus, and motivation.',
        simpleExplanation: 'Your mood is chemistry. Dopamine drives drive, Serotonin drives peace. This protocol balances these chemicals naturally so you feel motivated, happy, and calm on demand.',
        color: '#FF00FF', // Magenta
        supplements: [
            { name: "L-Tyrosine", dosage: "500mg-1g on empty stomach (Dopamine fuel)" },
            { name: "5-HTP", dosage: "100mg before bed (Serotonin fuel - use with caution)" },
            { name: "Mucuna Pruriens", dosage: "Contains L-Dopa (use sparingly)" }
        ],
        habits: [
            {
                id: 'neurotrans-1',
                name: 'Morning Sunlight (Serotonin)',
                category: 'Mental',
                duration: 15,
                difficulty: 'Easy',
                why: 'Serotonin is produced in response to bright light. It creates a mood boost and is later converted into melatonin.',
                howTo: 'Get direct morning light into your eyes.'
            },
            {
                id: 'neurotrans-2',
                name: 'Cold Shower (Dopamine)',
                category: 'Mental',
                duration: 3,
                difficulty: 'Medium',
                why: 'Cold shock creates a 250% increase in dopamine that lasts for hours, without the "crash" of stimulants.',
                howTo: 'Take a 3-minute fully cold shower.'
            },
            {
                id: 'neurotrans-3',
                name: 'Social Grooming/Touch',
                category: 'Mental',
                duration: 10,
                difficulty: 'Easy',
                why: 'Physical touch releases oxytocin, which balances out cortisol and acts as an emotional stabilizer.',
                howTo: 'Physical contact with a partner, pet, or even getting a massage.'
            },
            {
                id: 'neurotrans-4',
                name: 'Goal Micro-Dosing',
                category: 'Mental',
                duration: 5,
                difficulty: 'Easy',
                why: 'Dopamine is the molecule of "more." Checking a box releases a small hit, creating a momentum loop ("The progress principle").',
                howTo: 'Break tasks into tiny, checkable boxes and check them off physically.'
            },
            {
                id: 'neurotrans-5',
                name: 'Protein Rotation',
                category: 'Mental',
                duration: 1,
                difficulty: 'Medium',
                why: 'Precursors compete for transport. Beef provides Tyrosine (Dopamine); Turkey/Eggs provide Tryptophan (Serotonin).',
                howTo: 'Eat Red Meat in the morning (Drive). Eat Poultry/Eggs in the evening (Mood/Sleep).'
            }
        ]
    },
    'lymphatic-detox': {
        id: 'lymphatic-detox',
        name: 'Lymphatic Detox',
        icon: Droplets,
        description: 'Activate the body\'s waste removal system to clear toxins and reduce inflammation.',
        simpleExplanation: 'Your lymph system is the body\'s sewage system, but unlike blood, it has no pump. It relies on YOU to move. This protocol uses gravity and motion to flush toxins and reduce bloating.',
        color: '#20B2AA', // LightSeaGreen
        supplements: [], // None listed in prompt
        habits: [
            {
                id: 'lymph-1',
                name: 'Rebounding',
                category: 'Detox',
                duration: 10,
                difficulty: 'Easy',
                why: 'The vertical G-force opens and closes the lymphatic valves, acting as a manual pump for the entire system.',
                howTo: 'Gently bounce on a mini-trampoline for 10 minutes. Feet do not need to leave the mat.'
            },
            {
                id: 'lymph-2',
                name: 'Dry Brushing',
                category: 'Detox',
                duration: 5,
                difficulty: 'Easy',
                why: 'Physically pushes stagnant lymph fluid from the surface capillaries toward the main drainage nodes and heart.',
                howTo: 'Use a natural bristle brush on dry skin. Use long sweeping strokes towards the heart.'
            },
            {
                id: 'lymph-3',
                name: 'Contrast Showers',
                category: 'Detox',
                duration: 5,
                difficulty: 'Medium',
                why: 'Alternating hot (expansion) and cold (contraction) creates a "milking" action on the blood and lymph vessels.',
                howTo: '30 seconds Hot, 30 seconds Cold. Repeat 5 times. End on Cold.'
            },
            {
                id: 'lymph-4',
                name: 'Legs Up The Wall',
                category: 'Detox',
                duration: 10,
                difficulty: 'Easy',
                why: 'Uses gravity to drain pooled lymph and blood from the lower extremities back to the core.',
                howTo: 'Lie on your back with legs vertical against a wall for 10 minutes.'
            },
            {
                id: 'lymph-5',
                name: 'Loose Clothing',
                category: 'Detox',
                duration: 1,
                difficulty: 'Easy',
                why: 'Chronic tight clothing restricts passive lymph flow, creating "dams" where toxins accumulate.',
                howTo: 'Wear loose clothing when possible. Avoid tight bras, underwear, or belts that leave red marks.'
            }
        ]
    }
};
