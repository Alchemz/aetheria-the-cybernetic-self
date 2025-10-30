
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Circle,
  Zap,
  Target,
  Flame,
  Brain,
  Heart,
  Sunrise,
  Dumbbell,
  Zap as Lightning,
  Eye,
  Shield,
  TrendingUp,
  Activity,
  Droplets,
  Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/api/supabaseClient';
import SubscriptionGuard from '../components/SubscriptionGuard';

export default function TheTemple() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeBioMods, setActiveBioMods] = useState([]);
  const [user, setUser] = useState(null);
  const mountRef = useRef(null);

  // Set background immediately on mount to prevent flash
  useEffect(() => {
    document.body.style.background = '#2C2C2C';
    return () => {
      document.body.style.background = '#000000';
    };
  }, []);

  // Three.js background animation
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2C2C2C); // Changed from 0x000000 to 0x2C2C2C

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Changed alpha to false and added setClearColor
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x2C2C2C); // Added this line
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00A86B,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];
        
        // Wrap around edges
        if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
      }
      
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    loadUserBioMods();
  }, []);

  const loadUserBioMods = async () => {
    try {
      const currentUser = await auth.me();
      setUser(currentUser);
      
      const userBioMods = currentUser.active_bio_mods || [];
      setActiveBioMods(userBioMods);
    } catch (error) {
      console.error('Error loading bio-mods:', error);
    }
  };

  const bioMods = [
    {
      id: 'neurogenesis',
      name: 'Neurogenesis Mode',
      icon: Brain,
      description: 'Force new neural pathway creation through deliberate pattern interruption',
      simpleExplanation: 'Think of your brain like a forest with paths. When you walk the same path every day, it gets deeper and harder to change. This bio-mod helps you create NEW paths in your brain by doing things differently. It\'s like teaching your brain to be more flexible and creative!',
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
    {
      id: 'testosterone',
      name: 'Testosterone Optimization',
      icon: Dumbbell,
      description: 'Maximize natural testosterone production through targeted biological interventions',
      simpleExplanation: 'Testosterone is like your body\'s "strength hormone." It helps you build muscle, feel confident, and have lots of energy. This bio-mod uses special habits (like cold showers and lifting heavy things) to help your body make MORE of this power hormone naturally!',
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
    {
      id: 'memory-palace',
      name: 'Memory Palace Protocol',
      icon: Brain,
      description: 'Enhance memory encoding, storage, and recall through systematic training',
      simpleExplanation: 'Imagine having a superpower where you could remember ANYTHING you want - names, facts, where you put things. This bio-mod trains your brain to be like a camera that never forgets. It uses special tricks that memory champions use to remember hundreds of things perfectly!',
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
    {
      id: 'heart-coherence',
      name: 'Heart-Coherence Engine',
      icon: Heart,
      description: 'Synchronize heart-brain communication for emotional regulation and peak performance',
      simpleExplanation: 'Did you know your heart and brain talk to each other? When they\'re in sync (like best friends working together), you feel calm, focused, and happy. This bio-mod teaches you how to make your heart and brain become teammates, so you can handle stress better and feel more peaceful.',
      habits: [
        {
          name: 'HeartMath Breathing',
          duration: 10,
          difficulty: 'Easy',
          why: 'Controlled breathing at 0.1Hz (6 breaths/min) maximizes heart rate variability and vagal tone.'
        },
        {
          name: 'Gratitude Journaling',
          duration: 5,
          difficulty: 'Easy',
          why: 'Activates heart-centered positive emotions, increasing cardiac coherence and reducing cortisol.'
        },
        {
          name: 'Compassion Meditation',
          duration: 15,
          difficulty: 'Medium',
          why: 'Loving-kindness practice increases heart coherence and synchronizes autonomic nervous system.'
        },
        {
          name: 'Coherent Breath Protocol',
          duration: 5,
          difficulty: 'Easy',
          why: 'Inhale 5s, hold 5s, exhale 5s creates optimal HRV and heart-brain coherence state.'
        }
      ]
    },
    {
      id: 'circadian-mastery',
      name: 'Circadian Mastery',
      icon: Sunrise,
      description: 'Align biological rhythms with natural light cycles for optimal hormonal function',
      simpleExplanation: 'Your body has an internal clock (like an alarm clock inside you) that tells you when to sleep and wake up. This bio-mod helps you set that clock perfectly using sunlight and darkness, so you have tons of energy during the day and sleep like a baby at night!',
      habits: [
        {
          name: 'Morning Red Light Gazing',
          duration: 10,
          difficulty: 'Easy',
          why: 'Morning red/infrared light sets circadian rhythm via melanopsin photoreceptors, optimizing melatonin production.'
        },
        {
          name: 'Grounding (Barefoot)',
          duration: 30,
          difficulty: 'Medium',
          why: 'Transfers electrons from Earth, reducing inflammation and synchronizing circadian biology.'
        },
        {
          name: 'Blue Light Blocking (Evening)',
          duration: 120,
          difficulty: 'Easy',
          why: 'Prevents circadian disruption by blocking blue wavelengths that suppress melatonin after sunset.'
        },
        {
          name: 'Temperature Manipulation',
          duration: 10,
          difficulty: 'Medium',
          why: 'Cool room temperature (65-68°F) signals circadian system for sleep onset via thermoreceptor feedback.'
        }
      ]
    },
    {
      id: 'mitochondrial',
      name: 'Mitochondrial Enhancement',
      icon: Lightning,
      description: 'Optimize cellular energy production and metabolic efficiency',
      simpleExplanation: 'Mitochondria are like tiny power plants inside every cell in your body. They make the energy you need to run, think, and play. This bio-mod makes your power plants work BETTER, so you have more energy all day long - like upgrading from regular batteries to super batteries!',
      habits: [
        {
          name: 'Wim Hof Breathing',
          duration: 15,
          difficulty: 'Medium',
          why: 'Controlled hyperventilation increases oxygen saturation and triggers mitochondrial biogenesis.'
        },
        {
          name: 'Cold Exposure Protocol',
          duration: 3,
          difficulty: 'Hard',
          why: 'Cold stress activates PGC-1α, master regulator of mitochondrial biogenesis and brown fat activation.'
        },
        {
          name: 'Intermittent Fasting',
          duration: 960,
          difficulty: 'Medium',
          why: 'Fasting triggers autophagy and mitochondrial quality control via AMPK pathway activation.'
        },
        {
          name: 'Red Light Therapy',
          duration: 15,
          difficulty: 'Easy',
          why: 'Near-infrared wavelengths directly enhance mitochondrial ATP production via cytochrome c oxidase activation.'
        }
      ]
    },
    {
      id: 'pineal-activation',
      name: 'Pineal Activation Protocol',
      icon: Eye,
      description: 'Decalcify and activate the pineal gland for enhanced melatonin and DMT production',
      simpleExplanation: 'In the middle of your brain, there\'s a tiny gland shaped like a pinecone (that\'s why it\'s called pineal!). Ancient people called it your "third eye" because it helps you dream, sleep deeply, and maybe even see things more clearly. This bio-mod cleans and activates this special gland!',
      habits: [
        {
          name: 'Fluoride Avoidance',
          duration: 1440,
          difficulty: 'Medium',
          why: 'Fluoride accumulates in pineal gland, causing calcification. Filtered water and fluoride-free toothpaste essential.'
        },
        {
          name: 'Third Eye Meditation',
          duration: 20,
          difficulty: 'Medium',
          why: 'Focused attention on pineal region increases blood flow and activates dormant neural pathways.'
        },
        {
          name: 'Sun Gazing Protocol',
          duration: 5,
          difficulty: 'Easy',
          why: 'Safe sunrise/sunset gazing stimulates pineal gland via retinohypothalamic tract.'
        },
        {
          name: 'Iodine Supplementation',
          duration: 2,
          difficulty: 'Easy',
          why: 'Iodine displaces fluoride and bromine from pineal tissue, supporting decalcification.'
        }
      ]
    },
    {
      id: 'gut-brain-axis',
      name: 'Gut-Brain Axis Optimization',
      icon: Target,
      description: 'Enhance the bidirectional communication between gut microbiome and brain',
      simpleExplanation: 'Your belly (gut) and brain are connected by a special highway of nerves. The tiny creatures living in your belly (good bacteria) actually send messages to your brain that affect your mood and thinking! This bio-mod makes that connection stronger and healthier, so your belly and brain work together perfectly.',
      habits: [
        {
          name: 'Probiotic-Rich Foods',
          duration: 15,
          difficulty: 'Easy',
          why: 'Fermented foods (kimchi, kefir, sauerkraut) introduce beneficial bacteria that produce neurotransmitters.'
        },
        {
          name: 'Prebiotic Fiber Protocol',
          duration: 10,
          difficulty: 'Easy',
          why: 'Resistant starches feed beneficial gut bacteria, increasing SCFA production and reducing inflammation.'
        },
        {
          name: 'Vagus Nerve Stimulation',
          duration: 10,
          difficulty: 'Medium',
          why: 'Gargling, singing, cold exposure activate vagal tone, strengthening gut-brain communication.'
        },
        {
          name: 'Fasting-Mimicking Diet',
          duration: 1440,
          difficulty: 'Hard',
          why: 'Periodic fasting resets gut microbiome composition and enhances gut barrier function.'
        }
      ]
    },
    {
      id: 'rejuvenation-dna',
      name: 'Rejuvenation & DNA Repair',
      icon: Shield,
      description: 'Activate your body\'s innate repair mechanisms and cellular regeneration',
      simpleExplanation: 'Imagine your body has a repair crew that fixes all the tiny damages that happen every day. This bio-mod is like calling in the best repair team ever! It helps your body clean out old, broken parts and build fresh, new ones - kind of like how a video game character heals after resting.',
      habits: [
        {
          name: 'Deep Sleep Focus (Delta Wave)',
          duration: 480,
          difficulty: 'Medium',
          why: 'Prioritizing 7-9 hours with maximized deep sleep (N3) using Delta waves (0.5-4 Hz) activates cellular repair, HGH release, and immune function.'
        },
        {
          name: 'Fasted Morning Window',
          duration: 960,
          difficulty: 'Medium',
          why: '14-16 hour overnight fast (e.g., 8 PM - 10 AM) stimulates autophagy, the body\'s cellular cleanup process that removes damaged proteins and organelles.'
        },
        {
          name: 'DNA Repair Frequency (528 Hz)',
          duration: 30,
          difficulty: 'Easy',
          why: '528 Hz "Love/Repair" Solfeggio frequency has been shown to reduce oxidative stress markers and support DNA integrity at the molecular level.'
        },
        {
          name: 'Polyphenol Flood',
          duration: 15,
          difficulty: 'Easy',
          why: 'Eating 3+ different colored berries, vegetables, and herbs (blueberries, spinach, turmeric, beets) floods your system with antioxidants that neutralize free radicals and protect DNA.'
        }
      ]
    },
    {
      id: 'growth-hormone',
      name: 'Growth Hormone Activation',
      icon: TrendingUp,
      description: 'Unlock your body\'s natural fountain of youth hormone',
      simpleExplanation: 'Growth Hormone is like your body\'s "youth juice." It helps you grow, heal faster, build muscle, and stay young. Your body makes the most of it while you sleep! This bio-mod uses special tricks (like exercise and fasting) to make your body produce MORE of this amazing hormone naturally.',
      habits: [
        {
          name: 'Intensity Surges',
          duration: 20,
          difficulty: 'Hard',
          why: 'Short, intense bursts (sprint intervals or heavy compound lifts to failure) 2x per week trigger acute HGH spikes via lactate accumulation and metabolic stress.'
        },
        {
          name: 'Deep Sleep Sanctuary',
          duration: 180,
          difficulty: 'Easy',
          why: 'No food for 3 hours before bed prevents insulin from suppressing your natural overnight Growth Hormone pulse, which peaks during deep sleep.'
        },
        {
          name: 'Intermittent Fasting (16:8)',
          duration: 960,
          difficulty: 'Medium',
          why: 'Condensing daily eating into an 8-hour window (e.g., 12 PM - 8 PM) naturally spikes HGH levels by up to 1300% during the fasted state.'
        },
        {
          name: 'Pre-Sleep Protein',
          duration: 5,
          difficulty: 'Easy',
          why: '10-20g of slow-digesting protein (casein or plant blend) 30 minutes before bed on non-fasting days supports overnight muscle repair and amino acid availability.'
        }
      ]
    },
    {
      id: 'vagus-nerve',
      name: 'Vagus Nerve Tone & Stress Resilience',
      icon: Wind,
      description: 'Master your nervous system\'s brake pedal for calm and recovery',
      simpleExplanation: 'The vagus nerve is like the "chill out button" in your body. When you\'re stressed or scared, it helps calm you down. This bio-mod trains that button to work better, so you can stay calm even when things get crazy - like having a superpower to control your own stress!',
      habits: [
        {
          name: 'Resonant Breathing',
          duration: 10,
          difficulty: 'Easy',
          why: 'Breathe in for 5s, out for 5s (0.1 Hz frequency) to optimally stimulate the vagus nerve, increasing heart rate variability and parasympathetic activation.'
        },
        {
          name: 'Gargling & Humming',
          duration: 4,
          difficulty: 'Easy',
          why: '2 minutes of vigorous gargling or continuous humming ("Om") vibrates and strengthens the vagus nerve through direct mechanical stimulation.'
        },
        {
          name: 'Cold Face Exposure',
          duration: 1,
          difficulty: 'Medium',
          why: '30-60 seconds of cold water on face or back of neck triggers the "dive reflex," massively activating vagal tone and parasympathetic response.'
        },
        {
          name: 'Social Connection',
          duration: 15,
          difficulty: 'Easy',
          why: 'Genuine, positive social interaction (not texting) stimulates the ventral vagus nerve. Laughter is one of the most powerful vagal activators.'
        }
      ]
    },
    {
      id: 'metabolic-flexibility',
      name: 'Metabolic Flexibility & Fat Adaptation',
      icon: Activity,
      description: 'Train your body to be a dual-fuel engine for sustained energy',
      simpleExplanation: 'Your body can run on two types of fuel: sugar (carbs) and fat. Most people only know how to burn sugar, so they crash when they haven\'t eaten. This bio-mod teaches your body to ALSO burn fat for energy - like having a hybrid car that can run on two types of gas. You\'ll have energy ALL day!',
      habits: [
        {
          name: 'Fasted Movement',
          duration: 45,
          difficulty: 'Medium',
          why: '30-60 minutes of light exercise (walking, yoga) in a fasted state upon waking teaches your body to efficiently tap into fat stores for fuel.'
        },
        {
          name: 'Carb Cycling',
          duration: 1440,
          difficulty: 'Hard',
          why: '2-3 low-carb days per week (<50g net carbs) with higher-carb days on intense workout days improves insulin sensitivity and metabolic flexibility.'
        },
        {
          name: 'C8 MCT Oil',
          duration: 5,
          difficulty: 'Easy',
          why: '1 tablespoon in morning coffee rapidly induces ketone production, signaling your metabolism to burn fat and providing immediate mental clarity.'
        },
        {
          name: 'Time-Restricted Eating',
          duration: 960,
          difficulty: 'Medium',
          why: 'Consuming all daily calories within a consistent 8-10 hour window gives your digestive system and metabolism a daily reset, improving metabolic efficiency.'
        }
      ]
    },
    {
      id: 'neurotransmitter-balance',
      name: 'Neurotransmitter Balance',
      icon: Brain,
      description: 'Optimize your brain\'s chemical messengers for mood and focus',
      simpleExplanation: 'Your brain uses special chemicals (like dopamine and serotonin) to help you feel happy, focused, and calm. It\'s like having different buttons for different feelings! This bio-mod makes sure all those buttons work perfectly, so you feel great and can think clearly all day long.',
      habits: [
        {
          name: 'Sunrise Light Anchor',
          duration: 10,
          difficulty: 'Easy',
          why: '10 minutes of direct morning sunlight in eyes (no sunglasses) sets circadian rhythm and boosts serotonin production via retinal melanopsin activation.'
        },
        {
          name: 'Tyrosine for Focus',
          duration: 2,
          difficulty: 'Easy',
          why: '500-1000mg of L-Tyrosine 30 minutes before cognitive work naturally supports dopamine production, enhancing motivation and mental energy.'
        },
        {
          name: 'GABA-Toning Activities',
          duration: 15,
          difficulty: 'Easy',
          why: 'Yoga nidra, deep meditation, or 432 Hz frequencies boost GABA (your brain\'s "brake pedal"), reducing anxiety and promoting calm focus.'
        },
        {
          name: 'Digital Sunset',
          duration: 90,
          difficulty: 'Medium',
          why: 'Avoiding all screens 90 minutes before bed protects melatonin production and prevents dopamine overstimulation, ensuring quality sleep and neurotransmitter recovery.'
        }
      ]
    },
    {
      id: 'lymphatic-detox',
      name: 'Lymphatic System & Detox Optimization',
      icon: Droplets,
      description: 'Activate your body\'s internal waste-removal and immune transport system',
      simpleExplanation: 'Think of your lymphatic system like a trash collection service for your body. It picks up all the junk (toxins, dead cells, waste) and takes it out. This bio-mod helps that trash truck work better, so your body stays clean inside - like taking out the garbage every day instead of letting it pile up!',
      habits: [
        {
          name: 'Rebounding',
          duration: 10,
          difficulty: 'Easy',
          why: '10 minutes on a mini-trampoline uses vertical G-force to pump lymph fluid through one-way valves—one of the most effective lymphatic activation methods.'
        },
        {
          name: 'Dry Brushing',
          duration: 5,
          difficulty: 'Easy',
          why: 'Brushing dry skin toward your heart (starting at extremities) before shower manually stimulates lymph flow and removes dead skin cells.'
        },
        {
          name: 'Lymphatic Breathing',
          duration: 5,
          difficulty: 'Easy',
          why: 'Deep, diaphragmatic "belly breathing" activates your diaphragm, which acts as the primary pump for the lymphatic system in your core.'
        },
        {
          name: 'Hydration with Lemon & Electrolytes',
          duration: 5,
          difficulty: 'Easy',
          why: '500ml warm water with lemon and sea salt upon waking hydrates cells and supports cellular detox pathways via kidney and liver function.'
        }
      ]
    }
  ];

  const toggleBioMod = async (bioModId) => {
    const newActiveBioMods = activeBioMods.includes(bioModId)
      ? activeBioMods.filter(id => id !== bioModId)
      : [...activeBioMods, bioModId];
    
    setActiveBioMods(newActiveBioMods);
    
    try {
      await auth.updateMe({
        active_bio_mods: newActiveBioMods
      });
    } catch (error) {
      console.error('Error saving bio-mods:', error);
    }
  };

  const filteredBioMods = bioMods.filter(mod =>
    mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mod.simpleExplanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SubscriptionGuard requiredProduct="heartwave">
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#2C2C2C' }}>
        <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#2C2C2C' }} />

        <div className="heartwave-biomods-page" style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');

            .heartwave-biomods-page {
              min-height: 100vh;
              color: white;
              font-family: 'Rajdhani', sans-serif;
              padding: calc(1rem + env(safe-area-inset-top)) 1rem 100px;
              background: transparent !important;
            }

            .heartwave-header {
              margin-bottom: 2rem;
            }

            .heartwave-header-top {
              display: flex;
              align-items: center;
              gap: 1rem;
              margin-bottom: 1.5rem;
            }

            .heartwave-back {
              color: rgba(255, 255, 255, 0.7);
              transition: color 0.3s;
              text-decoration: none;
            }

            .heartwave-back:hover {
              color: #00A86B;
            }

            .heartwave-title {
              font-family: 'Orbitron', monospace;
              font-size: 2rem;
              font-weight: 900;
              color: #00A86B;
              flex: 1;
              text-align: center;
              letter-spacing: 0.15em;
              text-shadow: 0 0 20px rgba(0, 168, 107, 0.6);
            }

            .heartwave-subtitle {
              text-align: center;
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.95rem;
              margin-bottom: 1.5rem;
              line-height: 1.5;
            }

            .heartwave-search-box {
              background: rgba(0, 168, 107, 0.05);
              border: 1px solid rgba(0, 168, 107, 0.3);
              padding: 1rem;
              display: flex;
              gap: 1rem;
              align-items: center;
              margin-bottom: 2rem;
            }

            .heartwave-search-box input {
              background: transparent;
              border: none;
              color: white;
              flex: 1;
              font-size: 1rem;
              outline: none;
            }

            .heartwave-search-box input::placeholder {
              color: rgba(255, 255, 255, 0.3);
            }

            .update-routine-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.6rem;
              background: linear-gradient(135deg, #00A86B 0%, #008557 100%);
              border: 1px solid #00A86B;
              color: white;
              padding: 0.9rem 1.5rem;
              font-family: 'Orbitron', monospace;
              font-size: 0.85rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              cursor: pointer;
              transition: all 0.3s ease;
              text-decoration: none;
              box-shadow: 0 0 15px rgba(0, 168, 107, 0.3);
              margin-bottom: 2rem;
            }

            .update-routine-btn:hover {
              background: linear-gradient(135deg, #00C97F 0%, #00A86B 100%);
              box-shadow: 0 0 25px rgba(0, 168, 107, 0.6);
              transform: translateY(-2px);
            }

            .update-routine-btn:active {
              transform: translateY(0);
            }

            .heartwave-biomods-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
              gap: 1.5rem;
            }

            .heartwave-biomod-card {
              background: rgba(0, 168, 107, 0.03);
              border: 2px solid rgba(0, 168, 107, 0.2);
              padding: 2rem;
              position: relative;
              transition: all 0.3s ease;
              cursor: pointer;
            }

            .heartwave-biomod-card:hover {
              border-color: #00A86B;
              box-shadow: 0 0 30px rgba(0, 168, 107, 0.3);
              transform: translateY(-2px);
            }

            .heartwave-biomod-card.active {
              background: rgba(0, 168, 107, 0.1);
              border-color: #00A86B;
              box-shadow: 0 0 40px rgba(0, 168, 107, 0.5);
            }

            .heartwave-biomod-icon-wrapper {
              width: 60px;
              height: 60px;
              margin-bottom: 1.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(0, 168, 107, 0.1);
              border: 1px solid rgba(0, 168, 107, 0.3);
            }

            .heartwave-biomod-card.active .heartwave-biomod-icon-wrapper {
              background: rgba(0, 168, 107, 0.2);
              border-color: #00A86B;
              box-shadow: 0 0 20px rgba(0, 168, 107, 0.4);
            }

            .heartwave-biomod-icon {
              color: #00A86B;
              filter: drop-shadow(0 0 10px rgba(0, 168, 107, 0.5));
            }

            .heartwave-biomod-name {
              font-family: 'Orbitron', monospace;
              font-size: 1.2rem;
              font-weight: 700;
              margin-bottom: 0.8rem;
              color: #00A86B;
              letter-spacing: 0.05em;
            }

            .heartwave-biomod-description {
              color: rgba(255, 255, 255, 0.7);
              line-height: 1.6;
              font-size: 0.9rem;
              margin-bottom: 1rem;
            }

            .heartwave-biomod-simple-text {
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.9rem;
              line-height: 1.6;
              margin: 1rem 0;
              padding: 1rem;
              background: rgba(0, 0, 0, 0.3);
              border-left: 2px solid #00A86B;
            }

            .heartwave-biomod-habits-count {
              color: rgba(255, 255, 255, 0.5);
              font-size: 0.85rem;
              margin-bottom: 1.5rem;
            }

            .heartwave-biomod-status {
              position: absolute;
              top: 1rem;
              right: 1rem;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 2px solid rgba(0, 168, 107, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            }

            .heartwave-biomod-card.active .heartwave-biomod-status {
              background: #00A86B;
              border-color: #00A86B;
              box-shadow: 0 0 15px rgba(0, 168, 107, 0.6);
            }

            .heartwave-active-count {
              background: rgba(0, 168, 107, 0.1);
              border: 1px solid rgba(0, 168, 107, 0.3);
              padding: 1rem 1.5rem;
              margin-bottom: 2rem;
              text-align: center;
            }

            .heartwave-active-count-number {
              font-family: 'Orbitron', monospace;
              font-size: 2rem;
              color: #00A86B;
              font-weight: 900;
            }

            .heartwave-active-count-label {
              color: rgba(255, 255, 255, 0.6);
              font-size: 0.9rem;
              margin-top: 0.3rem;
            }

            .heartwave-bottom-nav {
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              background: linear-gradient(to top, #0A0A0F, rgba(10, 10, 15, 0.95));
              backdrop-filter: blur(10px);
              padding: 1rem;
              padding-bottom: calc(1rem + env(safe-area-inset-bottom));
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

            @media (max-width: 768px) {
              .heartwave-title {
                font-size: 1.5rem;
              }

              .heartwave-biomods-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>

          <div className="heartwave-header">
            <div className="heartwave-header-top">
              <Link to="/portal" className="heartwave-back">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="heartwave-title">THE TEMPLE</h1>
              <div style={{ width: 24 }} />
            </div>

            <p className="heartwave-subtitle">
              Pick the upgrades you want. Your daily habits will automatically update.
            </p>

            {activeBioMods.length > 0 && (
              <div className="heartwave-active-count">
                <div className="heartwave-active-count-number">{activeBioMods.length}</div>
                <div className="heartwave-active-count-label">Active Bio-Mods</div>
              </div>
            )}

            <div className="heartwave-search-box">
              <Search size={20} color="#00A86B" />
              <input 
                type="text"
                placeholder="Search bio-mods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link to="/heartwave-console" className="update-routine-btn">
              <Target size={18} />
              <span>Update Routine Stack</span>
            </Link>
          </div>

          <div className="heartwave-biomods-grid">
            {filteredBioMods.map(mod => {
              const Icon = mod.icon;
              const isActive = activeBioMods.includes(mod.id);
              
              return (
                <div 
                  key={mod.id} 
                  className={`heartwave-biomod-card ${isActive ? 'active' : ''}`}
                  onClick={() => toggleBioMod(mod.id)}
                >
                  <div className="heartwave-biomod-status">
                    {isActive ? (
                      <CheckCircle2 size={20} color="#000" />
                    ) : (
                      <Circle size={20} color="rgba(0, 168, 107, 0.5)" />
                    )}
                  </div>

                  <div className="heartwave-biomod-icon-wrapper">
                    <Icon className="heartwave-biomod-icon" size={32} />
                  </div>

                  <h3 className="heartwave-biomod-name">{mod.name}</h3>
                  <p className="heartwave-biomod-description">{mod.description}</p>
                  
                  <div className="heartwave-biomod-simple-text">
                    <strong>In Simple Words:</strong><br/>
                    {mod.simpleExplanation}
                  </div>

                  <div className="heartwave-biomod-habits-count">
                    {mod.habits.length} targeted habits
                  </div>
                </div>
              );
            })}
          </div>

          <div className="heartwave-bottom-nav">
            <Link to="/heartwave-console" className="heartwave-nav-btn">
              <Target size={24} />
              <span>Routine</span>
            </Link>
            <div className="heartwave-nav-btn active">
              <Flame size={24} />
              <span>Bio-Mods</span>
            </div>
            <Link to="/heartwave-athena" className="heartwave-nav-btn">
              <Zap size={24} />
              <span>ATHENA</span>
            </Link>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
