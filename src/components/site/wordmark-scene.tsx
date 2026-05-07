"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
// FontLoader is shipped with three's examples; .js extension required for ESM
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

const FONT_URL = "/fonts/helvetiker_bold.typeface.json";
const WORD = "ZIRCON";

/**
 * Per-letter fragmenting wordmark.
 *
 * Layout: each glyph is generated independently from the font shape data and
 * placed at a known x in a manually-laid-out row. Each glyph is recentered
 * on its own bbox so rotations pivot around the letter's center, not its
 * baseline-left.
 *
 * Interaction: cursor proximity (in canvas-NDC mapped to world units) drives
 * a per-letter scatter — z-pop, x/y/z spin. Idle "breathing" keeps the mark
 * alive when cursor is elsewhere. Activation fades to zero when the canvas
 * loses pointer hover, so scrolling past the hero doesn't drag letters with
 * the carried-over pointer value.
 */
function Letters({ hoverRef }: { hoverRef: MutableRefObject<boolean> }) {
  const font = useLoader(FontLoader, FONT_URL);
  const { pointer, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const elapsed = useRef(0);
  const active = useRef(0);

  // Build per-letter geometry + row layout once. Track total width so we can
  // scale-to-fit at runtime as the viewport changes.
  const { glyphs, totalWidth } = useMemo(() => {
    const SIZE = 1;
    const SPACING = 0.07;
    const items: Array<{ geom: THREE.ExtrudeGeometry; x: number }> = [];
    let xCursor = 0;
    for (const char of WORD) {
      const shapes = font.generateShapes(char, SIZE);
      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.018,
        bevelSegments: 4,
        curveSegments: 6,
      });
      geom.computeBoundingBox();
      const bb = geom.boundingBox!;
      const w = bb.max.x - bb.min.x;
      const h = bb.max.y - bb.min.y;
      // Recenter glyph on its own center (rotation pivots through middle)
      geom.translate(-bb.min.x - w / 2, -bb.min.y - h / 2, -0.15);
      items.push({ geom, x: xCursor + w / 2 });
      xCursor += w + SPACING;
    }
    const total = xCursor - SPACING;
    items.forEach((it) => (it.x -= total / 2));
    return { glyphs: items, totalWidth: total };
  }, [font]);

  // Per-letter motion signature — keeps scatter from looking symmetric
  const sigs = useMemo(
    () =>
      WORD.split("").map((_, i) => ({
        phase: (i / WORD.length) * Math.PI * 2,
        spinX: 0.45 + ((i * 31) % 7) / 14,
        spinY: 0.35 + ((i * 17) % 9) / 14,
        spinZ: 0.18 + ((i * 11) % 5) / 14,
        depth: 0.32 + ((i * 53) % 6) / 14,
      })),
    []
  );

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    // Clamp delta — handles tab-refocus where dt could be huge
    const d = Math.min(dt, 0.05);
    elapsed.current += d;

    // Smoothly fade activation when canvas isn't hovered
    const want = hoverRef.current ? 1 : 0;
    active.current += (want - active.current) * Math.min(1, dt * 4);

    // Fit-to-view: keep the word at ~88% of canvas width regardless of
    // device size. Without this, narrow viewports clip the word entirely.
    const fit = (viewport.width * 0.88) / totalWidth;
    const fitCapped = Math.min(fit, 1.05);
    groupRef.current.scale.setScalar(fitCapped);

    // Cursor → world units. r3f's pointer is NDC [-1,1] over the canvas.
    // Apply the inverse of the group scale so proximity stays consistent.
    const cx = (pointer.x * (viewport.width / 2)) / fitCapped;
    const cy = (pointer.y * (viewport.height / 2)) / fitCapped;

    for (let i = 0; i < meshes.current.length; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      const sig = sigs[i];
      const restX = glyphs[i].x;

      const dx = cx - restX;
      const dy = cy; // letters rest at y=0
      const dist = Math.hypot(dx, dy);

      const radius = 1.1; // localized falloff so neighbors don't co-fragment
      const proximity = Math.max(0, 1 - dist / radius) * active.current;

      const breathe = Math.sin(elapsed.current * 0.7 + sig.phase) * 0.04;
      const idleRotX = Math.sin(elapsed.current * 0.4 + sig.phase) * 0.03;
      const idleRotY = Math.sin(elapsed.current * 0.5 + sig.phase * 1.3) * 0.04;

      const targetZ = breathe + proximity * sig.depth * 0.55;
      const targetRotX = idleRotX + proximity * sig.spinX * 0.5;
      const targetRotY = idleRotY + proximity * sig.spinY * 0.6;
      const targetRotZ = proximity * sig.spinZ * 0.4 * Math.sign(dx || 1);

      const k = Math.min(1, dt * 7);
      // Always pull x,y back to rest — no drift when cursor scrolls away
      m.position.x += (restX - m.position.x) * k * 0.6;
      m.position.y += (0 - m.position.y) * k * 0.6;
      m.position.z += (targetZ - m.position.z) * k;
      m.rotation.x += (targetRotX - m.rotation.x) * k;
      m.rotation.y += (targetRotY - m.rotation.y) * k;
      m.rotation.z += (targetRotZ - m.rotation.z) * k;
    }

    // Subtle whole-group parallax — only while hovered
    const yaw = pointer.x * 0.04 * active.current;
    const pitch = -pointer.y * 0.025 * active.current;
    const k2 = Math.min(1, dt * 2.5);
    groupRef.current.rotation.y += (yaw - groupRef.current.rotation.y) * k2;
    groupRef.current.rotation.x += (pitch - groupRef.current.rotation.x) * k2;
  });

  return (
    <group ref={groupRef}>
      {glyphs.map((g, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          position={[g.x, 0, 0]}
          geometry={g.geom}
        >
          <meshStandardMaterial
            color="#fbf6ec"
            roughness={0.55}
            metalness={0.04}
          />
        </mesh>
      ))}
    </group>
  );
}

export function WordmarkScene() {
  const [ready, setReady] = useState(false);
  const hoverRef = useRef(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <div
      className="w-full h-full touch-none"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerMove={() => {
        // Touch: pointerEnter doesn't always fire reliably on iOS — any
        // movement counts as activation.
        hoverRef.current = true;
      }}
      onPointerDown={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      onPointerCancel={() => {
        hoverRef.current = false;
      }}
      onPointerUp={() => {
        // On touch, pointerUp fires before pointerLeave — let the activation
        // hold briefly so the scatter has time to animate to the tap point,
        // then fade. On desktop this is harmless since the cursor is still
        // hovering.
        setTimeout(() => {
          hoverRef.current = false;
        }, 600);
      }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5.4], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <directionalLight position={[3, 4, 6]} intensity={1.7} color="#fff4dc" />
        <directionalLight
          position={[-4, -2, -3]}
          intensity={0.5}
          color="#e9dec4"
        />
        <ambientLight intensity={0.6} color="#fdf6e8" />
        <hemisphereLight args={["#ffeacb", "#3a2a18", 0.4]} />
        <Suspense fallback={null}>
          <Letters hoverRef={hoverRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
