import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X } from 'lucide-react';

const BrainVisualization = ({ active = true }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const brainMeshRef = useRef(null);
  const orbsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const isRenderingRef = useRef(false);
  const animateFnRef = useRef(null);
  const hoveredRegionRef = useRef(null);
  
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  
  const cameraControlsRef = useRef({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    previousTouchDistance: 0,
    rotation: { x: 0, y: 0 },
    targetRotation: { x: 0, y: 0 },
    zoom: 5,
    targetZoom: 5
  });

  const brainRegions = [
    {
      id: 'pineal',
      name: 'Pineal Gland',
      position: [0, 0.5, -0.8],
      color: 0xFFD700,
      description: 'The "third eye" - regulates circadian rhythms and produces melatonin. Ancient cultures believed it was the seat of the soul and spiritual insight.'
    },
    {
      id: 'thalamus',
      name: 'Thalamus',
      position: [0, 0.2, -0.3],
      color: 0x00FFFF,
      description: 'The brain\'s relay station - processes and transmits sensory information to the cerebral cortex. Critical for consciousness and sleep regulation.'
    },
    {
      id: 'hippocampus-left',
      name: 'Hippocampus (Left)',
      position: [-1.2, -0.3, 0],
      color: 0x9D4EDD,
      description: 'Essential for forming new memories and spatial navigation. Damage here can cause severe memory impairment.'
    },
    {
      id: 'hippocampus-right',
      name: 'Hippocampus (Right)',
      position: [1.2, -0.3, 0],
      color: 0x9D4EDD,
      description: 'Essential for forming new memories and spatial navigation. Damage here can cause severe memory impairment.'
    },
    {
      id: 'amygdala',
      name: 'Amygdala',
      position: [0, -0.5, 0.5],
      color: 0xFF006E,
      description: 'The emotional center - processes fear, anxiety, and emotional memories. Key to survival responses and emotional learning.'
    },
    {
      id: 'prefrontal-left',
      name: 'Prefrontal Cortex (Left)',
      position: [-0.8, 1.0, 1.2],
      color: 0x06FFA5,
      description: 'Executive function hub - decision making, planning, and personality expression. The most evolved part of the human brain.'
    },
    {
      id: 'prefrontal-right',
      name: 'Prefrontal Cortex (Right)',
      position: [0.8, 1.0, 1.2],
      color: 0x06FFA5,
      description: 'Executive function hub - decision making, planning, and personality expression. The most evolved part of the human brain.'
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00FFFF, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xFF00FF, 0.8, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    const brainGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const brainMaterial = new THREE.MeshPhongMaterial({
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.15,
      wireframe: false,
      emissive: 0x0a0a1e,
      emissiveIntensity: 0.3
    });
    const brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
    scene.add(brainMesh);
    brainMeshRef.current = brainMesh;

    const wireframeGeometry = new THREE.SphereGeometry(1.81, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00FFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeMesh);

    const isMobile = window.innerWidth < 768;
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starCount = isMobile ? 400 : 800;
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    brainRegions.forEach((region) => {
      const orbGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: region.color,
        emissive: region.color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(...region.position);
      orb.userData = region;
      scene.add(orb);
      orbsRef.current.push(orb);

      const glowGeometry = new THREE.SphereGeometry(0.18, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: region.color,
        transparent: true,
        opacity: 0.2
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(...region.position);
      scene.add(glow);
      orb.userData.glow = glow;
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!isRenderingRef.current) {
        animationFrameRef.current = null;
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);

      const controls = cameraControlsRef.current;
      controls.rotation.x += (controls.targetRotation.x - controls.rotation.x) * 0.05;
      controls.rotation.y += (controls.targetRotation.y - controls.rotation.y) * 0.05;
      controls.zoom += (controls.targetZoom - controls.zoom) * 0.05;

      camera.position.x = Math.sin(controls.rotation.y) * controls.zoom;
      camera.position.y = Math.sin(controls.rotation.x) * controls.zoom;
      camera.position.z = Math.cos(controls.rotation.y) * controls.zoom;
      camera.lookAt(0, 0, 0);

      brainMesh.rotation.y += 0.001;
      wireframeMesh.rotation.y += 0.001;
      wireframeMesh.rotation.x += 0.0005;

      orbsRef.current.forEach((orb) => {
        const baseScale = hoveredRegionRef.current?.id === orb.userData.id ? 1.3 : 1.0;
        const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1;
        orb.scale.setScalar(baseScale * pulse);
        
        if (orb.userData.glow) {
          const glowScale = hoveredRegionRef.current?.id === orb.userData.id ? 1.5 : 1.0;
          orb.userData.glow.scale.setScalar(glowScale * pulse * 1.2);
          orb.userData.glow.material.opacity = hoveredRegionRef.current?.id === orb.userData.id ? 0.4 : 0.2;
        }
      });

      renderer.render(scene, camera);
    };
    
    animateFnRef.current = animate;
    
    if (active) {
      isRenderingRef.current = true;
      animate();
    }

    return () => {
      isRenderingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (active && !isRenderingRef.current && !animationFrameRef.current) {
      isRenderingRef.current = true;
      if (animateFnRef.current) {
        animateFnRef.current();
      }
    } else if (!active && isRenderingRef.current) {
      isRenderingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  }, [active]);

  useEffect(() => {
    hoveredRegionRef.current = hoveredRegion;
    orbsRef.current.forEach((orb) => {
      orb.material.emissiveIntensity = hoveredRegion?.id === orb.userData.id ? 1.0 : 0.5;
    });
  }, [hoveredRegion]);

  const handleMouseDown = (e) => {
    cameraControlsRef.current.isDragging = true;
    cameraControlsRef.current.previousMousePosition = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (cameraRef.current && sceneRef.current) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(orbsRef.current);
      
      if (intersects.length > 0) {
        setHoveredRegion(intersects[0].object.userData);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredRegion(null);
        document.body.style.cursor = 'default';
      }
    }

    const controls = cameraControlsRef.current;
    if (controls.isDragging) {
      const deltaX = e.clientX - controls.previousMousePosition.x;
      const deltaY = e.clientY - controls.previousMousePosition.y;
      
      controls.targetRotation.y += deltaX * 0.005;
      controls.targetRotation.x += deltaY * 0.005;
      
      controls.targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, controls.targetRotation.x));
      
      controls.previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    }
  };

  const handleMouseUp = () => {
    cameraControlsRef.current.isDragging = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const controls = cameraControlsRef.current;
    controls.targetZoom += e.deltaY * 0.005;
    controls.targetZoom = Math.max(3, Math.min(10, controls.targetZoom));
  };

  const handleClick = () => {
    if (hoveredRegion) {
      setSelectedRegion(hoveredRegion);
    }
  };

  const handleResetView = () => {
    const controls = cameraControlsRef.current;
    controls.targetRotation = { x: 0, y: 0 };
    controls.targetZoom = 5;
    setSelectedRegion(null);
    setHoveredRegion(null);
  };

  const focusOnRegion = (region) => {
    const controls = cameraControlsRef.current;
    const orb = orbsRef.current.find(o => o.userData.id === region.id);
    if (orb) {
      const targetPos = new THREE.Vector3(...region.position);
      const angle = Math.atan2(targetPos.x, targetPos.z);
      controls.targetRotation.y = angle;
      controls.targetRotation.x = Math.asin(targetPos.y / 2);
      controls.targetZoom = 3.5;
      setSelectedRegion(region);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        style={{ width: '100%', height: '100%', cursor: 'grab' }}
      />

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <button
          onClick={handleResetView}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, rgba(255, 34, 0, 0.15), rgba(255, 85, 51, 0.10))',
            border: '2px solid rgba(255, 34, 0, 0.5)',
            borderRadius: '8px',
            color: '#FF5533',
            fontFamily: 'Exo 2, sans-serif',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '1px',
            textShadow: '0 0 10px rgba(255, 85, 51, 0.5)',
            boxShadow: '0 0 15px rgba(255, 34, 0, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(255, 34, 0, 0.25), rgba(255, 85, 51, 0.15))';
            e.target.style.boxShadow = '0 0 25px rgba(255, 34, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(255, 34, 0, 0.15), rgba(255, 85, 51, 0.10))';
            e.target.style.boxShadow = '0 0 15px rgba(255, 34, 0, 0.3)';
          }}
        >
          RESET VIEW
        </button>

        <div style={{
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.7))',
          border: '1px solid rgba(255, 34, 0, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{
            color: '#FF5533',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '12px',
            fontWeight: '700',
            marginBottom: '12px',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(255, 85, 51, 0.5)'
          }}>
            BRAIN REGIONS
          </div>
          {brainRegions.map((region) => (
            <button
              key={region.id}
              onClick={() => focusOnRegion(region)}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: '6px',
                background: selectedRegion?.id === region.id 
                  ? 'linear-gradient(135deg, rgba(255, 34, 0, 0.2), rgba(255, 85, 51, 0.15))'
                  : 'rgba(10, 10, 10, 0.5)',
                border: `1px solid ${selectedRegion?.id === region.id ? 'rgba(255, 34, 0, 0.6)' : 'rgba(255, 85, 51, 0.3)'}`,
                borderRadius: '6px',
                color: selectedRegion?.id === region.id ? '#FF5533' : '#999',
                fontFamily: 'Exo 2, sans-serif',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 34, 0, 0.15), rgba(255, 85, 51, 0.10))';
                e.target.style.borderColor = 'rgba(255, 34, 0, 0.5)';
                e.target.style.color = '#FF5533';
              }}
              onMouseLeave={(e) => {
                if (selectedRegion?.id !== region.id) {
                  e.target.style.background = 'rgba(10, 10, 10, 0.5)';
                  e.target.style.borderColor = 'rgba(255, 85, 51, 0.3)';
                  e.target.style.color = '#999';
                }
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: `#${region.color.toString(16).padStart(6, '0')}`,
                boxShadow: `0 0 10px #${region.color.toString(16).padStart(6, '0')}`
              }} />
              {region.name}
            </button>
          ))}
        </div>
      </div>

      {selectedRegion && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '30px',
          transform: 'translateY(-50%)',
          maxWidth: '350px',
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95), rgba(20, 20, 30, 0.9))',
          border: `2px solid #${selectedRegion.color.toString(16).padStart(6, '0')}`,
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(15px)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 40px rgba(${parseInt(selectedRegion.color.toString(16).slice(0, 2), 16)}, ${parseInt(selectedRegion.color.toString(16).slice(2, 4), 16)}, ${parseInt(selectedRegion.color.toString(16).slice(4, 6), 16)}, 0.3)`,
          zIndex: 20,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <button
            onClick={() => setSelectedRegion(null)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'transparent',
              border: 'none',
              color: '#FF5533',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: `#${selectedRegion.color.toString(16).padStart(6, '0')}`,
              boxShadow: `0 0 20px #${selectedRegion.color.toString(16).padStart(6, '0')}`
            }} />
            <h3 style={{
              color: '#FFF',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '1px',
              textShadow: `0 0 15px rgba(${parseInt(selectedRegion.color.toString(16).slice(0, 2), 16)}, ${parseInt(selectedRegion.color.toString(16).slice(2, 4), 16)}, ${parseInt(selectedRegion.color.toString(16).slice(4, 6), 16)}, 0.5)`
            }}>
              {selectedRegion.name}
            </h3>
          </div>
          
          <p style={{
            color: '#CCC',
            fontFamily: 'Exo 2, sans-serif',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0
          }}>
            {selectedRegion.description}
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateY(-50%) translateX(50px);
            opacity: 0;
          }
          to {
            transform: translateY(-50%) translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BrainVisualization;
