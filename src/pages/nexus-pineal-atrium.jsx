
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ArrowLeft, X, Info, Zap, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PinealAtrium() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const brainRegionsRef = useRef([]);
  const brainPlanesRef = useRef([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Brain region data with SMALLER sizes to fit inside brain
  const brainRegions = [
    {
      id: 'pineal',
      name: 'Pineal Gland',
      position: { x: 0, y: 0, z: 0 },
      color: 0xBA55D3,
      size: 0.08, // Much smaller
      info: {
        scientific: 'A small endocrine gland that produces melatonin and DMT. Located at the geometric center of the brain.',
        esoteric: 'Known as the "Third Eye" and "Seat of the Soul" across ancient cultures. Gateway to higher consciousness.',
        practices: [
          'Sun gazing (first 15 minutes after sunrise)',
          'Eliminate fluoride exposure',
          'Meditation with 963 Hz frequency',
          'Dark room meditation practices'
        ]
      }
    },
    {
      id: 'prefrontal',
      name: 'Prefrontal Cortex',
      position: { x: 0, y: 0.3, z: 0.7 },
      color: 0x00FFFF,
      size: 0.12, // Smaller
      info: {
        scientific: 'Executive function center. Controls decision-making, personality expression, and complex cognitive behavior.',
        esoteric: 'The seat of conscious will and higher reasoning. Bridge between animal instinct and divine intellect.',
        practices: [
          'Cold exposure for dopamine regulation',
          'Meditation to strengthen neural pathways',
          'Novelty-seeking to maintain plasticity',
          'Intentional discomfort training'
        ]
      }
    },
    {
      id: 'hippocampus-left',
      name: 'Hippocampus (Left)',
      position: { x: -0.5, y: -0.2, z: 0.1 },
      color: 0xFF6B9D,
      size: 0.09, // Smaller
      info: {
        scientific: 'Critical for memory formation and spatial navigation. Contains high concentration of neurogenesis.',
        esoteric: 'The librarian of consciousness. Keeper of your story and anchor to linear time.',
        practices: [
          'Memory palace technique',
          'Spatial navigation exercises',
          'BDNF boosting (exercise, Lion\'s Mane)',
          'Novelty and learning protocols'
        ]
      }
    },
    {
      id: 'hippocampus-right',
      name: 'Hippocampus (Right)',
      position: { x: 0.5, y: -0.2, z: 0.1 },
      color: 0xFF6B9D,
      size: 0.09, // Smaller
      info: {
        scientific: 'Works with left hippocampus for episodic memory and emotional context of memories.',
        esoteric: 'The emotional resonance keeper. Assigns meaning and feeling to stored experiences.',
        practices: [
          'Emotional memory journaling',
          'Visualization exercises',
          'Gratitude practice for positive encoding',
          'Dream recall training'
        ]
      }
    },
    {
      id: 'thalamus',
      name: 'Thalamus',
      position: { x: 0, y: 0.05, z: 0.1 },
      color: 0xFFAA00,
      size: 0.1, // Smaller
      info: {
        scientific: 'Sensory relay station. All sensory information (except smell) passes through here before reaching cortex.',
        esoteric: 'The gatekeeper of perception. Filters reality before it reaches your conscious awareness.',
        practices: [
          'Sensory deprivation practices',
          'Mindfulness of sensation',
          'Binaural beats for thalamic entrainment',
          'Fasting to heighten sensory acuity'
        ]
      }
    },
    {
      id: 'amygdala-left',
      name: 'Amygdala (Left)',
      position: { x: -0.4, y: -0.25, z: 0.2 },
      color: 0xFF4444,
      size: 0.07, // Smaller
      info: {
        scientific: 'Processes emotions, especially fear and threat detection. Critical for survival responses.',
        esoteric: 'The guardian of safety. Ancient protector that must be acknowledged but not ruled by.',
        practices: [
          'Breathwork to regulate fear response',
          'Exposure therapy for resilience',
          'Loving-kindness meditation',
          'Somatic experiencing practices'
        ]
      }
    },
    {
      id: 'amygdala-right',
      name: 'Amygdala (Right)',
      position: { x: 0.4, y: -0.25, z: 0.2 },
      color: 0xFF4444,
      size: 0.07, // Smaller
      info: {
        scientific: 'Processes emotional significance and autonomic responses to emotional stimuli.',
        esoteric: 'The emotional truth detector. Knows what matters before the mind can articulate why.',
        practices: [
          'Heart coherence breathing',
          'Emotional freedom technique (EFT)',
          'Body scan meditation',
          'Vagal tone exercises'
        ]
      }
    },
    {
      id: 'corpus-callosum',
      name: 'Corpus Callosum',
      position: { x: 0, y: 0.15, z: 0 },
      color: 0xFFFFFF,
      size: 0.08, // Smaller
      geometry: 'bridge',
      info: {
        scientific: 'Thick band of nerve fibers connecting left and right hemispheres. Enables hemispheric communication.',
        esoteric: 'The bridge of integration. Where logic meets intuition, creating wholeness.',
        practices: [
          'Cross-lateral exercises',
          'Ambidextrous skill development',
          'Bilateral stimulation (EMDR)',
          'Whole-brain synchronization audio'
        ]
      }
    }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xBA55D3, 1.5, 100);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Load wireframe brain images as textured planes with better blending
    const textureLoader = new THREE.TextureLoader();
    
    // Left side view
    textureLoader.load(
      'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/2f8ee0934_Photoroom_20251017_034534.PNG',
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(2.5, 2.5);
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6, // Increased opacity
          side: THREE.DoubleSide,
          depthWrite: false, // Added for better blending
          blending: THREE.AdditiveBlending // Added for better blending
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, 0);
        plane.rotation.y = Math.PI / 2; // Rotate to side view
        scene.add(plane);
        brainPlanesRef.current.push(plane);
      }
    );

    // Right side view
    textureLoader.load(
      'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/fe2fa23a1_Photoroom_20251017_034648.PNG',
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(2.5, 2.5);
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6, // Increased opacity
          side: THREE.DoubleSide,
          depthWrite: false, // Added for better blending
          blending: THREE.AdditiveBlending // Added for better blending
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, 0);
        plane.rotation.y = -Math.PI / 2; // Opposite side
        scene.add(plane);
        brainPlanesRef.current.push(plane);
      }
    );

    // Top view
    textureLoader.load(
      'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/4c58f0ece_Photoroom_20251017_034754.PNG',
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(2.5, 2.5);
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6, // Increased opacity
          side: THREE.DoubleSide,
          depthWrite: false, // Added for better blending
          blending: THREE.AdditiveBlending // Added for better blending
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, 0);
        plane.rotation.x = Math.PI / 2; // Rotate to top view
        scene.add(plane);
        brainPlanesRef.current.push(plane);
      }
    );

    // Front view (using top view image for better coverage)
    textureLoader.load(
      'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d4574bc126933aed677cd7/4c58f0ece_Photoroom_20251017_034754.PNG',
      (texture) => {
        const planeGeometry = new THREE.PlaneGeometry(2.5, 2.5);
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, 0);
        plane.rotation.y = 0; // Front facing
        scene.add(plane);
        brainPlanesRef.current.push(plane);
      }
    );

    // Create interactive brain regions (smaller glowing spheres)
    const regions = [];
    brainRegions.forEach(region => {
      let mesh;
      
      if (region.geometry === 'bridge') {
        // Corpus callosum as a thin horizontal bridge
        const bridgeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8); // Smaller bridge
        const bridgeMaterial = new THREE.MeshBasicMaterial({
          color: region.color,
          transparent: true,
          opacity: 0.8
        });
        mesh = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        mesh.rotation.z = Math.PI / 2;
      } else {
        // Regular spherical regions
        const geometry = new THREE.SphereGeometry(region.size, 16, 16);
        const material = new THREE.MeshBasicMaterial({
          color: region.color,
          transparent: true,
          opacity: 0.9 // Slightly more opaque
        });
        mesh = new THREE.Mesh(geometry, material);
      }

      mesh.position.set(region.position.x, region.position.y, region.position.z);
      mesh.userData = { regionId: region.id, regionData: region };
      scene.add(mesh);
      regions.push(mesh);

      // Add glow effect (relative size adjusted)
      const glowGeometry = new THREE.SphereGeometry(region.size * 1.5, 16, 16); // Larger glow relative to sphere
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: region.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(mesh.position);
      scene.add(glow);
      mesh.userData.glow = glow;
    });

    brainRegionsRef.current = regions;

    // Neural connection particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 150; // Fewer particles
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 1.2 + Math.random() * 0.4; // Slightly smaller range
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.012, // Smaller particles
      color: 0xBA55D3,
      transparent: true,
      opacity: 0.5, // Less opaque
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation loop - NO AUTO-ROTATION, only gentle pulsing
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Only pulse the glows gently
      regions.forEach((r, idx) => {
        const pulseSpeed = 1 + idx * 0.15;
        const pulseAmount = Math.sin(elapsedTime * pulseSpeed) * 0.1 + 1;
        if (r.userData.glow) {
          r.userData.glow.scale.set(pulseAmount, pulseAmount, pulseAmount);
        }
      });

      // Very subtle particle drift
      particles.rotation.y += 0.0002;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging) {
        // Raycast for hover detection
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(regions);

        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object;
          setHoveredRegion(hoveredMesh.userData.regionId);
          
          // Brighten hovered region
          regions.forEach(r => {
            if (r === hoveredMesh) {
              r.material.opacity = 1;
              if (r.userData.glow) r.userData.glow.material.opacity = 0.6; // Brighter glow on hover
            } else {
              r.material.opacity = 0.9;
              if (r.userData.glow) r.userData.glow.material.opacity = 0.3;
            }
          });
        } else {
          setHoveredRegion(null);
          regions.forEach(r => {
            r.material.opacity = 0.9;
            if (r.userData.glow) r.userData.glow.material.opacity = 0.3;
          });
        }
      }

      // Manual rotation when dragging (ONLY when user drags)
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        // Rotate brain planes
        brainPlanesRef.current.forEach(plane => {
          plane.rotation.y += deltaMove.x * 0.005;
          plane.rotation.x += deltaMove.y * 0.005;
        });

        // Rotate regions and glows
        regions.forEach(r => {
          const pivot = new THREE.Object3D();
          scene.add(pivot);
          pivot.add(r);
          pivot.rotation.y += deltaMove.x * 0.005;
          pivot.rotation.x += deltaMove.y * 0.005;
          scene.attach(r);
          scene.remove(pivot);

          if (r.userData.glow) {
            const glowPivot = new THREE.Object3D();
            scene.add(glowPivot);
            glowPivot.add(r.userData.glow);
            glowPivot.rotation.y += deltaMove.x * 0.005;
            glowPivot.rotation.x += deltaMove.y * 0.005;
            scene.attach(r.userData.glow);
            scene.remove(glowPivot);
          }
        });

        particles.rotation.y += deltaMove.x * 0.005;
        particles.rotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = (event) => {
      if (Math.abs(event.clientX - previousMousePosition.x) > 5 || 
          Math.abs(event.clientY - previousMousePosition.y) > 5) {
        return; // Was dragging, not clicking
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(regions);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        setSelectedRegion(clickedMesh.userData.regionData);
      }
    };

    const onWheel = (event) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.002;
      camera.position.z = Math.max(2, Math.min(7, camera.position.z));
    };

    // IMPROVED TOUCH HANDLING FOR MOBILE
    let touchStartPos = { x: 0, y: 0 };
    let touchCurrentPos = { x: 0, y: 0 };
    let isTouching = false;

    const onTouchStart = (event) => {
      event.preventDefault(); // Prevent default browser actions like scrolling
      if (event.touches.length === 1) { // Only handle single touch for rotation/tap
        isTouching = true;
        touchStartPos = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        };
        touchCurrentPos = { ...touchStartPos };
      }
    };

    const onTouchMove = (event) => {
      event.preventDefault(); // Prevent default browser actions like scrolling
      if (!isTouching || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const newPos = {
        x: touch.clientX,
        y: touch.clientY
      };

      const deltaMove = {
        x: newPos.x - touchCurrentPos.x,
        y: newPos.y - touchCurrentPos.y
      };

      // Rotate brain planes
      brainPlanesRef.current.forEach(plane => {
        plane.rotation.y += deltaMove.x * 0.008; // Slightly more sensitive for mobile
        plane.rotation.x += deltaMove.y * 0.008;
      });

      // Rotate regions and glows
      regions.forEach(r => {
        const pivot = new THREE.Object3D();
        scene.add(pivot);
        pivot.add(r);
        pivot.rotation.y += deltaMove.x * 0.008;
        pivot.rotation.x += deltaMove.y * 0.008;
        scene.attach(r);
        scene.remove(pivot);

        if (r.userData.glow) {
          const glowPivot = new THREE.Object3D();
          scene.add(glowPivot);
          glowPivot.add(r.userData.glow);
          glowPivot.rotation.y += deltaMove.x * 0.008;
          glowPivot.rotation.x += deltaMove.y * 0.008;
          scene.attach(r.userData.glow);
          scene.remove(glowPivot);
        }
      });

      particles.rotation.y += deltaMove.x * 0.008;
      particles.rotation.x += deltaMove.y * 0.008;

      touchCurrentPos = newPos;
    };

    const onTouchEnd = (event) => {
      event.preventDefault(); // Prevent default browser actions
      
      // Check if it was a tap (not a drag)
      const touchDistance = Math.sqrt(
        Math.pow(touchCurrentPos.x - touchStartPos.x, 2) +
        Math.pow(touchCurrentPos.y - touchStartPos.y, 2)
      );

      if (isTouching && touchDistance < 10 && event.changedTouches.length === 1) {
        // It was a tap - check for region click
        const touch = event.changedTouches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(regions);

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object;
          setSelectedRegion(clickedMesh.userData.regionData);
        }
      }

      isTouching = false;
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    
    // Touch events with passive: false to allow preventDefault
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: false });

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [brainRegions]);

  return (
    <div className="pineal-atrium">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

        .pineal-atrium {
          min-height: 100vh;
          background: #000;
          color: white;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .atrium-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          cursor: grab;
        }

        .atrium-bg:active {
          cursor: grabbing;
        }

        .atrium-controls {
          position: fixed;
          top: 20px;
          left: 20px;
          right: 20px;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .atrium-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #BA55D3;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 10px 15px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(186, 85, 211, 0.3);
        }

        .atrium-back:hover {
          color: #DDA0DD;
          border-color: #BA55D3;
          transform: translateX(-3px);
        }

        .atrium-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          color: #BA55D3;
          text-shadow: 0 0 20px #BA55D3;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px 20px;
          border: 1px solid rgba(186, 85, 211, 0.3);
        }

        .atrium-instructions {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(186, 85, 211, 0.3);
          padding: 15px 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem;
          color: rgba(221, 160, 221, 0.8);
        }

        .instruction-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .region-panel {
          position: fixed;
          right: 0;
          top: 0;
          width: 400px;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          border-left: 2px solid #BA55D3;
          z-index: 20;
          padding: 30px;
          padding-top: calc(30px + env(safe-area-inset-top));
          overflow-y: auto;
          transform: translateX(${selectedRegion ? '0' : '100%'});
          transition: transform 0.4s ease;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
        }

        .panel-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.4rem;
          color: #BA55D3;
          font-weight: 700;
        }

        .panel-close {
          background: transparent;
          border: none;
          color: #BA55D3;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 5px;
        }

        .panel-close:hover {
          color: #DDA0DD;
          transform: rotate(90deg);
        }

        .panel-section {
          margin-bottom: 25px;
        }

        .panel-section-title {
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          color: #DDA0DD;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .panel-section-content {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .practices-list {
          list-style: none;
          padding: 0;
        }

        .practices-list li {
          padding: 10px;
          margin-bottom: 8px;
          background: rgba(186, 85, 211, 0.1);
          border-left: 3px solid #BA55D3;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
        }

        .practices-list li::before {
          content: '⚡';
          margin-right: 8px;
          color: #BA55D3;
        }

        .hover-indicator {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(186, 85, 211, 0.2);
          border: 1px solid #BA55D3;
          padding: 10px 20px;
          font-family: 'Orbitron', monospace;
          font-size: 0.9rem;
          color: #BA55D3;
          opacity: ${hoveredRegion ? 1 : 0};
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .region-panel {
            width: 100%;
          }

          .atrium-instructions {
            font-size: 0.7rem;
            padding: 10px 15px;
            flex-wrap: wrap;
            gap: 10px;
          }

          .atrium-title {
            font-size: 1.2rem;
            padding: 8px 15px;
          }
        }

        /* Custom scrollbar for panel */
        .region-panel::-webkit-scrollbar {
          width: 8px;
        }

        .region-panel::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .region-panel::-webkit-scrollbar-thumb {
          background: #BA55D3;
          border-radius: 4px;
        }

        .region-panel::-webkit-scrollbar-thumb:hover {
          background: #DDA0DD;
        }
      `}</style>

      <div ref={mountRef} className="atrium-bg" />

      <div className="atrium-controls">
        <Link to="/nexus" className="atrium-back">
          <ArrowLeft size={18} />
          Back to Nexus
        </Link>
        <div className="atrium-title">PINEAL ATRIUM</div>
        <div style={{ width: 100 }} />
      </div>

      <div className="atrium-instructions">
        <div className="instruction-item">
          <Info size={16} />
          <span>Drag to rotate</span>
        </div>
        <div className="instruction-item">
          <Zap size={16} />
          <span>Click regions to explore</span>
        </div>
        <div className="instruction-item">
          <RotateCw size={16} />
          <span>Scroll to zoom</span>
        </div>
      </div>

      {hoveredRegion && (
        <div className="hover-indicator">
          {brainRegions.find(r => r.id === hoveredRegion)?.name}
        </div>
      )}

      {selectedRegion && (
        <div className="region-panel">
          <div className="panel-header">
            <h2 className="panel-title">{selectedRegion.name}</h2>
            <button 
              className="panel-close"
              onClick={() => setSelectedRegion(null)}
            >
              <X size={24} />
            </button>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Scientific Understanding</div>
            <div className="panel-section-content">
              {selectedRegion.info.scientific}
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Esoteric Wisdom</div>
            <div className="panel-section-content">
              {selectedRegion.info.esoteric}
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Optimization Practices</div>
            <ul className="practices-list">
              {selectedRegion.info.practices.map((practice, idx) => (
                <li key={idx}>{practice}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
