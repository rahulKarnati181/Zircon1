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
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

const FONT_URL = "/fonts/centurygothic.typeface.json";

// Two-line wordmark. Proportions match the brand logo:
//   ZIRCON34   — dominant top line
//   DESIGN STUDIO  — smaller, letter-spaced so its width matches the line above.
type LineSpec = {
  text: string;
  size: number;
  fragDensity: number;
  spacing: number; // letter spacing in world units (absolute, not size-scaled)
  wordSpace: number; // gap for ' ' characters
};
const LINES: LineSpec[] = [
  { text: "ZIRCON34", size: 1.0, fragDensity: 220, spacing: 0.13, wordSpace: 0.35 },
  // Subtitle's spacing is auto-fit at runtime so the row spans the same
  // width as the line above. The `spacing` value here is the floor — used
  // only if the auto-fit calc would produce something tighter.
  { text: "DESIGN STUDIO", size: 0.52, fragDensity: 200, spacing: 0.08, wordSpace: 0.3 },
];
const LINE_GAP = 0.18; // vertical gap between the two lines, in world units

// Tunables
const LETTER_DEPTH = 0.14;
const FRAG_SIZE = 0.06;
const SHATTER_RANGE = 1.05;
const FRAG_RADIUS = 0.85;
const SPRING_K = 22;
const SPRING_DAMP = 4.5;
const SHATTER_ATTACK = 14;
const SHATTER_RELEASE = 3.0;

// Crossfade between solid letter ↔ fragments. The "swap" value is damped
// independently of `shatter` so we can tune the visual handoff direction
// asymmetrically: snap fast when the letter breaks apart, fade slow as it
// reforms — so the rebuild reads as a gentle merge, not a pop.
const SWAP_THRESHOLD = 0.04;
const SWAP_ATTACK = 26; // ~40ms to reach 'fragments' state
const SWAP_RELEASE = 3.7; // ~250ms to fade back to 'solid' state

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

function sampleAndBbox(
  shapes: THREE.Shape[],
  density: number,
  depthRange: number
) {
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
  const cell = Math.sqrt((w * h) / Math.max(density, 1));
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
          z: (Math.random() - 0.5) * depthRange,
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
  x: number; // world x within its row
  y: number; // world y of its row
  lineSize: number; // scale factor for fragments belonging to this line
};

type FragState = {
  target: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: { x: number; y: number; z: number };
  force: number;
};

function Letters({ hoverRef }: { hoverRef: MutableRefObject<boolean> }) {
  const font = useLoader(FontLoader, FONT_URL);
  const { pointer, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const active = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { items, maxRowWidth, totalHeight } = useMemo(() => {
    // -------- Pass 1: build geometries + sampling per line; measure widths --
    type RawLetter = {
      geom: THREE.ExtrudeGeometry;
      w: number;
      h: number;
      sampled: ReturnType<typeof sampleAndBbox>;
    };
    type RawLine = {
      letters: RawLetter[];
      intrinsicW: number; // sum of letter widths only (no gaps)
      wordSpaces: number;
      height: number;
    };

    const raws: RawLine[] = LINES.map((line) => {
      const letters: RawLetter[] = [];
      let intrinsicW = 0;
      let wordSpaces = 0;
      let height = 0;
      const lineDepth = LETTER_DEPTH * line.size;
      for (const char of line.text) {
        if (char === " ") {
          wordSpaces++;
          continue;
        }
        const shapes = font.generateShapes(char, line.size);
        const geom = new THREE.ExtrudeGeometry(shapes, {
          depth: lineDepth,
          bevelEnabled: true,
          bevelThickness: 0.012 * line.size,
          bevelSize: 0.012 * line.size,
          bevelSegments: 3,
          curveSegments: 6,
        });
        geom.computeBoundingBox();
        const bb = geom.boundingBox!;
        const w = bb.max.x - bb.min.x;
        const h = bb.max.y - bb.min.y;
        geom.translate(-bb.min.x - w / 2, -bb.min.y - h / 2, -lineDepth / 2);
        const sampled = sampleAndBbox(shapes, line.fragDensity, lineDepth);
        letters.push({ geom, w, h, sampled });
        intrinsicW += w;
        if (h > height) height = h;
      }
      return { letters, intrinsicW, wordSpaces, height };
    });

    // Row 0's actual width using its declared spacing — this is the target
    // width the subtitle row will auto-fit to.
    const row0Width =
      raws[0].intrinsicW +
      Math.max(0, raws[0].letters.length - 1) * LINES[0].spacing +
      raws[0].wordSpaces * LINES[0].wordSpace;

    // -------- Pass 2: lay out each row; auto-fit subtitle to row 0 width ----
    const WORD_TO_LETTER_RATIO = 2.6; // word-gap is ~2.6× letter-gap
    const itemsByLine: LetterData[][] = [];
    const rowHeights: number[] = [];
    const rowWidths: number[] = [];

    for (let li = 0; li < raws.length; li++) {
      const raw = raws[li];
      const line = LINES[li];
      let spacing = line.spacing;
      let wordSpace = line.wordSpace;

      if (li > 0) {
        const letterGaps = Math.max(0, raw.letters.length - 1);
        const gapUnits = letterGaps + raw.wordSpaces * WORD_TO_LETTER_RATIO;
        const extra = row0Width - raw.intrinsicW;
        if (gapUnits > 0 && extra > 0) {
          spacing = Math.max(line.spacing, extra / gapUnits);
          wordSpace = spacing * WORD_TO_LETTER_RATIO;
        }
      }

      const lineItems: LetterData[] = [];
      let xCursor = 0;
      let rawIdx = 0;
      for (const char of line.text) {
        if (char === " ") {
          xCursor += wordSpace;
          continue;
        }
        const r = raw.letters[rawIdx++];
        const targets = r.sampled.samples.map((p) => ({
          x: p.x - r.sampled.minX - r.sampled.w / 2,
          y: p.y - r.sampled.minY - r.sampled.h / 2,
          z: p.z,
        }));
        lineItems.push({
          geom: r.geom,
          targets,
          x: xCursor + r.w / 2,
          y: 0,
          lineSize: line.size,
        });
        xCursor += r.w + spacing;
      }
      const rowW = xCursor - spacing;
      lineItems.forEach((it) => (it.x -= rowW / 2));
      itemsByLine.push(lineItems);
      rowHeights.push(raw.height);
      rowWidths.push(rowW);
    }

    // Vertical layout: line1 above, line2 below — centered around y=0
    const line1H = rowHeights[0] || 0;
    const line2H = rowHeights[1] || 0;
    const line1Y = LINE_GAP / 2 + line2H / 2;
    const line2Y = -LINE_GAP / 2 - line1H / 2;
    const ys = [line1Y, line2Y];
    itemsByLine.forEach((items, li) => {
      items.forEach((it) => (it.y = ys[li]));
    });

    const flat = itemsByLine.flat();
    const maxW = Math.max(...rowWidths, 1);
    const totalH = line1H + line2H + LINE_GAP;
    return { items: flat, maxRowWidth: maxW, totalHeight: totalH };
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
  const swapPerLetter = useRef<number[]>(items.map(() => 0));
  const solidMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const instancedMeshes = useRef<(THREE.InstancedMesh | null)[]>([]);

  useEffect(() => {
    items.forEach((letter, li) => {
      const im = instancedMeshes.current[li];
      if (!im) return;
      const ls = states[li];
      ls.forEach((s, fi) => {
        dummy.position.copy(s.pos);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(0);
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

    // Fit-to-view across both axes. Width budget set so the wordmark sits
    // centered with generous breathing room around it (~60% of canvas).
    const fit = Math.min(
      (viewport.width * 0.65) / maxRowWidth,
      (viewport.height * 0.42) / totalHeight,
      0.9
    );
    groupRef.current.scale.setScalar(fit);

    const cx = (pointer.x * (viewport.width / 2)) / fit;
    const cy = (pointer.y * (viewport.height / 2)) / fit;

    items.forEach((letter, li) => {
      // Cursor in letter-local coords (account for row y too now)
      const lcx = cx - letter.x;
      const lcy = cy - letter.y;
      const dist = Math.hypot(lcx, lcy);

      const wantShatter =
        Math.max(0, 1 - dist / (SHATTER_RANGE * letter.lineSize)) *
        active.current;

      const cur = shatterPerLetter.current[li];
      const rate = wantShatter > cur ? SHATTER_ATTACK : SHATTER_RELEASE;
      const shatter = cur + (wantShatter - cur) * Math.min(1, dt * rate);
      shatterPerLetter.current[li] = shatter;

      // Asymmetric crossfade. We aim for a binary target (broken vs whole)
      // but damp into it at different speeds: fast attack so the shatter
      // reads as a sudden break, slow release so the rebuild reads as a
      // gentle merge — fragments and the solid letter overlap during the
      // last reform window instead of one popping in.
      //
      // The release rate is scaled DOWN for smaller letters. Their fragments
      // travel less distance, so without this they'd be back at rest before
      // the crossfade had time to blend, and you'd see a sudden snap. Scaling
      // by lineSize stretches the fade in proportion to the line's scale.
      const swapTarget = shatter > SWAP_THRESHOLD ? 1 : 0;
      const prevSwap = swapPerLetter.current[li];
      const releaseRate = SWAP_RELEASE * letter.lineSize;
      const swapRate = swapTarget > prevSwap ? SWAP_ATTACK : releaseRate;
      const swap = prevSwap + (swapTarget - prevSwap) * Math.min(1, dt * swapRate);
      swapPerLetter.current[li] = swap;

      const fragScale = swap;
      const solidOpacity = 1 - swap;

      const sm = solidMeshes.current[li];
      if (sm) {
        const mat = sm.material as THREE.MeshStandardMaterial;
        mat.opacity = solidOpacity;
        mat.transparent = solidOpacity < 1;
        mat.depthWrite = solidOpacity > 0.5;
        sm.visible = solidOpacity > 0.005;
      }

      const im = instancedMeshes.current[li];
      if (!im) return;
      const ls = states[li];

      const fragsVisible = swap > 0.005;
      im.visible = fragsVisible;
      if (!fragsVisible) return;

      const fragRadius = FRAG_RADIUS * letter.lineSize;

      for (let fi = 0; fi < ls.length; fi++) {
        const s = ls[fi];

        s.vel.x +=
          (s.target.x - s.pos.x) * SPRING_K * d - s.vel.x * SPRING_DAMP * d;
        s.vel.y +=
          (s.target.y - s.pos.y) * SPRING_K * d - s.vel.y * SPRING_DAMP * d;
        s.vel.z +=
          (s.target.z - s.pos.z) * SPRING_K * d - s.vel.z * SPRING_DAMP * d;

        if (shatter > 0.05) {
          const fdx = lcx - s.target.x;
          const fdy = lcy - s.target.y;
          const fdist = Math.hypot(fdx, fdy) + 0.0001;
          const fp = Math.max(0, 1 - fdist / fragRadius) * shatter;
          if (fp > 0.01) {
            const ox = -fdx / fdist;
            const oy = -fdy / fdist;
            const oz = (Math.random() - 0.5) * 0.7;
            const impulse = fp * fp * s.force * 7 * d * letter.lineSize;
            s.vel.x += ox * impulse;
            s.vel.y += oy * impulse;
            s.vel.z += oz * impulse;
            s.rotVel.x += (Math.random() - 0.5) * impulse * 6;
            s.rotVel.y += (Math.random() - 0.5) * impulse * 6;
            s.rotVel.z += (Math.random() - 0.5) * impulse * 6;
          }
        }

        s.pos.x += s.vel.x * d;
        s.pos.y += s.vel.y * d;
        s.pos.z += s.vel.z * d;

        s.rot.x += s.rotVel.x * d;
        s.rot.y += s.rotVel.y * d;
        s.rot.z += s.rotVel.z * d;
        s.rotVel.x += -s.rot.x * 8 * d - s.rotVel.x * 3 * d;
        s.rotVel.y += -s.rot.y * 8 * d - s.rotVel.y * 3 * d;
        s.rotVel.z += -s.rot.z * 8 * d - s.rotVel.z * 3 * d;

        // Scale combines swap (transition) and line size (so subtitle
        // fragments are physically smaller than the headline's).
        const scale = fragScale * letter.lineSize;
        dummy.position.set(s.pos.x, s.pos.y, s.pos.z);
        dummy.rotation.set(s.rot.x, s.rot.y, s.rot.z);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        im.setMatrixAt(fi, dummy.matrix);
      }
      im.instanceMatrix.needsUpdate = true;
    });

    const yaw = pointer.x * 0.04 * active.current;
    const pitch = -pointer.y * 0.025 * active.current;
    const k2 = Math.min(1, dt * 2.5);
    groupRef.current.rotation.y += (yaw - groupRef.current.rotation.y) * k2;
    groupRef.current.rotation.x += (pitch - groupRef.current.rotation.x) * k2;
  });

  return (
    <group ref={groupRef}>
      {items.map((letter, i) => (
        <group key={i} position={[letter.x, letter.y, 0]}>
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
