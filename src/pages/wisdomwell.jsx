
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ChevronDown, ChevronUp, Sparkles, Eye, Star, Sun, Moon,
  Flower2, Search, Database, ShieldCheck, Cpu, KeyRound, Flame,
  CircleDashed, Focus, Sword, Gem, Waves, Music, LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HolographicSigil = ({ Icon, isExpanded, id, wwP, wwD }) => {
  return (
    <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center group/sigil shrink-0">
      {/* Orbital Discovery Ring */}
      <div
        className={`absolute inset-0 rounded-full ${isExpanded ? 'animate-[spin_10s_linear_infinite]' : 'group-hover/sigil:animate-[spin_15s_linear_infinite]'}`}
        style={{ border: `1px solid ${wwP}1a` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: wwP, boxShadow: `0 0 10px ${wwP}` }}></div>
      </div>

      {/* Secondary Pulse Ring */}
      <motion.div
        animate={isExpanded ? { scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-2 rounded-full"
        style={{ border: `1px solid ${wwP}0d` }}
      />

      {/* The Core Glass Container */}
      <div
        className={`relative z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-700 ${isExpanded ? 'scale-110' : ''}`}
        style={{
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
          borderWidth: '1px',
          borderStyle: 'solid',
          background: isExpanded ? `${wwD}22` : undefined,
          borderColor: isExpanded ? wwP : undefined,
          boxShadow: isExpanded ? `0 0 50px ${wwD}4d` : undefined,
        }}
      >
        {/* Internal Nebula Glow */}
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${isExpanded ? 'opacity-100' : 'group-hover/sigil:opacity-50'}`}
          style={{ background: `radial-gradient(circle at 50% 50%, ${wwD}4d, transparent 70%)` }}
        ></div>

        {/* The Icon itself with bespoke styling */}
        <div className="relative z-20">
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id={`icon-grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor={wwP} />
              </linearGradient>
            </defs>
          </svg>
          <Icon
            size={22}
            strokeWidth={1.2}
            className={`transition-all duration-700 md:w-7 md:h-7`}
            style={{
              color: isExpanded ? wwP : undefined,
              stroke: isExpanded ? `url(#icon-grad-${id})` : undefined,
              opacity: isExpanded ? 1 : 0.4,
            }}
          />
        </div>
      </div>

      {/* Background Static Geometric Burst */}
      <div className={`absolute inset-4 opacity-[0.03] transition-all duration-700 pointer-events-none ${isExpanded ? 'rotate-45 scale-150 opacity-[0.07]' : ''}`}
        style={{ backgroundImage: `repeating-conic-gradient(${wwP} 0% 1%, transparent 1% 10%)` }}>
      </div>
    </div>
  );
};

export default function WisdomWell() {
  const [expandedCard, setExpandedCard] = useState(null);

  // Track theme for adapting hardcoded blue colors
  const [isLight, setIsLight] = useState(
    () => document.documentElement.dataset.theme === 'light'
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsLight(document.documentElement.dataset.theme === 'light');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  // Theme-aware Wisdom Well blue palette
  // Dark: bright electric blue  /  Light: deep navy, low-saturation glow
  const wwP = isLight ? '#2B4880' : '#72A0FF';   // primary (borders, text, icons)
  const wwD = isLight ? '#1E3568' : '#4A9EFF';   // dim / secondary blue

  const wisdomThreads = [
    {
      id: 1,
      icon: KeyRound,
      title: "The Hermetic Principles",
      description: "The 7 universal laws governing reality from The Kybalion.",
      content: (
        <>
          <h3>THE HERMETIC PRINCIPLES: THE ARCHITECT'S BLUEPRINT</h3>

          <p><em>Do not read this as philosophy. Read it as the source code of reality itself, the operating system your soul agreed to run on before you entered this dream of form.</em></p>

          <p>These seven laws, whispered from the heart of Thoth-Hermes, are the master keys to understanding everything—from the spin of a galaxy to the storm in your mind. To master your sleep and your dreams, you must first understand the nature of the reality in which you are dreaming.</p>

          <h4>I. THE PRINCIPLE OF MENTALISM</h4>
          <p><strong>"THE ALL is MIND; The Universe is Mental."</strong></p>
          <p>This is the first and final truth. The cosmos is not a dead, mechanical void. It is a living, thinking, infinite consciousness. The physical world you perceive is a mental construct, a projection of this one infinite mind. You are not a drop in the ocean; you are the entire ocean in a drop. Your thoughts are not harmless whispers; they are the first drafts of reality. The "silent alchemy of sleep" is where you, as a sovereign focal point of THE ALL, have the most direct access to the drafting table to rewrite your being.</p>

          <h4>II. THE PRINCIPLE OF CORRESPONDENCE</h4>
          <p><strong>"As above, so below; as below, so above."</strong></p>
          <p>This is the law of fractal harmony. The spiral of a galaxy and the spiral of your DNA are the same pattern. The chaos of your day (the "below") is a perfect reflection of the chaos in your mind (the "above"). The external world is a mirror, showing you the vibrational state of your inner world. To calm your sleep, you must first calm your inner cosmos. The macrocosm and microcosm are in constant, unspoken dialogue.</p>

          <h4>III. THE PRINCIPLE OF VIBRATION</h4>
          <p><strong>"Nothing rests; everything moves; everything vibrates."</strong></p>
          <p>Your fear has a frequency. Your love has a frequency. A rock has a frequency. The 432 Hz tone you listen to is not a metaphor; it is a surgical tool to recalibrate the dissonant vibration of stress back into the coherent frequency of peace. You are a walking symphony of vibrating energy, and sleep is your daily tuning session. To change your state, you must change your vibration.</p>

          <h4>IV. THE PRINCIPLE OF POLARITY</h4>
          <p><strong>"Everything is dual; everything has poles; everything has its pair of opposites..."</strong></p>
          <p>Heat and cold, love and hate, wakefulness and sleep—these are not enemies, but the same thing, differing only in degree. The anxiety that keeps you awake is not the opposite of peace; it is undeveloped peace. By applying the mental art of Transmutation, you can shift your perspective along the pole. See the "nightmare" not as a terror, but as an intense, unintegrated lesson. The shadow cannot exist without a light to cast it.</p>

          <h4>V. THE PRINCIPLE OF RHYTHM</h4>
          <p><strong>"Everything flows, out and in; everything has its tides..."</strong></p>
          <p>All of life is a pendulum swing. Your energy, your mood, your focus—they all have their rhythm. The descent into sleep and the ascent into wakefulness are the most fundamental rhythms you possess. You cannot hold the pendulum still. But by understanding this law, you can learn to neutralize its effects in your mind. You can observe the swing from anxiety to calm without being swept away by it, finding the still point in the center—the eye of the storm.</p>

          <h4>VI. THE PRINCIPLE OF CAUSE AND EFFECT</h4>
          <p><strong>"Every Cause has its Effect; every Effect has its Cause..."</strong></p>
          <p>There is no such thing as chance. The universe is a court of divine justice. The effect of "restless sleep" has a cause: perhaps the caffeine, the unprocessed stress, the chaotic energy of the day. The effect of "vivid, healing dreams" also has a cause: the wind-down ritual, the clear intention, the coherent frequency. You are not a victim of your sleep. You are its cause. Take sovereignty.</p>

          <h4>VII. THE PRINCIPLE OF GENDER</h4>
          <p><strong>"Gender is in everything; everything has its Masculine and Feminine Principles..."</strong></p>
          <p>This is not about biology. It is about the fundamental creative forces. The Masculine principle is the focused, active, projecting energy—your intention to sleep. The Feminine principle is the receptive, nurturing, generative energy—the state of allowing sleep to come. You must wield both. You cannot force sleep (overuse of Masculine), nor can you be a passive victim of insomnia (overuse of Feminine). You must set the clear intention, and then surrender to the process, allowing your body to perform its natural alchemy.</p>

          <h4>TO INTEGRATE THIS, ASK YOURSELF:</h4>
          <p>• Which of these principles feels most alive to me right now?</p>
          <p>• Where in my life do I see the Principle of Correspondence playing out?</p>
          <p>• How can I use the Principle of Vibration tonight to shift my state before sleep?</p>

          <p><em>This is not knowledge to be collected. It is a lens through which to see the world. Wield it wisely.</em></p>
        </>
      )
    },
    {
      id: 2,
      icon: Flame,
      title: "The Christ Consciousness",
      description: "The esoteric wisdom of Jesus from the Sermon on the Mount.",
      content: (
        <>
          <h3>THE TEACHINGS OF CHRIST CONSCIOUSNESS</h3>
          <p><em>A roadmap to awakening the divine awareness within—the understanding that you are one with the Source of all life.</em></p>

          <h4>THE BEATITUDES - The Path to Divine Consciousness</h4>
          <p><em>These are not passive blessings but active, energetic stances for the awakened seeker.</em></p>

          <p><strong>"Blessed are the poor in spirit, for theirs is the kingdom of heaven."</strong></p>
          <p>This is the sacred starting point: the emptying of the ego. It is the conscious choice to release the need to know, control, and appear spiritually full. In this state of humble receptivity—this "holy emptiness"—the noise of the personal self subsides, and you become a clear vessel for the infinite. The "kingdom of heaven" is the direct experience of this unified consciousness.</p>

          <p><strong>"Blessed are those who mourn, for they shall be comforted."</strong></p>
          <p>This sanctifies the full human experience. To "mourn" is to allow yourself to feel deeply—grief, pain, or the longing for a world more beautiful. This is not a state of victimhood, but of profound authenticity. By courageously feeling your pain without resistance, you alchemize it into compassion and profound inner peace. The "comfort" is the arrival of a grace that knows you are more than your suffering.</p>

          <p><strong>"Blessed are the meek, for they shall inherit the earth."</strong></p>
          <p>"Meekness" is not weakness; it is mastered strength. It is the power of a river, not a dam. It is the quiet confidence that needs no validation, the gentle firmness that needs no force. This is the essence of Inner Sovereignty—you are unshakable because your power comes from your connection to Source, not from external approval or domination. You "inherit the earth" by living in harmonious, empowered co-creation with it.</p>

          <h4>THE TEACHING ON LIGHT: Your Fundamental Identity</h4>
          <p><strong>"You are the light of the world. A city on a hill cannot be hidden. Let your light shine before others."</strong></p>
          <p>This is a declaration of your true nature, not a future goal. The journey is not one of becoming the light, but of remembering it and removing all that you have been taught that dims it. Your unique expression of this light is essential to the whole. To "hide your light" is to withhold your unique gift from a world that needs it. Your authentic expression—your joy, your creativity, your love—is your greatest service.</p>

          <h4>THE LAW OF DIVINE RECIPROCITY: The Responsive Universe</h4>
          <p><strong>"Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you."</strong></p>
          <p>This is the cosmic law of cause and effect in action. The "asking" is the setting of a clear, heartfelt intention from your sovereign self. The "seeking" is the taking of aligned action—moving in faith toward your vision. The "knocking" is persistent, patient faith. The Universe is a conscious, responsive partner in your awakening, meeting your genuine vibration with matching opportunities and grace.</p>

          <h4>THE INNER KINGDOM: The Seat of Your Sovereignty</h4>
          <p><strong>"The kingdom of God is within you."</strong></p>
          <p>All seeking ends here, in the silent space of your own being. You need not petition an external god or achieve a distant goal to find peace, love, or power. These are native qualities of your own consciousness, waiting to be discovered in the quiet mind and open heart. Turning inward is not an escape from the world, but the only way to engage with it from a place of wholeness and divine truth.</p>
        </>
      )
    },
    {
      id: 3,
      icon: CircleDashed,
      title: "The Buddha's Path",
      description: "The Four Noble Truths and the Noble Eightfold Path to liberation.",
      content: (
        <>
          <h3>THE FOUR NOBLE TRUTHS</h3>

          <h4>1. THE TRUTH OF SUFFERING (Dukkha)</h4>
          <p>Life contains suffering, dissatisfaction, and impermanence. This is not pessimism but realistic observation.</p>

          <h4>2. THE TRUTH OF THE CAUSE OF SUFFERING (Samudaya)</h4>
          <p>Suffering arises from craving, attachment, and ignorance. We suffer because we cling to what is temporary and resist what is.</p>

          <h4>3. THE TRUTH OF THE END OF SUFFERING (Nirodha)</h4>
          <p>Suffering can cease. Liberation is possible through the elimination of craving and the realization of true nature.</p>

          <h4>4. THE TRUTH OF THE PATH (Magga)</h4>
          <p>There is a practical path to the end of suffering: The Noble Eightfold Path.</p>

          <h3>THE NOBLE EIGHTFOLD PATH</h3>

          <p><strong>RIGHT VIEW:</strong> Understanding the Four Noble Truths and the nature of reality.</p>
          <p><strong>RIGHT INTENTION:</strong> Commitment to mental and ethical growth with thoughts of renunciation, goodwill, and harmlessness.</p>
          <p><strong>RIGHT SPEECH:</strong> Speaking truthfully, avoiding gossip, harsh words, and idle chatter.</p>
          <p><strong>RIGHT ACTION:</strong> Acting ethically and morally, not harming living beings.</p>
          <p><strong>RIGHT LIVELIHOOD:</strong> Earning a living in a way that doesn't harm others.</p>
          <p><strong>RIGHT EFFORT:</strong> Cultivating positive states of mind and eliminating negative ones.</p>
          <p><strong>RIGHT MINDFULNESS:</strong> Developing awareness of body, feelings, mind, and phenomena.</p>
          <p><strong>RIGHT CONCENTRATION:</strong> Developing deep states of meditative absorption.</p>
        </>
      )
    },
    {
      id: 4,
      icon: Focus,
      title: "The Yoga Sutras of Patanjali",
      description: "The 8 limbs of Yoga—the path to self-realization.",
      content: (
        <>
          <h3>THE EIGHT LIMBS OF YOGA</h3>

          <h4>1. YAMA (Ethical Restraints)</h4>
          <p><strong>Ahimsa:</strong> Non-violence in thought, word, and deed.</p>
          <p><strong>Satya:</strong> Truthfulness.</p>
          <p><strong>Asteya:</strong> Non-stealing.</p>
          <p><strong>Brahmacharya:</strong> Moderation and control of the senses.</p>
          <p><strong>Aparigraha:</strong> Non-possessiveness, letting go of greed.</p>

          <h4>2. NIYAMA (Personal Observances)</h4>
          <p><strong>Saucha:</strong> Purity of body and mind.</p>
          <p><strong>Santosha:</strong> Contentment.</p>
          <p><strong>Tapas:</strong> Self-discipline and austerity.</p>
          <p><strong>Svadhyaya:</strong> Self-study and study of sacred texts.</p>
          <p><strong>Ishvara Pranidhana:</strong> Surrender to the divine.</p>

          <h4>3. ASANA (Physical Postures)</h4>
          <p>Steady and comfortable postures that prepare the body for meditation.</p>

          <h4>4. PRANAYAMA (Breath Control)</h4>
          <p>Regulation of the breath to control the flow of prana (life force energy).</p>

          <h4>5. PRATYAHARA (Withdrawal of Senses)</h4>
          <p>Turning inward by withdrawing the senses from external objects.</p>

          <h4>6. DHARANA (Concentration)</h4>
          <p>Focused attention on a single point or object.</p>

          <h4>7. DHYANA (Meditation)</h4>
          <p>Uninterrupted flow of concentration, sustained meditation.</p>

          <h4>8. SAMADHI (Absorption)</h4>
          <p>Complete absorption, union with the object of meditation, enlightenment.</p>
        </>
      )
    },
    {
      id: 5,
      icon: Sword,
      title: "The Bhagavad Gita",
      description: "The path of Dharma, duty, and devotion from Krishna's teachings.",
      content: (
        <>
          <h3>THE TEACHINGS OF THE BHAGAVAD GITA</h3>

          <h4>THE THREE PATHS TO LIBERATION</h4>

          <p><strong>KARMA YOGA (Path of Action):</strong></p>
          <p>"You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."</p>
          <p>Act without attachment to outcomes. Perform your duty with devotion, offering the results to the divine.</p>

          <p><strong>BHAKTI YOGA (Path of Devotion):</strong></p>
          <p>"Those who worship Me with devotion, I am in them and they are in Me."</p>
          <p>Cultivate love and devotion to the divine in all its forms. Surrender the ego and find union through love.</p>

          <p><strong>JNANA YOGA (Path of Knowledge):</strong></p>
          <p>"The soul is neither born, and nor does it die. It is unborn, eternal, ever-existing, and primeval."</p>
          <p>Realize the true self (Atman) through wisdom and discrimination between the real and unreal.</p>

          <h4>ON DHARMA (Righteous Duty)</h4>
          <p>"It is better to perform one's own duties imperfectly than to master the duties of another."</p>
          <p>Live in alignment with your true nature and purpose. Your dharma is your unique expression of the divine.</p>

          <h4>ON EQUANIMITY</h4>
          <p>"One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness has attained true wisdom."</p>
          <p>Cultivate balance and steadiness in all circumstances.</p>
        </>
      )
    },
    {
      id: 6,
      icon: Gem,
      title: "The Emerald Tablet",
      description: "The ancient alchemical wisdom of Hermes Trismegistus.",
      content: (
        <>
          <h3>THE EMERALD TABLET OF HERMES</h3>

          <p><em>True, without falsehood, certain and most true:</em></p>

          <p><strong>"That which is below is like that which is above, and that which is above is like that which is below, to accomplish the miracles of the one thing."</strong></p>
          <p>The fundamental law of correspondence—patterns repeat at all levels of existence.</p>

          <p><strong>"And as all things have been and arose from One, by the mediation of One, so all things have their birth from this One Thing by adaptation."</strong></p>
          <p>All creation emanates from a single source. Diversity arises from unity.</p>

          <p><strong>"The Sun is its father, the Moon its mother, the Wind hath carried it in its belly, the Earth is its nurse."</strong></p>
          <p>The four elements and celestial forces combine to create and sustain life.</p>

          <p><strong>"Separate thou the earth from the fire, the subtle from the gross, sweetly with great industry."</strong></p>
          <p>The alchemical process of purification—refining consciousness by separating the essential from the non-essential.</p>

          <p><strong>"It ascends from the earth to the heaven and again it descends to the earth, and receives the force of things superior and inferior."</strong></p>
          <p>The cycle of evolution—spirit descends into matter and matter ascends back to spirit, gaining wisdom through experience.</p>

          <p><strong>"By this means you shall have the glory of the whole world, and thereby all obscurity shall fly from you."</strong></p>
          <p>Through this understanding, you gain mastery over reality and illuminate all darkness.</p>
        </>
      )
    },
    {
      id: 7,
      icon: Waves,
      title: "The Tao Te Ching",
      description: "The philosophy of Wu Wei and the flow of the Tao.",
      content: (
        <>
          <h3>THE WAY OF THE TAO</h3>

          <h4>THE NATURE OF THE TAO</h4>
          <p>"The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name."</p>
          <p>Ultimate reality transcends words and concepts. It must be experienced directly.</p>

          <h4>WU WEI (Non-Action)</h4>
          <p>"The Tao does nothing, yet leaves nothing undone."</p>
          <p>Wu Wei is not inaction but effortless action—acting in harmony with the natural flow of life, without force or struggle.</p>

          <h4>THE POWER OF SOFTNESS</h4>
          <p>"Nothing in the world is as soft and yielding as water. Yet for dissolving the hard and inflexible, nothing can surpass it."</p>
          <p>True strength lies in flexibility and gentleness, not in rigidity and force.</p>

          <h4>EMBRACING SIMPLICITY</h4>
          <p>"In the pursuit of learning, every day something is acquired. In the pursuit of Tao, every day something is dropped."</p>
          <p>Wisdom comes through unlearning, simplification, and returning to natural spontaneity.</p>

          <h4>THE UNCARVED BLOCK (P'u)</h4>
          <p>"Return to the root and you will find the meaning."</p>
          <p>Maintain the simplicity and purity of your original nature, unconditioned by society and ego.</p>

          <h4>YIN AND YANG</h4>
          <p>"Being and non-being create each other. Difficult and easy support each other."</p>
          <p>Opposites are complementary. Harmony arises from the balance of polarities.</p>
        </>
      )
    },
    {
      id: 8,
      icon: Music,
      title: "The Stories of Krishna",
      description: "Divine plays and teachings from the Bhagavata Purana.",
      content: (
        <>
          <h3>THE DIVINE LEELAS OF KRISHNA</h3>

          <h4>THE BUTTER THIEF</h4>
          <p>Young Krishna steals butter from the village homes, enchanting all with his innocence and charm.</p>
          <p><strong>The Teaching:</strong> The divine comes to steal your heart—not through force, but through irresistible love and playfulness. Surrender is sweet, not serious.</p>

          <h4>LIFTING GOVARDHAN HILL</h4>
          <p>When villagers worship Indra out of fear, Krishna teaches them to honor their immediate environment—the hill that provides for them. When Indra rages, Krishna lifts the entire Govardhan Hill on his little finger to shelter all.</p>
          <p><strong>The Teaching:</strong> True divinity protects without effort. The divine doesn't need grand displays—it simply IS, and that is enough.</p>

          <h4>THE DANCE WITH THE GOPIS (Rasa Lila)</h4>
          <p>Krishna multiplies himself to dance with each gopi simultaneously, each believing she alone is with him.</p>
          <p><strong>The Teaching:</strong> The divine is infinitely present, fully available to each soul individually. God's love is not divided—it is complete for everyone.</p>

          <h4>KALIYA THE SERPENT</h4>
          <p>Krishna dances on the heads of the poisonous serpent Kaliya, subduing but not killing him, then sends him away to live peacefully.</p>
          <p><strong>The Teaching:</strong> Darkness and poison are not to be destroyed but transformed. Even the toxic parts of existence have their place when balanced by consciousness.</p>

          <h4>THE FLUTE</h4>
          <p>Krishna's flute calls all beings irresistibly to him. The flute itself is hollow—empty.</p>
          <p><strong>The Teaching:</strong> To receive the divine, become empty like the flute. The ego must hollow itself to become an instrument of the infinite.</p>
        </>
      )
    },
    {
      id: 9,
      icon: Eye,
      title: "The Gnostic Gospels",
      description: "The inner-knowing teachings from the Gospel of Thomas.",
      content: (
        <>
          <h3>THE GOSPEL OF THOMAS - SAYINGS OF JESUS</h3>

          <h4>THE KINGDOM IS WITHIN</h4>
          <p>"If those who lead you say, 'See, the Kingdom is in the sky,' then the birds will precede you. If they say, 'It is in the sea,' then the fish will precede you. Rather, the Kingdom is inside of you, and it is outside of you."</p>
          <p>The divine realm is not a distant place but a state of consciousness, accessible here and now.</p>

          <h4>KNOW THYSELF</h4>
          <p>"When you come to know yourselves, then you will be known, and you will realize that you are the children of the living Father."</p>
          <p>Self-knowledge is God-knowledge. To know your true nature is to know divinity.</p>

          <h4>BECOME AS A CHILD</h4>
          <p>"When you make the two one, and when you make the inside like the outside... then you will enter the Kingdom."</p>
          <p>Integration and wholeness—transcending duality—is the key to enlightenment.</p>

          <h4>THE LIGHT WITHIN</h4>
          <p>"There is light within a person of light, and it lights up the whole world. If it does not shine, there is darkness."</p>
          <p>You are either emanating consciousness or unconsciousness. There is no neutral state.</p>

          <h4>SEEK AND YOU WILL FIND</h4>
          <p>"Let him who seeks continue seeking until he finds. When he finds, he will become troubled. When he becomes troubled, he will be astonished, and he will rule over all."</p>
          <p>The path to truth disturbs the false self before revealing liberation.</p>

          <h4>SPLIT A PIECE OF WOOD</h4>
          <p>"Split a piece of wood; I am there. Lift up the stone, and you will find me there."</p>
          <p>The Christ consciousness (divine awareness) pervades all of material reality. God is immanent, not transcendent alone.</p>
        </>
      )
    },
    {
      id: 10,
      icon: LayoutGrid,
      title: "Jungian Archetypes",
      description: "Carl Jung's concepts of the Collective Unconscious and archetypes.",
      content: (
        <>
          <h3>THE JUNGIAN ARCHETYPES</h3>

          <h4>THE COLLECTIVE UNCONSCIOUS</h4>
          <p>Beneath personal consciousness lies a deeper layer shared by all humanity—the collective unconscious. It contains universal patterns of experience and behavior: the archetypes.</p>

          <h4>THE MAJOR ARCHETYPES</h4>

          <p><strong>THE SELF:</strong></p>
          <p>The totality of the psyche, the union of conscious and unconscious. The Self is the organizing principle, the source of wholeness. The goal of individuation is to realize the Self.</p>

          <p><strong>THE SHADOW:</strong></p>
          <p>The unconscious, rejected aspects of your personality. What you deny in yourself. Integrating the shadow is essential for wholeness—you cannot be whole by only accepting the "good" parts.</p>

          <p><strong>THE ANIMA/ANIMUS:</strong></p>
          <p>The Anima is the feminine aspect within a man; the Animus is the masculine aspect within a woman. These are the inner contrasexual images that mediate between ego and unconscious.</p>

          <p><strong>THE PERSONA:</strong></p>
          <p>The mask you wear in social situations—the public self. While necessary for functioning, over-identification with the persona leads to loss of genuine self.</p>

          <h4>OTHER KEY ARCHETYPES</h4>

          <p><strong>THE HERO:</strong> The one who confronts challenges and emerges transformed.</p>
          <p><strong>THE WISE OLD MAN/WOMAN:</strong> The archetype of wisdom and guidance.</p>
          <p><strong>THE TRICKSTER:</strong> The disruptor, the one who breaks rules and brings necessary chaos.</p>
          <p><strong>THE MOTHER:</strong> Nourishment, protection, unconditional love.</p>
          <p><strong>THE FATHER:</strong> Structure, authority, law.</p>

          <h4>INDIVIDUATION</h4>
          <div className="wisdom-dossier-card">
            <div className="data-stream-glow"></div>
            <p>"Until you make the unconscious conscious, it will direct your life and you will call it fate."</p>
          </div>
          <p>The process of becoming a psychologically mature individual—integrating the conscious and unconscious, the personal and collective, into a unified Self.</p>
        </>
      )
    }
  ];

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="wisdom-well font-['Exo_2'] min-h-screen relative overflow-x-hidden pt-24 pb-20">
      {/* BACKGROUND — adapts to light/dark theme */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="ww-bg-layer absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.15)]" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&family=Space+Mono&display=swap');

        /* ── Dark theme (default) ── */
        .wisdom-well { isolation: isolate; color: rgba(255,255,255,0.87); background: #090912; }
        .ww-bg-layer { background: radial-gradient(ellipse at 50% 0%, rgba(74,100,180,0.12) 0%, transparent 70%); }
        .wisdom-well .ww-accent { color: #72A0FF; }
        .wisdom-well .ancient-glass { background: rgba(12,16,30,0.55); border-color: rgba(74,158,255,0.18); box-shadow: inset 0 0 24px rgba(74,158,255,0.04), 0 16px 40px rgba(0,0,0,0.4); }
        .wisdom-well .prose-intel h3 { background: linear-gradient(to bottom, rgba(255,255,255,0.9), #72A0FF); }
        .wisdom-well .prose-intel h4 { color: #72A0FF; }
        .wisdom-well .prose-intel p { color: rgba(255,255,255,0.5); }
        .wisdom-well .prose-intel strong { color: #72A0FF; }
        .wisdom-well .prose-intel em { color: #9BBFFF; border-color: rgba(114,160,255,0.2); }
        .wisdom-well .wisdom-dossier-card { background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.18)); border-color: rgba(255,255,255,0.06); box-shadow: 0 16px 48px rgba(0,0,0,0.35); }
        .wisdom-well .wisdom-dossier-card::before, .wisdom-well .wisdom-dossier-card::after { background: #4A9EFF; }

        /* ── Light theme — dark navy, low-saturation glow ── */
        :root[data-theme="light"] .wisdom-well { color: rgba(10,14,30,0.88); background: #ebe7df; }
        :root[data-theme="light"] .ww-bg-layer { background: radial-gradient(ellipse at 50% 0%, rgba(43,72,128,0.10) 0%, transparent 70%); }
        :root[data-theme="light"] .wisdom-well .ww-accent { color: #2B4880; }
        :root[data-theme="light"] .wisdom-well .ancient-glass { background: rgba(255,252,245,0.65); border-color: rgba(43,72,128,0.18); box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 12px 32px rgba(30,53,104,0.08); }
        :root[data-theme="light"] .wisdom-well .prose-intel h3 { background: linear-gradient(to bottom, #0e1a40, #2B4880); filter: drop-shadow(0 0 10px rgba(43,72,128,0.15)); }
        :root[data-theme="light"] .wisdom-well .prose-intel h4 { color: #2B4880; }
        :root[data-theme="light"] .wisdom-well .prose-intel p { color: rgba(10,14,30,0.60); }
        :root[data-theme="light"] .wisdom-well .prose-intel strong { color: #1E3568; }
        :root[data-theme="light"] .wisdom-well .prose-intel em { color: #2B4880; border-color: rgba(43,72,128,0.22); }
        :root[data-theme="light"] .wisdom-well .wisdom-dossier-card { background: rgba(255,252,245,0.72); border-color: rgba(43,72,128,0.14); box-shadow: 0 8px 32px rgba(30,53,104,0.07); }
        :root[data-theme="light"] .wisdom-well .wisdom-dossier-card::before, :root[data-theme="light"] .wisdom-well .wisdom-dossier-card::after { background: #2B4880; }
        :root[data-theme="light"] .wisdom-well * { border-color: rgba(43,72,128,0.16); }
        :root[data-theme="light"] .wisdom-well .data-stream-glow { background: linear-gradient(90deg, transparent, #2B4880, transparent); }
        :root[data-theme="light"] .wisdom-well .custom-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, transparent, rgba(43,72,128,0.4), transparent); }

        .wisdom-well { isolation: isolate; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, transparent, rgba(114,160,255,0.5), transparent);
          border-radius: 10px;
        }

        .ancient-glass {
          backdrop-filter: blur(40px) saturate(160%);
          -webkit-backdrop-filter: blur(40px) saturate(160%);
          border-width: 1px;
          border-style: solid;
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
          background: #4A9EFF;
          opacity: 0.3;
        }

        .wisdom-dossier-card::after {
          content: '';
          position: absolute;
          bottom: -1px; right: -1px;
          width: 2px; height: 20px;
          background: #4A9EFF;
          opacity: 0.3;
        }

        .data-stream-glow {
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #72A0FF, transparent);
          opacity: 0.15;
          animation: stream-linear 6s infinite linear;
        }

        @keyframes stream-linear {
          0% { transform: translateY(-100%) scaleX(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(1000%) scaleX(2); opacity: 0; }
        }

        .prose-intel h3 {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          letter-spacing: 0.3em;
          @media (min-width: 768px) { letter-spacing: 0.6em; }
          background: linear-gradient(to bottom, rgba(255,255,255,0.9), #4A9EFF);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 2rem;
          @media (min-width: 768px) { margin-bottom: 3.5rem; }
          filter: drop-shadow(0 0 20px rgba(74, 158, 255, 0.4));
          opacity: 0.8;
          font-size: 1.1rem;
          @media (min-width: 768px) { font-size: 1.5rem; }
        }

        .prose-intel h4 {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: #72A0FF;
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
          background: linear-gradient(90deg, #72A0FF33, transparent);
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
          color: #4A9EFF;
          opacity: 0.9;
          font-weight: 700;
        }

        .prose-intel em {
          font-style: normal;
          color: #72A0FF;
          border-bottom: 1px solid rgba(114, 160, 255, 0.2);
          padding-bottom: 2px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 relative z-[2]">
        <div className="wisdom-header text-center mb-16 relative">
          <Link to="/portal" className="absolute -top-12 left-0 flex items-center gap-2 transition-all group font-mono text-xs tracking-widest uppercase"
            style={{ color: `${wwD}99` }}>
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Control Center
          </Link>

          <div className="inline-block px-4 py-1 rounded-none text-[9px] font-mono tracking-[0.4em] uppercase mb-4 backdrop-blur-sm"
            style={{ border: `1px solid ${wwP}4d`, color: wwP, background: `${wwP}0d` }}>
            SUB-CONSCIOUS ARCHIVE // AUTH_NODE: ENABLED
          </div>

          <h1 className="font-[Orbitron] text-5xl md:text-7xl font-black text-transparent bg-clip-text tracking-[0.3em] mb-6"
            style={{
              backgroundImage: isLight
                ? `linear-gradient(to right, rgba(10,14,30,0.7), ${wwP}, rgba(10,14,30,0.7))`
                : `linear-gradient(to right, rgba(255,255,255,0.9), ${wwP}, rgba(255,255,255,0.9))`,
              filter: `drop-shadow(0 0 24px ${wwD}4d)`,
            }}>
            WISDOM WELL
          </h1>

          <p className="font-[Orbitron] text-[10px] tracking-[0.5em] uppercase mb-8 flex items-center justify-center gap-6"
            style={{ color: `${wwD}66` }}>
            <span className="w-16 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${wwD}33, transparent)` }}></span>
            Streaming Ancient Intel Data
            <span className="w-16 h-[1px]" style={{ background: `linear-gradient(to left, transparent, ${wwD}33, transparent)` }}></span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {wisdomThreads.map((thread) => {
            const isExpanded = expandedCard === thread.id;
            const Icon = thread.icon;

            return (
              <motion.div
                key={thread.id}
                layout
                initial={false}
                className="ancient-glass relative overflow-hidden group transition-all duration-700 rounded-px"
                style={{
                  clipPath: isExpanded ? 'none' : 'polygon(0 0, 95% 0, 100% 10%, 100% 100%, 5% 100%, 0 90%)',
                  borderRadius: '2px',
                  outline: isExpanded ? `1px solid ${wwP}66` : undefined,
                }}
              >
                {/* Tech Highlight — left edge accent */}
                <div className="absolute top-0 left-0 w-[1px] h-full opacity-20"
                  style={{ background: `linear-gradient(to bottom, ${wwD}, transparent, transparent)` }} />

                <div
                  className="p-6 md:p-10 cursor-pointer relative z-10"
                  onClick={() => handleCardClick(thread.id)}
                >
                  <div className="flex justify-between items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-4 md:gap-8">
                      <HolographicSigil Icon={Icon} isExpanded={isExpanded} id={thread.id} wwP={wwP} wwD={wwD} />
                      <div>
                        <div className="flex items-center gap-4 mb-2 font-mono text-[8px] tracking-[0.3em] uppercase opacity-40">
                          <span>NODE_0{thread.id}</span>
                          <div className="w-1 h-1 rounded-full" style={{ background: wwD }}></div>
                          <span>SECURE</span>
                        </div>
                        <h2 className="text-lg md:text-3xl font-[Orbitron] font-black tracking-[0.1em] md:tracking-[0.2em] transition-colors uppercase"
                          style={{ color: isExpanded ? wwP : undefined }}>
                          {thread.title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-2 md:p-3 transition-all duration-700"
                      style={{
                        border: `1px solid ${isExpanded ? `${wwP}66` : 'rgba(255,255,255,0.10)'}`,
                        background: isExpanded ? `${wwP}1a` : undefined,
                        transform: isExpanded ? 'rotate(180deg)' : undefined,
                      }}>
                      <ChevronDown size={20} style={{ color: isExpanded ? wwP : undefined, opacity: isExpanded ? 1 : 0.2 }} />
                    </div>
                  </div>

                  {!isExpanded && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 text-xs font-light md:pl-32 leading-relaxed max-w-2xl font-['Space_Mono'] uppercase tracking-widest opacity-40"
                    >
                      {thread.description}
                    </motion.p>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden relative"
                    >
                      {/* Internal Textures */}
                      <div className="absolute inset-0 opacity-[0.2] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{ backgroundImage: `radial-gradient(${wwD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

                      <div className="p-6 md:p-20 pt-4 relative z-10 backdrop-blur-3xl"
                        style={{
                          borderTop: `1px solid ${isLight ? 'rgba(43,72,128,0.12)' : 'rgba(255,255,255,0.05)'}`,
                          background: isLight ? 'rgba(255,252,245,0.5)' : 'rgba(0,0,0,0.40)',
                        }}>
                        {/* Dossier Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 font-mono text-[9px] tracking-widest uppercase pb-8 gap-4"
                          style={{
                            color: `${wwP}66`,
                            borderBottom: `1px solid ${isLight ? 'rgba(43,72,128,0.10)' : 'rgba(255,255,255,0.05)'}`,
                          }}>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 animate-pulse" style={{ background: wwD }}></div>
                              <span style={{ color: isLight ? 'rgba(10,14,30,0.55)' : 'rgba(255,255,255,0.60)' }}>INTELLIGENCE_REPORT_ACTIVE</span>
                            </div>
                            <div>AUTH_LEVEL: SOVEREIGN</div>
                          </div>
                          <div className="text-left md:text-right">
                            <div>DATA_STREAM: {Math.random().toString(16).toUpperCase()}</div>
                            <div>TIMESTAMP: 2024.AR.09</div>
                          </div>
                        </div>

                        <div className="prose-intel max-w-4xl mx-auto">
                          <div className="wisdom-dossier-card">
                            <div className="data-stream-glow"></div>
                            {thread.content}
                          </div>
                        </div>

                        <div className="mt-12 md:mt-20 flex flex-col items-center gap-8">
                          <div className="w-40 h-[1px]"
                            style={{ background: `linear-gradient(to right, transparent, ${wwD}66, transparent)` }}></div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedCard(null); }}
                            className="group relative px-10 md:px-20 py-4 bg-transparent transition-all"
                            style={{ border: `1px solid ${wwD}33` }}
                          >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: `${wwP}0d` }}></div>
                            <span className="relative z-10 font-[Orbitron] text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] transition-colors"
                              style={{ color: wwP }}>
                              DISCONNECT_MODULE_II
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
