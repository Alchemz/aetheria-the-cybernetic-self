import {
    Droplet, Sun, Moon, Sparkles, Brain, Activity, Zap, Heart, Telescope,
    ThermometerSnowflake, Sunrise, Timer, Wind, Dna, Atom
} from 'lucide-react';

export const MEDITATION_CATEGORIES = {
    guided: {
        id: 'guided',
        name: 'Guided Meditations',
        description: 'Immersive guided journeys for deep relaxation and consciousness exploration',
        tracks: [
            {
                id: 'heart-bloom',
                name: 'A Heart in Full Bloom',
                duration: '20:00',
                freq: 'Guided',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/A+Heart+in+Full+Bloom%E2%80%9D+Meditation+%E2%80%93+Live+With+Mei-lan+.mp3'
            },
            {
                id: 'transcendental-beginners',
                name: 'Transcendental Meditation for Beginners',
                duration: '10:00',
                freq: 'Guided',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Powerful+10-Minute+Guided+Transcendental+Meditation+for+Beginners+.mp3'
            },
            {
                id: 'heart-coherence-original',
                name: 'Heart Coherence Meditation',
                duration: '15:00',
                freq: 'Guided',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Heart+Coherence+Guided+Meditation+Dr+Joe+Dispenza+.mp3'
            },
            {
                id: 'chakra-alignment',
                name: 'Full Chakra Alignment Journey',
                duration: '25:00',
                freq: 'Guided',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Guided+Meditation++-+Chakra+Alignment+.mp3'
            }
        ]
    },
    heartcoherence: {
        id: 'heartcoherence',
        name: 'Heart Coherence',
        description: 'Heart-centered practices for emotional balance and cardiovascular harmony',
        tracks: [
            {
                id: 'heart-coherence-hc',
                name: 'Heart Coherence Meditation',
                duration: '15:00',
                freq: 'Guided',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Heart+Coherence+Guided+Meditation+Dr+Joe+Dispenza+.mp3'
            },
            {
                id: 'heart-bloom-hc',
                name: 'A Heart in Full Bloom',
                duration: '20:00',
                freq: 'Guided',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/A+Heart+in+Full+Bloom%E2%80%9D+Meditation+%E2%80%93+Live+With+Mei-lan+.mp3'
            }
        ]
    },
    healing: {
        id: 'healing',
        name: 'Healing Frequencies',
        description: 'Solfeggio frequencies and sound healing for cellular regeneration and energy alignment',
        tracks: [
            {
                id: '963-alignment',
                name: '963 Hz Alignment Meditation',
                duration: '30:00',
                freq: '963 Hz',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/963+Hz+to+Connect++healing+Meditation+and+Healing+.mp3'
            },
            {
                id: 'chakra-sound-bath',
                name: 'Chakra Restoration Sound Bath',
                duration: '30:00',
                freq: 'Mixed',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Chakra+Restoration+Sound+Bath++Singing+bowls+music+for+aligning+Chakras+.mp3'
            },
            {
                id: 'solar-harmonics-healing',
                name: 'Solar Harmonics',
                duration: '35:00',
                freq: 'Solar',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Solar+Harmonics+.mp3'
            }
        ]
    },
    focus: {
        id: 'focus',
        name: 'Focus',
        description: 'Binaural beats and gamma waves for peak concentration and cognitive performance',
        tracks: [
            {
                id: 'deep-focus-40hz',
                name: '40 Hz Deep Focus (Headphones)',
                duration: '45:00',
                freq: '40 Hz',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/(Headphones)+40hz+for+Deep+Focus+.mp3'
            },
            {
                id: 'solar-harmonics-focus',
                name: 'Solar Harmonics',
                duration: '35:00',
                freq: 'Solar',
                url: 'https://Innersync-media.s3.us-east-005.backblazeb2.com/Solar+Harmonics+.mp3'
            }
        ]
    }
};

export const SLEEP_CATEGORIES = {
    "Deep Sleep": [
        { id: "delta-wave-deep-sleep", name: "Delta Wave Deep Sleep", freq: "0.5-4 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Fall+asleep+and+heal.mp3" },
        { id: "solfeggio-healing", name: "9 Solfeggio Healing", freq: "174-963 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/b9slfgs.mp3" },
        { id: "chakra-deep-sleep", name: "Chakra Alignment", freq: "432-741 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/432Hz+%2B+528Hz+%2B+741Hz+%EF%BD%9C+ng+leep%EF%BC%9A+Whole+Body+Regeneration%2C+Chackra+Alignment.mp3" }
    ],
    "Lucid Dreaming": [
        { id: "lucid-dreams-theta", name: "Lucid Dreams Theta", freq: "4-8 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Lucid+dreams+theta.mp3" },
        { id: "hemi-sync-lucid", name: "Hemi-Sync Coherence", freq: "Mixed", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Hemi-Sync.mp3" }
    ],
    "Astral Projection": [
        { id: "astral-projection-7hz", name: "Astral 7Hz", freq: "7 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Astral+projection+7hz.mp3" }
    ],
    "Theta Waves": [
        { id: "theta-lucid-dreams", name: "Theta Wave Lucid", freq: "4-8 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/Lucid+dreams+theta.mp3" }
    ],
    "Chakra Alignment": [
        { id: "chakra-deep-sync", name: "Chakra Deep Sync", freq: "432-741 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/432Hz+%2B+528Hz+%2B+741Hz+%EF%BD%9C+ng+leep%EF%BC%9A+Whole+Body+Regeneration%2C+Chackra+Alignment.mp3" }
    ],
    "Solfeggio": [
        { id: "solfeggio-cleanse", name: "9 Solfeggio Cleanse", freq: "174-963 Hz", url: "https://Innersync-media.s3.us-east-005.backblazeb2.com/b9slfgs.mp3" }
    ]
};

export const BIOHACKING_PROTOCOLS = [
    {
        id: 'cold-exposure',
        name: 'Cold Exposure',
        icon: ThermometerSnowflake,
        color: '#00D4FF',
        category: 'Physical Resilience',
        description: 'Activate brown fat, boost metabolism, and enhance mental resilience through strategic cold therapy.',
        benefits: {
            'Physical': [
                'Increases brown fat activation for thermogenesis',
                'Boosts metabolism by 16% for hours post-exposure',
                'Enhances immune function (up to 530% increase in leukocytes)',
                'Accelerates fat loss and muscle recovery',
                'Improves circulation and cardiovascular health'
            ],
            'Neurological': [
                'Dopamine increase by 250% (sustained 2.5 hours)',
                'Enhanced mental clarity and focus',
                'Builds stress resilience via hormetic response',
                'Strengthens vagal tone and nervous system',
                'Reduces inflammation in neural pathways'
            ],
            'Hormonal': [
                'Acute norepinephrine spike (530% increase)',
                'Testosterone optimization in males',
                'Cortisol regulation and stress adaptation',
                'HGH release during recovery phase',
                'Improved insulin sensitivity'
            ],
            'Longevity': [
                'Activates cold shock proteins',
                'Triggers autophagy at cellular level',
                'Reduces systemic inflammation markers',
                'Enhances mitochondrial biogenesis',
                'Mimics caloric restriction benefits'
            ]
        },
        protocol: [
            '1. Start with 30-second cold shower finishes',
            '2. Progress to 2-minute full cold showers',
            '3. Advanced: Ice baths 3-5 minutes at 50°F (10°C)',
            '4. Optimal timing: Morning for dopamine/energy boost',
            '5. Breathe slowly and deeply - do not hyperventilate',
            '6. Build gradually - cold adaptation takes 2-3 weeks'
        ]
    },
    {
        id: 'circadian',
        name: 'Circadian Optimization',
        icon: Sunrise,
        color: '#FFB347',
        category: 'Biological Rhythm',
        description: 'Align your biology with natural light cycles for peak hormone production and energy.',
        benefits: {
            'Hormonal': [
                'Optimized cortisol awakening response',
                'Enhanced melatonin production at night',
                'Testosterone peak in early morning',
                'Growth hormone release during deep sleep',
                'Balanced leptin and ghrelin for appetite control'
            ],
            'Sleep Quality': [
                'Faster sleep onset (reduced latency)',
                'Increased deep sleep percentage',
                'Consolidated sleep architecture',
                'Reduced night wakings',
                'Enhanced sleep efficiency (>85%)'
            ],
            'Energy & Performance': [
                'Stable energy without crashes',
                'Peak performance windows aligned',
                'Reduced afternoon fatigue',
                'Enhanced physical performance timing',
                'Improved reaction time and alertness'
            ],
            'Metabolic': [
                'Improved glucose tolerance',
                'Enhanced insulin sensitivity',
                'Optimized fat oxidation timing',
                'Better nutrient partitioning',
                'Reduced metabolic syndrome risk'
            ]
        },
        protocol: [
            '1. View bright light within 30 min of waking',
            '2. Get 10-15 minutes morning sunlight (no sunglasses)',
            '3. Avoid bright lights 2-3 hours before bed',
            '4. Use blue-blocking glasses after sunset',
            '5. Keep bedroom completely dark (blackout)',
            '6. Maintain consistent sleep/wake times (±30 min)'
        ]
    },
    {
        id: 'fasting',
        name: 'Intermittent Fasting',
        icon: Timer,
        color: '#BA55D3',
        category: 'Metabolic Mastery',
        description: 'Trigger autophagy, enhance mitochondrial function, and optimize metabolic flexibility.',
        benefits: {
            'Cellular Health': [
                'Autophagy activation (cellular cleanup)',
                'Enhanced mitochondrial biogenesis',
                'Removal of damaged proteins',
                'Stem cell regeneration',
                'Reduced oxidative stress'
            ],
            'Metabolic': [
                'Improved insulin sensitivity',
                'Enhanced metabolic flexibility',
                'Increased fat oxidation',
                'Ketone body production',
                'Stable blood sugar levels'
            ],
            'Hormonal': [
                'HGH increase up to 300-500%',
                'Improved leptin sensitivity',
                'Enhanced AMPK activation',
                'Optimized BDNF production',
                'Balanced ghrelin response'
            ],
            'Longevity & Brain': [
                'Reduced inflammation markers',
                'Enhanced neuroplasticity',
                'Improved mental clarity',
                'Neuroprotective effects',
                'Extended healthspan markers'
            ]
        },
        protocol: [
            '1. Begin with 12-hour overnight fast (easy entry)',
            '2. Progress to 16:8 (16 hours fasting, 8 eating)',
            '3. Advanced: 20:4 or OMAD protocols',
            '4. Break fast with nutrient-dense whole foods',
            '5. Stay hydrated - water, coffee, tea (no calories)',
            '6. Listen to body - adjust based on energy levels'
        ]
    },
    {
        id: 'breath',
        name: 'Breathwork Mastery',
        icon: Wind,
        color: '#FFD700',
        category: 'Nervous System',
        description: 'Harness breath to control nervous system, enhance oxygenation, and alter consciousness.',
        benefits: {
            'Nervous System': [
                'Voluntary control of autonomic system',
                'Enhanced vagal tone',
                'Reduced fight-or-flight activation',
                'Improved HRV (heart rate variability)',
                'Better stress response modulation'
            ],
            'Respiratory': [
                'Increased CO2 tolerance',
                'Enhanced oxygen utilization',
                'Improved lung capacity',
                'Better diaphragmatic function',
                'Reduced respiratory rate at rest'
            ],
            'Mental State': [
                'Rapid anxiety reduction',
                'Enhanced focus and clarity',
                'Altered states of consciousness',
                'Improved emotional regulation',
                'Better mindfulness and presence'
            ],
            'Performance': [
                'Increased athletic endurance',
                'Faster recovery between efforts',
                'Enhanced cold tolerance',
                'Better altitude adaptation',
                'Improved sleep quality'
            ]
        },
        protocol: [
            '1. Box Breathing: 4-4-4-4 for calm (parasympathetic)',
            '2. Wim Hof: 30-40 deep breaths + retention (energizing)',
            '3. Buteyko: Nasal breathing + light breath holds',
            '4. 4-7-8: Inhale 4, hold 7, exhale 8 (for sleep)',
            '5. Coherence: 5 sec in, 5 sec out (HRV optimization)',
            '6. Practice 10-20 minutes daily',
            '7. Never force - build gradually over weeks'
        ]
    },
    {
        id: 'primal-diet',
        name: 'Primal Nutrition',
        icon: Dna,
        color: '#FF8C42',
        category: 'Ancestral Eating',
        description: 'Return to nutrient-dense whole foods that sustained humans for millennia.',
        benefits: {
            'Metabolic Health': [
                'Stable blood sugar and insulin',
                'Enhanced fat adaptation',
                'Reduced inflammation markers',
                'Improved metabolic flexibility',
                'Better nutrient partitioning'
            ],
            'Physical Performance': [
                'Increased muscle protein synthesis',
                'Better recovery and adaptation',
                'Enhanced mitochondrial function',
                'Improved bone density',
                'Optimal hormone production'
            ],
            'Gut Health': [
                'Diverse gut microbiome',
                'Reduced intestinal permeability',
                'Better nutrient absorption',
                'Enhanced immune function (70% in gut)',
                'Reduced digestive issues'
            ],
            'Mental Clarity': [
                'Stable energy throughout day',
                'Enhanced cognitive function',
                'Better mood regulation',
                'Reduced brain inflammation',
                'Improved focus and productivity'
            ]
        },
        protocol: [
            '1. Prioritize: Grass-fed meat, wild fish, pastured eggs',
            '2. Eat: Abundant vegetables (especially leafy greens)',
            '3. Include: Healthy fats (avocado, olive oil, coconut)',
            '4. Add: Organ meats 1-2x/week (nature\'s multivitamin)',
            '5. Avoid: Refined sugars, seed oils, processed foods',
            '6. Limit: Grains and legumes (anti-nutrients)',
            '7. Timing: 2-3 meals, no snacking (metabolic rest)',
            '8. Hydrate: Clean water, mineral-rich when possible'
        ]
    },
    {
        id: 'meditation',
        name: 'Meditation Practice',
        icon: Brain,
        color: '#9D4EDD',
        category: 'Consciousness',
        description: 'Train attention, expand awareness, and access deeper states of consciousness.',
        benefits: {
            'Brain Structure': [
                'Increased gray matter density',
                'Enhanced prefrontal cortex thickness',
                'Reduced amygdala activation (less reactivity)',
                'Improved neural connectivity',
                'Enhanced corpus callosum integration'
            ],
            'Mental Health': [
                'Reduced anxiety and depression',
                'Enhanced emotional regulation',
                'Improved mood stability',
                'Reduced rumination',
                'Better stress resilience'
            ],
            'Cognitive': [
                'Enhanced sustained attention',
                'Improved working memory',
                'Better cognitive flexibility',
                'Reduced age-related cognitive decline',
                'Enhanced creativity and insight'
            ],
            'Well-Being': [
                'Increased self-awareness',
                'Enhanced compassion and empathy',
                'Improved sense of purpose',
                'Greater life satisfaction',
                'Reduced perception of pain'
            ]
        },
        protocol: [
            '1. Start with 5 minutes daily (consistency > duration)',
            '2. Focus attention on breath at nostrils',
            '3. When mind wanders, gently return to breath',
            '4. Progress to 10, then 20 minutes over weeks',
            '5. Experiment: body scan, open awareness, loving-kindness',
            '6. Best times: Morning (sets tone) or before bed',
            '7. Use app guidance if helpful (Waking Up, Headspace)'
        ]
    },
    {
        id: 'lymphatic',
        name: 'Lymphatic Stimulation',
        icon: Activity,
        color: '#FF6B9D',
        category: 'Detoxification',
        description: 'Activate your body\'s drainage system through strategic tapping and movement.',
        benefits: {
            'Immune Function': [
                'Enhanced lymphocyte circulation',
                'Faster pathogen removal',
                'Reduced lymph node congestion',
                'Improved antibody distribution',
                'Strengthened immune surveillance'
            ],
            'Detoxification': [
                'Accelerated toxin removal',
                'Reduced cellular waste buildup',
                'Enhanced interstitial fluid drainage',
                'Improved kidney filtration support',
                'Better liver detox pathway support'
            ],
            'Physical': [
                'Reduced inflammation and swelling',
                'Decreased muscle soreness',
                'Improved skin health and glow',
                'Enhanced tissue repair',
                'Better nutrient delivery to cells'
            ],
            'Energy & Vitality': [
                'Reduced brain fog',
                'Increased overall energy',
                'Better mood regulation',
                'Enhanced recovery from illness',
                'Improved sleep quality'
            ]
        },
        protocol: [
            '1. Neck: Gentle strokes down sides (5 reps each side)',
            '2. Armpits: Circular tapping (20 taps each)',
            '3. Heart: Gentle tapping over sternum (30 seconds)',
            '4. Abdomen: Clockwise circular massage (2 minutes)',
            '5. Groin: Gentle tapping inner thighs (20 taps each)',
            '6. Behind knees: Light tapping (15 taps each)',
            '7. Do entire sequence 1-2x daily, best after waking',
            '8. Combine with rebounding or walking for max effect'
        ]
    },
    {
        id: 'nootropics',
        name: 'Nootropic Stack',
        icon: Atom,
        color: '#00FFFF',
        category: 'Cognitive Enhancement',
        description: 'Scientifically-backed supplements for cognitive enhancement and neuroprotection.',
        benefits: {
            'Cognitive Performance': [
                'Enhanced focus and concentration',
                'Improved memory formation and recall',
                'Faster information processing',
                'Reduced mental fatigue',
                'Enhanced creativity and problem-solving'
            ],
            'Neuroprotection': [
                'Increased BDNF (brain fertilizer)',
                'Enhanced neurogenesis',
                'Reduced neuroinflammation',
                'Protection against cognitive decline',
                'Improved neuroplasticity'
            ],
            'Mood & Motivation': [
                'Balanced dopamine and serotonin',
                'Reduced anxiety and stress',
                'Enhanced motivation and drive',
                'Improved emotional regulation',
                'Better stress resilience'
            ],
            'Brain Energy': [
                'Enhanced mitochondrial function',
                'Improved cerebral blood flow',
                'Increased ATP production',
                'Better glucose utilization',
                'Reduced oxidative stress in brain'
            ]
        },
        protocol: [
            '1. L-Theanine 200mg + Caffeine 100mg (morning)',
            '2. Lion\'s Mane 500-1000mg daily (any time)',
            '3. Omega-3 (EPA/DHA) 2-3g daily with meals',
            '4. Creatine 5g daily (for brain energy)',
            '5. Magnesium L-Threonate 2g before bed',
            '6. Optional: Rhodiola 200-400mg for stress adaptation',
            '7. Cycle stimulants - take breaks every 8-12 weeks'
        ]
    }
];
