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

// Tunables
const LETTER_SIZE = 1;
const LETTER_SPACING = 0.07;
const LETTER_DEPTH = 0.14; // thinner slab — reduced from 0.30
const FRAG_SIZE = 0.06; // edge length of each shatter cube
const FRAG_PER_LETTER = 220;
const SHATTER_RANGE = 1.05; // letter-center distance at which shatter is full
const FRAG_RADIUS = 0.85; // per-fragment cursor falloff
const SPRING_K = 22;
const SPRING_DAMP = 4.5;
const SHATTER_ATTACK = 14; // shatter rises fast
const SHATTER_RELEASE = 3.2; // and rebuilds slower / more gracefully

type Vec2 = { x: number; y: number };

function pointInPolygon(poly: Vec2[], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const hit =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function pointInShape(shape: THREE.Shape, x: number, y: number): boolean {
  if (!pointInPolygon(shape.getPoints() as Vec2[], x, y)) return false;
  for (const hole of shape.holes) {
    if (pointInPolygon(hole.getPoints() as Vec2[], x, y)) return false;
  }
  return true;
}

function sampleAndBbox(shapes: THREE.Shape[], density: number) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const s of shapes) {
    for (const p of s.getPoints()) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  const w = maxX - minX;
  const h = maxY - minY;
  const cell = Math.sqrt((w * h) / density);
  const samples: { x: number; y: number; z: number }[] = [];
  for (let y = minY; y <= maxY; y += cell) {
    for (let x = minX; x <= maxX; x += cell) {
      const jx = x + (Math.random() - 0.5) * cell * 0.55;
      const jy = y + (Math.random() - 0.5) * cell * 0.55;
      let inside = false;
      for (const s of shapes) {
        if (pointInShape(s, jx, jy)) {
          inside = true;
          break;
        }
      }
      if (inside) {
        samples.push({
          x: jx,
          y: jy,
          z: (Math.random() - 0.5) * LETTER_DEPTH,
        });
      }
    }
  }
  return { samples, minX, minY, w, h };
}

function smoothstep(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

type LetterData = {
  geom: THREE.ExtrudeGeometry;
  targets: { x: number; y: number; z: number }[]; // letter-local
  x: number; // row offset
  width: number;
};

type FragState = {
  target: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: { x: number; y: number; z: number };
  force: number;
};

/**
 * Solid-then-shatter wordmark.
 *
 * Each letter is rendered TWICE:
 *   1) A solid extruded mesh — the resting appearance
 *   2) An InstancedMesh of small cubes sampled from the letter's shape
 *
 * Per-letter `shatter` (0..1) crossfades between the two: opacity of the
 * solid mesh = 1 - smoothstep(shatter), instance scale = smoothstep(shatter).
 * Cursor proximity drives shatter up; when the cursor leaves, fragments
 * spring back to their targets and the solid letter reforms.
 *
 * Fast attack, slow release — the break feels sudden, the rebuild graceful.
 */
function Letters({ hoverRef }: { hoverRef: MutableRefObject<boolean> }) {
  const font = useLoader(FontLoader, FONT_URL);
  const { pointer, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const active = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { items, total } = useMemo(() => {
    const list: LetterData[] = [];
    let xCursor = 0;
    for (const char of WORD) {
      const shapes = font.generateShapes(char, LETTER_SIZE);

      // Solid letter geometry — recentered to its bbox center
      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth: LETTER_DEPTH,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 3,
        curveSegments: 6,
      });
      geom.computeBoundingBox();
      const bb = geom.boundingBox!;
      const w = bb.max.x - bb.min.x;
      const h = bb.max.y - bb.min.y;
      geom.translate(-bb.min.x - w / 2, -bb.min.y - h / 2, -LETTER_DEPTH / 2);

      // Sample fragment positions from the same shape; recenter to the same
      // local origin so fragments coincide with the solid letter at rest.
      const { samples, minX, minY, w: sw, h: sh } = sampleAndBbox(
        shapes,
        FRAG_PER_LETTER
      );
      const targets = samples.map((p) => ({
        x: p.x - minX - sw / 2,
        y: p.y - minY - sh / 2,
        z: p.z,
      }));

      list.push({ geom, targets, x: xCursor + w / 2, width: w });
      xCursor += w + LETTER_SPACING;
    }
    const totalW = xCursor - LETTER_SPACING;
    list.forEach((l) => (l.x -= totalW / 2));
    return { items: list, total: totalW };
  }, [font]);

  const states = useMemo<FragState[][]>(
    () =>
      items.map((letter) =>
        letter.targets.map((t) => ({
          target: new THREE.Vector3(t.x, t.y, t.z),
          pos: new THREE.Vector3(t.x, t.y, t.z),
          vel: new THREE.Vector3(0, 0, 0),
          rot: new THREE.Euler(0, 0, 0),
          rotVel: { x: 0, y: 0, z: 0 },
          force: 0.7 + Math.random() * 0.9,
        }))
      ),
    [items]
  );

  const shatterPerLetter = useRef<number[]>(items.map(() => 0));
  const solidMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const instancedMeshes = useRef<(THREE.InstancedMesh | null)[]>([]);

  // Seed instance matrices so fragments don't flash at origin on first paint
  useEffect(() => {
    items.forEach((_, li) => {
      const im = instancedMeshes.current[li];
      if (!im) return;
      const ls = states[li];
      ls.forEach((s, fi) => {
        dummy.position.copy(s.pos);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(0); // hidden at rest
        dummy.updateMatrix();
        im.setMatrixAt(fi, dummy.matrix);
      });
      im.instanceMatrix.needsUpdate = true;
    });
  }, [items, states, dummy]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const d = Math.min(dt, 0.05);
    elapsed.current += d;

    const want = hoverRef.current ? 1 : 0;
    active.current += (want - active.current) * Math.min(1, dt * 4);

    // Fit-to-view scaling
    const fit = Math.min((viewport.width * 0.88) / total, 1.05);
    groupRef.current.scale.setScalar(fit);

    const cx = (pointer.x * (viewport.width / 2)) / fit;
    const cy = (pointer.y * (viewport.height / 2)) / fit;

    items.forEach((letter, li) => {
      // Cursor in letter-local coords
      const lcx = cx - letter.x;
      const lcy = cy;
      const dist = Math.hypot(lcx, lcy);

      // Per-letter shatter target
      const wantShatter =
        Math.max(0, 1 - dist / SHATTER_RANGE) * active.current;

      // Asymmetric easing: fast attack, slow release
      const cur = shatterPerLetter.current[li];
      const rate = wantShatter > cur ? SHATTER_ATTACK : SHATTER_RELEASE;
      const shatter = cur + (wantShatter - cur) * Math.min(1, dt * rate);
      shatterPerLetter.current[li] = shatter;

      // Hard handoff between solid mesh and fragments. We crossfade only
      // across a narrow window so the solid letter is essentially invisible
      // while the shatter is in motion, and the fragments are only seen for
      // the duration of the break + rebuild — never both at once.
      const SWAP_START = 0.02;
      const SWAP_END = 0.08;
      const t = Math.max(
        0,
        Math.min(1, (shatter - SWAP_START) / (SWAP_END - SWAP_START))
      );
      const swap = smoothstep(t); // 0 = solid, 1 = fragments
      const fragScale = swap;
      const solidOpacity = 1 - swap;

      // Solid mesh
      const sm = solidMeshes.current[li];
      if (sm) {
        const mat = sm.material as THREE.MeshStandardMaterial;
        mat.opacity = solidOpacity;
        mat.transparent = solidOpacity < 1;
        mat.depthWrite = solidOpacity > 0.5;
        sm.visible = solidOpacity > 0.005;
      }

      // Fragments
      const im = instancedMeshes.current[li];
      if (!im) return;
      const ls = states[li];

      const fragsVisible = swap > 0.005;
      im.visible = fragsVisible;
      if (!fragsVisible) return;

      for (let fi = 0; fi < ls.length; fi++) {
        const s = ls[fi];

        // Spring toward target (always)
        s.vel.x +=
          (s.target.x - s.pos.x) * SPRING_K * d - s.vel.x * SPRING_DAMP * d;
        s.vel.y +=
          (s.target.y - s.pos.y) * SPRING_K * d - s.vel.y * SPRING_DAMP * d;
        s.vel.z +=
          (s.target.z - s.pos.z) * SPRING_K * d - s.vel.z * SPRING_DAMP * d;

        // Outward impulse — only meaningful while shatter is high
        if (shatter > 0.05) {
          const fdx = lcx - s.target.x;
          const fdy = lcy - s.target.y;
          const fdist = Math.hypot(fdx, fdy) + 0.0001;
          const fp = Math.max(0, 1 - fdist / FRAG_RADIUS) * shatter;
          if (fp > 0.01) {
            const ox = -fdx / fdist;
            const oy = -fdy / fdist;
            const oz = (Math.random() - 0.5) * 0.7;
            const impulse = fp * fp * s.force * 7 * d;
            s.vel.x += ox * impulse;
            s.vel.y += oy * impulse;
            s.vel.z += oz * impulse;
            s.rotVel.x += (Math.random() - 0.5) * impulse * 6;
            s.rotVel.y += (Math.random() - 0.5) * impulse * 6;
            s.rotVel.z += (Math.random() - 0.5) * impulse * 6;
          }
        }

        // Integrate position + rotation
        s.pos.x += s.vel.x * d;
        s.pos.y += s.vel.y * d;
        s.pos.z += s.vel.z * d;

        s.rot.x += s.rotVel.x * d;
        s.rot.y += s.rotVel.y * d;
        s.rot.z += s.rotVel.z * d;
        s.rotVel.x += -s.rot.x * 8 * d - s.rotVel.x * 3 * d;
        s.rotVel.y += -s.rot.y * 8 * d - s.rotVel.y * 3 * d;
        s.rotVel.z += -s.rot.z * 8 * d - s.rotVel.z * 3 * d;

        // Scale by the swap value — fragments are full-size while shattered
        // and only collapse to 0 right at the moment of reform, when the
        // solid letter takes over.
        const scale = fragScale;
        dummy.position.set(s.pos.x, s.pos.y, s.pos.z);
        dummy.rotation.set(s.rot.x, s.rot.y, s.rot.z);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        im.setMatrixAt(fi, dummy.matrix);
      }
      im.instanceMatrix.needsUpdate = true;
    });

    // Whole-group parallax — only while active
    const yaw = pointer.x * 0.04 * active.current;
    const pitch = -pointer.y * 0.025 * active.current;
    const k2 = Math.min(1, dt * 2.5);
    groupRef.current.rotation.y += (yaw - groupRef.current.rotation.y) * k2;
    groupRef.current.rotation.x += (pitch - groupRef.current.rotation.x) * k2;
  });

  return (
    <group ref={groupRef}>
      {items.map((letter, i) => (
        <group key={i} position={[letter.x, 0, 0]}>
          {/* Solid letter — visible at rest */}
          <mesh
            ref={(el) => {
              solidMeshes.current[i] = el;
            }}
            geometry={letter.geom}
          >
            <meshStandardMaterial
              color="#fbf6ec"
              roughness={0.55}
              metalness={0.04}
              transparent
            />
          </mesh>

          {/* Shattered fragments — visible during/after shatter */}
          <instancedMesh
            ref={(el) => {
              instancedMeshes.current[i] = el;
            }}
            args={[undefined, undefined, letter.targets.length]}
          >
            <boxGeometry args={[FRAG_SIZE, FRAG_SIZE, FRAG_SIZE]} />
            <meshStandardMaterial
              color="#fbf6ec"
              roughness={0.55}
              metalness={0.04}
            />
          </instancedMesh>
        </group>
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
