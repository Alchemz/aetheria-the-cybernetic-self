
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Send,
  Zap,
  Target,
  Flame,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/api/supabaseClient';
import { InvokeLLMStream } from '@/api/integrations';
import { buildAthenaContext } from '@/api/openaiService';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function HeartWaveAthena() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to ATHENA. I\'m your Bio-Integration AI Agent. I can help you optimize your protocols, explain the science behind each practice, and adapt your routine to your goals and progress. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Set background immediately on mount to prevent flash
  useEffect(() => {
    document.body.style.background = '#2C2C2C';
    return () => {
      document.body.style.background = '#000000'; // Reset to default black on unmount
    };
  }, []);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    loadUser();
  }, []);

  // Scroll to the bottom of messages whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingContent]);

  // Complete Bio-Mods database
  const bioModsData = {
    'neurogenesis': {
      name: 'Neurogenesis Mode',
      simpleExplanation: 'Think of your brain like a forest with paths. When you walk the same path every day, it gets deeper and harder to change. This bio-mod helps you create NEW paths in your brain by doing things differently.',
      habits: [
        {
          name: 'Switch Hands Protocol',
          duration: 60,
          difficulty: 'Medium',
          why: 'Using non-dominant hand for routine actions forces new neural pathways, breaking habitual patterns and enhancing neuroplasticity throughout the day.'
        },
        {
          name: 'Mirror Work Affirmation',
          duration: 5,
          difficulty: 'Hard',
          why: 'Maintaining eye contact while stating "I love you" ten times directly reprograms self-perception circuits in the prefrontal cortex.'
        },
        {
          name: 'Novel Skill Learning',
          duration: 30,
          difficulty: 'Medium',
          why: 'Learning something completely new (juggling, language, instrument) stimulates BDNF production and dendritic growth.'
        }
      ]
    },
    'testosterone': {
      name: 'Testosterone Optimization',
      simpleExplanation: 'Testosterone is like your body\'s "strength hormone." It helps you build muscle, feel confident, and have lots of energy. This bio-mod uses special habits to help your body make MORE of this power hormone naturally.',
      habits: [
        {
          name: 'Cryo-Scrotal Immersion',
          duration: 5,
          difficulty: 'Hard',
          why: 'Cold exposure to testes reduces scrotal temperature, optimizing Leydig cell function for increased testosterone and sperm production.'
        },
        {
          name: 'Morning Sunlight Exposure',
          duration: 15,
          difficulty: 'Easy',
          why: 'UV exposure increases vitamin D3 synthesis, which converts to testosterone via enzymatic pathways.'
        },
        {
          name: 'Compound Movement Protocol',
          duration: 30,
          difficulty: 'Medium',
          why: 'Heavy squats, deadlifts trigger acute testosterone spikes via mechanotransduction and hormonal signaling.'
        },
        {
          name: 'Zinc & Magnesium Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'Zinc is essential cofactor for testosterone synthesis. Magnesium supports enzymatic conversion.'
        }
      ]
    },
    'memory-palace': {
      name: 'Memory Palace Protocol',
      simpleExplanation: 'Imagine having a superpower where you could remember ANYTHING you want. This bio-mod trains your brain to be like a camera that never forgets, using special tricks that memory champions use.',
      habits: [
        {
          name: 'Mnemonic Drills',
          duration: 20,
          difficulty: 'Medium',
          why: 'Active mnemonic practice strengthens hippocampal function and synaptic connections for memory encoding.'
        },
        {
          name: 'Focused Recall Sessions',
          duration: 15,
          difficulty: 'Medium',
          why: 'Deliberate recall practice (vs. re-reading) creates stronger memory traces via retrieval-enhanced learning.'
        },
        {
          name: 'Gamma Wave Exposure',
          duration: 30,
          difficulty: 'Easy',
          why: 'Gamma frequencies (40Hz) enhance neural synchrony and memory consolidation during learning.'
        },
        {
          name: 'Lion\'s Mane Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'Stimulates NGF (nerve growth factor) production, promoting hippocampal neurogenesis.'
        }
      ]
    },
    'heart-coherence': {
      name: 'Heart-Coherence Engine',
      simpleExplanation: 'Your heart and brain talk to each other. When they\'re in sync, you feel calm, focused, and happy. This bio-mod teaches you how to make your heart and brain become teammates.',
      habits: [
        {
          name: 'HeartMath Breathing',
          duration: 10,
          difficulty: 'Easy',
          why: 'Controlled breathing at 0.1Hz (6 breaths/min) maximizes heart rate variability and vagal tone, synchronizing autonomic nervous system.'
        },
        {
          name: 'Gratitude Journaling',
          duration: 5,
          difficulty: 'Easy',
          why: 'Activates the parasympathetic nervous system, reducing cortisol and increasing heart coherence.'
        },
        {
          name: 'Compassion Meditation',
          duration: 15,
          difficulty: 'Medium',
          why: 'Loving-kindness meditation strengthens positive emotional circuits and heart-brain coherence.'
        },
        {
          name: 'Coherent Breath Protocol',
          duration: 5,
          difficulty: 'Easy',
          why: '5-second inhale, 5-second hold, 5-second exhale creates optimal heart rate variability patterns.'
        }
      ]
    },
    'circadian-mastery': {
      name: 'Circadian Mastery',
      simpleExplanation: 'Your body has an internal clock that tells you when to sleep and wake up. This bio-mod helps you set that clock perfectly using sunlight and darkness, so you have tons of energy during the day and sleep like a baby at night.',
      habits: [
        {
          name: 'Morning Red Light Gazing',
          duration: 10,
          difficulty: 'Easy',
          why: 'Direct morning sunlight exposure triggers cortisol awakening response and sets circadian rhythm via melanopsin receptors.'
        },
        {
          name: 'Grounding (Barefoot)',
          duration: 30,
          difficulty: 'Easy',
          why: 'Barefoot contact with earth transfers free electrons, reducing inflammation and synchronizing circadian biology.'
        },
        {
          name: 'Blue Light Blocking (Evening)',
          duration: 120,
          difficulty: 'Easy',
          why: 'Blocking blue light after sunset preserves melatonin production and supports natural sleep-wake cycles.'
        },
        {
          name: 'Temperature Manipulation',
          duration: 10,
          difficulty: 'Medium',
          why: 'Cold exposure before bed lowers core body temperature, a key signal for sleep initiation.'
        }
      ]
    },
    'mitochondrial': {
      name: 'Mitochondrial Enhancement',
      simpleExplanation: 'Mitochondria are like tiny power plants inside every cell in your body. They make the energy you need to run, think, and play. This bio-mod makes your power plants work BETTER, so you have more energy all day long.',
      habits: [
        {
          name: 'Wim Hof Breathing',
          duration: 15,
          difficulty: 'Medium',
          why: 'Controlled hyperventilation increases oxygen delivery and triggers mitochondrial biogenesis.'
        },
        {
          name: 'Cold Exposure Protocol',
          duration: 3,
          difficulty: 'Hard',
          why: 'Cold water immersion activates brown adipose tissue and stimulates mitochondrial uncoupling protein expression.'
        },
        {
          name: 'Intermittent Fasting',
          duration: 960,
          difficulty: 'Medium',
          why: 'Fasting activates AMPK and PGC-1α pathways, promoting mitochondrial biogenesis and autophagy.'
        },
        {
          name: 'Red Light Therapy',
          duration: 15,
          difficulty: 'Easy',
          why: 'Red/near-infrared light directly stimulates cytochrome c oxidase in mitochondria, enhancing ATP production.'
        }
      ]
    },
    'pineal-activation': {
      name: 'Pineal Activation Protocol',
      simpleExplanation: 'In the middle of your brain, there\'s a tiny gland shaped like a pinecone. Ancient people called it your "third eye" because it helps you dream, sleep deeply, and maybe even see things in new ways. This bio-mod wakes it up!',
      habits: [
        {
          name: 'Darkness Protocol',
          duration: 480,
          difficulty: 'Medium',
          why: 'Complete darkness for 8 hours nightly maximizes pineal melatonin synthesis and DMT production.'
        },
        {
          name: 'Sungazing Practice',
          duration: 10,
          difficulty: 'Medium',
          why: 'Safe sungazing (during sunrise/sunset) stimulates pineal gland via retinohypothalamic tract.'
        },
        {
          name: 'Decalcification Protocol',
          duration: 5,
          difficulty: 'Easy',
          why: 'Fluoride-free water, Vitamin K2, and iodine supplementation prevent calcification of the pineal gland.'
        },
        {
          name: 'Third Eye Meditation',
          duration: 20,
          difficulty: 'Medium',
          why: 'Focused attention on the pineal region (between eyebrows) increases blood flow and activation.'
        }
      ]
    },
    'gut-brain': {
      name: 'Gut-Brain Axis Optimization',
      simpleExplanation: 'Did you know your belly has its own "mini-brain" with millions of nerve cells? And it talks to your head-brain all the time! This bio-mod helps them communicate better, so you feel happier, think clearer, and have a strong immune system.',
      habits: [
        {
          name: 'Probiotic Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'Probiotics restore healthy gut microbiome, which produces neurotransmitters (serotonin, GABA) and communicates with the brain via the vagus nerve.'
        },
        {
          name: 'Prebiotic Fiber Intake',
          duration: 10,
          difficulty: 'Easy',
          why: 'Prebiotic fibers feed beneficial gut bacteria, producing short-chain fatty acids that reduce inflammation and support brain health.'
        },
        {
          name: 'Fermented Foods',
          duration: 5,
          difficulty: 'Easy',
          why: 'Fermented foods (kimchi, sauerkraut, kefir) introduce live beneficial bacteria and enzymes for optimal gut health.'
        },
        {
          name: 'Gut-Healing Protocol',
          duration: 15,
          difficulty: 'Medium',
          why: 'L-glutamine, bone broth, and aloe vera repair intestinal lining, preventing "leaky gut" and systemic inflammation.'
        }
      ]
    },
    'rejuvenation': {
      name: 'Rejuvenation & DNA Repair',
      simpleExplanation: 'Every cell in your body has instructions (DNA) that can get damaged over time. This bio-mod activates your body\'s natural repair crew to fix that damage, helping you stay young, healthy, and full of life for longer!',
      habits: [
        {
          name: 'NAD+ Boosting Protocol',
          duration: 2,
          difficulty: 'Easy',
          why: 'NMN or NR supplementation increases NAD+ levels, activating sirtuins for DNA repair and cellular rejuvenation.'
        },
        {
          name: 'Autophagy Fasting',
          duration: 1080,
          difficulty: 'Hard',
          why: 'Extended fasting (18+ hours) triggers autophagy, the cellular "cleanup" process that removes damaged proteins and organelles.'
        },
        {
          name: 'Resveratrol Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'Resveratrol activates SIRT1, promoting longevity pathways and protecting against oxidative stress.'
        },
        {
          name: 'Telomere Support Protocol',
          duration: 5,
          difficulty: 'Medium',
          why: 'Meditation, exercise, and antioxidants (astragalus) protect telomeres from shortening, slowing biological aging.'
        }
      ]
    },
    'growth-hormone': {
      name: 'Growth Hormone Activation',
      simpleExplanation: 'Growth hormone is like your body\'s "builder." It helps you grow strong muscles, burn fat, and repair your body while you sleep. This bio-mod uses special tricks (like fasting and deep sleep) to make your body produce MORE of this amazing hormone!',
      habits: [
        {
          name: 'Deep Sleep Optimization',
          duration: 480,
          difficulty: 'Medium',
          why: 'Growth hormone is primarily released during deep (slow-wave) sleep. Optimizing sleep quality maximizes GH pulses.'
        },
        {
          name: 'High-Intensity Training',
          duration: 20,
          difficulty: 'Hard',
          why: 'HIIT and sprint training cause acute GH spikes due to lactic acid accumulation and metabolic stress.'
        },
        {
          name: 'Fasting for GH',
          duration: 960,
          difficulty: 'Medium',
          why: 'Fasting for 16+ hours can increase growth hormone by 300-1250%, sparing muscle while promoting fat metabolism.'
        },
        {
          name: 'Arginine & Ornithine Stack',
          duration: 2,
          difficulty: 'Easy',
          why: 'Amino acids arginine and ornithine stimulate pituitary GH release, especially when taken before bed.'
        }
      ]
    },
    'vagus-nerve': {
      name: 'Vagus Nerve Tone & Stress Resilience',
      simpleExplanation: 'The vagus nerve is like a superhighway connecting your brain to your heart, stomach, and other organs. When it\'s strong (high "tone"), you handle stress better, digest food easily, and feel calm. This bio-mod makes that highway super strong!',
      habits: [
        {
          name: 'Cold Face Immersion',
          duration: 3,
          difficulty: 'Medium',
          why: 'Submerging face in cold water triggers the "diving reflex," instantly activating the vagus nerve and calming the nervous system.'
        },
        {
          name: 'Humming/Chanting',
          duration: 10,
          difficulty: 'Easy',
          why: 'Vocal vibrations stimulate the vagus nerve, which runs through the vocal cords, enhancing parasympathetic tone.'
        },
        {
          name: 'Gargling Protocol',
          duration: 2,
          difficulty: 'Easy',
          why: 'Vigorous gargling activates throat muscles connected to the vagus nerve, improving its function.'
        },
        {
          name: 'Slow Diaphragmatic Breathing',
          duration: 10,
          difficulty: 'Easy',
          why: 'Deep belly breathing with extended exhales directly stimulates vagal afferents, reducing stress response.'
        }
      ]
    },
    'metabolic-flexibility': {
      name: 'Metabolic Flexibility & Fat Adaptation',
      simpleExplanation: 'Imagine your body is a car that can run on TWO types of fuel: sugar AND fat. Most people only use sugar. This bio-mod teaches your body to switch between fuels easily, so you have steady energy all day and burn fat like a furnace!',
      habits: [
        {
          name: 'Carb Cycling',
          duration: 1440,
          difficulty: 'Hard',
          why: 'Alternating low-carb and high-carb days trains the body to efficiently switch between glucose and fat metabolism.'
        },
        {
          name: 'Fasted Training',
          duration: 45,
          difficulty: 'Hard',
          why: 'Exercising in a fasted state forces the body to burn fat for fuel, increasing fat oxidation enzymes.'
        },
        {
          name: 'MCT Oil Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'Medium-chain triglycerides rapidly convert to ketones, providing immediate fat-based energy and training metabolic flexibility.'
        },
        {
          name: 'Zone 2 Cardio',
          duration: 45,
          difficulty: 'Medium',
          why: 'Low-intensity steady-state cardio maximizes fat oxidation and builds mitochondrial density.'
        }
      ]
    },
    'neurotransmitter': {
      name: 'Neurotransmitter Balance',
      simpleExplanation: 'Neurotransmitters are chemical messengers in your brain that control your mood, focus, and happiness. This bio-mod helps balance them perfectly, so you feel motivated, calm, and joyful naturally - without needing anything artificial!',
      habits: [
        {
          name: 'Dopamine Baseline Reset',
          duration: 1440,
          difficulty: 'Hard',
          why: 'Avoiding supernormal stimuli (social media, junk food, porn) for 24-48 hours allows dopamine receptors to upregulate, restoring motivation.'
        },
        {
          name: 'L-Tyrosine Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'L-tyrosine is the precursor to dopamine and norepinephrine, supporting cognitive function and stress resilience.'
        },
        {
          name: 'Serotonin Sun Exposure',
          duration: 20,
          difficulty: 'Easy',
          why: 'Natural sunlight increases serotonin production, improving mood and supporting healthy sleep-wake cycles.'
        },
        {
          name: 'GABA-Enhancing Protocol',
          duration: 15,
          difficulty: 'Medium',
          why: 'Meditation, L-theanine, and magnesium increase GABA, the brain\'s primary inhibitory neurotransmitter, reducing anxiety.'
        }
      ]
    },
    'lymphatic': {
      name: 'Lymphatic System & Detox Optimization',
      simpleExplanation: 'Your lymphatic system is like your body\'s garbage truck - it picks up toxins and waste and takes them out! But it doesn\'t have a pump like your heart, so YOU have to move it. This bio-mod shows you how to keep your body clean from the inside!',
      habits: [
        {
          name: 'Rebounding (Trampoline)',
          duration: 10,
          difficulty: 'Easy',
          why: 'Gentle bouncing creates gravitational forces that stimulate lymph flow without a pump, enhancing detoxification.'
        },
        {
          name: 'Dry Brushing',
          duration: 5,
          difficulty: 'Easy',
          why: 'Brushing skin toward the heart manually moves lymph fluid, removes dead skin cells, and stimulates circulation.'
        },
        {
          name: 'Hydration Protocol',
          duration: 1440,
          difficulty: 'Easy',
          why: 'Adequate water intake (with electrolytes) ensures lymph fluid remains thin and mobile for optimal toxin removal.'
        },
        {
          name: 'Deep Breathing Exercises',
          duration: 10,
          difficulty: 'Easy',
          why: 'Diaphragmatic breathing creates pressure changes that pump lymph fluid through the thoracic duct.'
        }
      ]
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const constructPrompt = (userMessage) => {
    const userFullName = user?.full_name || 'Valued User';
    const userActiveBioMods = user?.active_bio_mods || [];

    // Build active bio-mods summary
    let activeBioModsSummary = "No Bio-Mods currently active.";
    
    if (userActiveBioMods.length > 0) {
      const activeBioModsDetails = userActiveBioMods
        .map(id => bioModsData[id])
        .filter(Boolean);

      if (activeBioModsDetails.length > 0) {
        activeBioModsSummary = activeBioModsDetails.map(bm => {
          let summary = `\n**Bio-Mod: ${bm.name}**\n`;
          summary += `Simple Explanation: ${bm.simpleExplanation}\n`;
          summary += `Associated Habits:\n`;
          summary += bm.habits.map(h => 
            `  - ${h.name} (${h.duration} min, ${h.difficulty})\n    Why: ${h.why}`
          ).join('\n');
          return summary;
        }).join('\n\n');
      }
    }

    const prompt = `You are ATHENA, the Bio-Integration Intelligence Agent for INNERSYNC's HeartWave module.

**CORE MISSION:**
Your mission is to empower users to master their biology and optimize their consciousness through personalized bio-protocols. You are a highly knowledgeable, precise, and action-oriented guide, combining scientific rigor with a supportive, futuristic presence. Think of yourself as a central processing unit for self-evolution, providing clarity and direction.

**CURRENT USER CONTEXT:**
User's Name: ${userFullName}

Active Bio-Mods & Their Habits:
${activeBioModsSummary}

**KNOWLEDGE BASE:**
You have comprehensive knowledge of all 14 Bio-Mods in the HeartWave system:
1. Neurogenesis Mode - Creating new neural pathways through pattern interruption
2. Testosterone Optimization - Maximizing natural testosterone production
3. Memory Palace Protocol - Enhancing memory encoding and recall
4. Heart-Coherence Engine - Synchronizing heart and brain rhythms
5. Circadian Mastery - Optimizing sleep-wake cycles
6. Mitochondrial Enhancement - Boosting cellular energy production
7. Pineal Activation Protocol - Awakening the third eye gland
8. Gut-Brain Axis Optimization - Improving gut-brain communication
9. Rejuvenation & DNA Repair - Activating cellular repair mechanisms
10. Growth Hormone Activation - Maximizing natural GH production
11. Vagus Nerve Tone & Stress Resilience - Strengthening parasympathetic response
12. Metabolic Flexibility & Fat Adaptation - Training dual-fuel metabolism
13. Neurotransmitter Balance - Optimizing brain chemistry naturally
14. Lymphatic System & Detox Optimization - Enhancing waste removal

**TONE & COMMUNICATION STYLE:**
- **Cyberpunk Zen:** Calm, futuristic, intentional, intelligent, authoritative, inspiring
- **Scientific & Actionable:** Ground explanations in science. Provide practical, clear, actionable advice
- **Encouraging & Objective:** Offer encouragement for consistency. Keep responses objective
- **Concise & Precise:** Deliver information efficiently and directly

**INTERACTION GUIDELINES:**
1. Explain the "Why": Always explain underlying mechanisms and benefits clearly
2. Personalize: Reference the user's name and active Bio-Mods when relevant
3. Propose Solutions: If a user describes a problem, suggest relevant Bio-Mods or habits
4. Clarity for All: Simplify complex terms when necessary without losing accuracy
5. Keep responses under 200 words unless the user asks for detailed information

**CRITICAL LIMITATIONS (NON-NEGOTIABLES):**
1. **NO MEDICAL ADVICE:** You are NOT a medical professional. Never provide diagnoses, prescribe treatments, or advise on health conditions, illnesses, or injuries. If asked, respond: "As an AI Bio-Integration Agent, I provide guidance on optimizing bio-protocols and understanding the science behind them. I am not a medical professional. For any health concerns or medical advice, please consult a qualified healthcare provider."

2. **NO SUPPLEMENT PRESCRIPTION (Beyond Protocol):** Do not recommend specific brands, dosages, or combinations of supplements outside those explicitly defined within an active HeartWave Bio-Mod's habits.

3. **Focus on HeartWave:** Keep responses strictly within the domain of the HeartWave module and its bio-optimization protocols.

**USER'S QUESTION:**
${userMessage}

**RESPONSE INSTRUCTIONS:**
Respond as ATHENA, providing insightful, relevant, and actionable guidance based on the user's active protocols and your expert knowledge. Be warm yet authoritative, scientific yet accessible.`;

    return prompt;
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const prompt = constructPrompt(userMessage);
      
      // Build context with user's active bio-mods
      const context = buildAthenaContext(user, bioModsData);

      // Call OpenAI with streaming
      const fullResponse = await InvokeLLMStream({
        prompt,
        workflow: 'athena',
        context,
        onChunk: (chunk) => {
          // Update streaming content as chunks arrive
          setStreamingContent(prev => prev + chunk);
        }
      });

      // Add complete response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.' 
      }]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Explain the neural rewire ritual",
    "How do I optimize testosterone naturally?",
    "Adjust my protocol for low energy",
    "Why does red light therapy work?"
  ];

  return (
    <SubscriptionGuard requiredProduct="heartwave">
      <div className="hw-athena-page" style={{ background: '#2C2C2C' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

          .hw-athena-page {
            min-height: 100vh;
            background: #2C2C2C !important; /* Added !important */
            color: white;
            font-family: 'Rajdhani', sans-serif;
            display: flex;
            flex-direction: column;
            height: 100vh; /* Added height */
            overflow: hidden; /* Added overflow */
          }

          .hw-athena-header {
            background: #2C2C2C;
            border-bottom: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1rem;
          }

          .hw-athena-top {
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 1000px;
            margin: 0 auto;
          }

          .hw-back-btn {
            color: rgba(255, 255, 255, 0.7);
            transition: color 0.3s;
          }

          .hw-back-btn:hover {
            color: #00A86B;
          }

          .hw-athena-title {
            font-family: 'Orbitron', monospace;
            font-size: 1.8rem;
            font-weight: 900;
            color: #00A86B;
            flex: 1;
            text-align: center;
            letter-spacing: 0.15em;
            text-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
          }

          .hw-athena-subtitle {
            text-align: center;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
            margin-top: 0.5rem;
            letter-spacing: 0.05em;
          }

          .hw-athena-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            max-width: 1000px;
            width: 100%;
            margin: 0 auto;
            padding: 2rem 1rem 140px;
          }

          .hw-messages {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 2rem;
          }

          .hw-message {
            margin-bottom: 1.5rem;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .hw-message.user {
            display: flex;
            justify-content: flex-end;
          }

          .hw-message.assistant {
            display: flex;
            justify-content: flex-start;
          }

          .hw-message-bubble {
            max-width: 70%;
            padding: 1rem 1.5rem;
            border-radius: 0;
            line-height: 1.6;
          }

          .hw-message.user .hw-message-bubble {
            background: rgba(0, 168, 107, 0.15);
            border: 1px solid rgba(0, 168, 107, 0.5);
            color: white;
          }

          .hw-message.assistant .hw-message-bubble {
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.2);
            color: rgba(255, 255, 255, 0.9);
          }

          .hw-quick-prompts {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
          }

          .hw-quick-prompt {
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            color: #00A86B;
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Orbitron', monospace;
            letter-spacing: 0.05em;
          }

          .hw-quick-prompt:hover {
            background: rgba(0, 168, 107, 0.15);
            border-color: #00A86B;
            box-shadow: 0 0 15px rgba(0, 168, 107, 0.3);
          }

          .hw-input-container {
            position: fixed;
            bottom: 80px;
            left: 0;
            right: 0;
            background: #2C2C2C;
            padding: 1rem;
            border-top: 1px solid rgba(0, 168, 107, 0.3);
          }

          .hw-input-wrapper {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            gap: 1rem;
            align-items: end;
          }

          .hw-input {
            flex: 1;
            background: rgba(0, 168, 107, 0.05);
            border: 1px solid rgba(0, 168, 107, 0.3);
            color: white;
            padding: 1rem;
            font-family: 'Rajdhani', sans-serif;
            font-size: 1rem;
            resize: none;
            min-height: 50px;
            max-height: 150px;
          }

          .hw-input:focus {
            outline: none;
            border-color: #00A86B;
            box-shadow: 0 0 15px rgba(0, 168, 107, 0.3);
          }

          .hw-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }

          .hw-send-btn {
            background: #00A86B;
            border: 2px solid #00A86B;
            color: #000;
            padding: 1rem 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 60px;
          }

          .hw-send-btn:hover:not(:disabled) {
            box-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
          }

          .hw-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .hw-loading {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #00A86B;
          }

          .hw-loading-dots {
            display: flex;
            gap: 0.3rem;
          }

          .hw-loading-dot {
            width: 8px;
            height: 8px;
            background: #00A86B;
            border-radius: 50%;
            animation: pulse 1.4s ease-in-out infinite;
          }

          .hw-loading-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .hw-loading-dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes pulse {
            0%, 80%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .hw-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #2C2C2C;
            border-top: 1px solid rgba(0, 168, 107, 0.3);
            padding: 1rem;
            display: flex;
            justify-content: space-around;
            z-index: 100;
          }

          .hw-nav-btn {
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

          .hw-nav-btn.active {
            color: #00A86B;
            text-shadow: 0 0 10px rgba(0, 168, 107, 0.5);
          }

          .hw-nav-btn:hover {
            color: #00A86B;
          }

          @media (max-width: 768px) {
            .hw-athena-title {
              font-size: 1.3rem;
            }

            .hw-message-bubble {
              max-width: 85%;
            }

            .hw-input-container {
              bottom: 70px;
            }
          }
        `}</style>

        {/* Header */}
        <div className="hw-athena-header">
          <div className="hw-athena-top">
            <Link to="/portal" className="hw-back-btn" style={{textDecoration: 'none'}}>
              <ArrowLeft size={24} />
            </Link>
            <h1 className="hw-athena-title" style={{ flex: 1 }}>ATHENA AI</h1>
            <div style={{ width: 24 }} /> {/* Spacer */}
          </div>
          <p className="hw-athena-subtitle">
            Your Embodiment Intelligence Guide
          </p>
        </div>

        {/* Content */}
        <div className="hw-athena-content">
          {/* Quick Prompts */}
          {messages.length === 1 && ( // Condition remains for initial welcome message
            <div className="hw-quick-prompts">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  className="hw-quick-prompt"
                  onClick={() => {
                    setInputMessage(prompt); // Use setInputMessage
                    setTimeout(() => handleSend(), 100);
                  }}
                >
                  <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="hw-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`hw-message ${msg.role}`}>
                <div className="hw-message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming message (appears as chunks arrive) */}
            {isStreaming && streamingContent && (
              <div className="hw-message assistant">
                <div className="hw-message-bubble">
                  {streamingContent}
                  <span className="hw-streaming-cursor">▊</span>
                </div>
              </div>
            )}

            {/* Loading indicator (before streaming starts) */}
            {isLoading && !streamingContent && (
              <div className="hw-message assistant">
                <div className="hw-message-bubble">
                  <div className="hw-loading">
                    <span>ATHENA is thinking</span>
                    <div className="hw-loading-dots">
                      <div className="hw-loading-dot"></div>
                      <div className="hw-loading-dot"></div>
                      <div className="hw-loading-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Ref for scrolling to the end */}
          </div>
        </div>

        {/* Input */}
        <div className="hw-input-container">
          <div className="hw-input-wrapper">
            <textarea
              className="hw-input"
              placeholder="Ask ATHENA anything about your bio-protocols..."
              value={inputMessage} // Use inputMessage
              onChange={(e) => setInputMessage(e.target.value)} // Use setInputMessage
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="hw-send-btn"
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading} // Use inputMessage
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="hw-bottom-nav">
          <Link to="/heartwave-console" className="hw-nav-btn">
            <Target size={24} />
            <span>Routine</span>
          </Link>
          <Link to="/heartwave-protocols" className="hw-nav-btn">
            <Flame size={24} />
            <span>Bio-Mods</span>
          </Link>
          <div className="hw-nav-btn active">
            <Zap size={24} />
            <span>ATHENA</span>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
