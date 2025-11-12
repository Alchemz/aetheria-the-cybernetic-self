
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, Zap, Droplet, Moon, Sun, Dumbbell, Brain, Activity, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BiohackingLab() {
  const mountRef = useRef(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const protocols = [
    {
      id: 'cold-exposure',
      name: 'Cold Exposure',
      icon: Droplet,
      color: '#00D4FF',
      category: 'Physical Resilience',
      description: 'Activate brown fat, boost metabolism, and enhance mental resilience through strategic cold therapy',
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
      icon: Sun,
      color: '#FFB347',
      category: 'Biological Rhythm',
      description: 'Align your biology with natural light cycles for peak hormone production and energy',
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
      icon: Moon,
      color: '#BA55D3',
      category: 'Metabolic Mastery',
      description: 'Trigger autophagy, enhance mitochondrial function, and optimize metabolic flexibility',
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
      id: 'primal-diet',
      name: 'Primal Nutrition',
      icon: Sun,
      color: '#FF8C42',
      category: 'Ancestral Eating',
      description: 'Return to nutrient-dense whole foods that sustained humans for millennia',
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
      id: 'breath',
      name: 'Breathwork Mastery',
      icon: Sparkles,
      color: '#FFD700',
      category: 'Nervous System',
      description: 'Harness breath to control nervous system, enhance oxygenation, and alter consciousness',
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
      id: 'meditation',
      name: 'Meditation Practice',
      icon: Brain,
      color: '#9D4EDD',
      category: 'Consciousness',
      description: 'Train attention, expand awareness, and access deeper states of consciousness',
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
      description: 'Activate your body\'s drainage system through strategic tapping and movement',
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
      icon: Brain,
      color: '#00FFFF',
      category: 'Cognitive Enhancement',
      description: 'Scientifically-backed supplements for cognitive enhancement and neuroprotection',
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

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Electric energy particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Cyan and electric blue colors
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // DNA helix
    const helixGroup = new THREE.Group();
    const helixGeometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const helixMaterial = new THREE.MeshBasicMaterial({
      color: 0x00FFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    for (let i = 0; i < 3; i++) {
      const helix = new THREE.Mesh(helixGeometry, helixMaterial);
      helix.rotation.x = (Math.PI / 3) * i;
      helixGroup.add(helix);
    }

    scene.add(helixGroup);

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
      
      helixGroup.rotation.y = elapsedTime * 0.2;
      helixGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;

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

  return (
    <div className="biohacking-lab">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .biohacking-lab {
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .lab-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .lab-content {
          position: relative;
          z-index: 10;
          padding: calc(80px + var(--safe-area-top)) 20px calc(40px + var(--safe-area-bottom));
          max-width: 1400px;
          margin: 0 auto;
        }

        .lab-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #00FFFF;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .lab-back:hover {
          color: #00D4FF;
          transform: translateX(-3px);
        }

        .lab-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .lab-title {
          font-family: 'Orbitron', monospace;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FFFF, #00D4FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 15px;
          text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
        }

        .lab-subtitle {
          color: rgba(0, 255, 255, 0.7);
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .protocols-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .protocol-card {
          background: linear-gradient(135deg, rgba(0, 20, 20, 0.50), rgba(0, 10, 10, 0.55));
          border: 2px solid rgba(0, 255, 255, 0.3);
          padding: 30px;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }

        .protocol-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #00FFFF, transparent);
          transition: left 0.6s ease;
        }

        .protocol-card:hover::before {
          left: 100%;
        }

        .protocol-card:hover {
          border-color: #00FFFF;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
          transform: translateY(-5px);
          background: linear-gradient(135deg, rgba(0, 25, 25, 0.55), rgba(0, 15, 15, 0.60));
        }
        
        .protocol-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .protocol-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid currentColor;
          transition: all 0.3s ease;
        }

        .protocol-card:hover .protocol-icon {
          transform: rotate(360deg) scale(1.1);
          box-shadow: 0 0 20px currentColor;
        }

        .protocol-info {
          flex: 1;
        }

        .protocol-name {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .protocol-category {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .protocol-description {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .learn-button {
          width: 100%;
          background: transparent;
          border: 2px solid #00FFFF;
          color: #00FFFF;
          padding: 12px;
          font-family: 'Orbitron', monospace;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
        }

        .learn-button:hover {
          background: rgba(0, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
        }

        .protocol-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, rgba(0, 20, 30, 0.95), rgba(0, 10, 15, 0.95));
          border: 3px solid #00FFFF;
          padding: 40px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: transparent;
          border: none;
          color: #00FFFF;
          font-size: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          transform: rotate(90deg);
          color: #FF6B9D;
        }

        .modal-title {
          font-family: 'Orbitron', monospace;
          font-size: 2rem;
          color: #00FFFF;
          margin-bottom: 20px;
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .benefits-section {
          margin: 30px 0;
        }

        .benefit-category {
          background: rgba(0, 0, 0, 0.5);
          border-left: 3px solid #00FFFF;
          padding: 20px;
          margin-bottom: 25px;
        }

        .benefit-category-title {
          font-family: 'Orbitron', monospace;
          color: #00FFFF;
          margin-bottom: 15px;
          font-size: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .benefit-category ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefit-category li {
          padding: 10px 0;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
          line-height: 1.6;
          padding-left: 25px;
          position: relative;
        }

        .benefit-category li::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #00FFFF;
          font-weight: bold;
        }

        .benefit-category li:last-child {
          border-bottom: none;
        }

        .protocol-steps {
          background: rgba(0, 255, 255, 0.05);
          border: 2px solid rgba(0, 255, 255, 0.3);
          padding: 25px;
          margin-top: 30px;
        }

        .steps-title {
          font-family: 'Orbitron', monospace;
          color: #00FFFF;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .protocol-steps ol {
          padding-left: 20px;
        }

        .protocol-steps li {
          padding: 12px 0;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .lab-content {
            padding: 60px 15px 30px;
          }

          .lab-title {
            font-size: 2rem;
          }

          .protocols-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 30px 20px;
          }
        }
      `}</style>

      <div ref={mountRef} className="lab-bg" />

      <div className="lab-content">
        <Link to="/nexus" className="lab-back">
          <ArrowLeft size={18} />
          Back to Command Center
        </Link>

        <div className="lab-header">
          <h1 className="lab-title">BIOHACKING LAB</h1>
          <p className="lab-subtitle">
            Evidence-based ancestral practices for optimizing human performance and longevity
          </p>
        </div>

        <div className="protocols-grid">
          {protocols.map(protocol => {
            const Icon = protocol.icon;
            
            return (
              <div
                key={protocol.id}
                className="protocol-card"
                style={{ color: protocol.color }}
                onClick={() => setSelectedProtocol(protocol)}
              >
                <div className="protocol-header">
                  <div className="protocol-icon">
                    <Icon size={24} />
                  </div>
                  <div className="protocol-info">
                    <div className="protocol-name">{protocol.name}</div>
                    <div className="protocol-category">{protocol.category}</div>
                  </div>
                </div>

                <p className="protocol-description">{protocol.description}</p>

                <button className="learn-button">
                  READ THE BENEFITS
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProtocol && (
        <div className="protocol-modal" onClick={() => setSelectedProtocol(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProtocol(null)}>×</button>
            
            <h2 className="modal-title">{selectedProtocol.name}</h2>
            <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '20px', lineHeight: '1.6'}}>
              {selectedProtocol.description}
            </p>

            <div className="benefits-section">
              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                color: '#00FFFF',
                fontSize: '1.5rem',
                marginBottom: '25px',
                textAlign: 'center',
                textShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
              }}>
                MULTI-DIMENSIONAL BENEFITS
              </h3>

              {Object.entries(selectedProtocol.benefits).map(([category, benefitList]) => (
                <div key={category} className="benefit-category">
                  <div className="benefit-category-title">{category}</div>
                  <ul>
                    {benefitList.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="protocol-steps">
              <div className="steps-title">IMPLEMENTATION PROTOCOL</div>
              <ol>
                {selectedProtocol.protocol.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
