
import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles, Eye, Star, Sun, Moon, Flower2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WisdomWell() {
  const [expandedCard, setExpandedCard] = useState(null);

  const wisdomThreads = [
    {
      id: 1,
      icon: Star,
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
      icon: Sparkles,
      title: "The Christ Consciousness",
      description: "The esoteric wisdom of Jesus from the Sermon on the Mount.",
      content: (
        <>
          <h3>THE TEACHINGS OF CHRIST CONSCIOUSNESS</h3>
          
          <h4>THE BEATITUDES - The Path to Divine Consciousness</h4>
          <p><strong>"Blessed are the poor in spirit, for theirs is the kingdom of heaven."</strong><br/>
          Humility and surrender of ego open the door to higher consciousness.</p>
          
          <p><strong>"Blessed are those who mourn, for they shall be comforted."</strong><br/>
          Through genuine feeling and processing of pain comes healing and awakening.</p>
          
          <p><strong>"Blessed are the meek, for they shall inherit the earth."</strong><br/>
          True power comes not from force but from gentle strength and inner sovereignty.</p>
          
          <h4>THE TEACHING ON LIGHT</h4>
          <p>"You are the light of the world. Let your light shine before others."</p>
          <p>You are not seeking enlightenment—you ARE the light. Your purpose is to remember and embody this truth.</p>
          
          <h4>THE LAW OF ATTRACTION</h4>
          <p>"Ask, and it will be given to you; seek, and you will find; knock, and it will be opened."</p>
          <p>The universe responds to genuine intention and aligned action.</p>
          
          <h4>THE INNER KINGDOM</h4>
          <p>"The kingdom of God is within you."</p>
          <p>You need not seek externally what already exists in your consciousness. Turn inward to find divine truth.</p>
        </>
      )
    },
    {
      id: 3,
      icon: Flower2,
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
      icon: Eye,
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
      icon: Sun,
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
      icon: Star,
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
      icon: Moon,
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
      icon: Sparkles,
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
      icon: Flower2,
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
          <p>"Until you make the unconscious conscious, it will direct your life and you will call it fate."</p>
          <p>The process of becoming a psychologically mature individual—integrating the conscious and unconscious, the personal and collective, into a unified Self.</p>
        </>
      )
    }
  ];

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="wisdom-well">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        @keyframes cyan-glow {
          0%, 100% {
            text-shadow: 0 0 20px #4A9EFF, 0 0 30px #00FFFF;
            box-shadow: 0 0 20px rgba(74, 158, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 30px #4A9EFF, 0 0 50px #00FFFF, 0 0 60px #A0D8FF;
            box-shadow: 0 0 40px rgba(74, 158, 255, 0.6);
          }
        }

        @keyframes icon-shine {
          0%, 100% {
            filter: drop-shadow(0 0 10px #4A9EFF);
          }
          50% {
            filter: drop-shadow(0 0 20px #00FFFF) drop-shadow(0 0 30px #A0D8FF);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .wisdom-well {
          min-height: 100vh;
          background: radial-gradient(ellipse at center, #0A0A0A 0%, #000000 100%);
          padding: 80px 20px 40px;
          font-family: 'Exo 2', sans-serif;
          color: #F5F5F5;
          position: relative;
          overflow-x: hidden;
        }

        .wisdom-well::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(74, 158, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(0, 255, 255, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .wisdom-header {
          text-align: center;
          margin-bottom: 60px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .wisdom-back-button {
          position: absolute;
          left: 0;
          top: -40px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #4A9EFF;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .wisdom-back-button:hover {
          color: #00FFFF;
          transform: translateX(-3px);
          text-shadow: 0 0 15px #4A9EFF;
        }

        .wisdom-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          color: #4A9EFF;
          margin-bottom: 20px;
          letter-spacing: 0.15em;
          animation: cyan-glow 4s ease-in-out infinite;
          background: linear-gradient(90deg, #4A9EFF, #00FFFF, #A0D8FF, #00FFFF, #4A9EFF);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: cyan-glow 4s ease-in-out infinite, shimmer 3s linear infinite;
        }

        .wisdom-subtitle {
          font-size: 1.1rem;
          color: rgba(74, 158, 255, 0.8);
          line-height: 1.6;
          max-width: 700px;
          margin: 0 auto;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }

        .wisdom-grid {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .wisdom-card {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.08), rgba(74, 158, 255, 0.03));
          border: 2px solid rgba(74, 158, 255, 0.4);
          transition: all 0.4s ease;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          backdrop-filter: blur(10px);
        }

        .wisdom-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .wisdom-card:hover::before {
          left: 100%;
        }

        .wisdom-card:hover {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.15), rgba(74, 158, 255, 0.08));
          border-color: #4A9EFF;
          box-shadow: 0 0 30px rgba(74, 158, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .card-header-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 1;
        }

        .card-icon-wrapper {
          flex-shrink: 0;
          color: #4A9EFF;
          animation: icon-shine 4s ease-in-out infinite;
        }

        .card-header-content {
          flex: 1;
        }

        .card-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.4rem;
          font-weight: 700;
          color: #4A9EFF;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
          text-shadow: 0 0 15px rgba(74, 158, 255, 0.5);
        }

        .card-description {
          font-size: 0.95rem;
          color: rgba(74, 158, 255, 0.7);
          line-height: 1.5;
        }

        .card-expand-icon {
          color: #4A9EFF;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .wisdom-card.expanded .card-expand-icon {
          transform: rotate(180deg);
        }

        .card-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s ease, padding 0.5s ease;
          padding: 0 25px;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(10, 10, 10, 0.3));
        }

        .card-content.expanded {
          max-height: 5000px;
          padding: 30px 25px;
          border-top: 1px solid rgba(74, 158, 255, 0.3);
        }

        .card-content h3 {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          color: #00FFFF;
          margin-bottom: 20px;
          letter-spacing: 0.08em;
          text-align: center;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .card-content h4 {
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          color: #4A9EFF;
          margin-top: 25px;
          margin-bottom: 12px;
          letter-spacing: 0.05em;
          text-shadow: 0 0 10px rgba(74, 158, 255, 0.3);
        }

        .card-content p {
          font-size: 1rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 15px;
        }

        .card-content strong {
          color: #00FFFF;
          font-weight: 600;
          text-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
        }

        .card-content em {
          color: rgba(74, 158, 255, 0.8);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .wisdom-well {
            padding: 60px 15px 30px;
          }

          .wisdom-back-button {
            position: static;
            margin-bottom: 20px;
            justify-content: center;
          }

          .wisdom-title {
            font-size: 2rem;
            margin-bottom: 15px;
          }

          .wisdom-subtitle {
            font-size: 0.95rem;
          }

          .wisdom-header {
            margin-bottom: 40px;
          }

          .card-title {
            font-size: 1.2rem;
          }

          .card-description {
            font-size: 0.9rem;
          }

          .card-header {
            padding: 20px;
          }

          .card-header-left {
            gap: 15px;
          }

          .card-content.expanded {
            padding: 25px 20px;
          }

          .card-content h3 {
            font-size: 1.1rem;
          }

          .card-content h4 {
            font-size: 1rem;
          }

          .card-content p {
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div className="wisdom-header">
        <Link to="/portal" className="wisdom-back-button">
          <ArrowLeft size={18} />
          Back to Portal
        </Link>
        <h1 className="wisdom-title">THE WISDOM WELL</h1>
        <p className="wisdom-subtitle">
          A sacred collection of timeless wisdom from the world's profound spiritual traditions. 
          Tap each thread to explore its depths.
        </p>
      </div>

      <div className="wisdom-grid">
        {wisdomThreads.map((thread) => {
          const Icon = thread.icon;
          return (
            <div 
              key={thread.id} 
              className={`wisdom-card ${expandedCard === thread.id ? 'expanded' : ''}`}
              onClick={() => handleCardClick(thread.id)}
            >
              <div className="card-header">
                <div className="card-header-left">
                  <div className="card-icon-wrapper">
                    <Icon size={32} />
                  </div>
                  <div className="card-header-content">
                    <h2 className="card-title">{thread.title}</h2>
                    <p className="card-description">{thread.description}</p>
                  </div>
                </div>
                <div className="card-expand-icon">
                  {expandedCard === thread.id ? (
                    <ChevronUp size={28} />
                  ) : (
                    <ChevronDown size={28} />
                  )}
                </div>
              </div>
              <div className={`card-content ${expandedCard === thread.id ? 'expanded' : ''}`}>
                {thread.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
