import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, KeyRound, Telescope, Activity, Sun, Moon } from 'lucide-react';

// ── Typewriter ──────────────────────────────────────────────────────────────
const StreamingText = ({ text, speed = 18, onComplete, skip }) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        setDisplayed(''); setDone(false);
        if (skip) { setDisplayed(text); setDone(true); onComplete?.(); return; }
        let i = 0;
        const iv = setInterval(() => {
            if (i < text.length) { setDisplayed(text.slice(0, ++i)); }
            else { clearInterval(iv); setDone(true); onComplete?.(); }
        }, speed);
        return () => clearInterval(iv);
    }, [text, speed, skip]);
    return <span>{displayed}{!done && <span className="animate-pulse opacity-50">▋</span>}</span>;
};

// ── Per-step visual components ──────────────────────────────────────────────

// Welcome: RASYNC glowing wordmark
const VisualWelcome = ({ isDark }) => (
    <div className="flex flex-col items-center justify-center gap-3">
        <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-black tracking-[0.4em] text-transparent bg-clip-text uppercase"
            style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(2rem, 10vw, 3.5rem)',
                backgroundImage: isDark
                    ? 'linear-gradient(135deg, rgba(255,248,235,0.95) 0%, #72A0FF 60%, rgba(255,248,235,0.6) 100%)'
                    : 'linear-gradient(135deg, rgba(18,14,8,0.88) 0%, #2B4880 60%, rgba(18,14,8,0.5) 100%)',
                filter: isDark ? 'drop-shadow(0 0 30px rgba(114,160,255,0.5))' : 'drop-shadow(0 0 20px rgba(43,72,128,0.25))',
            }}
        >RASYNC</motion.div>
        <div className="flex gap-1.5 mt-1">
            {[...Array(5)].map((_, i) => (
                <motion.div key={i}
                    className="w-1 h-1 rounded-full"
                    style={{ background: isDark ? '#72A0FF' : '#2B4880' }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
            ))}
        </div>
    </div>
);

// Player: HUD with animated frequency bars
const VisualPlayer = ({ isDark }) => {
    const bars = [4, 7, 5, 9, 6, 8, 3, 7, 5, 6, 4, 8];
    const blue = isDark ? '#72A0FF' : '#2B4880';
    return (
        <div className="w-full max-w-[300px] mx-auto">
            <motion.div
                className="rounded-full px-4 py-3 flex items-center gap-3"
                style={{
                    background: isDark ? 'rgba(114,160,255,0.06)' : 'rgba(43,72,128,0.06)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${blue}33`,
                }}
                initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" />
                <span className="font-mono text-[10px] tracking-widest flex-1" style={{ color: blue }}>DELTA DEEP • 2.1Hz</span>
                <div className="flex items-end gap-[2px] h-5">
                    {bars.map((h, i) => (
                        <motion.div key={i} className="w-[3px] rounded-sm" style={{ background: blue }}
                            animate={{ height: [`${h * 2}px`, `${(h + 3) * 2}px`, `${h * 2}px`] }}
                            transition={{ duration: 0.6 + i * 0.08, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}
                </div>
            </motion.div>
            <div className="flex justify-center mt-3">
                <div className="flex items-center rounded-full overflow-hidden text-[11px] font-bold"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                    <span className="px-3 py-1" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(18,14,8,0.25)' }}>ZZZ</span>
                    <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(255,215,0,0.15)', color: '#B8960A' }}>ॐ</span>
                </div>
            </div>
        </div>
    );
};

// Sanctuary / AI: chat bubbles
const VisualSanctuaryAI = ({ isDark }) => (
    <div className="flex flex-col gap-2 w-full max-w-[280px] mx-auto">
        {[
            { from: 'ai', text: 'What do you dream about most often?', delay: 0 },
            { from: 'user', text: 'I keep dreaming I\'m flying...', delay: 0.4 },
            { from: 'ai', text: 'That\'s a classic consciousness expansion symbol ✦', delay: 0.8 },
        ].map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: msg.from === 'ai' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: msg.delay + 0.3, duration: 0.4 }}
                className={`px-3 py-2 rounded-2xl text-[11px] leading-relaxed max-w-[85%] ${msg.from === 'ai' ? 'self-start' : 'self-end'}`}
                style={{
                    background: msg.from === 'ai' ? 'rgba(217,75,30,0.12)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    border: msg.from === 'ai' ? '1px solid rgba(217,75,30,0.2)' : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    color: isDark ? (msg.from === 'ai' ? 'rgba(255,248,235,0.7)' : 'rgba(255,248,235,0.5)') : (msg.from === 'ai' ? 'rgba(18,14,8,0.75)' : 'rgba(18,14,8,0.5)'),
                }}
            >{msg.text}</motion.div>
        ))}
    </div>
);

// Sanctuary / Library: level ladder
const VisualLibrary = ({ isDark }) => {
    const levels = [
        { label: 'SLEEP CYCLES', sub: 'Beginner', color: '#D94B1E' },
        { label: 'VIVID DREAMS', sub: 'Intermediate', color: '#E07818' },
        { label: 'LUCID DREAMING', sub: 'Advanced', color: '#E8A030' },
        { label: 'ASTRAL PROJECTION', sub: 'Master', color: '#C89000' },
    ];
    return (
        <div className="flex flex-col gap-1.5 w-full max-w-[280px] mx-auto">
            {levels.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 + 0.2 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: `${l.color}12`, border: `1px solid ${l.color}2e` }}
                >
                    <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black"
                        style={{ background: l.color, color: '#000' }}>{i + 1}</div>
                    <div>
                        <div className="font-black text-[10px] tracking-widest"
                            style={{ fontFamily: 'Orbitron, monospace', color: isDark ? 'rgba(255,248,235,0.8)' : 'rgba(18,14,8,0.8)' }}>{l.label}</div>
                        <div className="text-[9px] font-mono" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(18,14,8,0.35)' }}>{l.sub}</div>
                    </div>
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: l.color }} />
                </motion.div>
            ))}
        </div>
    );
};

// Sanctuary / Journal: lined journal
const VisualJournal = ({ isDark }) => (
    <div className="w-full max-w-[280px] mx-auto rounded-xl overflow-hidden"
        style={{ background: 'rgba(213,75,30,0.05)', border: '1px solid rgba(213,75,30,0.18)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(213,75,30,0.14)' }}>
            <PenLine size={12} style={{ color: 'rgba(213,75,30,0.6)' }} />
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'rgba(213,75,30,0.5)' }}>Dream Entry • Tonight</span>
        </div>
        {[{ w: '85%', delay: 0.1 }, { w: '72%', delay: 0.2 }, { w: '90%', delay: 0.3 }, { w: '60%', delay: 0.4 }].map((l, i) => (
            <motion.div key={i} className="mx-4 my-2.5 rounded-sm"
                style={{ height: '1px', width: '0%', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(18,14,8,0.1)' }}
                animate={{ width: l.w }}
                transition={{ delay: l.delay + 0.3, duration: 0.6, ease: 'easeOut' }}
            />
        ))}
        <div className="px-4 py-2" style={{ borderTop: '1px solid rgba(213,75,30,0.1)' }}>
            <motion.span animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                className="font-mono text-[9px]" style={{ color: 'rgba(224,120,24,0.5)' }}>AI is analyzing your dream...</motion.span>
        </div>
    </div>
);

// Wisdom Well: octagon sigil
const VisualWisdomWell = ({ isDark }) => {
    const blue = isDark ? '#4A9EFF' : '#2B4880';
    const blueDim = isDark ? '#72A0FF' : '#1E3568';
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{ border: `1px solid ${blue}33` }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ background: blue, boxShadow: `0 0 8px ${blue}` }} />
                </motion.div>
                <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }}
                    className="w-14 h-14 flex items-center justify-center"
                    style={{
                        background: `${blue}12`,
                        border: `1px solid ${blue}44`,
                        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
                    }}
                >
                    <KeyRound size={20} style={{ color: blue, filter: `drop-shadow(0 0 6px ${blue})` }} />
                </motion.div>
            </div>
            <div className="flex gap-2">
                {['☥', '☯', '✡', '⊕', '✦'].map((s, i) => (
                    <motion.span key={i} className="text-sm"
                        style={{ color: `${blue}66` }}
                        animate={{ opacity: [0.2, 0.7, 0.2] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    >{s}</motion.span>
                ))}
            </div>
        </div>
    );
};

// Nexus: orbital rings
const VisualNexus = ({ isDark }) => (
    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        {[1, 2, 3].map((r, i) => (
            <motion.div key={i}
                className="absolute rounded-full"
                style={{ inset: `${i * 10}px`, border: '1px solid rgba(123,101,192,0.22)' }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#7B65C0', boxShadow: '0 0 6px #7B65C0' }} />
            </motion.div>
        ))}
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-8 h-8 flex items-center justify-center"
        >
            <Telescope size={18} style={{ color: '#7B65C0', filter: 'drop-shadow(0 0 6px #7B65C0)' }} />
        </motion.div>
    </div>
);

// Temple: hexagon protocol grid
const VisualTemple = ({ isDark }) => {
    const protocols = [
        { name: 'NEURO', color: '#00BBBB' }, { name: 'CARDIO', color: '#259B68' },
        { name: 'SLEEP', color: '#7B65C0' }, { name: 'COLD', color: isDark ? '#72A0FF' : '#2B5090' },
        { name: 'BREATH', color: '#D94B1E' }, { name: 'LIGHT', color: '#C89000' },
    ];
    return (
        <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mx-auto">
            {protocols.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 + 0.2 }}
                    className="aspect-square flex flex-col items-center justify-center gap-1 rounded-xl"
                    style={{ background: `${p.color}0e`, border: `1px solid ${p.color}28` }}
                >
                    <Activity size={12} style={{ color: p.color }} />
                    <span className="font-mono text-[7px] tracking-widest" style={{ color: `${p.color}99` }}>{p.name}</span>
                </motion.div>
            ))}
        </div>
    );
};

// Synchrony: pulsing OM rings
const VisualSynchrony = ({ isDark }) => (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {[1, 2, 3, 4].map((r, i) => (
            <motion.div key={i}
                className="absolute rounded-full"
                style={{ inset: `${i * 8}px`, border: '1px solid rgba(123,101,192,0.22)' }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
            />
        ))}
        <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl leading-none select-none"
            style={{ color: '#7B65C0', filter: 'drop-shadow(0 0 16px #7B65C0)' }}
        >ॐ</motion.div>
    </div>
);

// Ready: final glow
const VisualReady = ({ isDark }) => (
    <div className="flex flex-col items-center gap-2">
        <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.97, 1.02, 0.97] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-black tracking-[0.5em] text-transparent bg-clip-text"
            style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
                backgroundImage: isDark
                    ? 'linear-gradient(135deg, rgba(255,248,235,0.95) 0%, #72A0FF 50%, rgba(255,248,235,0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(18,14,8,0.88) 0%, #2B4880 50%, rgba(18,14,8,0.88) 100%)',
                filter: isDark ? 'drop-shadow(0 0 24px rgba(114,160,255,0.6))' : 'drop-shadow(0 0 16px rgba(43,72,128,0.3))',
            }}
        >RASYNC</motion.div>
        <div className="flex gap-3 text-xs font-mono tracking-widest"
            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(18,14,8,0.3)' }}>
            <span>ZZZ</span><span>·</span><span>ॐ</span><span>·</span><span>☥</span>
        </div>
    </div>
);

// ── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
    {
        id: 'welcome',
        title: 'WELCOME',
        subtitle: null,
        text: 'Your complete ecosystem for sleep mastery, consciousness expansion, and biological optimization. This is not just an app — it is a system. Let us show you how it works.',
        accent: '#72A0FF',
        accentLight: '#2B4880',
        bg: 'radial-gradient(ellipse at 50% 30%, #0e1030 0%, #080810 100%)',
        bgLight: 'radial-gradient(ellipse at 50% 30%, #f2dece 0%, #ebe7df 100%)',
        Visual: VisualWelcome,
    },
    {
        id: 'player',
        title: 'NEURAL STREAM PLAYER',
        subtitle: 'Lives at the top — always',
        text: 'Your frequency companion never leaves. ZZZ activates deep sleep binaural frequencies — delta, theta, nature layers. ॐ switches to meditation tracks. Tap ↑ to hide it as a glowing LED sliver. Tap the sliver to restore it. It keeps playing.',
        accent: '#72A0FF',
        accentLight: '#2B4880',
        bg: 'radial-gradient(ellipse at 50% 20%, #0a1035 0%, #080810 100%)',
        bgLight: 'radial-gradient(ellipse at 50% 20%, #eee9e1 0%, #ebe7df 100%)',
        Visual: VisualPlayer,
    },
    {
        id: 'sanctuary-ai',
        title: 'THE SANCTUARY',
        subtitle: 'Your AI sleep & dream guide',
        text: 'Your AI Sleep Companion is trained on sleep science, circadian biology, and dream psychology. Ask it anything — why you wake at 3am, what your dreams mean, how to begin lucid dreaming. It knows. It listens. It remembers.',
        accent: '#D94B1E',
        accentLight: '#B83A10',
        bg: 'radial-gradient(circle at center, #150a02 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #f2dece 0%, #ebe7df 100%)',
        Visual: VisualSanctuaryAI,
    },
    {
        id: 'sanctuary-library',
        title: 'KNOWLEDGE LIBRARY',
        subtitle: 'Beginner → Lucid → Astral → Master',
        text: 'A structured curriculum from first principles to mastery. Sleep cycles. Vivid dreams by design. Full lucid dreaming. Then astral projection — navigating non-physical awareness with full intention. The path is mapped. You simply walk it.',
        accent: '#D94B1E',
        accentLight: '#B83A10',
        bg: 'radial-gradient(circle at center, #150a02 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #f2dece 0%, #ebe7df 100%)',
        Visual: VisualLibrary,
    },
    {
        id: 'sanctuary-journal',
        title: 'DREAM JOURNAL',
        subtitle: 'Decode your subconscious nightly',
        text: 'Every dream you record is analyzed by your AI guide. Recurring symbols surface. Emotional patterns decode. Messages from your subconscious are translated into plain language. Journal nightly for the deepest results.',
        accent: '#E07818',
        accentLight: '#C46010',
        bg: 'radial-gradient(circle at center, #150a02 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #f2dece 0%, #ebe7df 100%)',
        Visual: VisualJournal,
    },
    {
        id: 'wisdomwell',
        title: 'THE WISDOM WELL',
        subtitle: 'Zero dogma. Pure signal.',
        text: 'Ten sacred teachings from humanity\'s deepest wisdom traditions — The Hermetic Principles, The Buddha\'s Path, The Tao Te Ching, The Yoga Sutras, The Gnostic Gospels, Jungian Archetypes. No doctrine. No gatekeeping. Only the universal patterns every culture independently converged on.',
        accent: '#4A9EFF',
        accentLight: '#2B4880',
        bg: 'radial-gradient(ellipse at 50% 30%, #091428 0%, #080810 100%)',
        bgLight: 'radial-gradient(ellipse at 50% 30%, #e8edf8 0%, #ebe7df 100%)',
        Visual: VisualWisdomWell,
    },
    {
        id: 'nexus',
        title: 'THE NEXUS',
        subtitle: 'Cosmic intelligence, live',
        text: 'The Nexus reads the cosmos on your behalf. Live planetary alignments decoded. Current lunar phase and its documented effects on sleep, emotion, and biology. Weekly astrological intelligence updated every seven days. Align your energy with the universe — not against it.',
        accent: '#7B65C0',
        accentLight: '#5A4AA8',
        bg: 'radial-gradient(circle at center, #0c0418 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #e8e0f2 0%, #ebe7df 100%)',
        Visual: VisualNexus,
    },
    {
        id: 'temple',
        title: 'THE TEMPLE',
        subtitle: 'Your biological engineering lab',
        text: '23 expert protocols with over 100 precision habits. Neurogenesis Mode, Cold Exposure, Heart-Coherence Engine, Circadian Mastery, Pineal Activation, Vagus Nerve Tone. Each habit has a scheduled time, duration, difficulty, and the science behind it. Build your daily stack. The app reminds you when it\'s time.',
        accent: '#259B68',
        accentLight: '#1A7A50',
        bg: 'radial-gradient(circle at center, #021408 0%, #0a0d18 100%)',
        bgLight: 'radial-gradient(circle at center, #d8f0e4 0%, #ebe7df 100%)',
        Visual: VisualTemple,
    },
    {
        id: 'synchrony',
        title: 'SYNCHRONY',
        subtitle: 'The global coherence field',
        text: 'HeartMath Institute research and Dr. John Hagelin\'s quantum field studies document measurable drops in violence during synchronized group meditation. Coherence propagates non-linearly. Mystics and physicists agree: when 8% of humanity aligns in daily meditation for peace, no shadow can sustain itself. Every day, at a set time, we join. We breathe. We resonate.',
        accent: '#7B65C0',
        accentLight: '#5A4AA8',
        bg: 'radial-gradient(ellipse at 50% 30%, #140020 0%, #080810 100%)',
        bgLight: 'radial-gradient(ellipse at 50% 30%, #ede0f5 0%, #ebe7df 100%)',
        Visual: VisualSynchrony,
    },
    {
        id: 'ready',
        title: 'THE UNIVERSE IS WAITING',
        subtitle: null,
        text: 'You now hold the map. The Sanctuary has your first frequency loaded. The Library has your first lesson ready. The Temple has your first protocol queued. The Wisdom Well is open. The Nexus is aligned. Synchrony runs every day. Begin.',
        accent: '#72A0FF',
        accentLight: '#2B4880',
        bg: 'radial-gradient(ellipse at 50% 30%, #0e1030 0%, #080810 100%)',
        bgLight: 'radial-gradient(ellipse at 50% 30%, #f2dece 0%, #ebe7df 100%)',
        Visual: VisualReady,
        isLast: true,
    },
];

// ── Main Tutorial Component ──────────────────────────────────────────────────
export default function Tutorial({ onComplete, isDark, setIsDark }) {
    const [stepIdx, setStepIdx] = useState(0);
    const [textDone, setTextDone] = useState(false);
    const [skipText, setSkipText] = useState(false);
    const [streamKey, setStreamKey] = useState(0);

    const step = STEPS[stepIdx];

    // Theme-aware color tokens
    const t = {
        title:   isDark ? 'rgba(255,248,235,0.95)' : 'rgba(18,14,8,0.88)',
        body:    isDark ? 'rgba(255,248,235,0.60)' : 'rgba(18,14,8,0.55)',
        muted:   isDark ? 'rgba(255,248,235,0.22)' : 'rgba(18,14,8,0.30)',
        glass:   isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,252,245,0.70)',
        topLine: isDark ? `${step.accent}44`        : `${step.accentLight}33`,
        dot:     isDark ? 'rgba(255,255,255,0.15)'  : 'rgba(0,0,0,0.15)',
    };
    const accent = isDark ? step.accent : step.accentLight;

    const goNext = useCallback(() => {
        if (step.isLast) { localStorage.setItem('rasync_tutorial_seen', '1'); onComplete?.(); return; }
        setStepIdx(p => p + 1);
        setTextDone(false); setSkipText(false); setStreamKey(p => p + 1);
    }, [step, onComplete]);

    const skipAll = () => { localStorage.setItem('rasync_tutorial_seen', '1'); onComplete?.(); };
    const handleTap = () => { if (!textDone) setSkipText(true); else goNext(); };

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
            style={{ fontFamily: "'Exo 2', sans-serif" }}>

            {/* Animated background */}
            <AnimatePresence mode="wait">
                <motion.div key={`bg-${stepIdx}-${isDark}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                    style={{ background: isDark ? step.bg : step.bgLight }}
                />
            </AnimatePresence>

            {/* Accent glow bloom */}
            <motion.div key={`bloom-${stepIdx}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${accent}0a 0%, transparent 65%)` }}
            />

            {/* Subtle particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(14)].map((_, i) => (
                    <motion.div key={i} className="absolute rounded-full"
                        style={{ width: 1.5, height: 1.5, background: accent, left: `${(i * 17 + 7) % 100}%`, top: `${(i * 23 + 13) % 100}%`, opacity: 0.2 }}
                        animate={{ opacity: [0.08, 0.3, 0.08], y: [-8, 8, -8] }}
                        transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.4 }}
                    />
                ))}
            </div>

            {/* Top bar: theme toggle + step counter + skip */}
            <div className="absolute top-0 left-0 right-0 z-[20] flex items-center justify-between px-4"
                style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}>
                {/* Step counter */}
                <span className="text-[10px] font-mono tracking-widest" style={{ color: t.muted }}>
                    {String(stepIdx + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
                </span>

                {/* Theme toggle + Skip */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsDark?.(!isDark)}
                        className="p-2 transition-opacity hover:opacity-70 active:opacity-50"
                        style={{ color: t.muted }}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={13} /> : <Moon size={13} />}
                    </button>
                    <button onClick={skipAll}
                        className="text-[10px] font-mono tracking-[0.3em] uppercase transition-opacity hover:opacity-70 px-2 py-2"
                        style={{ color: t.muted }}>SKIP</button>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-[10] flex flex-col items-center px-5 w-full max-w-lg mt-8"
                onClick={handleTap} style={{ cursor: 'pointer' }}>

                {/* Visual component */}
                <AnimatePresence mode="wait">
                    <motion.div key={`visual-${stepIdx}`}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-6 w-full flex justify-center"
                    >
                        <step.Visual isDark={isDark} />
                    </motion.div>
                </AnimatePresence>

                {/* Title */}
                <AnimatePresence mode="wait">
                    <motion.h1 key={`title-${stepIdx}`}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="font-black text-center tracking-[0.25em] uppercase mb-1"
                        style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(0.85rem, 3vw, 1.2rem)', color: t.title }}
                    >{step.title}</motion.h1>
                </AnimatePresence>

                {step.subtitle && (
                    <AnimatePresence mode="wait">
                        <motion.p key={`sub-${stepIdx}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4"
                            style={{ color: accent }}
                        >{step.subtitle}</motion.p>
                    </AnimatePresence>
                )}
                {!step.subtitle && <div className="mb-4" />}

                {/* Glass text panel */}
                <AnimatePresence mode="wait">
                    <motion.div key={`panel-${stepIdx}`}
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.12 }}
                        className="w-full rounded-2xl p-4 md:p-5 mb-5 text-left relative overflow-hidden"
                        style={{
                            background: t.glass,
                            backdropFilter: 'blur(24px)',
                            border: `1px solid ${accent}22`,
                            boxShadow: `0 0 40px ${accent}08, inset 0 1px 0 ${accent}10`,
                        }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent, ${t.topLine}, transparent)` }} />
                        <p className="leading-[1.85]" style={{ fontSize: 'clamp(0.78rem, 2.2vw, 0.9rem)', color: t.body }}>
                            <StreamingText key={streamKey} text={step.text} speed={17}
                                skip={skipText} onComplete={() => setTextDone(true)} />
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* CTA */}
                <AnimatePresence>
                    {textDone && (
                        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="px-7 py-2.5 rounded-full font-black text-[11px] tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95"
                            style={{ fontFamily: 'Orbitron, monospace', background: accent, color: isDark ? '#000' : '#fff', boxShadow: `0 0 24px ${accent}55` }}
                        >{step.isLast ? 'BEGIN ✦' : 'CONTINUE →'}</motion.button>
                    )}
                </AnimatePresence>

                {!textDone && (
                    <p className="text-[9px] font-mono tracking-[0.4em] uppercase mt-1" style={{ color: t.muted }}>TAP TO SKIP</p>
                )}
            </div>

            {/* Progress dots */}
            <div className="absolute left-0 right-0 flex justify-center gap-1.5 z-[10]"
                style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
                {STEPS.map((s, i) => (
                    <motion.div key={s.id}
                        animate={{ width: i === stepIdx ? 18 : 5, background: i === stepIdx ? accent : t.dot }}
                        transition={{ duration: 0.3 }} className="h-[4px] rounded-full" />
                ))}
            </div>
        </div>
    );
}
