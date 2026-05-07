"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Procedural architectural maquette.
 * - Three stacked rectangular volumes (echoes Block House / Lightwell House)
 * - One tall thin "lightwell" column glowing with the bronze accent
 * - Cursor-driven rotation, idle sine drift when idle
 * - Soft ContactShadows + studio environment for matte plaster look
 */
function Maquette() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const lightwell = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const wantY = target.current.x * 0.55 + Math.sin(t * 0.25) * 0.06;
    const wantX = -target.current.y * 0.25 + Math.cos(t * 0.2) * 0.03;
    const k = Math.min(1, dt * 3.2);
    group.current.rotation.y += (wantY - group.current.rotation.y) * k;
    group.current.rotation.x += (wantX - group.current.rotation.x) * k;

    if (lightwell.current) {
      const m = lightwell.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + Math.sin(t * 1.2) * 0.18;
    }
  });

  // Material recipes
  const cream = new THREE.MeshStandardMaterial({
    color: "#ece2cf",
    roughness: 0.92,
    metalness: 0.02,
  });
  const sand = new THREE.MeshStandardMaterial({
    color: "#d9caaf",
    roughness: 0.95,
    metalness: 0.02,
  });
  const ivory = new THREE.MeshStandardMaterial({
    color: "#f4ecd9",
    roughness: 0.9,
    metalness: 0.02,
  });
  const aperture = new THREE.MeshStandardMaterial({
    color: "#1a1612",
    roughness: 0.6,
  });

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      {/* Base volume — long, low */}
      <mesh castShadow receiveShadow position={[0, 0, 0]} material={cream}>
        <boxGeometry args={[3.4, 0.55, 1.5]} />
      </mesh>

      {/* Mid volume — offset back-left */}
      <mesh
        castShadow
        receiveShadow
        position={[-0.55, 0.78, -0.12]}
        material={sand}
      >
        <boxGeometry args={[1.95, 1.0, 1.25]} />
      </mesh>

      {/* Top volume — offset right, smaller */}
      <mesh
        castShadow
        receiveShadow
        position={[0.75, 1.55, 0.06]}
        material={ivory}
      >
        <boxGeometry args={[1.15, 0.75, 1.05]} />
      </mesh>

      {/* Lightwell column — the focal accent */}
      <mesh ref={lightwell} castShadow position={[0.05, 0.95, 0.55]}>
        <boxGeometry args={[0.16, 2.6, 0.16]} />
        <meshStandardMaterial
          color="#b07a35"
          emissive="#d99a4a"
          emissiveIntensity={0.6}
          roughness={0.35}
          metalness={0.55}
        />
      </mesh>

      {/* Window apertures — recessed dark planes */}
      <mesh position={[1.45, 0.2, 0.756]} material={aperture}>
        <planeGeometry args={[0.42, 0.32]} />
      </mesh>
      <mesh position={[-1.4, 0.95, 0.51]} material={aperture}>
        <planeGeometry args={[0.55, 0.42]} />
      </mesh>
      <mesh position={[0.85, 1.55, 0.586]} material={aperture}>
        <planeGeometry args={[0.32, 0.42]} />
      </mesh>

      {/* Roof plinth on top volume */}
      <mesh
        receiveShadow
        position={[0.75, 1.94, 0.06]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={ivory}
      >
        <planeGeometry args={[1.2, 1.1]} />
      </mesh>

      {/* Slim canopy slab over base */}
      <mesh
        castShadow
        receiveShadow
        position={[1.1, 0.4, 0.5]}
        material={cream}
      >
        <boxGeometry args={[1.2, 0.06, 0.55]} />
      </mesh>
    </group>
  );
}

function Stage() {
  return (
    <Float
      speed={1.1}
      rotationIntensity={0.18}
      floatIntensity={0.25}
      floatingRange={[-0.05, 0.05]}
    >
      <Maquette />
    </Float>
  );
}

export function Scene3D() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  const isMobile =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|Android/i.test(navigator.userAgent);

  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [3.6, 2.2, 4.6], fov: 32 }}
      style={{ background: "transparent" }}
    >
      {/* Key light */}
      <directionalLight
        position={[4.5, 6, 3.5]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0003}
      />
      {/* Fill */}
      <directionalLight position={[-4, 2.5, -2]} intensity={0.35} color="#f1e3c8" />
      {/* Bounce */}
      <ambientLight intensity={0.45} color="#fdf6e8" />

      <Suspense fallback={null}>
        <Stage />
        <Environment preset="apartment" />
        <ContactShadows
          position={[0, -0.4, 0]}
          opacity={0.55}
          scale={9}
          blur={2.6}
          far={2.5}
          color="#3a2c1c"
        />
      </Suspense>
    </Canvas>
  );
}
