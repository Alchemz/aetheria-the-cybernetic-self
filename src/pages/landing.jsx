
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from 'react-router-dom';

/**
 * NEON PARTICLE & WIREFRAME AESTHETIC
 * - "Digital Soul" vibe: Wireframes representing structure, Particles representing energy.
 * - Giant 3D Title in the void.
 */

const PLANETS = [
    { name: "Mercury", radius: 0.18, color: "#a0a0a0", distance: 2.5, speed: 1.2 },
    { name: "Venus", radius: 0.28, color: "#e0c080", distance: 3.5, speed: 0.95 },
    { name: "Earth", radius: 0.30, color: "#4080ff", distance: 4.8, speed: 0.85 },
    { name: "Mars", radius: 0.22, color: "#ff4040", distance: 6.0, speed: 0.78 },
    { name: "Jupiter", radius: 0.70, color: "#d0a060", distance: 8.5, speed: 0.55 },
    { name: "Saturn", radius: 0.62, color: "#e0d0a0", distance: 10.5, speed: 0.47 },
    { name: "Uranus", radius: 0.42, color: "#80ffff", distance: 12.5, speed: 0.40 },
    { name: "Neptune", radius: 0.40, color: "#4060ff", distance: 14.5, speed: 0.34 },
];

const CHAKRAS = [
    { key: "root", color: "#ff2b2b" },
    { key: "sacral", color: "#ff7a1a" },
    { key: "solar", color: "#ffd400" },
    { key: "heart", color: "#33ff77" },
    { key: "throat", color: "#3aa7ff" },
    { key: "thirdEye", color: "#6b4bff" },
    { key: "crown", color: "#b46bff" },
];

function NeonPlanet({ name, radius, color, distance, speed }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const particlesRef = useRef();

    // Random orbit phase
    const phase = useMemo(() => Math.random() * Math.PI * 2, []);

    // Generate random particles around the planet
    const particleCount = 40;
    const particlePositions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = radius * (1.2 + Math.random() * 0.5); // Cloud around planet
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return pos;
    }, [radius]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const angle = t * speed * 0.1 + phase;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;

        if (groupRef.current) {
            groupRef.current.position.set(x, 0, z);
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.x += 0.005;
        }
        if (particlesRef.current) {
            particlesRef.current.rotation.y -= 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group>
                    {/* Wireframe Core (Structure) */}
                    <mesh ref={meshRef}>
                        <icosahedronGeometry args={[radius, 1]} />
                        <meshBasicMaterial
                            color={color}
                            wireframe={true}
                            transparent
                            opacity={0.3}
                        />
                    </mesh>

                    {/* Inner Glow Core (Energy) */}
                    <mesh>
                        <sphereGeometry args={[radius * 0.6, 16, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.5} />
                    </mesh>

                    {/* Particle Cloud (Field) */}
                    <points ref={particlesRef}>
                        <bufferGeometry>
                            <bufferAttribute attach="attributes-position" count={particleCount} array={particlePositions} itemSize={3} />
                        </bufferGeometry>
                        <pointsMaterial size={0.03} color={color} transparent opacity={0.6} sizeAttenuation={true} />
                    </points>

                    {/* Data Ring */}
                    <mesh rotation-x={Math.PI / 2}>
                        <ringGeometry args={[radius * 1.5, radius * 1.52, 32]} />
                        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
                    </mesh>
                </group>
            </Float>
        </group>
    );
}

function ChakraColumnNeon() {
    return (
        <group>
            {/* Central Beam */}
            <mesh>
                <cylinderGeometry args={[0.02, 0.02, 10, 8]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
            </mesh>

            {CHAKRAS.map((c, i) => {
                const y = (i - 3) * 0.8;
                return (
                    <group key={c.key} position={[0, y, 0]}>
                        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                            <boxGeometry args={[0.2, 0.2, 0.2]} />
                            <meshBasicMaterial color={c.color} wireframe transparent opacity={0.4} />
                        </mesh>
                    </group>
                )
            })}
        </group>
    )
}

function StarField({ count = 1500 }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 80;
            p[i * 3 + 1] = (Math.random() - 0.5) * 80;
            p[i * 3 + 2] = (Math.random() - 0.5) * 80;
            sizes[i] = Math.random();
        }
        return { p, sizes };
    }, [count]);

    // Twinkle effect
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points.p} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.3} sizeAttenuation={true} blending={THREE.AdditiveBlending} />
        </points>
    );
}

function GiantTitle() {
    return (
        <group position={[0, 0, -20]}>
            {/* Main Title - High Visibility */}
            <Text
                font="/fonts/Orbitron.woff"
                fontSize={10}
                letterSpacing={0.1}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fillOpacity={1}
                outlineWidth={0.05}
                outlineColor="#00ffff"
                outlineOpacity={1}
            >
                INNERSYNC
            </Text>

            {/* Inner Glow Layer */}
            <Text
                font="/fonts/Orbitron.woff"
                fontSize={10}
                letterSpacing={0.1}
                color="#00ffff"
                anchorX="center"
                anchorY="middle"
                position={[0, 0, -0.1]}
                fillOpacity={0.5}
                outlineWidth={0.1}
                outlineColor="#00ffff"
                outlineBlur={0.1}
                outlineOpacity={0.8}
            >
                INNERSYNC
            </Text>

            {/* Outer Bloom Layer */}
            <Text
                font="/fonts/Orbitron.woff"
                fontSize={10}
                letterSpacing={0.1}
                color="#00ffff"
                anchorX="center"
                anchorY="middle"
                position={[0, 0, -0.2]}
                fillOpacity={0}
                outlineWidth={0.5}
                outlineColor="#00ffff"
                outlineBlur={0.4}
                outlineOpacity={0.4}
            >
                INNERSYNC
            </Text>
        </group>
    )
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />

            {/* Environment for reflections if needed, but we are mostly wireframe/basic now */}
            <Environment preset="city" />

            <StarField />
            <React.Suspense fallback={null}>
                <GiantTitle />
            </React.Suspense>

            {PLANETS.map((p) => (
                <NeonPlanet key={p.name} {...p} />
            ))}

            <ChakraColumnNeon />

            <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
        </>
    );
}

export default function SolarChakraScene() {
    const navigate = useNavigate();

    return (
        <div style={{ width: "100%", height: "100dvh", minHeight: "-webkit-fill-available", background: "#000000", position: 'relative', overflow: 'hidden' }}>
            <Canvas
                camera={{ position: [0, 2, 8], fov: 60 }}
                gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
                dpr={[1, 2]}
            >
                <color attach="background" args={["#000000"]} />
                <fog attach="fog" args={["#000000", 10, 40]} />
                <Scene />
            </Canvas>

            {/* Cinematic Overlay UI - Minimal */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-32 z-10">
                <div className="pointer-events-auto">
                    <button
                        onClick={() => navigate('/portal')}
                        className="group relative px-16 py-5 bg-transparent overflow-hidden rounded-none transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 border border-white/20 skew-x-12 bg-black/20 backdrop-blur-sm group-hover:border-cyan-400/50 transition-colors" />

                        <span className="relative font-[Orbitron] text-sm tracking-[0.5em] text-white/80 group-hover:text-cyan-200 transition-colors">
                            INITIALIZE SYSTEM
                        </span>
                    </button>

                    <div className="text-center mt-4">
                        <span className="font-mono text-[10px] text-white/20 tracking-[0.5em] animate-pulse">
                            READY
                        </span>
                    </div>
                </div>
            </div>

            {/* Version Mark */}
            <div className="absolute bottom-8 right-8 text-[10px] font-mono text-white/10 tracking-widest">
                v4.5 NITRO
            </div>
        </div>
    );
}
