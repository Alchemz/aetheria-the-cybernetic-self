import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as AstronomyEngine from 'astronomy-engine';

// Handle Namespace vs Default export for bundling compatibility
const Astronomy = AstronomyEngine.default || AstronomyEngine;

export default function SolarSystemScene({
    interactive = false,
    height = '100%',
    date = new Date(),
    onPlanetSelect = null
}) {
    const mountRef = useRef(null);
    const solarSystemAPI = useRef({ update: null });

    useEffect(() => {
        if (!mountRef.current) return;

        let scene, camera, renderer, controls, raycaster, pointer;
        let planets = {};
        let stars;
        let mounted = true;
        let animationId;

        const init = () => {
            if (!mounted) return;

            // 1. Scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000510);

            camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 2000);

            // Camera position based on interactive mode
            if (interactive) {
                camera.position.set(0, 40, 60);
            } else {
                camera.position.set(0, 30, 45);
            }
            camera.lookAt(0, 0, 0);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            mountRef.current.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxDistance = 500;

            // Disable interaction if not requested
            controls.enabled = interactive;
            controls.autoRotate = !interactive; // Auto rotate for widget view
            controls.autoRotateSpeed = 0.5;

            raycaster = new THREE.Raycaster();
            pointer = new THREE.Vector2();

            // 2. Data
            const SCALE_FACTOR = 8;
            const PLANET_DATA = [
                { name: 'Mercury', body: 'Mercury', radius: 0.4, color: 0xA5A5A5, orbitColor: 0x555555, period: 88 },
                { name: 'Venus', body: 'Venus', radius: 0.9, color: 0xE6C229, orbitColor: 0x8B7D2B, period: 225 },
                { name: 'Earth', body: 'Earth', radius: 1.0, color: 0x22A6B3, orbitColor: 0x1B5E63, period: 365 },
                { name: 'Mars', body: 'Mars', radius: 0.5, color: 0xFF4D4D, orbitColor: 0x8B2E2E, period: 687 },
                { name: 'Jupiter', body: 'Jupiter', radius: 3.5, color: 0xE0AE6F, orbitColor: 0x755C3B, period: 4333 },
                { name: 'Saturn', body: 'Saturn', radius: 3.0, color: 0xF4D03F, orbitColor: 0x7D6B21, rule: true, period: 10759, ring: true },
                { name: 'Uranus', body: 'Uranus', radius: 2.0, color: 0x55E6C1, orbitColor: 0x2D7A66, period: 30687 },
                { name: 'Neptune', body: 'Neptune', radius: 1.9, color: 0x1B9CFC, orbitColor: 0x0E4D7D, period: 60190 },
            ];

            // 3. Objects
            // SUN
            const sunGeometry = new THREE.SphereGeometry(6, 64, 64);
            const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
            const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
            const sunGlow = new THREE.Mesh(
                new THREE.SphereGeometry(12, 64, 64),
                new THREE.MeshBasicMaterial({ color: 0xFF8C00, transparent: true, opacity: 0.2, side: THREE.BackSide, blending: THREE.AdditiveBlending })
            );
            sunMesh.add(sunGlow);
            sunMesh.userData = { name: 'Sun', type: 'Star', details: 'The Star at the center of our Solar System.' };
            scene.add(sunMesh);
            planets['Sun'] = sunMesh;

            // STARS
            const starGeom = new THREE.BufferGeometry();
            const starCount = 2000; // Less stars for widget performance
            const starPos = new Float32Array(starCount * 3);
            for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 1000;
            starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
            const starMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.5, transparent: true, opacity: 0.6 });
            stars = new THREE.Points(starGeom, starMat);
            scene.add(stars);

            // PLANETS
            PLANET_DATA.forEach(p => {
                const geometry = new THREE.SphereGeometry(p.radius, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: p.color });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = { ...p, type: 'Planet' };

                if (p.ring) {
                    const ringGeom = new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.5, 64);
                    const ringMat = new THREE.MeshBasicMaterial({ color: 0xAAAAAA, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
                    const ring = new THREE.Mesh(ringGeom, ringMat);
                    ring.rotation.x = Math.PI / 2;
                    mesh.add(ring);
                }

                scene.add(mesh);
                planets[p.name] = mesh;

                // ORBITS
                const orbitPoints = [];
                const segments = 90; // Lower res for widget
                const startMs = date.getTime();
                const periodMs = p.period * 24 * 60 * 60 * 1000;

                for (let i = 0; i <= segments; i++) {
                    const t = startMs + (i / segments) * periodMs;
                    const d = new Date(t);
                    const vec = Astronomy.HelioVector(p.body, d);
                    orbitPoints.push(new THREE.Vector3(vec.x * SCALE_FACTOR, vec.z * SCALE_FACTOR, -vec.y * SCALE_FACTOR));
                }

                const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
                const orbitMat = new THREE.LineBasicMaterial({ color: p.orbitColor, transparent: true, opacity: 0.3 });
                const orbitLine = new THREE.Line(orbitGeom, orbitMat);
                scene.add(orbitLine);
            });

            // Update Function
            solarSystemAPI.current.update = (d) => {
                if (!Astronomy) return;
                PLANET_DATA.forEach(p => {
                    const vec = Astronomy.HelioVector(p.body, d);
                    if (planets[p.name]) {
                        planets[p.name].position.set(vec.x * SCALE_FACTOR, vec.z * SCALE_FACTOR, -vec.y * SCALE_FACTOR);
                    }
                });
            };
            solarSystemAPI.current.update(date);

            // Interaction
            if (interactive) {
                const onPointerDown = (event) => {
                    const rect = renderer.domElement.getBoundingClientRect();
                    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                    raycaster.setFromCamera(pointer, camera);
                    const intersects = raycaster.intersectObjects(scene.children);
                    const hit = intersects.find(i => i.object.userData && (i.object.userData.type === 'Planet' || i.object.userData.type === 'Star'));

                    if (hit && onPlanetSelect) {
                        onPlanetSelect(hit.object.userData);
                    } else if (onPlanetSelect) {
                        onPlanetSelect(null);
                    }
                };
                renderer.domElement.addEventListener('pointerdown', onPointerDown);
            }

            // Loop
            const animate = () => {
                animationId = requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            const handleResize = () => {
                if (!mountRef.current) return;
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            };
            window.addEventListener('resize', handleResize);

            return () => {
                mounted = false;
                window.removeEventListener('resize', handleResize);
                cancelAnimationFrame(animationId);
                if (mountRef.current && renderer.domElement) {
                    mountRef.current.removeChild(renderer.domElement);
                }
                renderer.dispose();
            };
        };

        const cleanup = init();
        return () => { if (cleanup) cleanup(); };
    }, []);

    // React to prop updates
    useEffect(() => {
        if (solarSystemAPI.current.update) {
            solarSystemAPI.current.update(date);
        }
    }, [date]);

    return <div ref={mountRef} style={{ width: '100%', height: height, borderRadius: 'inherit', overflow: 'hidden' }} />;
}
