
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Check, Info, Target, Flame, Zap, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { auth } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function HeartWaveConsole() {
  const waveCanvasRef = useRef(null);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [activeBioMods, setActiveBioMods] = useState([]);

  // Set background immediately on mount to prevent flash
  useEffect(() => {
    document.body.style.background = '#2C2C2C';
    return () => {
      document.body.style.background = '#000000';
    };
  }, []);

  useEffect(() => {
    loadUserData();
    initWaveAnimation();
  }, []);

  // Refresh data when navigating to this page
  useEffect(() => {
    loadUserData();
  }, [location]);

  const loadUserData = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);
      
      const userBioMods = currentUser.active_bio_mods || [];
      setActiveBioMods(userBioMods);
      
      const allHabits = generateHabitsFromBioMods(userBioMods);
      setHabits(allHabits);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const bioModsData = {
    'neurogenesis': {
      name: 'Neurogenesis Mode',
      habits: [
        {
          name: 'Switch Hands Protocol',
          category: 'Neuroplasticity',
          duration: 45,
          difficulty: 'Medium',
          why: 'Using non-dominant hand for routine morning tasks (first 30-60 min of day) forces new neural pathways, breaking habitual patterns and enhancing neuroplasticity.',
          howTo: 'Brush teeth, eat, open doors, and perform routine tasks using your non-dominant hand for the first 30-60 minutes of your morning.'
        },
        {
          name: 'Mirror Work Affirmation',
          category: 'Neuroplasticity',
          duration: 5,
          difficulty: 'Hard',
          why: 'Maintaining eye contact while stating "I love you" ten times directly reprograms self-perception circuits in the prefrontal cortex.',
          howTo: 'Stand in front of mirror, make direct eye contact, say "I love you [your name]" 10 times with full presence.'
        },
        {
          name: 'Novel Skill Learning',
          category: 'Neuroplasticity',
          duration: 30,
          difficulty: 'Medium',
          why: 'Learning something completely new (juggling, language, instrument) stimulates BDNF production and dendritic growth.',
          howTo: 'Dedicate 30 minutes to learning a completely new skill you have never tried before (juggling, new language, instrument).'
        }
      ]
    },
    'testosterone': {
      name: 'Testosterone Optimization',
      habits: [
        {
          name: 'Cryo-Scrotal Immersion',
          category: 'Hormonal',
          duration: 5,
          difficulty: 'Hard',
          why: 'Cold exposure to testes reduces scrotal temperature, optimizing Leydig cell function for increased testosterone and sperm production.',
          howTo: 'Submerge testicles in ice-cold water for 5 minutes, or apply ice pack. Start with 1-2 minutes and build up.'
        },
        {
          name: 'Morning Sunlight Exposure',
          category: 'Circadian Alignment',
          duration: 15,
          difficulty: 'Easy',
          why: 'UV exposure increases vitamin D3 synthesis, which converts to testosterone via enzymatic pathways.',
          howTo: 'Within 30 minutes of waking, expose your bare skin (arms, chest, legs) to direct sunlight for 15 minutes without sunscreen.'
        },
        {
          name: 'Compound Movement Protocol',
          category: 'Hormonal',
          duration: 30,
          difficulty: 'Medium',
          why: 'Heavy squats, deadlifts trigger acute testosterone spikes via mechanotransduction and hormonal signaling.',
          howTo: 'Perform 4-6 sets of heavy squats or deadlifts with 6-8 reps at 75-85% of your max weight.'
        },
        {
          name: 'Zinc & Magnesium Supplementation',
          category: 'Hormonal',
          duration: 2,
          difficulty: 'Easy',
          why: 'Zinc is essential cofactor for testosterone synthesis. Magnesium supports enzymatic conversion.',
          howTo: 'Take 30mg zinc + 400mg magnesium 30 minutes before bed daily. Use chelated forms for better absorption.'
        }
      ]
    },
    'memory-palace': {
      name: 'Memory Palace Protocol',
      habits: [
        {
          name: 'Mnemonic Drills',
          category: 'Cognitive',
          duration: 20,
          difficulty: 'Medium',
          why: 'Active mnemonic practice strengthens hippocampal function and synaptic connections for memory encoding.',
          howTo: 'Practice method of loci: visualize a familiar route, place items to remember at specific locations, mentally walk the route to recall.'
        },
        {
          name: 'Focused Recall Sessions',
          category: 'Cognitive',
          duration: 15,
          difficulty: 'Medium',
          why: 'Deliberate recall practice (vs. re-reading) creates stronger memory traces via retrieval-enhanced learning.',
          howTo: 'After reading, close book and write everything you remember. Repeat in spaced intervals (1hr, 1day, 1week).'
        },
        {
          name: 'Gamma Wave Exposure',
          category: 'Cognitive',
          duration: 30,
          difficulty: 'Easy',
          why: 'Gamma frequencies (40Hz) enhance neural synchrony and memory consolidation during learning.',
          howTo: 'Listen to 40Hz binaural beats or isochronic tones while studying or doing memory exercises.'
        },
        {
          name: 'Lions Mane Supplementation',
          category: 'Cognitive',
          duration: 2,
          difficulty: 'Easy',
          why: 'Stimulates NGF (nerve growth factor) production, promoting hippocampal neurogenesis.',
          howTo: 'Take 500-1000mg of Lions Mane extract with breakfast daily. Look for products with at least 30% polysaccharides.'
        }
      ]
    },
    'heart-coherence': {
      name: 'Heart-Coherence Engine',
      habits: [
        {
          name: 'HeartMath Breathing',
          category: 'Heart-Brain Coherence',
          duration: 10,
          difficulty: 'Easy',
          why: 'Controlled breathing at 0.1Hz (6 breaths/min) maximizes heart rate variability and vagal tone.',
          howTo: 'Breathe in for 5 seconds, out for 5 seconds. Focus attention on heart area. Imagine breathing through your heart.'
        },
        {
          name: 'Gratitude Journaling',
          category: 'Heart-Brain Coherence',
          duration: 5,
          difficulty: 'Easy',
          why: 'Activates heart-centered positive emotions, increasing cardiac coherence and reducing cortisol.',
          howTo: 'Write down 3 specific things you are grateful for. Focus on the feeling in your heart as you write each one.'
        },
        {
          name: 'Compassion Meditation',
          category: 'Heart-Brain Coherence',
          duration: 15,
          difficulty: 'Medium',
          why: 'Loving-kindness practice increases heart coherence and synchronizes autonomic nervous system.',
          howTo: 'Sit quietly, generate feelings of love for yourself, then extend to loved ones, then all beings. Repeat phrases like "May you be happy".'
        },
        {
          name: 'Coherent Breath Protocol',
          category: 'Heart-Brain Coherence',
          duration: 5,
          difficulty: 'Easy',
          why: 'Inhale 5s, hold 5s, exhale 5s creates optimal HRV and heart-brain coherence state.',
          howTo: 'Breathe in through nose for 5 counts, hold for 5, exhale through mouth for 5. Repeat for 5 minutes.'
        }
      ]
    },
    'circadian-mastery': {
      name: 'Circadian Mastery',
      habits: [
        {
          name: 'Morning Red Light Gazing',
          category: 'Circadian Alignment',
          duration: 10,
          difficulty: 'Easy',
          why: 'Morning red/infrared light sets circadian rhythm via melanopsin photoreceptors, optimizing melatonin production.',
          howTo: 'Look toward the sun (not directly at it) during the first hour after sunrise for 10 minutes. Alternatively, use red light therapy panel.'
        },
        {
          name: 'Grounding (Barefoot)',
          category: 'Circadian Alignment',
          duration: 30,
          difficulty: 'Medium',
          why: 'Transfers electrons from Earth, reducing inflammation and synchronizing circadian biology.',
          howTo: 'Walk barefoot on grass, soil, sand, or concrete for 30 minutes. Avoid rubber-soled shoes which block electron transfer.'
        },
        {
          name: 'Blue Light Blocking (Evening)',
          category: 'Circadian Alignment',
          duration: 120,
          difficulty: 'Easy',
          why: 'Prevents circadian disruption by blocking blue wavelengths that suppress melatonin after sunset.',
          howTo: 'Wear blue-blocking glasses 2 hours before bed. Dim lights, use red/amber bulbs, enable night shift on devices.'
        },
        {
          name: 'Temperature Manipulation',
          category: 'Circadian Alignment',
          duration: 10,
          difficulty: 'Medium',
          why: 'Cool room temperature (65-68F) signals circadian system for sleep onset via thermoreceptor feedback.',
          howTo: 'Set bedroom to 65-68F. Take warm shower/bath 90 min before bed, then enter cool room for rapid temperature drop.'
        }
      ]
    },
    'mitochondrial': {
      name: 'Mitochondrial Enhancement',
      habits: [
        {
          name: 'Wim Hof Breathing',
          category: 'Energy',
          duration: 15,
          difficulty: 'Medium',
          why: 'Controlled hyperventilation increases oxygen saturation and triggers mitochondrial biogenesis.',
          howTo: '30-40 deep breaths (full inhale, relaxed exhale), then exhale and hold breath as long as comfortable. Repeat 3 rounds.'
        },
        {
          name: 'Cold Exposure Protocol',
          category: 'Energy',
          duration: 3,
          difficulty: 'Hard',
          why: 'Cold stress activates PGC-1α, master regulator of mitochondrial biogenesis and brown fat activation.',
          howTo: 'End shower with 30 seconds cold (build to 3 minutes). Or ice bath 50-59F for 2-3 minutes, 2-3x per week.'
        },
        {
          name: 'Intermittent Fasting',
          category: 'Energy',
          duration: 960,
          difficulty: 'Medium',
          why: 'Fasting triggers autophagy and mitochondrial quality control via AMPK pathway activation.',
          howTo: 'Fast for 16 hours (including sleep), eat within 8-hour window. Example: eat 12pm-8pm, fast 8pm-12pm next day.'
        },
        {
          name: 'Red Light Therapy',
          category: 'Energy',
          duration: 15,
          difficulty: 'Easy',
          why: 'Near-infrared wavelengths directly enhance mitochondrial ATP production via cytochrome c oxidase activation.',
          howTo: 'Use 660nm + 850nm red light panel 6-12 inches from skin for 10-15 minutes on target areas (face, thyroid, gut).'
        }
      ]
    },
    'pineal-activation': {
      name: 'Pineal Activation Protocol',
      habits: [
        {
          name: 'Fluoride Avoidance',
          category: 'Consciousness',
          duration: 1440,
          difficulty: 'Medium',
          why: 'Fluoride accumulates in pineal gland, causing calcification. Filtered water and fluoride-free toothpaste essential.',
          howTo: 'Use reverse osmosis or distilled water. Switch to fluoride-free toothpaste. Avoid non-stick cookware and processed foods.'
        },
        {
          name: 'Third Eye Meditation',
          category: 'Consciousness',
          duration: 20,
          difficulty: 'Medium',
          why: 'Focused attention on pineal region increases blood flow and activates dormant neural pathways.',
          howTo: 'Sit, close eyes, focus attention on center of forehead (between eyebrows). Visualize indigo light pulsing there.'
        },
        {
          name: 'Sun Gazing Protocol',
          category: 'Consciousness',
          duration: 5,
          difficulty: 'Easy',
          why: 'Safe sunrise/sunset gazing stimulates pineal gland via retinohypothalamic tract.',
          howTo: 'ONLY during first/last 15 minutes of sun at horizon, gaze at sun for 10 seconds, build to 5 minutes over weeks. NEVER midday.'
        },
        {
          name: 'Iodine Supplementation',
          category: 'Consciousness',
          duration: 2,
          difficulty: 'Easy',
          why: 'Iodine supports pineal decalcification and optimal gland function.',
          howTo: 'Take 150-1000mcg iodine (kelp or Lugols solution) daily. Start low. Consider iodine loading test first.'
        }
      ]
    },
    'gut-brain-axis': {
      name: 'Gut-Brain Axis Optimization',
      habits: [
        {
          name: 'Probiotic-Rich Foods',
          category: 'Gut Health',
          duration: 15,
          difficulty: 'Easy',
          why: 'Fermented foods (kimchi, kefir, sauerkraut) introduce beneficial bacteria that produce neurotransmitters.',
          howTo: 'Eat 1-2 servings daily of fermented foods: sauerkraut, kimchi, kefir, kombucha, or natto with meals.'
        },
        {
          name: 'Prebiotic Fiber Protocol',
          category: 'Gut Health',
          duration: 10,
          difficulty: 'Easy',
          why: 'Resistant starches feed beneficial gut bacteria, increasing SCFA production and reducing inflammation.',
          howTo: 'Eat cooked then cooled potatoes/rice, green bananas, raw garlic, onions, leeks, or take 5-10g prebiotic fiber supplement.'
        },
        {
          name: 'Vagus Nerve Stimulation',
          category: 'Gut Health',
          duration: 10,
          difficulty: 'Medium',
          why: 'Gargling, singing, cold exposure activate vagal tone, strengthening gut-brain communication.',
          howTo: 'Gargle water intensely for 30 seconds until eyes water. Or sing/hum loudly for 5-10 minutes. Do 2-3x daily.'
        },
        {
          name: 'Fasting-Mimicking Diet',
          category: 'Gut Health',
          duration: 1440,
          difficulty: 'Hard',
          why: 'Periodic fasting resets gut microbiome composition and enhances gut barrier function.',
          howTo: 'Once per month: 5 days of 800-1100 calories from plant-based foods. Or 24-48 hour water fast monthly.'
        }
      ]
    },
    'rejuvenation-dna': {
      name: 'Rejuvenation & DNA Repair',
      habits: [
        {
          name: 'Deep Sleep Focus (Delta Wave)',
          category: 'Recovery',
          duration: 480,
          difficulty: 'Medium',
          why: 'Prioritizing 7-9 hours with maximized deep sleep (N3) using Delta waves (0.5-4 Hz) activates cellular repair, HGH release, and immune function.',
          howTo: 'Sleep 7-9 hours. Use blackout curtains, cool room (65-68F), listen to delta wave frequencies (0.5-4Hz) before bed.'
        },
        {
          name: 'Fasted Morning Window',
          category: 'Recovery',
          duration: 960,
          difficulty: 'Medium',
          why: '14-16 hour overnight fast (e.g., 8 PM - 10 AM) stimulates autophagy, the body cellular cleanup process that removes damaged proteins and organelles.',
          howTo: 'Stop eating at 8pm, do not eat until 10am-12pm next day. Water, black coffee, green tea allowed during fast.'
        },
        {
          name: 'DNA Repair Frequency (528 Hz)',
          category: 'Recovery',
          duration: 30,
          difficulty: 'Easy',
          why: '528 Hz "Love/Repair" Solfeggio frequency has been shown to reduce oxidative stress markers and support DNA integrity at the molecular level.',
          howTo: 'Listen to 528 Hz frequency music/tones for 30 minutes while meditating or resting. Use headphones for best effect.'
        },
        {
          name: 'Polyphenol Flood',
          category: 'Recovery',
          duration: 15,
          difficulty: 'Easy',
          why: 'Eating 3+ different colored berries, vegetables, and herbs (blueberries, spinach, turmeric, beets) floods your system with antioxidants that neutralize free radicals and protect DNA.',
          howTo: 'Eat rainbow daily: blueberries, spinach, tomatoes, beets, turmeric, dark chocolate. Aim for 3-5 different colors per meal.'
        }
      ]
    },
    'growth-hormone': {
      name: 'Growth Hormone Activation',
      habits: [
        {
          name: 'Intensity Surges',
          category: 'Hormonal',
          duration: 20,
          difficulty: 'Hard',
          why: 'Short, intense bursts (sprint intervals or heavy compound lifts to failure) 2x per week trigger acute HGH spikes via lactate accumulation and metabolic stress.',
          howTo: '2x per week: 30-second all-out sprints with 90-second rest, 8 rounds. Or lift heavy to failure for 5-8 reps, 4-6 sets.'
        },
        {
          name: 'Deep Sleep Sanctuary',
          category: 'Hormonal',
          duration: 180,
          difficulty: 'Easy',
          why: 'No food for 3 hours before bed prevents insulin from suppressing your natural overnight Growth Hormone pulse, which peaks during deep sleep.',
          howTo: 'Last meal 3+ hours before bed. No snacks after dinner. This keeps insulin low during sleep natural HGH pulse.'
        },
        {
          name: 'Intermittent Fasting (16:8)',
          category: 'Hormonal',
          duration: 960,
          difficulty: 'Medium',
          why: 'Condensing daily eating into an 8-hour window (e.g., 12 PM - 8 PM) naturally spikes HGH levels by up to 1300% during the fasted state.',
          howTo: 'Eat only between 12pm-8pm (or any 8-hour window). Fast for 16 hours including sleep. Water, coffee, tea allowed while fasting.'
        },
        {
          name: 'Pre-Sleep Protein',
          category: 'Hormonal',
          duration: 5,
          difficulty: 'Easy',
          why: '10-20g of slow-digesting protein (casein or plant blend) 30 minutes before bed on non-fasting days supports overnight muscle repair and amino acid availability.',
          howTo: 'On non-fasting days: 20g casein protein or Greek yogurt 30 minutes before bed for sustained amino acid release overnight.'
        }
      ]
    },
    'vagus-nerve': {
      name: 'Vagus Nerve Tone & Stress Resilience',
      habits: [
        {
          name: 'Resonant Breathing',
          category: 'Stress',
          duration: 10,
          difficulty: 'Easy',
          why: 'Breathe in for 5s, out for 5s (0.1 Hz frequency) to optimally stimulate the vagus nerve, increasing heart rate variability and parasympathetic activation.',
          howTo: 'Inhale nose 5 counts, exhale mouth 5 counts. Keep this rhythm for 10 minutes. This is 6 breaths per minute.'
        },
        {
          name: 'Gargling & Humming',
          category: 'Stress',
          duration: 4,
          difficulty: 'Easy',
          why: '2 minutes of vigorous gargling or continuous humming ("Om") vibrates and strengthens the vagus nerve through direct mechanical stimulation.',
          howTo: 'Gargle water vigorously for 30 seconds until eyes water, 3-4 times daily. Or hum/chant "Om" continuously for 2-5 minutes.'
        },
        {
          name: 'Cold Face Exposure',
          category: 'Stress',
          duration: 1,
          difficulty: 'Medium',
          why: '30-60 seconds of cold water on face or back of neck triggers the "dive reflex," massively activating vagal tone and parasympathetic response.',
          howTo: 'Splash ice-cold water on face for 30-60 seconds, especially forehead and under eyes. Or hold ice pack on face.'
        },
        {
          name: 'Social Connection',
          category: 'Stress',
          duration: 15,
          difficulty: 'Easy',
          why: 'Genuine, positive social interaction (not texting) stimulates the ventral vagus nerve. Laughter is one of the most powerful vagal activators.',
          howTo: 'Have face-to-face conversation, hug loved ones, laugh together, make eye contact. Phone calls also work if in-person not possible.'
        }
      ]
    },
    'metabolic-flexibility': {
      name: 'Metabolic Flexibility & Fat Adaptation',
      habits: [
        {
          name: 'Fasted Movement',
          category: 'Metabolism',
          duration: 45,
          difficulty: 'Medium',
          why: '30-60 minutes of light exercise (walking, yoga) in a fasted state upon waking teaches your body to efficiently tap into fat stores for fuel.',
          howTo: 'Upon waking (before eating), go for 30-60 min walk, yoga, or light cardio. Keep intensity low (conversational pace).'
        },
        {
          name: 'Carb Cycling',
          category: 'Metabolism',
          duration: 1440,
          difficulty: 'Hard',
          why: '2-3 low-carb days per week (<50g net carbs) with higher-carb days on intense workout days improves insulin sensitivity and metabolic flexibility.',
          howTo: 'Mon/Wed/Fri: <50g carbs. Tue/Thu/Sat: 100-200g carbs on workout days. Sunday: refeed day with 200-300g carbs.'
        },
        {
          name: 'C8 MCT Oil',
          category: 'Metabolism',
          duration: 5,
          difficulty: 'Easy',
          why: '1 tablespoon in morning coffee rapidly induces ketone production, signaling your metabolism to burn fat and providing immediate mental clarity.',
          howTo: 'Add 1 tablespoon C8 MCT oil to morning coffee or tea. Start with 1 teaspoon and work up to avoid digestive discomfort.'
        },
        {
          name: 'Time-Restricted Eating',
          category: 'Metabolism',
          duration: 960,
          difficulty: 'Medium',
          why: 'Consuming all daily calories within a consistent 8-10 hour window gives your digestive system and metabolism a daily reset, improving metabolic efficiency.',
          howTo: 'Eat all meals within 8-10 hour window daily. Example: 11am-7pm. Be consistent with timing for best metabolic adaptation.'
        }
      ]
    },
    'neurotransmitter-balance': {
      name: 'Neurotransmitter Balance',
      habits: [
        {
          name: 'Sunrise Light Anchor',
          category: 'Mental',
          duration: 10,
          difficulty: 'Easy',
          why: '10 minutes of direct morning sunlight in eyes (no sunglasses) sets circadian rhythm and boosts serotonin production via retinal melanopsin activation.',
          howTo: 'Within 30 min of waking, look toward sunrise (not directly at sun) for 10 minutes. No sunglasses. Blink naturally.'
        },
        {
          name: 'Tyrosine for Focus',
          category: 'Mental',
          duration: 2,
          difficulty: 'Easy',
          why: '500-1000mg of L-Tyrosine 30 minutes before cognitive work naturally supports dopamine production, enhancing motivation and mental energy.',
          howTo: 'Take 500-1000mg L-Tyrosine 30 minutes before focused work on empty stomach. Do not use if taking MAOIs or have hyperthyroidism.'
        },
        {
          name: 'GABA-Toning Activities',
          category: 'Mental',
          duration: 15,
          difficulty: 'Easy',
          why: 'Yoga nidra, deep meditation, or 432 Hz frequencies boost GABA (your brain "brake pedal"), reducing anxiety and promoting calm focus.',
          howTo: 'Practice yoga nidra (guided body scan meditation) for 15-20 minutes. Or listen to 432 Hz music while meditating.'
        },
        {
          name: 'Digital Sunset',
          category: 'Mental',
          duration: 90,
          difficulty: 'Medium',
          why: 'Avoiding all screens 90 minutes before bed protects melatonin production and prevents dopamine overstimulation, ensuring quality sleep and neurotransmitter recovery.',
          howTo: 'No phones, computers, TV 90 minutes before bed. Read physical books, journal, meditate, or talk with family instead.'
        }
      ]
    },
    'lymphatic-detox': {
      name: 'Lymphatic System & Detox Optimization',
      habits: [
        {
          name: 'Rebounding',
          category: 'Detox',
          duration: 10,
          difficulty: 'Easy',
          why: '10 minutes on a mini-trampoline uses vertical G-force to pump lymph fluid through one-way valves—one of the most effective lymphatic activation methods.',
          howTo: 'Bounce gently on mini-trampoline for 10 minutes. Do not jump high, just gentle bouncing is enough to pump lymph fluid.'
        },
        {
          name: 'Dry Brushing',
          category: 'Detox',
          duration: 5,
          difficulty: 'Easy',
          why: 'Brushing dry skin toward your heart (starting at extremities) before shower manually stimulates lymph flow and removes dead skin cells.',
          howTo: 'Before shower, use natural bristle brush. Start at feet, brush toward heart in long strokes. Then arms toward heart. Avoid face.'
        },
        {
          name: 'Lymphatic Breathing',
          category: 'Detox',
          duration: 5,
          difficulty: 'Easy',
          why: 'Deep, diaphragmatic "belly breathing" activates your diaphragm, which acts as the primary pump for the lymphatic system in your core.',
          howTo: 'Lie down, breathe deeply into belly (not chest). Inhale nose, expand belly. Exhale fully. 10-20 deep breaths, 2-3x daily.'
        },
        {
          name: 'Hydration with Lemon & Electrolytes',
          category: 'Detox',
          duration: 5,
          difficulty: 'Easy',
          why: '500ml warm water with lemon and sea salt upon waking hydrates cells and supports cellular detox pathways via kidney and liver function.',
          howTo: 'Upon waking: 500ml warm water + juice of half lemon + pinch of sea salt. Drink before any food or coffee.'
        }
      ]
    }
  };

  const generateHabitsFromBioMods = (bioModIds) => {
    const allHabits = [];
    let habitId = 1;

    bioModIds.forEach(bioModId => {
      if (bioModsData[bioModId]) {
        const bioMod = bioModsData[bioModId];
        bioMod.habits.forEach(habit => {
          allHabits.push({
            id: habitId++,
            ...habit,
            bioMod: bioMod.name,
            completed: false
          });
        });
      }
    });

    return allHabits;
  };

  const initWaveAnimation = () => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.beginPath();
      ctx.strokeStyle = '#00A86B';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00A86B';

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.sin((x + phase) * 0.02) * 20 +
          Math.sin((x + phase) * 0.03) * 10 +
          Math.sin((x + phase) * 0.01) * 25;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00FFFF';

      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.sin((x + phase + 50) * 0.025) * 15;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      phase += 2;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 100;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  };

  const toggleHabit = async (habitId) => {
    const updatedHabits = habits.map(h => 
      h.id === habitId ? { ...h, completed: !h.completed } : h
    );
    setHabits(updatedHabits);
  };

  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.bioMod || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {});

  return (
    <SubscriptionGuard requiredProduct="heartwave">
      <div className="heartwave-console-page" style={{ background: '#2C2C2C' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

          .heartwave-console-page {
            min-height: 100vh;
            background: #2C2C2C !important;
            color: white;
            font-family: 'Rajdhani', sans-serif;
            padding: 1rem 1rem 100px;
          }

          .console-header {
            margin-bottom: 2rem;
          }

          .console-header-top {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .console-back {
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.3s;
            text-decoration: none;
          }

          .console-back:hover {
            color: #00A86B;
          }

          .console-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            font-weight: 900;
            color: #00A86B;
            flex: 1;
            text-align: center;
            letter-spacing: 0.15em;
            text-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
          }

          .console-greeting { 
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1.5rem;
            margin-bottom: 2rem;
          }

          .greeting-text { 
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.6;
          }

          .greeting-name { 
            color: #00A86B;
            font-weight: 600;
          }

          .stats-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .stat-card { 
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1.5rem;
            text-align: center;
          }

          .stat-value { 
            font-family: 'Orbitron', monospace;
            font-size: 2.5rem;
            color: #00A86B;
            font-weight: 900;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 15px rgba(0, 168, 107, 0.5);
          }

          .stat-label { 
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }

          .today-habits { 
            margin-bottom: 2rem;
          }

          .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: #00A86B;
            margin-bottom: 1.5rem;
            letter-spacing: 0.1em;
            text-shadow: 0 0 15px rgba(0, 168, 107, 0.4);
          }

          .habits-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .habit-card {
            background: rgba(0, 168, 107, 0.05);
            border: 2px solid rgba(0, 168, 107, 0.2);
            padding: 1.5rem;
            transition: all 0.3s ease;
            display: flex; /* Added for correct layout per new outline implicitly */
            align-items: start; /* Added for correct layout per new outline implicitly */
            gap: 1rem; /* Added for correct layout per new outline implicitly */
            margin-bottom: 1rem; /* Added for correct layout per new outline implicitly */
            cursor: pointer; /* Added for correct layout per new outline implicitly */
          }

          .habit-card:hover {
            border-color: #00A86B;
            box-shadow: 0 0 20px rgba(0, 168, 107, 0.3);
          }

          .habit-card.completed {
            background: rgba(0, 168, 107, 0.1);
            border-color: #00A86B;
          }

          .habit-header { 
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
          }

          .habit-info {
            flex: 1;
          }

          .habit-name {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: #00A86B;
            margin-bottom: 0.5rem;
            font-weight: 600;
          }

          .habit-meta {
            display: flex;
            gap: 1rem;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
          }

          .habit-why { 
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            font-size: 0.9rem;
            margin-bottom: 1rem;
          }

          .habit-checkbox-wrapper { 
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .habit-checkbox {
            width: 32px;
            height: 32px;
            border: 2px solid rgba(0, 168, 107, 0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0; /* Added for correct layout per new outline implicitly */
          }

          .habit-card.completed .habit-checkbox {
            background: #00A86B;
            border-color: #00A86B;
            box-shadow: 0 0 15px rgba(0, 168, 107, 0.6);
          }

          .heartwave-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(to top, #0A0A0F, rgba(10, 10, 15, 0.95));
            backdrop-filter: blur(10px);
            padding: 1rem;
            display: flex;
            justify-content: space-around;
            border-top: 1px solid rgba(0, 168, 107, 0.3);
            z-index: 100;
          }

          .heartwave-nav-btn {
            background: transparent;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.3rem;
            font-size: 0.75rem;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
          }

          .heartwave-nav-btn.active {
            color: #00A86B;
            text-shadow: 0 0 10px rgba(0, 168, 107, 0.5);
          }

          .heartwave-nav-btn:hover {
            color: #00A86B;
          }

          /* Original custom styles not in new outline, kept to preserve look for unmapped elements */
          .hw-subtitle {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }
          .hw-wave-viz {
            width: 100%;
            height: 80px;
            margin-top: 0.5rem;
          }
          .hw-compact-guide {
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1rem;
            margin: 1rem 0; /* Updated from 1rem 1rem 0 to 1rem 0 */
            position: relative;
          }
          .hw-compact-guide-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .hw-compact-guide-icon {
            color: #00A86B;
          }
          .hw-compact-guide-title {
            font-family: 'Orbitron', monospace;
            font-size: 0.9rem;
            color: #00A86B;
            letter-spacing: 0.05em;
          }
          .hw-compact-guide-subtitle {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
            margin-left: 1.8rem;
          }
          .hw-compact-guide-content {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-left: 2px solid #00A86B;
            display: none;
          }
          .hw-compact-guide-content.visible {
            display: block;
          }
          .hw-guide-habit-name {
            font-family: 'Orbitron', monospace;
            font-size: 1rem;
            color: #00A86B;
            margin-bottom: 1rem;
            letter-spacing: 0.05em;
          }
          .hw-guide-section {
            margin-bottom: 1rem;
          }
          .hw-guide-label {
            font-size: 0.85rem;
            color: #3CB371;
            font-weight: 600;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .hw-guide-text {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            font-size: 0.9rem;
          }
          .hw-category-section {
            margin-bottom: 2.5rem;
          }
          .hw-category-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.1rem;
            color: #00A86B;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(0, 168, 107, 0.3);
            letter-spacing: 0.1em;
          }
          .hw-habit-howto {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.5;
            padding: 0.5rem;
            background: rgba(0, 0, 0, 0.3);
            border-left: 2px solid rgba(0, 168, 107, 0.5);
            margin-top: 0.5rem;
          }
          .hw-empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: rgba(255, 255, 255, 0.5);
          }
          .hw-empty-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            color: #00A86B;
            margin-bottom: 1rem;
          }

          @media (max-width: 768px) {
            .console-title {
              font-size: 1.5rem;
            }

            /* .stats-grid { Not used in current JSX structure, but included for completeness from outline }
              grid-template-columns: 1fr;
            } */
            
            .hw-wave-viz {
              height: 60px;
            }
            .hw-compact-guide {
              margin: 1rem 0; /* Updated from 1rem 1rem 0 */
            }
            .habits-list { /* previously .hw-habits-panel */
              max-height: none;
              padding: 0; /* Updated as it was removed in outline */
            }
            .hw-category-section {
              margin-bottom: 2rem;
            }
            .habit-card { /* previously .hw-habit-item */
              padding: 1rem;
            }
          }
        `}</style>

        {/* HEADER */}
        <div className="console-header">
          <div className="console-header-top">
            <Link to="/portal" className="console-back" style={{textDecoration: 'none'}}>
              <ArrowLeft size={24} />
            </Link>
            <h1 className="console-title">DAILY ROUTINE</h1>
            <div style={{ width: 24 }} />
          </div>
          <p className="hw-subtitle"> 
            Your personalized daily protocol
          </p>
          <canvas ref={waveCanvasRef} className="hw-wave-viz" /> 
        </div>

        {/* COMPACT AI GUIDE AT TOP */}
        <div className="hw-compact-guide"> 
          <div className="hw-compact-guide-header"> 
            <Info className="hw-compact-guide-icon" size={20} /> 
            <span className="hw-compact-guide-title">AI HABIT GUIDE</span> 
          </div>
          <p className="hw-compact-guide-subtitle"> 
            (click any habit and this box will explain it better)
          </p>
          
          <div className={`hw-compact-guide-content ${selectedHabit ? 'visible' : ''}`}> 
            {selectedHabit && (
              <>
                <div className="hw-guide-habit-name">{selectedHabit.name}</div> 
                
                <div className="hw-guide-section"> 
                  <div className="hw-guide-label">Why This Works:</div> 
                  <p className="hw-guide-text">{selectedHabit.why}</p> 
                </div>

                <div className="hw-guide-section"> 
                  <div className="hw-guide-label">How To Do It:</div> 
                  <p className="hw-guide-text">{selectedHabit.howTo}</p> 
                </div>
              </>
            )}
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="hw-empty-state"> 
            <h2 className="hw-empty-title">NO ACTIVE PROTOCOLS</h2> 
            <p>Contact support to activate your personalized habit protocols.</p>
          </div>
        ) : (
          <div className="habits-list"> 
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
              <div key={category} className="hw-category-section"> 
                <h2 className="hw-category-title">{category}</h2> 
                {categoryHabits.map(habit => (
                  <div
                    key={habit.id}
                    className={`habit-card ${habit.completed ? 'completed' : ''}`} 
                    onClick={() => {
                      toggleHabit(habit.id);
                      setSelectedHabit(habit);
                    }}
                  >
                    <div className="habit-checkbox"> 
                      {habit.completed && <Check size={16} color="#000" />}
                    </div>
                    <div className="habit-info"> 
                      <div className="habit-name">{habit.name}</div> 
                      <div className="habit-meta"> 
                        <span>{habit.duration} min</span>
                        <span>•</span>
                        <span>{habit.difficulty}</span>
                      </div>
                      {habit.howTo && (
                        <div className="hw-habit-howto"> 
                          <strong>How:</strong> {habit.howTo}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="heartwave-bottom-nav"> 
          <div className="heartwave-nav-btn active"> 
            <Target size={24} />
            <span>Routine</span>
          </div>
          <Link to="/heartwave-protocols" className="heartwave-nav-btn"> 
            <Flame size={24} />
            <span>Bio-Mods</span>
          </Link>
          <Link to="/heartwave-athena" className="heartwave-nav-btn"> 
            <Zap size={24} />
            <span>ATHENA</span>
          </Link>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
