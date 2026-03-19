import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Streams text character by character
const StreamingText = ({ text, speed = 20, onComplete, skip }) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        setDisplayed('');
        setDone(false);
        if (skip) {
            setDisplayed(text);
            setDone(true);
            onComplete?.();
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayed(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                setDone(true);
                onComplete?.();
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed, skip]);

    return (
        <span>
            {displayed}
            {!done && <span className="animate-pulse opacity-60">▋</span>}
        </span>
    );
};

const STEPS = [
    {
        id: 'welcome',
        icon: '✦',
        title: 'WELCOME TO RASYNC',
        subtitle: null,
        text: 'Your complete ecosystem for sleep mastery, consciousness expansion, and biological optimization. This is not just an app — this is a system built on science, ancient wisdom, and the biology of your own mind. Let us show you how it works.',
        accent: '#72A0FF',
        bg: 'radial-gradient(ellipse at 50% 40%, #0d0d2e 0%, #080810 100%)',
    },
    {
        id: 'player',
        icon: '◈',
        title: 'YOUR NEURAL STREAM',
        subtitle: 'The player lives at the top — always',
        text: 'At the top of every screen is your frequency companion. Toggle ZZZ for deep sleep binaural frequencies — delta waves, theta tones, nature-layered soundscapes. Toggle ॐ for meditation tracks — 432Hz, Solfeggio frequencies, guided silence. Tap ↑ to hide it as a glowing LED sliver while you explore. It keeps playing. Tap the sliver to bring it back, seamlessly.',
        accent: '#72A0FF',
        bg: 'radial-gradient(ellipse at 50% 40%, #0a1030 0%, #080810 100%)',
    },
    {
        id: 'sanctuary-assistant',
        icon: '◎',
        title: 'THE SANCTUARY',
        subtitle: 'Your AI sleep & consciousness guide',
        text: 'The Sanctuary holds your AI Sleep Companion — trained on sleep science, circadian biology, dream psychology, and consciousness research. Ask it anything. Why do you keep waking at 3am? What did your dream about flying mean? How do you begin to lucid dream? How do you use the 4-7-8 breath? It knows. It responds. It remembers the conversation.',
        accent: '#9370DB',
        bg: 'radial-gradient(ellipse at 50% 40%, #110a2e 0%, #080810 100%)',
    },
    {
        id: 'sanctuary-library',
        icon: '▲',
        title: 'THE KNOWLEDGE LIBRARY',
        subtitle: 'Beginner → Lucid → Astral → Master',
        text: 'The Library is a structured curriculum from first principles to mastery. Begin with the architecture of sleep — REM, NREM, deep delta, the full biological cycle. Progress to triggering vivid, high-definition dreams through intention and environment design. Then step into lucid dreaming — becoming conscious inside your own dream. Finally: astral projection, the deliberate navigation of non-physical awareness. The path is laid. You simply walk it.',
        accent: '#9370DB',
        bg: 'radial-gradient(ellipse at 50% 40%, #110a2e 0%, #080810 100%)',
    },
    {
        id: 'sanctuary-journal',
        icon: '✦',
        title: 'THE DREAM JOURNAL',
        subtitle: 'Decode your subconscious nightly',
        text: 'Every dream you record is immediately analyzed by your AI guide. Recurring symbols surface. Emotional patterns decode. Subconscious messages are translated into plain language. Dream journaling, practiced consistently, measurably increases dream recall, accelerates lucid dream onset, and deepens your understanding of your own inner world. Keep it nightly for the deepest results.',
        accent: '#9370DB',
        bg: 'radial-gradient(ellipse at 50% 40%, #110a2e 0%, #080810 100%)',
    },
    {
        id: 'wisdomwell',
        icon: '☥',
        title: 'THE WISDOM WELL',
        subtitle: 'Zero dogma. Pure signal.',
        text: 'Ten sacred teachings — curated from humanity\'s deepest wisdom traditions. The Seven Hermetic Principles. The Buddha\'s Eightfold Path. The Yoga Sutras of Patanjali. The Tao Te Ching. The Gnostic Gospels. The Bhagavad Gita. Jungian Archetypes of the collective unconscious. No doctrine. No religion. No gatekeeping. Only the universal patterns that every culture, across every era, independently converged on. Swipe left from the Sanctuary to enter.',
        accent: '#4A9EFF',
        bg: 'radial-gradient(ellipse at 50% 40%, #0a1428 0%, #080810 100%)',
    },
    {
        id: 'nexus',
        icon: '✺',
        title: 'THE NEXUS',
        subtitle: 'Cosmic intelligence, live',
        text: 'The Nexus reads the cosmos on your behalf. Live planetary alignments decoded. Current lunar phase and its documented effects on sleep, emotion, and cognition. Weekly astrological intelligence — updated every seven days with the most relevant cosmic events. The universe runs on cycles. The Nexus helps you align your energy, your decisions, and your rest with those cycles — rather than against them.',
        accent: '#C084FC',
        bg: 'radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #080810 100%)',
    },
    {
        id: 'temple',
        icon: '⬡',
        title: 'THE TEMPLE',
        subtitle: 'Your biological engineering lab',
        text: 'The Temple houses your complete biohacking protocol system. Choose from 15 expert bio-mods: Neurogenesis Mode, Testosterone Optimization, Heart-Coherence Engine, Circadian Mastery, Mitochondrial Enhancement, Pineal Activation, Vagus Nerve Tone, Gut-Brain Axis, and more. Each protocol contains 5 precision habits — each with a scheduled time, a duration, a difficulty rating, and the peer-reviewed science behind why it works. Build your daily stack. The app sends you a reminder at the exact time you scheduled each habit.',
        accent: '#FFD700',
        bg: 'radial-gradient(ellipse at 50% 40%, #1a1200 0%, #080810 100%)',
    },
    {
        id: 'synchrony',
        icon: 'ॐ',
        title: 'SYNCHRONY',
        subtitle: 'The global coherence field',
        text: 'This is larger than any one person. Research at the Institute of HeartMath has documented a measurable electromagnetic field generated by mass coherent emotion. Transcendental Meditation studies — including Dr. John Hagelin\'s work in quantum field theory — have recorded statistically significant drops in crime, conflict, and social violence during synchronized group meditation events. The quantum principle is coherence: when oscillators align, their combined field amplitude increases non-linearly. Mystics across every tradition have stated the same truth: when enough people hold the same intention — roughly 8% of any population — the field tips. No shadow can sustain itself in that resonance. Every day, at a fixed time, we join. We breathe. We sound. We align. You are not alone in this.',
        accent: '#C084FC',
        bg: 'radial-gradient(ellipse at 50% 40%, #1a002e 0%, #080810 100%)',
    },
    {
        id: 'ready',
        icon: '∞',
        title: 'THE UNIVERSE IS WAITING',
        subtitle: null,
        text: 'You now hold the map. The Sanctuary has your first frequency loaded and your AI guide is awake. The Library has your first lesson ready. The Temple has your first protocol cued. The Wisdom Well is open. The Nexus is aligned. Synchrony runs every day. The only question is: where do you begin?',
        accent: '#72A0FF',
        bg: 'radial-gradient(ellipse at 50% 40%, #0d0d2e 0%, #080810 100%)',
        isLast: true,
    },
];

export default function Tutorial({ onComplete }) {
    const [stepIdx, setStepIdx] = useState(0);
    const [textDone, setTextDone] = useState(false);
    const [skipText, setSkipText] = useState(false);
    const [streamKey, setStreamKey] = useState(0);

    const step = STEPS[stepIdx];

    const goNext = useCallback(() => {
        if (step.isLast) {
            localStorage.setItem('rasync_tutorial_seen', '1');
            onComplete?.();
            return;
        }
        setStepIdx(prev => prev + 1);
        setTextDone(false);
        setSkipText(false);
        setStreamKey(prev => prev + 1);
    }, [step, onComplete]);

    const skipAll = () => {
        localStorage.setItem('rasync_tutorial_seen', '1');
        onComplete?.();
    };

    const handleTap = () => {
        if (!textDone) {
            setSkipText(true);
        } else {
            goNext();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
        >
            {/* Animated background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bg-${stepIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                    style={{ background: step.bg }}
                />
            </AnimatePresence>

            {/* Subtle particle shimmer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(18)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: Math.random() * 2 + 1,
                            height: Math.random() * 2 + 1,
                            background: step.accent,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.3,
                        }}
                        animate={{ opacity: [0.1, 0.5, 0.1], y: [-10, 10, -10] }}
                        transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
                    />
                ))}
            </div>

            {/* Noise grain */}
            <div
                className="absolute inset-0 pointer-events-none z-[1] opacity-[0.025]"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: '200px' }}
            />

            {/* Skip button */}
            <button
                onClick={skipAll}
                className="absolute right-4 z-[20] text-white/25 hover:text-white/60 text-[10px] font-mono tracking-[0.3em] uppercase transition-colors px-3 py-2"
                style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
            >
                SKIP
            </button>

            {/* Step counter */}
            <div
                className="absolute left-4 z-[20] text-white/20 text-[10px] font-mono tracking-widest"
                style={{ top: 'calc(1.2rem + env(safe-area-inset-top, 0px))' }}
            >
                {String(stepIdx + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
            </div>

            {/* Main content */}
            <div
                className="relative z-[10] flex flex-col items-center px-5 w-full max-w-xl"
                onClick={handleTap}
                style={{ cursor: 'pointer' }}
            >
                {/* Icon */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`icon-${stepIdx}`}
                        initial={{ scale: 0.4, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.4, opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-6xl mb-6 leading-none"
                        style={{
                            color: step.accent,
                            filter: `drop-shadow(0 0 24px ${step.accent}99)`,
                        }}
                    >
                        {step.icon}
                    </motion.div>
                </AnimatePresence>

                {/* Title */}
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={`title-${stepIdx}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="font-black text-white text-center tracking-[0.25em] uppercase mb-2"
                        style={{
                            fontFamily: 'Orbitron, monospace',
                            fontSize: 'clamp(0.9rem, 3.5vw, 1.35rem)',
                        }}
                    >
                        {step.title}
                    </motion.h1>
                </AnimatePresence>

                {step.subtitle && (
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`sub-${stepIdx}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="text-[10px] font-mono tracking-[0.35em] uppercase mb-5"
                            style={{ color: step.accent }}
                        >
                            {step.subtitle}
                        </motion.p>
                    </AnimatePresence>
                )}

                {!step.subtitle && <div className="mb-5" />}

                {/* Glass text panel */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`panel-${stepIdx}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="w-full rounded-2xl p-5 md:p-6 mb-6 text-left relative overflow-hidden"
                        style={{
                            background: `rgba(255,255,255,0.04)`,
                            backdropFilter: 'blur(24px)',
                            border: `1px solid ${step.accent}22`,
                            boxShadow: `0 0 50px ${step.accent}0d, inset 0 1px 0 ${step.accent}15`,
                        }}
                    >
                        {/* Top accent line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent, ${step.accent}44, transparent)` }}
                        />
                        <p
                            className="leading-[1.9] text-white/65"
                            style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)' }}
                        >
                            <StreamingText
                                key={streamKey}
                                text={step.text}
                                speed={18}
                                skip={skipText}
                                onComplete={() => setTextDone(true)}
                            />
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* CTA button */}
                <AnimatePresence>
                    {textDone && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="px-8 py-3 rounded-full font-black text-sm tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95"
                            style={{
                                fontFamily: 'Orbitron, monospace',
                                background: step.accent,
                                color: '#000',
                                boxShadow: `0 0 30px ${step.accent}55`,
                            }}
                        >
                            {step.isLast ? 'BEGIN ✦' : 'CONTINUE →'}
                        </motion.button>
                    )}
                </AnimatePresence>

                {!textDone && (
                    <p className="text-white/15 text-[9px] font-mono tracking-[0.4em] uppercase mt-2">
                        TAP TO SKIP
                    </p>
                )}
            </div>

            {/* Progress dots */}
            <div
                className="absolute left-0 right-0 flex justify-center gap-1.5 z-[10]"
                style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            >
                {STEPS.map((s, i) => (
                    <motion.div
                        key={s.id}
                        animate={{
                            width: i === stepIdx ? 20 : 6,
                            background: i === stepIdx ? step.accent : 'rgba(255,255,255,0.15)',
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-[5px] rounded-full"
                    />
                ))}
            </div>
        </div>
    );
}
