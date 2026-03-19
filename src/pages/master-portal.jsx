import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CosmicIntelligence } from '@/services/cosmicIntelligence';
import SolarSystemScene from '../components/SolarSystemScene';
import * as THREE from 'three';
import {
    Mic, MicOff, Play, Pause, SkipForward, SkipBack,
    Wind, Moon, Zap, Activity, BookOpen, Users,
    ChevronRight, ArrowRight, Brain, Lock, Star, Hexagon,
    Heart, Eye, ArrowLeft, Send, Download, History, Trash2,
    X, Telescope, PenLine, Droplet, Sun, Sparkles, Target, Flame, Globe, List, Plus, Check, CheckSquare, ChevronUp,
    Cpu, Orbit, KeyRound, Waves, LayoutGrid, Sword
} from 'lucide-react';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { auth } from '@/api/supabaseClient';
import { InvokeLLMStream } from '@/api/integrations';
import { buildDreamContext } from '@/api/aiService';
import SubscriptionGuard from '../components/SubscriptionGuard';
import ErrorBoundary from '../components/ErrorBoundary'; // [NEW] Error Boundary
import { MEDITATION_CATEGORIES, SLEEP_CATEGORIES, BIOHACKING_PROTOCOLS } from '../data/appData';
import { bioModsData } from '@/data/heartwaveData';
import { NotificationService } from '@/api/notificationService';

// --- CONFIGURATION & REAL DATA ---

const REALMS = {
    SANCTUARY: {
        id: 'SANCTUARY',
        color: '#D94B1E',          // desaturated orange-red
        colorLight: '#B83A10',
        secondary: '#E07818',      // desaturated amber
        secondaryLight: '#C46010',
        bg: 'radial-gradient(circle at center, #150a02 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #f2dece 0%, #ebe7df 100%)',
        particleMode: 'float',
        title: 'THE SANCTUARY',
        subtitle: 'Restoration & Subconscious Architecture',
        playlist: ["Deep Sleep", "Lucid Dreaming"]
    },
    NEXUS: {
        id: 'NEXUS',
        color: '#7B65C0',          // desaturated purple
        colorLight: '#5A4AA8',
        secondary: '#C4BCE0',      // desaturated lavender
        secondaryLight: '#4A3C90',
        bg: 'radial-gradient(circle at center, #0c0418 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #e8e0f2 0%, #ebe7df 100%)',
        particleMode: 'spiral',
        title: 'THE NEXUS',
        subtitle: 'Cognitive Augmentation & Bio-Optimization',
        playlist: ["Astral Projection", "Theta Waves"]
    },
    TEMPLE: {
        id: 'TEMPLE',
        color: '#259B68',          // desaturated emerald
        colorLight: '#1A7A50',
        secondary: '#30C0C0',      // desaturated cyan
        secondaryLight: '#147878',
        bg: 'radial-gradient(circle at center, #021408 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #d8f0e4 0%, #ebe7df 100%)',
        particleMode: 'rise',
        title: 'THE TEMPLE',
        subtitle: 'Embodiment, Wisdom & Synchrony',
        playlist: ["Chakra Alignment", "Solfeggio"]
    }
};

const FREQUENCY_TRACKS = SLEEP_CATEGORIES;

const FLAT_TRACKS = Object.values(FREQUENCY_TRACKS).flat();

const WISDOM_THREADS = [
    { id: 1, icon: KeyRound, title: "The Hermetic Principles", excerpt: "The 7 universal laws governing reality: Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause/Effect, and Gender." },
    { id: 2, icon: Waves, title: "The Tao Te Ching", excerpt: "The soft overcomes the hard. Acting in harmony with the natural flow of life, without force or struggle." },
    { id: 3, icon: LayoutGrid, title: "Jungian Archetypes", excerpt: "The totality of the psyche, the union of conscious and unconscious. Until you make the unconscious conscious, it will direct your life." },
    { id: 4, icon: Sword, title: "The Bhagavad Gita", excerpt: "Live in alignment with your true nature and purpose. Your dharma is your unique expression of the divine." },
    { id: 5, icon: Flame, title: "Christ Consciousness", excerpt: "The kingdom of heaven is within you. Awareness of your oneness with the Source of all life." }
];

const LIBRARY_COURSES = [
    {
        title: "Science of Sleep Cycles",
        type: "knowledge",
        desc: "Understand REM, Deep, and Light sleep phases.",
        longDescription: "Sleep is not a uniform state, but a complex architecture of cycles. Understanding these phases allows you to engineer your rest for maximum recovery and cognitive enhancement. You cycle through 4-6 full cycles per night, each lasting 90-110 minutes.",
        sections: [
            {
                title: "NREM 1 — Light Sleep (N1)",
                text: "Duration: 1-7 minutes (~5% of night). The transition between wakefulness and sleep. Theta waves begin to appear. Hypnagogic hallucinations may occur. Easily disturbed — a single notification can pull you back to full wakefulness from this stage."
            },
            {
                title: "NREM 2 — True Sleep (N2)",
                text: "Duration: 10-25 minutes (~45% of night). Body temperature drops, heart rate slows. Sleep spindles and K-complexes appear in brainwaves, actively protecting the brain from external stimuli and locking in memory consolidation. The longest and most frequent stage overall."
            },
            {
                title: "NREM 3 — Deep/Delta Sleep (N3)",
                text: "Duration: 20-40 minutes (~25% of night). The most restorative stage. Delta waves dominate. Growth hormone is released, tissues are repaired, the immune system is strengthened, and the brain flushes out toxic metabolic waste via the glymphatic system. Physical restoration at its deepest level."
            },
            {
                title: "REM — Rapid Eye Movement",
                text: "Duration: 10-60 minutes (~25% of night). Brain activity resembles wakefulness. Vivid dreaming occurs here. Crucial for memory consolidation, emotional processing, creative problem-solving, and neural plasticity. REM cycles grow longer toward morning — your final 2 hours contain the richest dream states."
            },
            {
                title: "THE SLEEP CYCLE ARCHITECTURE",
                text: "You cycle through all four stages 4-6 times per night. Each full cycle lasts 90-110 minutes. The first half of your night contains more N3 deep sleep (physical restoration). The second half contains progressively longer REM stages (mental and emotional processing). Cutting sleep short by even 1-2 hours disproportionately eliminates the REM-rich final cycles."
            },
            {
                title: "WHY EACH STAGE MATTERS",
                text: "Light Sleep (N1 & N2): Transition, sensory gating, and memory tagging. Deep Sleep (N3): Physical recovery, immune strengthening, hormone release, and glymphatic brain cleaning. REM Sleep: Learning consolidation, mood regulation, emotional integration, and creative insight. Neglecting any stage creates a specific deficit — poor immunity from lack of N3, poor memory from lack of N2, poor emotional balance from lack of REM."
            }
        ]
    },
    {
        title: "The Neurochemistry of Relaxation & Stress",
        type: "knowledge",
        desc: "How your brain chemicals control calm and tension.",
        longDescription: "Your nervous system is a chemical battlefield between stress and calm. Understanding the main players helps you consciously influence the outcome — and choose behaviors that tip the scales toward deep, restorative rest every night.",
        sections: [
            {
                title: "CORTISOL — The Stress Signal",
                text: "Function: Primary stress hormone designed for 'fight or flight.' Effects: Increases alertness and energy by raising heart rate, blood pressure, and blood sugar. While vital for short-term emergencies, chronic high cortisol — caused by modern persistent stress — disrupts sleep architecture, impairs memory formation, suppresses the immune system, and accelerates aging. The key to deep relaxation is learning to calm an overactive cortisol response through breathwork, movement, and deliberate evening wind-down rituals."
            },
            {
                title: "GABA — Your Brain's Brake Pedal",
                text: "Function: Main inhibitory neurotransmitter in your central nervous system. Effects: Slows down neuron firing, promoting calmness, relaxation, and sleep onset. Think of it as your brain's brake pedal. Many sleep medications work by boosting GABA activity artificially. Natural practices that enhance GABA: deep diaphragmatic breathing, meditation, yoga, and regular physical exercise. Magnesium L-Threonate also supports GABA receptor function and sleep quality."
            },
            {
                title: "THE VAGUS NERVE — The Calming Superhighway",
                text: "Function: The longest nerve in your body and the command center of your 'rest-and-digest' parasympathetic nervous system. Effects: When stimulated, it signals the body to slow heart rate, lower blood pressure, and activate full-body calm. Runs from your brainstem all the way to your colon. You can directly activate it through: slow, deep breathing with extended exhales, humming or singing, cold water on the face, and gargling. A well-toned vagus nerve means faster recovery from stress and faster entry into deep restorative sleep."
            }
        ]
    },
    {
        title: "Circadian Rhythms: Your Body's Internal Clock",
        type: "knowledge",
        desc: "Align with your natural 24-hour biological cycles.",
        longDescription: "You have a built-in master clock in your brain that synchronizes your entire body with the Earth's day-night cycle. Aligning your daily habits with this rhythm is the single most powerful, foundational act for restorative, regenerative sleep.",
        sections: [
            {
                title: "THE SUPRACHIASMATIC NUCLEUS (SCN) — The Master Clock",
                text: "Location: Hypothalamus, in the brain. Function: Operates on a roughly 24-hour cycle and regulates hormones, body temperature, digestion, and sleep cycles. The most powerful input to the SCN is light. Morning sunlight sends a direct signal to promote wakefulness and kick-start the cortisol awakening response. Darkness triggers the cascade toward melatonin and sleep. Disrupting this signal — through erratic sleep schedules or late-night artificial light — desynchronizes your entire hormonal and biological orchestra."
            },
            {
                title: "MELATONIN — The Darkness Hormone",
                text: "Function: The SCN triggers melatonin release from the pineal gland as evening darkness falls, making you feel sleepy and preparing every organ for restorative processes. Critical disruption: Exposure to bright light — especially the short-wavelength blue light from screens — in the 2 hours before bed can suppress melatonin production by up to 80%, tricking your brain into thinking it's still daytime. This is why a blue-light blocking protocol after sunset is non-negotiable for sleep quality."
            },
            {
                title: "ADENOSINE — Sleep Pressure",
                text: "Function: A chemical that accumulates in your brain the longer you are awake, creating an increasingly powerful pressure to sleep. During deep N3 sleep, your glymphatic system clears out this adenosine — the molecular reason you wake up feeling refreshed. Caffeine's mechanism: It works by blocking adenosine receptors, temporarily masking tiredness. The adenosine does not disappear — it continues building. When caffeine wears off, the accumulated adenosine hits all at once, causing the familiar afternoon energy crash."
            }
        ]
    },
    {
        title: "Module B: Beginner",
        type: "practice",
        desc: "The Digital Detox & Sanctuary Reset",
        longDescription: "Before we can build, we must clean the foundation. This module eliminates the biggest, most common saboteurs with simple, actionable commands. THE VICTORY: Falling asleep within 20 minutes of lying down, without mental chatter or digital interference.",
        sections: [
            { title: "The 5 Commandments Overview", text: "1. The Digital Boundary (Airplane Mode or 5ft distance)\n2. The Caffeine Curfew (6 hours before target bedtime)\n3. The Frequency Anchor (30 min before sleep, separate device)\n4. The Brain Dump Ritual (3-5 items written and closed)\n5. The Sanctuary Seal (Cool, completely dark, and silent)" }
        ],
        checklist: [
            "Digital Boundary: Phone on Airplane Mode or 5ft away",
            "Caffeine Curfew: No caffeine 6h before bed",
            "Frequency Anchor: Play relaxing frequency 30m before bed",
            "Brain Dump: Write down 3-5 mind items",
            "Sanctuary Seal: Room is dark, cool, and silent"
        ],
        commandments: [
            {
                name: "The Digital Boundary: Airplane Mode or Distance",
                rule: "You have two choices. Either: Put your phone on Airplane Mode 60 minutes before bed. Or: Place your phone at least 1.5 meters (5 feet) away from your head. The further, the better. A device across the room is always better than one on your nightstand.",
                why: "This serves two purposes. First, it eliminates sleep-disrupting notifications and the temptation to scroll — which exposes you to blue light and stimulating content right before sleep. Second, it reduces your exposure to the device's electromagnetic field (EMF), creating a cleaner energetic environment for your brain to wind down into its natural state."
            },
            {
                name: "The Caffeine Curfew",
                rule: "No caffeine 6 hours before your target bedtime. This includes coffee, green tea, pre-workout supplements, and many sodas. If your bedtime is 11pm, your last caffeine is 5pm.",
                why: "Caffeine has a half-life of approximately 5-6 hours. The 6-hour curfew ensures adenosine-blocking effects have fully cleared your system, allowing natural sleep pressure to build unimpeded. Caffeine consumed at 3pm can still be measurably interfering with sleep onset and deep sleep quality at 11pm."
            },
            {
                name: "The Frequency Anchor",
                rule: "30 minutes before bed, start playing a simple, relaxing frequency (delta waves, binaural beats, or nature sounds) on a separate device placed across the room. You can let it continue playing as you fall asleep. The key word is separate device — not your phone.",
                why: "This gives your brain a simple, repetitive auditory signal to anchor on, gently pulling it away from anxious thought loops and entraining it toward a calm, sleep-ready state. The act of setting up a separate device also creates a ritual — a behavioral cue that signals your nervous system: sleep is coming."
            },
            {
                name: "The 'Brain Dump' Ritual",
                rule: "Write down 3-5 things currently on your mind in a dedicated notebook, then close it and physically put it away. This takes 5 minutes maximum. Do it before entering the bedroom.",
                why: "This is a cognitive closure ritual. By externalizing your thoughts onto paper, you tell your brain: 'It is noted. We will handle this tomorrow. Your mental shift is over.' Without this step, the Default Mode Network — your brain's 'thinking about yourself and your problems' circuit — stays active after lights-out, generating the anxious rumination that prevents sleep onset."
            },
            {
                name: "The Sanctuary Seal",
                rule: "The bedroom must be cool (65-68°F / 18-20°C), completely dark (use blackout curtains or an eye mask), and silent (use earplugs if needed). No TV on in the background. No ambient light from chargers or devices.",
                why: "You are optimizing the three primal environmental triggers that the human brain evolved over millions of years to associate with safe sleep: a lower ambient temperature (mimicking natural nightfall cooling), the complete absence of light (the primary biological 'sleep signal'), and the absence of threatening sounds. Each element compounds the others — together they signal total safety to your nervous system."
            }
        ]
    },
    {
        title: "Module A: Advanced",
        type: "practice",
        desc: "The Energetic Alignment & Conscious Unwind",
        longDescription: "Now we move from preventing bad sleep to actively cultivating great sleep. This module uses intentional practices to align your biology and energy field with the sleep state. THE VICTORY: Waking up feeling not just rested, but renewed and emotionally balanced. The beginning of vivid dream recall.",
        sections: [
            { title: "The 4 Pillars Overview", text: "1. Circadian Rhythm Mastery (Morning AND Evening light management)\n2. The Pre-Sleep Meditation (4-7-8 Breathing or Body Scan)\n3. The Deep Journaling Session (Gratitude & Conscious Release)\n4. Advanced Frequency Integration (528Hz base + Theta overlay)" }
        ],
        checklist: [
            "Get 10-15 mins late afternoon sun",
            "Use dim, amber-toned lights after sunset",
            "Practice 4-7-8 breathing (5 reps)",
            "10-min body scan or meditation in bed",
            "Journal: 3 gratitudes, 1 release",
            "Layer audio: 528Hz base + Theta overlay"
        ],
        commandments: [
            {
                name: "Circadian Rhythm Mastery",
                rule: "Beyond morning light, manage your evening light environment. Use dim, amber-toned lights after sunset. Get 10-15 minutes of late afternoon sunlight to signal the biological 'end of the day' and prime melatonin production. Install blue-light blocking glasses for post-sunset screen use. Avoid overhead fluorescent lighting in the hours before bed.",
                why: "You are fine-tuning your master SCN clock by managing both the 'ON' signal (morning light) and the 'OFF' signal (evening amber light and darkness). This creates a steeper, more powerful wave of melatonin release and a sharper cortisol transition — resulting in faster sleep onset and more consolidated, deeper sleep cycles throughout the night."
            },
            {
                name: "The Pre-Sleep Meditation",
                rule: "A 10-minute guided body scan or 4-7-8 breathing exercise, performed in bed immediately before sleep. 4-7-8 Method: Inhale through the nose for 4 counts. Hold the breath for 7 counts. Exhale completely through the mouth for 8 counts. Repeat 5 full cycles.",
                why: "This directly and physiologically switches your nervous system from Sympathetic (fight-or-flight, elevated cortisol) to Parasympathetic (rest-and-digest) mode. The extended exhale specifically activates the vagus nerve, triggering a cascade of calming neurotransmitters including GABA and acetylcholine. It is not a suggestion to relax — it is a hardware-level command to your nervous system."
            },
            {
                name: "The Deep Journaling Session",
                rule: "During your wind-down ritual (ideally not in bed), spend 10-15 minutes with a 'Gratitude and Release' journal. Write three specific things you are genuinely grateful for from today — details matter. Write one thing — a worry, a resentment, or a stress — that you are consciously choosing to release for the night.",
                why: "This doesn't just empty the mind. It actively reprograms the emotional tone of your nervous system before sleep. You end the day on a frequency of gratitude and conscious release rather than unresolved stress. Research on gratitude journaling shows it measurably increases slow-wave sleep time and reduces pre-sleep cognitive arousal — the anxious mental spinning that delays sleep."
            },
            {
                name: "Advanced Frequency Integration",
                rule: "Layer your audio environment. Start with a base frequency of 528Hz (associated with cellular repair and heart coherence). Add an overlay of Theta binaural beats (4-7 Hz), which guide your brain directly into the hypnagogic threshold — the liminal state between wakefulness and deep sleep. Use stereo headphones or properly positioned stereo speakers for the binaural effect to work.",
                why: "You are moving beyond simple relaxation into targeted neurological entrainment. The 528Hz frequency works on the emotional and cellular body while the Theta waves guide your brainwave state into the exact frequency range associated with creativity, subconscious access, and dream-state initiation. You are engineering your entry point into the deeper layers of sleep."
            }
        ]
    },
    {
        title: "Module P: Pro",
        type: "practice",
        desc: "Oneironaut's Gateway",
        longDescription: "You have mastered the body of sleep. Now, it is time to awaken the mind within the dream. This module is for becoming an active, conscious citizen of your own dreamscape. THE VICTORY: Consistent dream recall, reliable lucid dreaming, and using the dream state as a tool for deep self-discovery and subconscious dialogue.",
        sections: [
            { title: "Dream Toolkit Overview", text: "1. The Dream Journal Imperative (Record before moving — every fragment)\n2. Reality Checks (Nose Pinch & Finger Through Palm — 5-10x daily)\n3. Advanced Frequency for Lucidity (Theta + Gamma overlay)\n4. Dream Analysis Dialogue (Weekly symbol mining and subconscious interview)" }
        ],
        checklist: [
            "Keep journal by bed; record immediately upon waking",
            "Perform reality checks 5-10 times daily",
            "Set lucid dreaming intention before sleep",
            "Use Theta/Gamma frequency audio",
            "Weekly analysis: 'What does this symbol represent?'",
            "Practice MILD: 'I will recognize I'm dreaming'"
        ],
        commandments: [
            {
                name: "The Dream Journal Imperative",
                rule: "Keep a physical journal and pen on your nightstand. The very first action upon waking — before moving your body, before checking your phone, before speaking — is to write down everything you remember from your dreams. Every fragment, feeling, color, symbol, and character. Even writing 'I remember nothing' is a valid and important entry.",
                why: "This sends a powerful, repeated signal to your subconscious: 'My dreams are important. I am paying attention.' Within 1-2 weeks, this single practice dramatically increases both dream recall and vividness. Your subconscious begins to 'perform for the record-keeper.' It also builds the detailed archive you will mine for deep psychological insight in the analysis phase."
            },
            {
                name: "Reality Checks & Lucid Dream Induction",
                rule: "Perform 5-10 'reality checks' throughout your day with genuine curiosity and intent — not robotically. The Nose Pinch Check: Pinch your nose closed and try to breathe through it. In waking reality, this is impossible. In a dream, you will be able to breathe normally — triggering the recognition. The Finger Through Palm Check: Press the finger of one hand into the palm of the other and try to push it through. In a dream, it will pass through.",
                why: "By conditioning this critical habit in waking life, you eventually perform it inside a dream. The bizarre result — being able to breathe through a pinched nose — creates the unmistakable realization: 'I am dreaming.' This moment of clarity is the lucid state activating. The habit must be practiced with genuine questioning each time, asking yourself 'Am I dreaming right now?' as if you truly don't know."
            },
            {
                name: "Advanced Frequency for Lucidity",
                rule: "Use audio tracks specifically designed for lucid dreaming induction. These use binaural beats in the Theta range (4-7 Hz) to maintain sleep depth, paired with a Gamma overlay (40 Hz) that encourages high cortical awareness within the dream state. Apply with stereo headphones for proper binaural effect. Begin playing 30-60 minutes before target REM onset.",
                why: "Gamma brainwaves (40 Hz) are associated with conscious awareness, perception binding, and the 'aha moment' of insight. Theta waves (4-7 Hz) are the dominant frequency of REM sleep and the hypnagogic threshold. The combination creates the precise neurological sweet spot: the body remains in a sleep state while the mind achieves and sustains critical self-awareness — the definition of lucid dreaming."
            },
            {
                name: "Dream Analysis & Dialogue",
                rule: "Once per week, open your dream journal not to read a story, but to conduct an interview with your subconscious mind. For each significant recurring symbol — the chasing shadow, the crumbling building, the unknown figure, the animal, the childhood home — ask and write: 'What part of me does this symbol represent? What feeling does it carry? What is it trying to show me?'",
                why: "You are no longer just recording dreams — you are mining them for profound psychological and emotional intelligence. The recurring 'threatening figures' become teachers, pointing directly to where healing, integration, or release is needed. This is active participation in your own psycho-spiritual evolution, conducted in the language your subconscious already uses naturally."
            }
        ]
    },
    {
        title: "Module M: Master",
        type: "practice",
        desc: "Sovereign Architect",
        longDescription: "You have navigated the inner realms. You have made peace with your shadows and learned the language of your subconscious. Now you move from exploration to orchestration. The boundaries between sleep, dream, and wakefulness become deliberate choices, not imposed states. You are the conductor of your own consciousness. THE VICTORY: Conscious, willful projection of awareness and the ability to architect your inner reality with full intention.",
        sections: [
            { title: "Practices of Sovereignty Overview", text: "1. The Transcendental Gateway (Conscious Exit Protocol — Rope or Roll-Out)\n2. The Gamma Heart Coherence State (Love/Gratitude + 40Hz intention)\n3. The Blueprint of Manifestation (Astral design studio)\n4. The Akashic Resonance Scan (Soul-level information retrieval)\n5. Unified Resonance (Coherence broadcasting to the collective field)" }
        ],
        checklist: [
            "Practice astral projection prep (Rope/Roll-out)",
            "Master theta-state Mind Awake/Body Asleep",
            "Activate Heart Coherence (Love/Gratitude)",
            "Pair Coherence with Gamma (40Hz+) intention",
            "Create symbolic blueprints in Astral",
            "Perform Akashic Resonance Scan",
            "Practice Unified Resonance (Broadcast coherence)"
        ],
        commandments: [
            {
                name: "The Transcendental Gateway: Conscious Exit Protocol",
                rule: "This is the refined, intentional practice of Astral Projection — moved beyond chance or spontaneous occurrence. Employ a specific exit technique: the Rope Technique (visualize a rope above you and climb hand-over-hand with full sensation while in the Mind Awake/Body Asleep state), the Roll-Out method (feel yourself rolling sideways out of your physical body), or direct intention from a sustained deep Theta state. The essential condition is maintaining sharp mental clarity while the body falls completely asleep.",
                why: "This is the ultimate demonstration of mind-over-matter — the practical, experiential proof that consciousness is not confined to the physical brain. The goal is not simply to 'leave the body,' but to do so with the same deliberate intentionality as choosing to walk into another room. It proves, from the inside, that you are a non-local awareness temporarily inhabiting a physical form."
            },
            {
                name: "The Gamma Heart Coherence State",
                rule: "While in a deep meditative or pre-projection state, consciously activate a state of overwhelming, unconditional love and gratitude — generating genuine Heart Coherence through full emotional embodiment, not visualization alone. Then pair this emotional state with the deliberate intention to generate Gamma brainwave activity (40 Hz+). Hold both simultaneously: the coherent heart-field and the high-frequency aware mind.",
                why: "Energetically, this creates a coherent and highly resonant field — what many traditions call a 'light body.' It functions simultaneously as the vibrational key that unlocks higher-dimensional awareness and the protective field during non-physical travel. You are not projecting from fear or curiosity, but from a state of purified, coherent love — which acts as engine, compass, and shield."
            },
            {
                name: "The Blueprint of Manifestation",
                rule: "The Master uses the Astral State as a conscious design studio. Do not only observe — create. Willfully construct environments, summon symbolic representations of your intentions (a luminous health crystal, a completed creative work, a healed relationship, a realized vision), and imbue them with the full force of your coherent intention. Upon returning to waking consciousness, immediately anchor the blueprint with a specific physical action — however small — to bridge the energetic and physical.",
                why: "This bridges the gap between the non-physical realm of pure potential and the physical realm of manifest reality. By consciously engineering in the unmanifest state — which operates closer to pure energy and possibility — and then anchoring it with physical action, you are working with the most fundamental creative mechanics underlying all of reality."
            },
            {
                name: "The Akashic Resonance Scan",
                rule: "With a clear and focused question held in mind, enter the Sovereign State and learn to 'tune in' to the vibrational information field — not as reading a book, but as resonating with the energetic signature of a person, place, time, or pattern. The goal is to receive the soul lesson or energetic truth, not historical narrative or mental construct. Record every impression immediately upon returning to waking consciousness.",
                why: "This transforms you from a passive recipient of life's events into an active student of your soul's curriculum. It enables the resolution of recurring patterns and karmic loops by accessing their root cause at the energetic level — bypassing the layers of story, ego, and intellectual analysis to reach the living, felt truth of an experience."
            },
            {
                name: "Unified Resonance — Becoming a Node of Coherence",
                rule: "The ultimate Master practice. Hold your complete Gamma Heart Coherence state and consciously extend your coherent field outward — broadcasting it with the intention of contributing to collective healing, peace, or awakening. This is not visualization. It is the deliberate act of holding and radiating a stabilized, high-frequency state of consciousness into the world's energy field.",
                why: "The Master understands that personal sovereignty is not a destination, but a tool for the elevation of all. By becoming a stable, coherent node in the planetary energy field, you contribute to raising the baseline frequency of collective consciousness. Your individual awakening becomes a form of direct service to the world — light that others can navigate by."
            }
        ],
        teaching: "You are not a drop in the ocean. You are the entire ocean in a drop. The journey through sleep, dreams, and lucidity was the process of remembering this. Astral projection is not an escape from reality — it is a return to your native reality. The physical world is the localized, focused dream. Here, in the Sovereign State, you are no longer a human being trying to have a spiritual experience. You are a spiritual being, consciously and willfully directing a human experience. Your mission now is to build a bridge between these worlds — to bring the light of your limitless nature into the focused crucible of your physical life, and in so doing, light the way for others."
    }
];

// BIOHACKING_PROTOCOLS imported from appData

const NEXUS_MODULES = [
    { id: 'biohacking', name: 'Biohacking Hub', icon: Cpu, description: 'Optimize your biological hardware through ancestral protocols.', color: '#4A9EFF' },
    { id: 'cosmic', name: 'Cosmic Observatory', icon: Orbit, description: 'Monitor celestial movements and planetary resonance.', color: '#FFD700' },
    { id: 'frequency', name: 'Frequency Lab', icon: Activity, description: 'Advanced binaural beats and manifestation engine.', color: '#72A0FF' }
];

const NEXUS_MODULE_CONTENT = {

    cosmic: {
        title: "CELESTIAL DATA",
        items: [
            { id: 1, title: "Mercury Retrograde", value: "ACTIVE", desc: "Focus on internal review and digital cleanup." },
            { id: 2, title: "Solar Resonance", value: "5.4 Hz", desc: "Schumann resonance alignment currently high." },
            { id: 3, title: "Lunar Phase", value: "Waxing", desc: "Optimal window for intention setting." }
        ]
    },
    frequency: {
        title: "FREQUENCY ENGINE",
        items: [
            { id: 1, title: "Theta Waves", value: "4.5 Hz", desc: "Deep meditation and creative visualization." },
            { id: 2, title: "Solfeggio 528", value: "ON", desc: "DNA repair and transformation frequency." },
            { id: 3, title: "Delta Deep", value: "2.1 Hz", desc: "Restorative sleep and HGH release." }
        ]
    },
    // Updated Biohacking with reference to full protocols
    biohacking: {
        title: "BIOHACKING PROTOCOLS",
        isComplex: true, // Flag to trigger complex UI
        items: BIOHACKING_PROTOCOLS
    }
};

// Transform new MEDITATION_CATEGORIES into the flat structure expected by legacy code if needed,
// but we will mainly use objects.values in the new player logic.
const MEDITATION_TRACKS = {};
// Populate for backward compat if any, but we will mostly rely on the keys of MEDITATION_CATEGORIES
Object.values(MEDITATION_CATEGORIES).forEach(cat => {
    MEDITATION_TRACKS[cat.name] = cat.tracks;
});

const DAY_TRACKS = Object.values(MEDITATION_TRACKS).flat();




const DAILY_QUOTES = [
    { title: "SOLARIS", quote: "The sun does not shine for a few trees and flowers, but for the wide world's joy." },
    { title: "LUNA", quote: "The moon is a reminder that no matter what phase you are in, you are still whole." },
    { title: "CHRONOS", quote: "Time is not a predator, but a medium through which we flow like water." },
    { id: "AETHER", title: "AETHER", quote: "Your soul is the architect of the reality your body inhabits." },
    { title: "TERRA", quote: "Root your consciousness in the present, for that is the only place life exists." },
    { title: "IGNIS", quote: "The fire of transformation requires the courage to let go of the old self." },
    { title: "COSMOS", quote: "We are the universe experiencing itself through the lens of a human soul." }
];

const CommandOrb = ({ Icon, color, isActive }) => {
    return (
        <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center group/orb shrink-0">
            {/* Orbital Rings */}
            <div className={`absolute inset-0 border border-white/5 rounded-full transition-transform duration-1000 ${isActive ? 'scale-110' : 'group-hover/orb:scale-105'}`} />
            <div className={`absolute inset-0 border-t border-[var(--orb-color)]/30 rounded-full animate-[spin_8s_linear_infinite] opacity-40`} style={{ '--orb-color': color }} />
            <div className={`absolute inset-2 md:inset-4 border-b border-[var(--orb-color)]/20 rounded-full animate-[spin_12s_linear_reverse_infinite] opacity-30`} style={{ '--orb-color': color }} />

            {/* Core Glass Sphere */}
            <div
                className={`relative z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full border transition-all duration-700 ${isActive ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.10)]' : 'bg-white/5 border-white/10 group-hover/orb:bg-white/10 group-hover/orb:border-white/20'}`}
                style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: isActive ? `0 0 50px ${color}33, inset 0 0 20px ${color}44` : 'none'
                }}
            >
                <Icon
                    size={22}
                    strokeWidth={1.5}
                    className={`transition-all duration-700 md:w-7 md:h-7 ${isActive ? 'text-white' : 'text-white/40 group-hover/orb:text-white'}`}
                    style={{ filter: isActive ? `drop-shadow(0 0 10px ${color})` : 'none' }}
                />

                {/* Internal Glow */}
                <div className={`absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,var(--orb-color)_0%,transparent_70%)] opacity-0 transition-opacity duration-700 ${isActive ? 'opacity-30' : 'group-hover/orb:opacity-10'}`} style={{ '--orb-color': color }} />
            </div>

            {/* Satellite Beacon */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                <div className={`w-1 h-1 rounded-full transition-all duration-700 ${isActive ? 'bg-white shadow-[0_0_10px_white] scale-150' : 'bg-white/20'}`} />
            </div>
        </div>
    );
};

const TechSigil = ({ Icon, color, isExpanded }) => {
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <div className={`absolute inset-0 border border-white/5 rounded-lg rotate-45 transition-transform duration-700 ${isExpanded ? 'scale-125 opacity-40' : 'opacity-20'}`} />
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,var(--sig-color)_0%,transparent_80%)] opacity-0 transition-opacity duration-700 ${isExpanded ? 'opacity-40' : 'group-hover:opacity-10'}`} style={{ '--sig-color': color }} />
            <div className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 transition-all ${isExpanded ? 'bg-white/10 border-white/30' : 'bg-white/5'}`}>
                <Icon size={18} strokeWidth={1.5} className={`transition-all duration-700 ${isExpanded ? 'text-white' : 'text-white/40 group-hover:text-white'}`} style={{ filter: isExpanded ? `drop-shadow(0 0 5px ${color})` : 'none' }} />
            </div>
        </div>
    );
};

const SanctuarySigil = ({ Icon, isExpanded, id }) => {
    return (
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group/sanctuary shrink-0">
            {/* Orbital Rings */}
            <div className={`absolute inset-0 border border-[var(--realm-color)]/10 rounded-full ${isExpanded ? 'animate-[spin_10s_linear_infinite]' : 'group-hover/sanctuary:animate-[spin_15s_linear_infinite]'}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--realm-color)] rounded-full" style={{ boxShadow: '0 0 6px var(--realm-color)' }}></div>
            </div>

            {/* The Core Glass Container */}
            <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-700 ${isExpanded ? 'scale-110' : 'bg-white/5 border-white/10 group-hover/sanctuary:border-[var(--realm-color)]/30'}`}
                style={{
                    clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                    borderWidth: '1px',
                    background: isExpanded ? 'rgba(var(--realm-color-rgb, 217,75,30), 0.12)' : undefined,
                    borderColor: isExpanded ? 'var(--realm-color)' : undefined,
                }}
            >
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${isExpanded ? 'opacity-80' : 'group-hover/sanctuary:opacity-40'}`}
                    style={{ background: 'radial-gradient(circle at 50% 50%, var(--realm-color), transparent 70%)', opacity: undefined }}
                ></div>
                <Icon size={20} strokeWidth={1.2} className={`transition-all duration-700 ${isExpanded ? 'text-white' : 'text-white/40 group-hover/sanctuary:text-white'}`} />
            </div>
        </div>
    );
};

const HolographicPlayButton = ({ isPlaying, onClick, dayMode }) => {
    return (
        <button
            onClick={onClick}
            className="group relative w-14 h-14 flex items-center justify-center"
        >
            <div className={`absolute inset-0 border border-white/10 rounded-full ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'group-hover:animate-[spin_8s_linear_infinite]'}`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${dayMode ? 'bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.15)]' : 'bg-white/10 text-white border border-white/20 group-hover:bg-white/20'}`}>
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </div>
            <div className={`absolute inset-0 rounded-full bg-white/5 blur-xl transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
        </button>
    );
};

const SigilIcon = ({ className, type = "default" }) => {
    const sigilPaths = {
        default: (
            <>
                <path d="M50 10V90" stroke="currentColor" strokeWidth="2" />
                <path d="M10 50H90" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </>
        ),
        delta: (
            <>
                <path d="M50 15L25 75L75 75Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M50 30L35 60L65 60Z" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="1" />
            </>
        ),
        theta: (
            <>
                <path d="M50 10C70 30 70 70 50 90C30 70 30 30 50 10Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 50L80 50" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </>
        ),
        chakra: (
            <>
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
                <path d="M50 20V80M20 50H80M35 35L65 65M65 35L35 65" stroke="currentColor" strokeWidth="1" />
                <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" />
            </>
        ),
        astral: (
            <>
                <path d="M50 10L60 40L90 40L70 60L80 90L50 75L20 90L30 60L10 40L40 40Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            </>
        )
    };
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {sigilPaths[type] || sigilPaths.default}
        </svg>
    );
};

const MatrixVisualizer = ({ color = "#FF4500", background = "transparent" }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);
        const dotCount = 40;
        const rowCount = 12;
        let t = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dotSpacing = canvas.width / dotCount;
            const rowSpacing = canvas.height / (rowCount + 1);
            for (let row = 0; row < rowCount; row++) {
                const baseY = rowSpacing * (row + 1);
                for (let i = 0; i < dotCount; i++) {
                    const phase = (i / dotCount) * Math.PI * 2;
                    const amplitude = Math.sin(t + phase + row * 0.3);
                    const yOffset = amplitude * 10;
                    ctx.beginPath();
                    ctx.arc(i * dotSpacing + dotSpacing / 2, baseY + yOffset, 1, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.2 + Math.abs(amplitude) * 0.3;
                    ctx.fill();
                }
            }
            t += 0.05;
            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, [color]);
    return <canvas ref={canvasRef} className="w-full h-full opacity-40" />;
};



// --- COMPONENTS ---

const ParticleField = ({ mode, dayMode }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);
        camera.position.z = 30;

        const count = 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
            sizes[i] = Math.random() * 0.4 + 0.1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const getCircleTexture = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(16, 16, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
        };

        const material = new THREE.PointsMaterial({
            size: 0.4, // Increased size for better visibility with texture
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            map: getCircleTexture(),
            depthWrite: false, // Better for particle sorting
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        let time = 0;
        const targetColor = new THREE.Color(REALMS[mode].color);
        const currentColor = new THREE.Color(REALMS[mode].color);

        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.005;

            // Dynamic Color Logic for Day/Night
            if (dayMode) {
                targetColor.set(REALMS[mode].colorLight || REALMS[mode].color);
            } else {
                targetColor.set(REALMS[mode].color);
            }

            currentColor.lerp(targetColor, 0.03);

            const positions = particles.geometry.attributes.position.array;
            const colors = particles.geometry.attributes.color.array;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                colors[i3] = currentColor.r;
                colors[i3 + 1] = currentColor.g;
                colors[i3 + 2] = currentColor.b;

                if (REALMS[mode].particleMode === 'float') {
                    positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.01;
                    positions[i3] += Math.cos(time + positions[i3 + 1]) * 0.01;
                } else if (REALMS[mode].particleMode === 'spiral') {
                    const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
                    const angle = time * 0.2 + radius * 0.05;
                    positions[i3] = Math.cos(angle + i) * radius;
                    positions[i3 + 2] = Math.sin(angle + i) * radius;
                } else if (REALMS[mode].particleMode === 'rise') {
                    positions[i3 + 1] += 0.08;
                    if (positions[i3 + 1] > 60) positions[i3 + 1] = -60;
                }
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.color.needsUpdate = true;
            particles.rotation.y = time * 0.05;
            renderer.render(scene, camera);
        };

        animate();
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) mountRef.current.innerHTML = '';
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, [mode]);

    return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const FrequencyVisualizer = ({ isActive, color }) => {
    return (
        <div className="flex items-center gap-[2px] h-6 px-3">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={isActive ? { height: [4, 16, 8, 20, 4] } : { height: 4 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    className="w-[2px] rounded-full"
                    style={{ backgroundColor: color || '#fff', opacity: isActive ? 0.8 : 0.2 }}
                />
            ))}
        </div>
    );
};

const MasterHeader = ({ realm, dayMode, setDayMode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIdx, setTrackIdx] = useState(0);
    const [selectedCategoryKey, setSelectedCategoryKey] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const audioRef = useRef(new Audio());

    const effectiveCategoryKey = useMemo(() => {
        if (selectedCategoryKey) {
            if (dayMode && MEDITATION_CATEGORIES[selectedCategoryKey]) return selectedCategoryKey;
            if (!dayMode && SLEEP_CATEGORIES[selectedCategoryKey]) return selectedCategoryKey;
        }
        return dayMode
            ? Object.keys(MEDITATION_CATEGORIES)[0]
            : Object.keys(SLEEP_CATEGORIES)[0];
    }, [dayMode, selectedCategoryKey]);

    useEffect(() => {
        if (selectedCategoryKey !== effectiveCategoryKey) {
            setSelectedCategoryKey(effectiveCategoryKey);
            setTrackIdx(0);
            setIsPlaying(false);
        }
    }, [effectiveCategoryKey, selectedCategoryKey]);

    const currentPlaylist = useMemo(() => {
        if (!effectiveCategoryKey) return [];
        if (dayMode) {
            return MEDITATION_CATEGORIES[effectiveCategoryKey]?.tracks || [];
        } else {
            return SLEEP_CATEGORIES[effectiveCategoryKey] || [];
        }
    }, [dayMode, effectiveCategoryKey]);

    useEffect(() => {
        const track = currentPlaylist[trackIdx];
        if (!track) return;

        const currentSrc = audioRef.current.src;
        if (currentSrc !== track.url) {
            audioRef.current.src = track.url;
            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            }
        }
    }, [trackIdx, currentPlaylist, isPlaying]);

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Play error:", e));
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const togglePlayback = (e) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };

    const currentTrack = currentPlaylist[trackIdx];
    const catDetails = dayMode && effectiveCategoryKey ? MEDITATION_CATEGORIES[effectiveCategoryKey] : { name: effectiveCategoryKey };

    return (
        <header
            className="fixed left-0 right-0 z-[100] flex flex-col items-center pointer-events-none"
            style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
        >
            <motion.div
                initial={false}
                animate={{
                    width: isExpanded ? '100%' : 'min(320px, calc(100vw - 2rem))',
                    maxWidth: isExpanded ? '900px' : '320px',
                    height: isExpanded ? 'auto' : '56px'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`pointer-events-auto relative overflow-hidden backdrop-blur-3xl border border-white/10 shadow-[0_12px_48px_rgba(0,0,0,0.25)] transition-all duration-700 ${isExpanded ? 'rounded-2xl bg-black/80 p-1 pt-1' : 'rounded-full bg-white/5 hover:bg-white/10'}`}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                onTouchStart={() => setIsExpanded(prev => !prev)}
            >
                {/* HUD Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

                <div className={`flex flex-col w-full h-full transition-all duration-500`}>

                    {/* TOP HUD BAR - Primary Controls */}
                    <div className="flex items-center justify-between px-4 h-[54px] min-h-[54px]">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <HolographicPlayButton isPlaying={isPlaying} onClick={togglePlayback} dayMode={dayMode} />
                                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500/40'}`}></div>
                            </div>

                            <div className="flex flex-col min-w-[80px]">
                                <span className="font-[Orbitron] text-[11px] md:text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">
                                    {isExpanded ? 'Neural Stream: Active' : 'Frequency Node'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`font-[Orbitron] text-[13px] md:text-[11px] font-bold text-white truncate max-w-[140px] tracking-widest ${isPlaying ? 'text-[#72A0FF]' : ''}`}>
                                        {currentTrack?.name || "Initializing..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isExpanded && (
                                <FrequencyVisualizer isActive={isPlaying} color={realm.color} />
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); setDayMode(!dayMode); }}
                                className={`w-10 h-10 rounded-full border border-white/5 flex items-center justify-center transition-all ${dayMode ? 'bg-[#FFD700]/10 text-[#FFD700]' : 'bg-[#72A0FF]/10 text-[#72A0FF]'}`}
                            >
                                {dayMode ? <Sun size={14} /> : <Moon size={14} />}
                            </button>

                            {isExpanded && (
                                <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                                    <button onClick={() => setTrackIdx(p => p > 0 ? p - 1 : currentPlaylist.length - 1)}>
                                        <SkipBack size={16} className="text-white/40 hover:text-white" />
                                    </button>
                                    <button onClick={() => setTrackIdx(p => (p + 1) % currentPlaylist.length)}>
                                        <SkipForward size={16} className="text-white/40 hover:text-white" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                        className="ml-2 p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all transform hover:-translate-y-0.5"
                                        title="Collapse HUD"
                                    >
                                        <ChevronUp size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* EXPANDED CONTENT: HUD MODULES */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="px-4 pb-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                                    {/* Selector Module */}
                                    <div className="md:col-span-3 bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3">
                                        <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.3em] text-white/30 uppercase border-b border-white/5 pb-2">
                                            <span>Module_Config_II</span>
                                            <span>ID: {effectiveCategoryKey?.substring(0, 8)}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(dayMode ? Object.values(MEDITATION_CATEGORIES) : Object.keys(SLEEP_CATEGORIES)).map(cat => {
                                                const catId = dayMode ? cat.id : cat;
                                                const catName = dayMode ? cat.name : cat;
                                                const active = effectiveCategoryKey === catId;
                                                return (
                                                    <button
                                                        key={catId}
                                                        onClick={() => setSelectedCategoryKey(catId)}
                                                        className={`relative px-4 py-2 border transition-all truncate text-[9px] font-[Orbitron] tracking-widest uppercase ${active
                                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}
                                                    >
                                                        {catName}
                                                        {active && (
                                                            <div className="absolute -top-1 -left-1 w-1 h-1 bg-white rotate-45"></div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Telemetry Module */}
                                    <div className="bg-[#72A0FF]/5 border border-[#72A0FF]/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
                                        <div className="font-mono text-[8px] tracking-[0.3em] text-[#72A0FF]/60 uppercase mb-1 w-full text-center">Telemetry</div>
                                        <FrequencyVisualizer isActive={isPlaying} color="#72A0FF" />
                                        <div className="text-[10px] font-bold text-[#72A0FF] font-mono tracking-tighter">
                                            {currentTrack?.freq || 'SYNC...'}
                                        </div>
                                    </div>
                                </div>

                                {/* HUD Footer Decor */}
                                <div className="mt-4 flex justify-between items-center opacity-20 pointer-events-none">
                                    <div className="flex gap-2">
                                        {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 bg-white rounded-full"></div>)}
                                    </div>
                                    <div className="font-mono text-[7px] tracking-[0.5em] text-white">INSTRUMENTATION_SYS_V4.02</div>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-white/40 to-transparent mx-4"></div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </header>
    );
};

const PrecisionTimeHUD = ({ habit, onConfirm, onCancel }) => {
    const [hours, setHours] = useState('08');
    const [minutes, setMinutes] = useState('00');

    const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteOptions = ['00', '15', '30', '45'];

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 p-4">
            <div className="glass-card p-6 md:p-10 max-w-sm w-full border border-[var(--realm-color)]/30 rounded-3xl relative shadow-[0_0_40px_rgba(0,0,0,0.30)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--realm-color)] to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <span className="text-[10px] font-mono text-[var(--realm-color)] tracking-[0.4em] uppercase mb-2 block">TEMPORAL_CALIBRATION</span>
                    <h3 className="font-[Orbitron] text-xl text-white font-black tracking-widest uppercase">{habit.name}</h3>
                </div>

                <div className="flex justify-center items-center gap-4 mb-10">
                    <div className="flex flex-col gap-2">
                        <span className="text-[8px] font-mono text-white/20 text-center uppercase">HOUR</span>
                        <select
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-[Orbitron] text-white focus:outline-none focus:border-[var(--realm-color)] appearance-none text-center cursor-pointer hover:bg-white/10 transition-all"
                        >
                            {hourOptions.map(h => <option key={h} value={h} className="bg-[#111]">{h}</option>)}
                        </select>
                    </div>
                    <span className="text-2xl font-[Orbitron] text-white/20 pt-6">:</span>
                    <div className="flex flex-col gap-2">
                        <span className="text-[8px] font-mono text-white/20 text-center uppercase">MIN</span>
                        <select
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-[Orbitron] text-white focus:outline-none focus:border-[var(--realm-color)] appearance-none text-center cursor-pointer hover:bg-white/10 transition-all"
                        >
                            {minuteOptions.map(m => <option key={m} value={m} className="bg-[#111]">{m}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onConfirm(`${hours}:${minutes}`)}
                        className="w-full py-4 bg-[var(--realm-color)] text-black font-[Orbitron] font-black tracking-[0.3em] text-[10px] rounded-xl shadow-[0_0_18px_rgba(217,75,30,0.14)] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        SYNC_ALARM_GATE
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-3 bg-white/5 text-white/40 font-[Orbitron] font-black tracking-widest text-[9px] rounded-xl hover:text-white transition-all"
                    >
                        ABORT_CALIBRATION
                    </button>
                </div>
            </div>
        </div>
    );
};

const RealmNavigator = ({ realm, onScrollTo }) => {
    if (realm === 'TEMPLE') return null;

    const navItems = realm === 'SANCTUARY' ? [
        { id: 'sanctuary-assistant', label: 'ASSISTANT', icon: Mic },
        { id: 'sanctuary-journal', label: 'JOURNAL', icon: PenLine },
        { id: 'sanctuary-library', label: 'LIBRARY', icon: Brain },
    ] : [
        { id: 'nexus-observatory', label: 'OBSERVATORY', icon: Globe },
        { id: 'nexus-oracle', label: 'ORACLE', icon: Sparkles },
        { id: 'nexus-library', label: 'BIO-LAB', icon: Activity },
    ];

    return (
        <div className="fixed top-24 md:top-32 left-4 md:left-8 z-[150] flex flex-col gap-3 group/nav animate-in slide-in-from-top duration-1000">
            <button className="w-12 h-12 rounded-xl bg-black/60 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[var(--realm-color)] transition-all shadow-2xl group/btn">
                <List size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                <div className="absolute left-14 opacity-0 group-hover/btn:opacity-100 transition-opacity bg-black/80 px-3 py-1 rounded text-[8px] font-mono tracking-widest text-white border border-white/10 whitespace-nowrap pointer-events-none uppercase">REALM_NAVIGATOR</div>
            </button>
            <div className="flex flex-col gap-2 opacity-0 group-hover/nav:opacity-100 transition-all duration-500 transform -translate-y-4 group-hover/nav:translate-y-0">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onScrollTo(item.id)}
                        className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/5 p-2 rounded-xl text-white/40 hover:text-[var(--realm-color)] hover:border-[var(--realm-color)]/30 transition-all hover:scale-110"
                    >
                        <item.icon size={16} />
                        <span className="text-[9px] font-[Orbitron] font-black tracking-widest hidden md:block">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const SanctuaryDashboard = ({ isActive }) => {
    const [messages, setMessages] = useState([{ role: 'ai', text: 'Welcome to the Sanctuary. I\'m your Sleep & Consciousness guide — ask me anything about sleep quality, dream analysis, lucid dreaming, supplements, circadian rhythms, or any sleep challenge you\'re facing. What would you like to explore?' }]);
    const [chatInput, setChatInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [journalEntries, setJournalEntries] = useState(() => JSON.parse(localStorage.getItem('innersync_dream_journal') || '[]'));
    const [showJournal, setShowJournal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const scrollRef = useRef(null);
    const webSpeechRef = useRef(null);
    const transcriptRef = useRef('');
    const messagesRef = useRef(messages);

    useEffect(() => { messagesRef.current = messages; }, [messages]);

    const handleSaveJournal = () => {
        if (!journalEntry.trim()) return;
        const newEntry = { id: Date.now(), date: new Date().toISOString(), content: journalEntry.trim() };
        const updated = [newEntry, ...journalEntries];
        setJournalEntries(updated);
        localStorage.setItem('innersync_dream_journal', JSON.stringify(updated));
        setJournalEntry('');
        handleSendMessage(`I had this dream: ${newEntry.content}`);
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSendMessage = async (text = chatInput) => {
        if (!text.trim()) return;
        setChatInput('');

        // Snapshot current history before updating state (avoids stale closure)
        const priorMessages = messagesRef.current
            .filter(m => m.text && m.text !== '...')
            .map(m => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                content: m.text
            }));
        priorMessages.push({ role: 'user', content: text });

        setMessages(prev => [...prev, { role: 'user', text }, { role: 'ai', text: '...' }]);

        try {
            let aiResponse = "";
            await InvokeLLMStream({
                prompt: text,
                context: {},
                workflow: 'dream',
                messages: priorMessages,
                onChunk: (chunk) => {
                    aiResponse += chunk;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: 'ai', text: aiResponse };
                        return updated;
                    });
                }
            });
        } catch (err) {
            console.error(err);
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'ai', text: 'Connection error. Please try again.' };
                return updated;
            });
        }
    };

    const handleMicToggle = async () => {
        const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
        if (isNative) {
            try {
                if (isRecording) {
                    await SpeechRecognition.stop();
                    await SpeechRecognition.removeAllListeners();
                    setIsRecording(false);
                } else {
                    const perm = await SpeechRecognition.requestPermissions();
                    if (perm.speechRecognition !== 'granted') return;

                    // Always clean up existing listeners before adding new ones
                    await SpeechRecognition.removeAllListeners();

                    await SpeechRecognition.start({
                        language: 'en-US',
                        partialResults: true,
                    });
                    setIsRecording(true);

                    SpeechRecognition.addListener('partialResults', (data) => {
                        if (data.matches && data.matches.length > 0) {
                            setChatInput(data.matches[0]);
                        }
                    });

                    SpeechRecognition.addListener('results', (data) => {
                        if (data.matches && data.matches.length > 0) {
                            const result = data.matches[0];
                            setChatInput('');
                            setIsRecording(false);
                            SpeechRecognition.removeAllListeners();
                            handleSendMessage(result);
                        }
                    });
                }
            } catch (err) { console.error(err); setIsRecording(false); }
        } else {
            // Real Web Speech API
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognitionAPI) {
                setChatInput('Speech recognition is not supported in this browser. Please type your message.');
                return;
            }

            if (isRecording && webSpeechRef.current) {
                webSpeechRef.current.stop();
                return;
            }

            const recognition = new SpeechRecognitionAPI();
            recognition.lang = 'en-US';
            recognition.interimResults = true;
            recognition.continuous = false;
            webSpeechRef.current = recognition;

            recognition.onstart = () => setIsRecording(true);

            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(r => r[0].transcript)
                    .join('');
                setChatInput(transcript);
                transcriptRef.current = transcript;
            };

            recognition.onend = () => {
                setIsRecording(false);
                webSpeechRef.current = null;
                const final = transcriptRef.current;
                transcriptRef.current = '';
                if (final.trim()) {
                    setChatInput('');
                    handleSendMessage(final);
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
                webSpeechRef.current = null;
                transcriptRef.current = '';
            };

            recognition.start();
        }
    };

    return (
        <div className={`dashboard-container ${isActive ? 'active' : ''}`}>
            <div className="absolute -top-20 left-0 right-0 h-40 pointer-events-none overflow-hidden">
                <MatrixVisualizer color="var(--realm-color)" />
            </div>
            <div className="max-w-4xl mx-auto space-y-12">

                {/* INSTRUCTIONAL TITLE */}
                <h2 className="text-center font-[Orbitron] text-xs font-bold text-white/50 tracking-[0.2em] uppercase animate-pulse">
                    Scroll down for Sovereign Sleep Library and Dream Journal
                </h2>

                {/* DREAM ASSISTANT SECTION */}
                <div id="sanctuary-assistant" className="glass-card flex flex-col border border-white/10 shadow-3xl bg-black/40 backdrop-blur-3xl" style={{ height: 'min(600px, 70dvh)' }}>
                    <div className="flex justify-between items-center p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[var(--realm-color)] animate-ping" />
                            <h3 className="font-[Orbitron] text-lg text-white font-black tracking-widest">SLEEP ASSISTANT <span className="text-[10px] opacity-40 ml-2 font-mono">v4.0</span></h3>
                        </div>
                        <div className="flex gap-4">
                            <History size={18} className="text-white/30 cursor-pointer hover:text-[var(--realm-color)] transition-colors" />
                            <Trash2 size={18} className="text-white/30 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setMessages([])} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar" ref={scrollRef} style={{ WebkitOverflowScrolling: 'touch' }}>
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-6 py-4 rounded-2xl text-[13px] leading-relaxed transition-all duration-500 animate-fade-in ${m.role === 'user'
                                    ? 'bg-gradient-to-br from-[var(--realm-color)] to-[var(--secondary-color)] text-black font-semibold shadow-lg'
                                    : 'bg-white/5 text-white/90 border border-white/10 backdrop-blur-md'
                                    }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-black/40 border-t border-white/5">
                        <div className="flex gap-4 items-center">
                            <button
                                onClick={handleMicToggle}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isRecording
                                    ? 'bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.22)] scale-95'
                                    : 'bg-white/5 text-[var(--realm-color)] hover:bg-white/10 hover:shadow-[0_0_15px_var(--realm-color)]'
                                    }`}
                            >
                                {isRecording ? <Mic size={24} /> : <MicOff size={24} />}
                            </button>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask about sleep, dreams, supplements, protocols..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[var(--realm-color)] transition-colors placeholder:text-white/20"
                                />
                                <button
                                    onClick={() => handleSendMessage()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[var(--realm-color)] transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DREAM JOURNAL SECTION */}
                <div id="sanctuary-journal" className="glass-card flex flex-col p-8 border border-white/10 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <PenLine size={24} className="text-[var(--realm-color)]" />
                            <h3 className="font-[Orbitron] text-lg text-white font-black tracking-widest">DREAM JOURNAL</h3>
                        </div>
                        <button onClick={() => setShowJournal(!showJournal)} className="text-[10px] font-mono text-white/40 hover:text-[var(--realm-color)] transition-colors tracking-widest uppercase px-4 py-2 bg-white/5 rounded-lg">
                            {showJournal ? '+ NEW ENTRY' : 'VIEW RECORDS'}
                        </button>
                    </div>

                    {!showJournal ? (
                        <div className="flex flex-col gap-6">
                            <textarea
                                value={journalEntry}
                                onChange={(e) => setJournalEntry(e.target.value)}
                                placeholder="Record your dream fragments... The subconscious speaks in symbols."
                                className="w-full min-h-[200px] bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-[var(--realm-color)] transition-all resize-none placeholder:text-white/20"
                            />
                            <button
                                onClick={handleSaveJournal}
                                className="bg-[var(--realm-color)] text-black font-[Orbitron] font-black py-5 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-[0_0_20px_var(--realm-color)] uppercase tracking-widest text-xs"
                            >
                                LOG DREAM PROTOCOL
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {journalEntries.length === 0 ? (
                                <div className="text-center py-20 text-white/20 text-xs font-mono tracking-widest">NO DATA STREAMS LOGGED</div>
                            ) : (
                                journalEntries.map(entry => (
                                    <div key={entry.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="text-[11px] md:text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
                                                {new Date(entry.date).toLocaleString()}
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-[var(--realm-color)] opacity-40 shadow-[0_0_5px_var(--realm-color)]" />
                                        </div>
                                        <p className="text-[13px] text-white/80 leading-relaxed font-medium">{entry.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* LIBRARY SECTION */}
                <div id="sanctuary-library" className="glass-card p-5 md:p-8 border border-white/10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-[var(--realm-color)]/10 text-[var(--realm-color)] border border-[var(--realm-color)]/20 shadow-[0_0_20px_var(--realm-color)]/20">
                            <Brain size={24} />
                        </div>
                        <div>
                            <h3 className="font-[Orbitron] text-xl font-black text-white tracking-widest">SOVEREIGN LIBRARY</h3>
                            <span className="text-[11px] md:text-[9px] font-black text-white/30 tracking-[0.2em] uppercase">NEURAL UPGRADE PROTOCOLS</span>
                        </div>
                    </div>

                    {/* LIBRARY OVERLAY */}
                    {selectedCourse && (
                        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl overflow-y-auto p-6 md:p-12 animate-in fade-in zoom-in duration-500">
                            <div className="max-w-4xl mx-auto">
                                <button onClick={() => setSelectedCourse(null)} className="mb-12 flex items-center gap-2 text-white/40 hover:text-white font-[Orbitron] text-[10px] tracking-widest uppercase transition-all">
                                    <ArrowLeft size={16} /> EXIT_LIBRARY_MOD
                                </button>

                                <div className="space-y-12">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
                                        <div className="flex items-center gap-6">
                                            <SanctuarySigil Icon={selectedCourse.type === 'practice' ? Activity : BookOpen} isExpanded={true} id="course" />
                                            <div>
                                                <div className="text-[10px] font-mono text-[var(--realm-color)]/60 uppercase tracking-[0.4em] mb-3">MODULE_{selectedCourse.type.toUpperCase()} // INTEL</div>
                                                <h1 className="font-[Orbitron] text-3xl md:text-5xl font-black text-white tracking-widest uppercase leading-tight">{selectedCourse.title}</h1>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-white/20 font-mono text-[9px] tracking-[0.4em] uppercase">
                                            <span>TELEMETRY_STREAM</span>
                                            <div className="w-12 h-[1px] bg-white/10 animate-pulse"></div>
                                            <span>AUTH_SOVEREIGN</span>
                                        </div>
                                    </div>

                                    <div className="prose-intel max-w-none">
                                        <div className="wisdom-dossier-card mb-12">
                                            <div className="data-stream-glow"></div>
                                            <p className="text-lg md:text-xl text-[var(--realm-color)] font-light leading-relaxed italic m-0">
                                                {selectedCourse.longDescription}
                                            </p>
                                        </div>

                                        {selectedCourse.sections && selectedCourse.sections.map((section, idx) => (
                                            <div key={idx} className="mb-12">
                                                <h3 className="text-left mb-6 flex items-center gap-4 text-lg md:text-xl tracking-widest">
                                                    <span className="text-[var(--realm-color)] font-mono text-sm">0{idx + 1}</span> {section.title}
                                                </h3>
                                                <p className="text-white/60 leading-relaxed text-sm md:text-base whitespace-pre-line">{section.text}</p>
                                            </div>
                                        ))}

                                        {selectedCourse.commandments && (
                                            <div className="mt-4 space-y-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--realm-color)]/20"></div>
                                                    <span className="font-[Orbitron] text-[9px] font-black text-[var(--realm-color)]/60 tracking-[0.4em] uppercase">Full Protocols</span>
                                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[var(--realm-color)]/20"></div>
                                                </div>
                                                {selectedCourse.commandments.map((cmd, idx) => (
                                                    <div key={idx} className="border-l-2 border-[var(--realm-color)]/30 pl-6 space-y-4">
                                                        <h4 className="font-[Orbitron] text-sm md:text-base font-black text-white tracking-wide">{cmd.name}</h4>
                                                        <div>
                                                            <span className="text-[11px] md:text-[9px] font-mono font-black text-[var(--realm-color)] tracking-[0.3em] uppercase">Protocol</span>
                                                            <p className="text-white/70 text-sm leading-relaxed mt-2">{cmd.rule}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-[11px] md:text-[9px] font-mono font-black text-white/30 tracking-[0.3em] uppercase">Why It Works</span>
                                                            <p className="text-white/45 text-sm leading-relaxed mt-2 italic">{cmd.why}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedCourse.teaching && (
                                            <div className="mt-16 p-8 border border-[var(--realm-color)]/15 bg-[var(--realm-color)]/5 rounded-2xl">
                                                <div className="text-[9px] font-mono font-black text-[var(--realm-color)]/50 tracking-[0.4em] uppercase mb-4">Sovereign Transmission</div>
                                                <p className="text-white/60 text-sm md:text-base leading-loose italic">{selectedCourse.teaching}</p>
                                            </div>
                                        )}

                                        <div className="mt-20 flex flex-col items-center gap-8">
                                            <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[var(--realm-color)]/30 to-transparent"></div>
                                            <button
                                                onClick={() => setSelectedCourse(null)}
                                                className="group relative px-10 md:px-20 py-4 border border-[var(--realm-color)]/20 bg-transparent transition-all hover:border-[var(--realm-color)] hover:shadow-[0_0_28px_rgba(217,75,30,0.10)] rounded-none"
                                            >
                                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="relative z-10 font-[Orbitron] text-[10px] tracking-[0.6em] text-[var(--realm-color)] group-hover:text-white transition-colors">
                                                    COMPLETE_NEURAL_UPLOAD
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {LIBRARY_COURSES.map((course, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedCourse(course)}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[var(--realm-color)]/50 hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <SanctuarySigil Icon={course.type === 'practice' ? Activity : BookOpen} isExpanded={false} id={i} />
                                        <span className="text-[10px] font-mono font-black text-white/20 group-hover:text-[var(--realm-color)] uppercase tracking-widest transition-colors">{course.title.split(' ')[0]}</span>
                                    </div>
                                    <h4 className="font-[Orbitron] text-sm font-black text-white mb-3 tracking-widest">{course.title}</h4>
                                    <p className="text-[11px] text-white/40 group-hover:text-white/60 font-medium leading-relaxed transition-colors mb-6">{course.desc}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-[10px] font-mono font-black text-white/20 uppercase tracking-widest">{course.type}</span>
                                    <div className="flex items-center gap-2 text-[var(--realm-color)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-black tracking-widest">OPEN</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CUSTOM ICONS ---
const AnkhIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2C9.243 2 7 4.243 7 7c0 2.158 1.36 4.015 3.266 4.706C10.666 11.83 11 12.203 11 13v7h2v-7c0-.797.334-1.17 1.734-1.294C16.64 11.015 18 9.158 18 7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3-1.346 3-3 3-3-1.346-3-3z" />
        <line x1="8" y1="13" x2="16" y2="13" />
    </svg>
);

const OmIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s-2.5-4-6-6-3.5-6-3.5-8c0-4.5 4.5-8 9.5-8s9.5 3.5 9.5 8c0 2-3.5 6-6 6-3.5 2-3.5 8-3.5 8z" stroke="none" />
        {/* Simplified Om representation for scalability - using a stylized curve or the actual Om if complex path is available. Replacing with a symbolic representation for now to match lucide style */}
        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 6v6m6-9c2 0 4-2 4-5" />
    </svg>
);

// Better Om path
const OmSymbol = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3a6 6 0 0 1 6 6c0 1.5-.5 3-1.5 4" />
        <path d="M8.5 3.5c-2 1-3.5 3-3.5 5.5A5 5 0 0 0 9 13.5h.5" />
        <path d="M12 13.5v7" />
        <path d="M16 16.5c2 0 4-1.5 4-3.5" />
    </svg>
);

// Improved Nexus Dashboard with reordered Cosmic Observatory
const NexusDashboard = ({ isActive }) => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [showBriefing, setShowBriefing] = useState(false);
    const [briefingData, setBriefingData] = useState(null);

    // Initial Briefing Load
    useEffect(() => {
        // Generate real-time briefing
        const briefing = CosmicIntelligence.generateBriefing(new Date());
        setBriefingData({
            title: `DAILY ALIGNMENT | ${briefing.date.toLocaleDateString()}`,
            content: briefing.message,
            theme: briefing.theme,
            moonStats: `${briefing.moon.name} (${Math.round(briefing.moon.fraction * 100)}%)`
        });

        // Send native notification only once per day
        const today = new Date().toDateString();
        const lastBriefingNotify = localStorage.getItem('innersync_last_briefing_notify');

        if (lastBriefingNotify !== today) {
            NotificationService.sendNotification(
                "Cosmic Alignment Ready",
                `Theme: ${briefing.theme}. ${briefing.message.slice(0, 80)}...`
            );
            localStorage.setItem('innersync_last_briefing_notify', today);
        }
    }, []);
    const [showPlayerInfo, setShowPlayerInfo] = useState(false);
    const [showMeditationLevels, setShowMeditationLevels] = useState(false);

    // --- COSMIC OBSERVATORY STATE ---
    const [showObservatory, setShowObservatory] = useState(false);
    const [simulationDate, setSimulationDate] = useState(new Date());
    const [selectedBody, setSelectedBody] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentView, setCurrentView] = useState('3d');
    const [loadingBriefing, setLoadingBriefing] = useState(true); // Keep for internal observatory state if needed, or rely on parent briefingData

    // Playback Loop for Observatory
    useEffect(() => {
        let interval;
        if (isPlaying && showObservatory) {
            interval = setInterval(() => {
                setSimulationDate(prev => {
                    const next = new Date(prev);
                    next.setDate(next.getDate() + 1);
                    return next;
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isPlaying, showObservatory]);

    const cosmicEvents = [
        {
            id: 1,
            name: 'Full Moon in Leo',
            date: '2025-02-09',
            daysUntil: 12,
            type: 'lunar',
            significance: 'Peak creative energy, self-expression, and leadership qualities amplified',
            recommendations: [
                { type: 'meditation', text: 'Heart Chakra Opening Meditation' },
                { type: 'frequency', text: '528 Hz Heart Coherence Track' },
                { type: 'practice', text: 'Creative Expression Ritual' }
            ]
        },
        {
            id: 2,
            name: 'Mercury Retrograde Begins',
            date: '2025-03-15',
            daysUntil: 46,
            type: 'planetary',
            significance: 'Time for reflection, review, and inner recalibration. Avoid major decisions.',
            recommendations: [
                { type: 'meditation', text: 'Stillness & Inner Listening' },
                { type: 'frequency', text: '7.83 Hz Schumann Resonance' },
                { type: 'practice', text: 'Journaling & Shadow Work' }
            ]
        },
        {
            id: 3,
            name: 'Spring Equinox',
            date: '2025-03-20',
            daysUntil: 51,
            type: 'solar',
            significance: 'Balance of light and dark. Perfect time for new beginnings and rebirth.',
            recommendations: [
                { type: 'meditation', text: 'Balance & Equilibrium Practice' },
                { type: 'frequency', text: '432 Hz Nature Attunement' },
                { type: 'practice', text: 'Spring Renewal Ritual' }
            ]
        },
        {
            id: 4,
            name: 'Perseid Meteor Shower Peak',
            date: '2025-08-12',
            daysUntil: 196,
            type: 'celestial',
            significance: 'Cosmic downloads and spiritual insights. High dimensional energy.',
            recommendations: [
                { type: 'meditation', text: 'Starlight Activation' },
                { type: 'frequency', text: '963 Hz Pineal Stimulation' },
                { type: 'practice', text: 'Night Sky Meditation' }
            ]
        }
    ];

    const getEventColor = (type) => {
        const colors = {
            lunar: '#9370DB',
            planetary: '#FFD700',
            solar: '#FF6347',
            celestial: '#4169E1'
        };
        return colors[type] || '#FFFFFF';
    };

    if (!isActive) return null;

    return (
        <div className="w-full h-full flex flex-col items-center pt-32 pb-48 animate-fade-in relative z-10 overflow-y-auto custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>

            {/* Header - Added padding-top to avoid overlap */}
            <h2 className="font-[Orbitron] text-4xl font-black text-white mb-2 tracking-[0.3em] text-center filter drop-shadow-[0_0_12px_rgba(0,200,200,0.22)]">
                NEXUS LAB
            </h2>
            <p className="text-xs font-mono text-[var(--realm-color)] uppercase tracking-[0.4em] mb-12 opacity-80">
                BIO-OPTIMIZATION & COSMIC ALIGNMENT
            </p>


            {/* COSMIC OBSERVATORY (PRIMARY FEATURE - TOP) */}
            <div id="nexus-observatory" className="w-full max-w-5xl px-4 md:px-6 mb-8">
                <div
                    onClick={() => {
                        console.log("OPENING OBSERVATORY OVERLAY (CARD CLICK)");
                        setShowObservatory(true);
                    }}
                    className="glass-card p-0 border border-[var(--realm-color)]/30 relative overflow-hidden group h-[400px] md:h-[500px] flex flex-col cursor-pointer hover:border-[var(--realm-color)] transition-all duration-500 hover:shadow-[0_0_50px_var(--realm-color)]/20"
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4))' }}
                >
                    {/* Background Solar System Widget */}

                    <div className="absolute inset-0 z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        {!showObservatory && <SolarSystemScene interactive={false} />}
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-6 md:p-10 pointer-events-none">

                        {/* Header Section */}
                        <div className="flex items-center gap-6 pointer-events-auto bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5 inline-flex self-start transition-transform group-hover:scale-105 duration-500">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--realm-color)]/10 border border-[var(--realm-color)] flex items-center justify-center shadow-[0_0_40px_var(--realm-color)]/30 animate-pulse-slow">
                                <Globe size={40} className="text-[var(--realm-color)]" />
                            </div>
                            <div>
                                <h3 className="font-[Orbitron] text-2xl md:text-3xl font-black text-white tracking-widest mb-1 shadow-black drop-shadow-lg">COSMIC OBSERVATORY</h3>
                                <p className="text-xs md:text-sm text-white/80 font-mono tracking-wider max-w-md shadow-black drop-shadow-md">
                                    Planetary alignments, retrogrades, and daily cognitive forecasts.
                                </p>
                            </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="flex items-end justify-between w-full pointer-events-auto">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className="px-8 py-4 bg-[var(--realm-color)] text-black font-[Orbitron] font-black tracking-widest text-xs rounded-xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_var(--realm-color)]/40 hover:shadow-[0_0_40px_var(--realm-color)]/60 flex items-center gap-3"
                                >
                                    <Telescope size={16} />
                                    ENTER OBSERVATORY
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowBriefing(true);
                                    }}
                                    className="px-6 py-4 border border-[var(--realm-color)] text-[var(--realm-color)] bg-black/80 backdrop-blur-md font-[Orbitron] font-black tracking-widest text-xs rounded-xl hover:bg-[var(--realm-color)] hover:text-black transition-all shadow-[0_0_20px_var(--realm-color)]/20 flex items-center gap-2"
                                >
                                    <Sparkles size={16} />
                                    DAILY BRIEFING
                                </button>
                            </div>

                            {/* Mini Event Widget */}
                            <div className="hidden md:block bg-black/60 backdrop-blur-md rounded-xl p-4 border border-[var(--realm-color)]/30 w-64 group-hover:border-[var(--realm-color)]/60 transition-colors">
                                <h4 className="font-[Orbitron] text-[10px] text-[var(--realm-color)] tracking-widest mb-3">UPCOMING EVENTS</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs text-white/90">
                                        <span>Mercury Retrograde</span>
                                        <span className="text-[var(--realm-color)] font-mono">2d</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-white/90">
                                        <span>Full Moon (Leo)</span>
                                        <span className="text-[var(--realm-color)] font-mono">5d</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HERMETIC ORACLE (Below Observatory) */}
            <div id="nexus-oracle" className="w-full max-w-5xl px-4 md:px-6 mb-12">
                <div
                    onClick={() => window.location.href = '/nexus-oracle'}
                    className="glass-card p-6 md:p-8 border border-[#FFD700]/30 relative overflow-hidden group cursor-pointer hover:border-[#FFD700] transition-colors"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FFD700,transparent_70%)] opacity-5 group-hover:opacity-10 transition-opacity" />

                    <div className="flex items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 border border-[#FFD700] flex items-center justify-center shadow-[0_0_30px_#FFD700]/20 animate-pulse-slow group-hover:scale-110 transition-transform">
                                <Sparkles size={40} className="text-[#FFD700]" />
                            </div>
                            <div>
                                <h3 className="font-[Orbitron] text-2xl font-black text-white tracking-widest mb-1">THE ORACLE</h3>
                                <p className="text-sm text-white/60 font-mono tracking-wider max-w-md">
                                    Consult the visible & invisible laws. AI-guided cosmic mentorship.
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="px-6 py-3 border border-[#FFD700]/30 rounded-full text-[#FFD700] text-xs font-black tracking-widest group-hover:bg-[#FFD700] group-hover:text-black transition-all">
                                ENTER TEMPLE
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* BIOHACKING GRID - INLINE EXPANSION */}
            <div id="nexus-library" className="w-full max-w-5xl px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-24">
                {BIOHACKING_PROTOCOLS.map((protocol, i) => {
                    const isExpanded = selectedModule?.id === protocol.id;
                    const Icon = protocol.icon;

                    return (
                        <motion.div
                            key={protocol.id}
                            layout
                            initial={false}
                            className={`bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-colors relative h-fit ${isExpanded ? 'ring-2 ring-[var(--realm-color)] bg-[var(--realm-color)]/5 md:col-span-2' : 'hover:border-[var(--realm-color)]/50 hover:bg-[var(--realm-color)]/5 cursor-pointer'}`}
                            onClick={() => setSelectedModule(isExpanded ? null : protocol)}
                        >
                            <div className={`p-6 md:p-8 flex flex-col justify-between relative min-h-[220px] md:min-h-[240px]`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Icon size={isExpanded ? (window.innerWidth < 768 ? 80 : 120) : (window.innerWidth < 768 ? 60 : 80)} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-6">
                                        <TechSigil Icon={Icon} color={protocol.color} isExpanded={isExpanded} />
                                        <span className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.4em]">PROTOCOL {String(i + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h3 className="font-[Orbitron] text-xl font-black text-white mb-2 tracking-widest uppercase">{protocol.name}</h3>
                                    <p className={`text-xs text-white/50 leading-relaxed max-w-[90%] ${isExpanded ? '' : 'line-clamp-2'}`}>
                                        {protocol.description}
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-8 pt-8 border-t border-white/10 overflow-hidden"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* BENEFITS SECTION */}
                                                <div>
                                                    <h4 className="font-[Orbitron] text-[10px] md:text-sm text-[var(--realm-color)] tracking-widest uppercase mb-4 flex items-center gap-2">
                                                        <Sparkles size={14} className="md:w-4 md:h-4" /> INTEL BENEFITS
                                                    </h4>
                                                    <div className="space-y-3 md:space-y-4">
                                                        {Object.entries(protocol.benefits).map(([cat, items]) => (
                                                            <div key={cat} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                                <span className="text-[10px] font-mono text-[var(--realm-color)]/70 uppercase block mb-2">{cat}</span>
                                                                <ul className="space-y-1.5">
                                                                    {items.map((item, idx) => (
                                                                        <li key={idx} className="text-[11px] md:text-xs text-white/70 flex gap-2 leading-relaxed">
                                                                            <span className="text-[var(--realm-color)] shrink-0">•</span>
                                                                            {item}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* EXECUTION SECTION */}
                                                <div>
                                                    <h4 className="font-[Orbitron] text-[10px] md:text-sm text-[var(--realm-color)] tracking-widest uppercase mb-4 flex items-center gap-2">
                                                        <Activity size={14} className="md:w-4 md:h-4" /> OPERATIONAL STEPS
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {protocol.protocol.map((step, idx) => (
                                                            <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5 group/step hover:bg-[var(--realm-color)]/10 transition-colors">
                                                                <span className="text-[9px] md:text-[10px] font-black text-[var(--realm-color)] bg-[var(--realm-color)]/10 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <p className="text-[11px] md:text-xs text-white/80 leading-relaxed pt-0.5">{step}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-8">
                                                        <button
                                                            className="w-full py-4 bg-[var(--realm-color)] text-black font-[Orbitron] font-black tracking-widest text-xs rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_18px_rgba(123,101,192,0.14)]"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedModule(null);
                                                            }}
                                                        >
                                                            DISMISS INTEL
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isExpanded && (
                                    <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/5">
                                        <div className="flex gap-2">
                                            {Object.keys(protocol.benefits).slice(0, 2).map((cat, idx) => (
                                                <span key={idx} className="text-[9px] font-mono px-2 py-1 rounded bg-white/5 text-white/30 uppercase">{cat}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--realm-color)]/40 group-hover:text-[var(--realm-color)] transition-colors">
                                            <span className="text-[9px] font-black tracking-widest">DETAILS</span>
                                            <Plus size={16} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>


            {/* DAILY BRIEFING OVERLAY (Enhanced) */}
            {showBriefing && briefingData && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={() => setShowBriefing(false)}>
                    <div className="glass-card p-6 md:p-10 max-w-2xl w-full border border-[var(--realm-color)]/50 rounded-2xl relative shadow-[0_0_24px_rgba(123,101,192,0.15)]" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowBriefing(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} className="md:w-6 md:h-6" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-[var(--realm-color)] md:w-6 md:h-6" />
                            <h2 className="text-base md:text-xl font-[Orbitron] tracking-[0.2em] md:tracking-widest text-[var(--realm-color)] uppercase">
                                {briefingData.title}
                            </h2>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="p-4 bg-[var(--realm-color)]/10 border border-[var(--realm-color)]/30 rounded-xl">
                                <div className="text-[9px] md:text-xs text-[var(--realm-color)] mb-1 font-black tracking-[0.2em] uppercase">TELEMETRY: LUNAR_PHASE</div>
                                <div className="text-white font-[Orbitron] text-sm md:text-lg tracking-widest">{briefingData.moonStats}</div>
                            </div>

                            <div className="p-5 md:p-8 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--realm-color)]/5 blur-3xl rounded-full"></div>
                                <p className="text-gray-300 leading-relaxed text-sm md:text-lg relative z-10 font-light">
                                    {briefingData.content}
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <span className="text-[9px] md:text-xs text-white/30 font-mono tracking-widest uppercase">COSMIC THEME:</span>
                                <span className="px-3 md:px-5 py-1 bg-[var(--realm-color)] text-black text-[9px] md:text-xs font-black rounded-full tracking-widest uppercase shadow-[0_0_15px_var(--realm-color)]">
                                    {briefingData.theme}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL SCREEN COSMIC OBSERVATORY OVERLAY */}
            {showObservatory && createPortal(
                <div className="fixed inset-0 z-[200] bg-black text-white font-['Exo_2'] overflow-y-auto animate-in fade-in duration-500 custom-scrollbar">
                    <div className="absolute inset-0 pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
                    <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black via-transparent to-black/80"></div>


                    {/* 3D SCENE BACKGROUND */}
                    <div className="observatory-bg">
                        <SolarSystemScene
                            interactive={true}
                            date={simulationDate}
                            onPlanetSelect={setSelectedBody}
                        />
                    </div>

                    <div className="observatory-content">
                        <button onClick={() => setShowObservatory(false)} className="observatory-back">
                            <ArrowLeft size={18} />
                            Back to Nexus (Exit Observatory)
                        </button>

                        {/* Selected Body Info Overlay */}
                        {selectedBody && (
                            <div className="planet-info-card" style={{ borderColor: '#' + (selectedBody.color ? selectedBody.color.toString(16).padStart(6, '0') : 'FFF') }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2 className="planet-name" style={{ color: '#' + (selectedBody.color ? selectedBody.color.toString(16).padStart(6, '0') : 'FFF') }}>{selectedBody.name}</h2>
                                    <button onClick={() => setSelectedBody(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>X</button>
                                </div>

                                {selectedBody.type === 'Planet' && (
                                    <>
                                        <div className="planet-detail-row">
                                            <span className="planet-label">Orbital Period</span>
                                            <span className="planet-value">{selectedBody.period} days</span>
                                        </div>
                                        <div className="planet-detail-row">
                                            <span className="planet-label">Size (Radius)</span>
                                            <span className="planet-value">{(selectedBody.radius * 6371).toLocaleString()} km</span>
                                        </div>
                                        <p style={{ marginTop: '15px', lineHeight: '1.4', fontSize: '0.9rem', color: '#DDD' }}>
                                            Current heliocentric alignment calculated for {simulationDate.toLocaleDateString()}.
                                        </p>
                                    </>
                                )}

                                {selectedBody.type === 'Star' && (
                                    <p style={{ lineHeight: '1.4', fontSize: '0.9rem', color: '#DDD' }}>
                                        {selectedBody.details}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="observatory-header relative z-20 mb-8 text-center pt-8">
                            <h1 className="font-[Orbitron] text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#9370DB] to-white tracking-[0.2em] drop-shadow-[0_0_12px_rgba(123,101,192,0.22)] mb-2">
                                COSMIC OBSERVATORY
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-[#9370DB]/60 font-mono text-xs tracking-[0.3em]">
                                <span className="w-12 h-[1px] bg-[#9370DB]/30"></span>
                                REAL-TIME CELESTIAL TELEMETRY
                                <span className="w-12 h-[1px] bg-[#9370DB]/30"></span>
                            </div>
                        </div>

                        <div className="view-toggle flex justify-center gap-4 mb-8 relative z-20">
                            {['3d', 'calendar', 'briefing'].map((view) => (
                                <button
                                    key={view}
                                    className={`px-6 py-2 rounded border font-[Orbitron] text-xs transition-all duration-300 tracking-widest uppercase ${currentView === view
                                        ? 'bg-[#9370DB]/10 border-[#9370DB] text-[#9370DB] shadow-[0_0_20px_rgba(147,112,219,0.2)]'
                                        : 'bg-black/40 border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                        }`}
                                    onClick={() => { setCurrentView(view); setSelectedBody(null); }}
                                >
                                    {view === '3d' ? 'System View' : view}
                                </button>
                            ))}
                        </div>

                        {/* TIME CONTROLS */}
                        <div className="control-panel">
                            <button className="control-btn" onClick={() => {
                                const d = new Date(simulationDate);
                                d.setMonth(d.getMonth() - 1);
                                setSimulationDate(d);
                            }}>{'<<'}</button>

                            <button className="control-btn" onClick={() => {
                                const d = new Date(simulationDate);
                                d.setDate(d.getDate() - 1);
                                setSimulationDate(d);
                            }}>{'<'}</button>

                            <button className="control-btn play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? '||' : '▶'}
                            </button>

                            <div className="date-display">
                                {simulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>

                            <button className="control-btn" onClick={() => {
                                const d = new Date(simulationDate);
                                d.setDate(d.getDate() + 1);
                                setSimulationDate(d);
                            }}>{'>'}</button>

                            <button className="control-btn" onClick={() => {
                                const d = new Date(simulationDate);
                                d.setMonth(d.getMonth() + 1);
                                setSimulationDate(d);
                            }}>{'>>'}</button>

                            <button
                                className="control-btn"
                                style={{ width: 'auto', padding: '0 15px', fontSize: '0.8rem', borderRadius: '20px' }}
                                onClick={() => { setSimulationDate(new Date()); setIsPlaying(false); }}
                            >
                                NOW
                            </button>
                        </div>

                        {/* Calendar View - Telemetry Dashboard Style */}
                        {currentView === 'calendar' && (
                            <div className="relative z-20 max-w-5xl mx-auto pb-20 px-4">
                                <div className="grid grid-cols-1 gap-6">
                                    {cosmicEvents.map((event, i) => {
                                        const color = getEventColor(event.type);
                                        return (
                                            <div
                                                key={event.id}
                                                className="group relative bg-[#050510]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 overflow-hidden transition-all hover:border-[var(--color)] hover:shadow-[0_0_30px_var(--color-alpha)]"
                                                style={{
                                                    '--color': color,
                                                    '--color-alpha': `${color}33`,
                                                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)'
                                                }}
                                            >
                                                {/* Tech Decor */}
                                                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-1">
                                                        {[...Array(3)].map((_, j) => (
                                                            <div key={j} className="w-1 h-1 bg-[var(--color)] rounded-full animate-pulse" style={{ animationDelay: `${j * 100}ms` }} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color)] to-transparent opacity-50" />

                                                <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start md:items-center">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[10px] font-mono font-bold text-[var(--color)] border border-[var(--color)]/30 px-2 py-0.5 rounded uppercase tracking-wider">
                                                                {event.type} EVENT // {String(i + 1).padStart(2, '0')}
                                                            </span>
                                                            <span className="text-[10px] text-white/40 font-mono tracking-widest">{event.date}</span>
                                                        </div>
                                                        <h2 className="text-2xl font-[Orbitron] font-black text-white tracking-widest mb-3 group-hover:text-[var(--color)] transition-colors">
                                                            {event.name}
                                                        </h2>
                                                        <p className="text-sm text-white/70 font-light leading-relaxed max-w-2xl border-l-2 border-white/10 pl-4">
                                                            {event.significance}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end min-w-[140px]">
                                                        <div className="text-4xl font-[Orbitron] font-black text-[var(--color)] tabular-nums tracking-tighter">
                                                            {event.daysUntil}
                                                        </div>
                                                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mt-1">
                                                            DAYS REMAINING
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Recommendations Grid */}
                                                <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {event.recommendations.map((rec, idx) => (
                                                        <div key={idx} className="bg-black/20 p-3 rounded border border-white/5 flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 bg-[var(--color)] rounded-full" />
                                                            <div>
                                                                <div className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{rec.type}</div>
                                                                <div className="text-xs text-white/80 font-mono">{rec.text}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Cosmic Briefing View - Telemetry Style */}
                        {currentView === 'briefing' && (
                            <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center p-6">
                                <div className="glass-panel-deep p-10 w-full border border-[#9370DB]/30 bg-black/60 relative overflow-hidden group">
                                    {/* Animated Borders */}
                                    <div className="absolute top-0 left-0 w-20 h-[2px] bg-[#9370DB]" />
                                    <div className="absolute top-0 left-0 h-20 w-[2px] bg-[#9370DB]" />
                                    <div className="absolute bottom-0 right-0 w-20 h-[2px] bg-[#9370DB]" />
                                    <div className="absolute bottom-0 right-0 h-20 w-[2px] bg-[#9370DB]" />

                                    <div className="flex items-center justify-center gap-4 mb-8">
                                        <Sparkles className="animate-pulse text-[#9370DB]" size={32} />
                                        <h2 className="text-2xl font-[Orbitron] font-bold tracking-[0.3em] text-[#9370DB] text-center">
                                            DAILY INTELLIGENCE
                                        </h2>
                                    </div>

                                    {briefingData ? (
                                        <div className="space-y-8 relative z-10">
                                            <div className="text-center pb-6 border-b border-white/10">
                                                <div className="inline-block px-4 py-1 border border-white/10 rounded-full text-xs font-mono text-white/50 mb-4 tracking-widest">
                                                    {briefingData.title}
                                                </div>
                                                <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90 drop-shadow-md">
                                                    "{briefingData.content}"
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-[#9370DB]/5 border border-[#9370DB]/20 rounded text-center">
                                                    <div className="text-[10px] text-[#9370DB] uppercase tracking-widest mb-1">COSMIC THEME</div>
                                                    <div className="font-[Orbitron] text-lg text-white">{briefingData.theme}</div>
                                                </div>
                                                <div className="p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded text-center">
                                                    <div className="text-[10px] text-[#FFD700] uppercase tracking-widest mb-1">LUNAR PHASE</div>
                                                    <div className="font-[Orbitron] text-lg text-white">{briefingData.moonStats}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-[#9370DB]">
                                            <div className="w-16 h-16 border-t-2 border-[#9370DB] rounded-full animate-spin mb-6" />
                                            <p className="font-[Orbitron] tracking-widest text-xs animate-pulse">ESTABLISHING UPSTREAM CONNECTION...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* PLAYER GUIDE OVERLAY */}
            {showPlayerInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setShowPlayerInfo(false)}>
                    <div className="bg-[#050505] border border-[var(--realm-color)] rounded-3xl p-10 max-w-lg w-full relative shadow-[0_0_60px_var(--realm-color)]/30 text-center" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowPlayerInfo(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <h3 className="font-[Orbitron] text-2xl font-black text-white tracking-widest uppercase mb-4">PLAYER GUIDE</h3>
                        <p className="text-sm text-white/70 leading-relaxed mb-6">
                            The Cognitive Audio Player is designed to entrain your brainwaves to specific frequencies. Use headphones for optimal results. Selecting a track automtically adjusts the particle field to match the frequency resonance.
                        </p>
                        <button onClick={() => setShowPlayerInfo(false)} className="px-8 py-3 rounded-full border border-white/20 text-xs font-mono text-white/50 hover:text-white hover:border-white hover:bg-white/5 transition-all uppercase tracking-widest">
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const TEMPLE_HABITS = [
    { id: 1, title: "Cold Exposure", desc: "Activate brown fat and dopamine spike. 2-3 mins cold shower.", frequency: "DAILY" },
    { id: 2, title: "Breathwork Mastery", desc: "4-7-8 for sleep or Box breathing for focus.", frequency: "AS NEEDED" },
    { id: 3, title: "Digital Boundary", desc: "No screens 90 mins before sleep. Sanctuary Seal.", frequency: "EVENING" },
    { id: 4, title: "Morning Sunlight", desc: "15 mins direct sun to set circadian rhythm.", frequency: "MORNING" }
];



const TempleDashboard = ({ isActive }) => {
    const [selectedProtocolKey, setSelectedProtocolKey] = useState(null);
    const [activeHabit, setActiveHabit] = useState(null); // Click-to-persist state
    const [pendingHabit, setPendingHabit] = useState(null); // For time picker
    const [dailyStack, setDailyStack] = useState(() => {
        try {
            const saved = localStorage.getItem('innersync_daily_stack');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    useEffect(() => {
        localStorage.setItem('innersync_daily_stack', JSON.stringify(dailyStack));

        // Schedule native notifications
        const setupNotifications = async () => {
            const hasPerm = await NotificationService.requestPermission();
            if (hasPerm) {
                await NotificationService.scheduleHabitNotifications(dailyStack);
            }
        };
        setupNotifications();
    }, [dailyStack]);

    const addToStack = (habit) => {
        if (dailyStack.some(h => h.name === habit.name)) return;
        setPendingHabit(habit);
    };

    const confirmTime = (time) => {
        const habitWithMeta = { ...pendingHabit, scheduledTime: time, difficulty: pendingHabit.difficulty || 'Medium' };
        setDailyStack(prev => [...prev, habitWithMeta]);
        setPendingHabit(null);
    };

    const removeFromStack = (habitName) => {
        setDailyStack(prev => prev.filter(h => h.name !== habitName));
    };

    return (
        <div className={`dashboard-container ${isActive ? 'active' : ''}`}>
            {pendingHabit && <PrecisionTimeHUD habit={pendingHabit} onConfirm={confirmTime} onCancel={() => setPendingHabit(null)} />}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px] h-auto lg:h-[600px]">

                {/* LEFT: PROTOCOLS MENU (3 cols) */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-[300px] lg:h-full">
                    <div className="glass-panel-deep rounded-2xl p-6 border border-white/10 flex-shrink-0 relative">
                        {/* Inner light reflection */}
                        <div className="absolute inset-[1px] rounded-2xl border border-white/5 pointer-events-none" />
                        <h3 className="font-[Orbitron] text-xl text-[var(--realm-color)] font-black tracking-widest uppercase mb-2 filter drop-shadow-[0_0_10px_var(--realm-color)]">TEMPLE PROTOCOLS</h3>
                        <p className="text-[10px] text-white/40 font-mono">SELECT A BIO-MOD TO VIEW HABITS</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {Object.entries(bioModsData).map(([key, protocol]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedProtocolKey(key)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-500 group relative overflow-hidden ${selectedProtocolKey === key
                                    ? 'bg-[var(--realm-color)] text-black border-[var(--realm-color)] shadow-[0_0_20px_var(--realm-color)]'
                                    : 'glass-card-frosted text-white/60 hover:text-white'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`font-[Orbitron] font-black text-xs tracking-widest uppercase ${selectedProtocolKey === key ? 'text-black' : 'text-white group-hover:text-white'}`}>
                                        {protocol.name}
                                    </span>
                                    {selectedProtocolKey === key && <Activity size={12} className="text-black animate-pulse" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* MIDDLE: DETAILED VIEW (6 cols) */}
                <div className="lg:col-span-6 h-[500px] lg:h-full relative flex flex-col gap-4">
                    {selectedProtocolKey ? (
                        <>
                            {/* TOP: PROTOCOL INFO & HABIT LIST */}
                            <div className="glass-panel-deep p-6 flex-1 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--realm-color)] to-transparent" />

                                <h2 className="font-[Orbitron] text-2xl text-white font-black tracking-widest uppercase mb-2 leading-tight">
                                    {bioModsData[selectedProtocolKey].name}
                                </h2>
                                <p className="text-sm text-white/60 mb-6 font-light leading-relaxed line-clamp-2">
                                    {bioModsData[selectedProtocolKey].simpleExplanation}
                                </p>

                                <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2 pb-4">
                                    {bioModsData[selectedProtocolKey].habits.map((habit, idx) => {
                                        const isAdded = dailyStack.some(h => h.name === habit.name);
                                        const isActiveHabit = activeHabit?.name === habit.name;
                                        return (
                                            <div
                                                key={idx}
                                                className={`bg-white/5 border rounded-xl overflow-hidden transition-all group relative cursor-pointer ${isActiveHabit ? 'border-[var(--realm-color)] bg-[var(--realm-color)]/5' : 'border-white/10 hover:border-[var(--realm-color)]/50 hover:bg-white/10'}`}
                                                onClick={() => setActiveHabit(habit === activeHabit ? null : habit)}
                                            >
                                                <div className="p-4 flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-mono text-[var(--realm-color)] font-black uppercase tracking-wider">{habit.duration} MIN</span>
                                                            {habit.difficulty && <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">• {habit.difficulty}</span>}
                                                        </div>
                                                        <h4 className="font-[Orbitron] font-bold text-white text-sm tracking-wide">{habit.name}</h4>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            !isAdded && addToStack(habit);
                                                        }}
                                                        disabled={isAdded}
                                                        className={`p-2 rounded-lg border transition-all ${isAdded
                                                            ? 'bg-[var(--realm-color)]/20 text-[var(--realm-color)] border-[var(--realm-color)]/50 cursor-default'
                                                            : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:border-white/40 shadow-lg'
                                                            }`}
                                                    >
                                                        {isAdded ? <Check size={14} /> : <Plus size={14} />}
                                                    </button>
                                                </div>

                                                {/* INLINE EXPANSION CONTENT */}
                                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActiveHabit ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    <div className="p-4 pt-0 border-t border-white/5 bg-black/20">
                                                        <div className="mb-3 mt-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Brain size={10} className="text-[var(--realm-color)]" />
                                                                <span className="text-[9px] font-mono text-[var(--realm-color)]/70 uppercase">NEURAL MECHANISM (WHY)</span>
                                                            </div>
                                                            <p className="text-xs text-white/80 leading-relaxed font-light pl-4 border-l border-[var(--realm-color)]/30">
                                                                {habit.why}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Zap size={10} className="text-[var(--realm-color)]" />
                                                                <span className="text-[9px] font-mono text-[var(--realm-color)]/70 uppercase">EXECUTION PROTOCOL (HOW)</span>
                                                            </div>
                                                            <p className="text-xs text-white/70 leading-relaxed font-mono bg-black/40 p-2 rounded border border-white/5">
                                                                {`> ${habit.howTo}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4 border-2 border-dashed border-white/5 rounded-3xl">
                            <Zap size={48} />
                            <span className="text-xs font-mono tracking-widest">Select a Protocol</span>
                        </div>
                    )}
                </div>

                {/* RIGHT: DAILY STACK (3 cols) */}
                <div className="lg:col-span-3 h-full flex flex-col">
                    <div className="glass-card p-6 border border-white/10 h-full flex flex-col bg-black/40">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-[Orbitron] text-xl text-white font-black tracking-widest uppercase">DAILY DESIGN</h3>
                                <span className="text-[9px] font-black text-white/30 tracking-[0.2em] uppercase">BUILD YOUR ROUTINE</span>
                            </div>
                            <div className="p-2 bg-white/5 rounded-full text-[var(--realm-color)]">
                                <Target size={20} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            {dailyStack.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-white/20 text-xs font-mono mb-2">NO HABITS SELECTED</p>
                                    <p className="text-white/10 text-[9px] max-w-[180px] mx-auto">Explore protocols and add habits (+).</p>
                                </div>
                            ) : (
                                dailyStack.map((habit, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in group hover:bg-white/10 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-[var(--realm-color)]/20 text-[var(--realm-color)] flex items-center justify-center text-[10px] font-black shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[11px] font-bold text-white truncate">{habit.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-white/40 font-mono">{habit.duration} MIN</span>
                                                {habit.scheduledTime && (
                                                    <span className="text-[9px] text-[var(--realm-color)] font-mono font-bold flex items-center gap-1">
                                                        <Hexagon size={8} fill="currentColor" /> {habit.scheduledTime}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromStack(habit.name)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {dailyStack.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] text-white/40 font-mono uppercase">TOTAL TIME</span>
                                    <span className="text-xl font-[Orbitron] text-white font-black">
                                        {dailyStack.reduce((acc, h) => acc + h.duration, 0)} <span className="text-xs text-[var(--realm-color)]">MIN</span>
                                    </span>
                                </div>
                                <button className="w-full py-3 bg-[var(--realm-color)] text-black font-[Orbitron] font-black tracking-widest text-[10px] rounded-xl shadow-[0_0_20px_var(--realm-color)] hover:scale-[1.02] active:scale-95 transition-all">
                                    INITIATE SEQUENCE
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

const DailyQuoteOverlay = ({ onDismiss }) => {
    const [visible, setVisible] = useState(false);
    const dayIndex = new Date().getDay();
    const todayQuote = DAILY_QUOTES[dayIndex];

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`max-w-2xl text-center space-y-8 transition-all duration-1000 transform ${visible ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}>
                <div className="flex flex-col items-center gap-4">
                    <Hexagon size={48} className="text-[#FF4500] animate-pulse drop-shadow-[0_0_15px_#FF4500]" />
                    <span className="text-[10px] font-black font-mono tracking-[0.6em] text-[#FF4500] uppercase">{todayQuote.title}</span>
                </div>
                <h2 className="font-[Orbitron] text-3xl md:text-5xl font-black text-white leading-tight tracking-wide italic">
                    "{todayQuote.quote}"
                </h2>
                <button
                    onClick={() => { setVisible(false); setTimeout(onDismiss, 1000); }}
                    className="group flex items-center gap-4 px-12 py-5 bg-white/5 hover:bg-[#FF4500] border border-white/10 rounded-2xl mx-auto transition-all duration-500 hover:scale-110 active:scale-95"
                >
                    <span className="text-sm font-black font-[Orbitron] text-white group-hover:text-black tracking-[0.3em]">ENTER THE SANCTUARY</span>
                    <ArrowRight size={20} className="text-white group-hover:text-black transition-transform group-hover:translate-x-2" />
                </button>
            </div>
        </div>
    );
};



// --- MAIN MASTER PORTAL COMPONENT ---

function MasterPortal() {
    const [activeRealm, setActiveRealm] = useState('SANCTUARY');
    const [dayMode, setDayMode] = useState(true); // Light theme by default
    const [showQuote, setShowQuote] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/').pop()?.toUpperCase();
        if (REALMS[path]) {
            setActiveRealm(path);
        } else if (location.pathname.includes('wisdomwell')) {
            setActiveRealm('TEMPLE');
        } else if (location.pathname.includes('foundation')) {
            setActiveRealm('SANCTUARY');
        }
    }, [location]);

    // Sync dayMode to HTML data-theme attribute for CSS variable switching
    useEffect(() => {
        document.documentElement.dataset.theme = dayMode ? 'light' : 'dark';
    }, [dayMode]);

    const cycleRealm = () => {
        const realms = Object.keys(REALMS);
        const currIdx = realms.indexOf(activeRealm);
        const nextIdx = (currIdx + 1) % realms.length;
        setActiveRealm(realms[nextIdx]);
    };

    const cycleRealmPrev = () => {
        const realms = Object.keys(REALMS);
        const currIdx = realms.indexOf(activeRealm);
        const prevIdx = (currIdx - 1 + realms.length) % realms.length;
        setActiveRealm(realms[prevIdx]);
    };

    const swipeStartX = useRef(null);
    const handleTouchStart = (e) => { swipeStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (swipeStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - swipeStartX.current;
        if (Math.abs(dx) > 60) dx < 0 ? cycleRealm() : cycleRealmPrev();
        swipeStartX.current = null;
    };

    const baseRealm = REALMS[activeRealm];
    const currentRealm = dayMode ? {
        ...baseRealm,
        color: baseRealm.colorLight,
        secondary: baseRealm.secondaryLight,
        bg: baseRealm.bgLight,
    } : baseRealm;

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (showQuote) return <DailyQuoteOverlay onDismiss={() => setShowQuote(false)} />;

    return (
        <main
            className="relative w-full overflow-y-auto text-white flex flex-col items-center transition-all duration-1000 custom-scrollbar noise-overlay"
            style={{
                height: '100dvh',
                minHeight: '-webkit-fill-available',
                '--realm-color': currentRealm.color,
                '--secondary-color': currentRealm.secondary,
                background: currentRealm.bg
            }}
        >
            <RealmNavigator realm={activeRealm} onScrollTo={scrollToSection} />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&family=Inter:wght@300;400;600&display=swap');
        
        .glass-panel { background: var(--glass-2); backdrop-filter: blur(40px) saturate(160%); -webkit-backdrop-filter: blur(40px) saturate(160%); border: 1px solid var(--glass-border); }
        .glass-card { background: var(--glass-1); backdrop-filter: blur(60px) saturate(160%); -webkit-backdrop-filter: blur(60px) saturate(160%); border-radius: 24px; border: 1px solid var(--glass-border); box-shadow: 0 8px 40px var(--glass-shadow); }
        .glass-chip { background: var(--glass-2); border: 1px solid var(--glass-border); padding: 12px 24px; border-radius: 99px; display: flex; flex-direction: column; align-items: center; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: all 0.5s ease; cursor: pointer; }
        .glass-chip:hover { transform: translateY(-3px); border-color: var(--realm-color); background: var(--glass-3); box-shadow: 0 0 14px rgba(0,0,0,calc(var(--glow-mult, 0.12) * 1.5)); }
        .glass-chip .label { font-size: 8px; color: var(--text-secondary); font-weight: 900; letter-spacing: 2px; margin-bottom: 2px; text-transform: uppercase; }
        .glass-chip .value { font-family: 'Orbitron'; font-size: 16px; font-weight: 900; letter-spacing: 1px; color: var(--text-primary); }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, transparent, var(--realm-color), transparent); border-radius: 10px; }

        .prose-intel h3 {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          letter-spacing: 0.3em;
          @media (min-width: 768px) { letter-spacing: 0.6em; }
          background: linear-gradient(to bottom, rgba(255,255,255,0.9), var(--realm-color));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 2rem;
          @media (min-width: 768px) { margin-bottom: 3.5rem; }
          filter: drop-shadow(0 0 20px var(--realm-color));
          opacity: 0.8;
          font-size: 1.1rem;
          @media (min-width: 768px) { font-size: 1.5rem; }
        }

        .prose-intel h4 {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: var(--realm-color);
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 15px;
          opacity: 0.7;
          text-transform: uppercase;
        }

        .prose-intel h4::before {
            content: '>>';
            font-size: 8px;
            opacity: 0.5;
        }

        .prose-intel h4::after {
          content: '';
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, var(--realm-color), transparent);
          opacity: 0.15;
        }

        .prose-intel p {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          line-height: 2.2;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 2.5rem;
          text-align: justify;
          letter-spacing: 0.02em;
        }

        .prose-intel strong {
            color: var(--realm-color);
            opacity: 0.9;
            font-weight: 700;
        }

        .wisdom-dossier-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.2));
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          @media (min-width: 768px) { padding: 3rem; }
          margin-bottom: 2.5rem;
          position: relative;
          border-radius: 2px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .wisdom-dossier-card::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px;
          width: 20px; height: 2px;
          background: var(--realm-color);
          opacity: 0.3;
        }

        .wisdom-dossier-card::after {
          content: '';
          position: absolute;
          bottom: -1px; right: -1px;
          width: 2px; height: 20px;
          background: var(--realm-color);
          opacity: 0.3;
        }

        .data-stream-glow {
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--realm-color), transparent);
          opacity: 0.15;
          animation: stream-linear 6s infinite linear;
        }

        @keyframes stream-linear {
          0% { transform: translateY(-100%) scaleX(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(1000%) scaleX(2); opacity: 0; }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .perspective-2000 { perspective: 2000px; }
        
        .dashboard-container {
          position: relative;
          width: 100%;
          min-height: calc(100dvh - 170px);
          min-height: calc(100vh - 170px);
          display: none;
          opacity: 0;
          transform: scale(0.98) translateY(20px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          padding-top: calc(160px + env(safe-area-inset-top, 0px));
          /* Extra bottom padding for safe area + fixed nav buttons */
          padding-bottom: calc(200px + env(safe-area-inset-bottom, 0px));
          padding-left: max(1rem, calc(1rem + env(safe-area-inset-left, 0px)));
          padding-right: max(1rem, calc(1rem + env(safe-area-inset-right, 0px)));
          margin: 0 auto;
        }
        @media (min-width: 768px) {
            .dashboard-container {
                padding-left: 2rem; padding-right: 2rem;
            }
        }
        .dashboard-container.active {
          display: block;
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      `}</style>

            <ParticleField mode={activeRealm} dayMode={dayMode} />
            <MasterHeader
                realm={currentRealm}
                dayMode={dayMode}
                setDayMode={setDayMode}
            />


            <div
                className="relative w-full h-full max-w-7xl mx-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <SanctuaryDashboard isActive={activeRealm === 'SANCTUARY'} />
                <NexusDashboard isActive={activeRealm === 'NEXUS'} />
                <TempleDashboard isActive={activeRealm === 'TEMPLE'} />
            </div>

            {/* MOBILE REALM INDICATOR DOTS */}
            <div className="md:hidden fixed left-0 right-0 z-[99] flex justify-center gap-2 pointer-events-none" style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))' }}>
                {Object.keys(REALMS).map(r => (
                    <div
                        key={r}
                        className={`rounded-full transition-all duration-300 ${activeRealm === r ? 'w-4 h-2 bg-[var(--realm-color)]' : 'w-2 h-2 bg-white/20'}`}
                    />
                ))}
            </div>

            {/* BOTTOM LEFT WISDOM WELL BUTTON — desktop only */}
            <div className="hidden md:block fixed left-8 z-[100]" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
                <button
                    onClick={() => navigate('/wisdomwell')}
                    className="w-16 h-16 rounded-full bg-[#5465FF]/10 backdrop-blur-2xl border border-[#5465FF]/30 flex items-center justify-center text-[#5465FF] hover:bg-[#5465FF]/20 transition-all hover:scale-110 shadow-[0_0_30px_rgba(84,101,255,0.2)] hover:shadow-[0_0_40px_#5465FF] group relative"
                >
                    <span className="text-3xl pb-1">☥</span>
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-[#5465FF] text-[10px] px-3 py-1.5 rounded-lg border border-[#5465FF]/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-[0.2em] font-[Orbitron] font-bold">
                        WISDOM
                    </span>
                    <div className="absolute inset-0 rounded-full border border-[#5465FF] opacity-0 group-hover:opacity-100 animate-ping-slow pointer-events-none" />
                </button>
            </div>

            {/* CENTERED REALM SWITCH BUTTON — desktop only */}
            <div className="hidden md:flex fixed left-0 right-0 z-50 justify-center pointer-events-none" style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}>
                <button
                    onClick={cycleRealm}
                    className="pointer-events-auto group px-8 py-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-4 transition-all duration-300 hover:scale-105 active:scale-95 hover:border-[var(--realm-color)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                    <div className="w-2 h-2 rounded-full bg-[var(--realm-color)] animate-pulse shadow-[0_0_10px_var(--realm-color)]" />
                    <span className="text-xs font-[Orbitron] font-black text-white tracking-[0.2em] group-hover:text-[var(--realm-color)] transition-colors uppercase">
                        SWITCH REALM
                    </span>
                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-[var(--realm-color)]/20 transition-colors">
                        <ChevronRight size={14} className="text-white/40 group-hover:text-[var(--realm-color)]" />
                    </div>
                </button>
            </div>

            {/* BOTTOM RIGHT SYNCHRONY BUTTON — desktop only */}
            <div className="hidden md:flex fixed right-8 z-[100] items-center gap-6" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
                <button
                    onClick={() => navigate('/synchrony')}
                    className="w-16 h-16 rounded-full bg-[#5465FF]/10 backdrop-blur-2xl border border-[#5465FF]/30 flex items-center justify-center text-[#5465FF] hover:bg-[#5465FF]/20 transition-all hover:scale-110 shadow-[0_0_30px_rgba(84,101,255,0.2)] hover:shadow-[0_0_40px_#5465FF] group relative"
                >
                    <span className="text-3xl pb-1">ॐ</span>
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-[#5465FF] text-[10px] px-3 py-1.5 rounded-lg border border-[#5465FF]/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-[0.2em] font-[Orbitron] font-bold">
                        SYNCHRONY
                    </span>
                    <div className="absolute inset-0 rounded-full border border-[#5465FF] opacity-0 group-hover:opacity-100 animate-ping-slow pointer-events-none" />
                </button>
            </div>

            {/* MOBILE BOTTOM NAV BAR — mobile only */}
            <div
                className="md:hidden fixed left-0 right-0 bottom-0 z-[100] flex items-stretch bg-black/80 backdrop-blur-2xl border-t border-white/10"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <button
                    onClick={() => navigate('/wisdomwell')}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[#5465FF]/70 hover:text-[#5465FF] active:bg-white/5 transition-colors"
                >
                    <span className="text-xl">☥</span>
                    <span className="font-[Orbitron] text-[8px] tracking-[0.2em] uppercase">Wisdom</span>
                </button>
                <button
                    onClick={cycleRealm}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 border-x border-white/10 text-white/70 hover:text-[var(--realm-color)] active:bg-white/5 transition-colors"
                >
                    <div className="w-2 h-2 rounded-full bg-[var(--realm-color)] animate-pulse shadow-[0_0_8px_var(--realm-color)]" />
                    <span className="font-[Orbitron] text-[8px] tracking-[0.2em] uppercase">Switch Realm</span>
                </button>
                <button
                    onClick={() => navigate('/synchrony')}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[#5465FF]/70 hover:text-[#5465FF] active:bg-white/5 transition-colors"
                >
                    <span className="text-xl">ॐ</span>
                    <span className="font-[Orbitron] text-[8px] tracking-[0.2em] uppercase">Synchrony</span>
                </button>
            </div>
        </main >
    );
}


// [NEW] Wrapped Export with Error Boundary
export default function MasterPortalWrapped(props) {
    return (
        <ErrorBoundary>
            <MasterPortal {...props} />
        </ErrorBoundary>
    );
}
