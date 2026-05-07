"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type CSSProperties } from "react";

type Props = {
  text?: string;
  className?: string;
};

/**
 * Interactive 3D wordmark.
 * - Tilts on cursor movement (rotateX / rotateY)
 * - Built from 14 stacked layers in z-space → real chiseled depth, not just text-shadow
 * - Front face uses the foreground; receding layers warm into the bronze accent
 * - Specular sweep tracks the cursor for a soft material highlight
 * - Respects prefers-reduced-motion
 */
export function Wordmark3D({ text = "Zircon", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0); // -0.5 .. 0.5
  const my = useMotionValue(0);

  const spring = { stiffness: 90, damping: 16, mass: 0.9 };
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), spring);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), spring);
  const shiftX = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), spring);
  const shiftY = useSpring(useTransform(my, [-0.5, 0.5], [-4, 4]), spring);

  // Specular highlight position
  const hx = useTransform(mx, [-0.5, 0.5], [15, 85]);
  const hy = useTransform(my, [-0.5, 0.5], [10, 90]);
  const sheen = useMotionTemplate`radial-gradient(60% 80% at ${hx}% ${hy}%, rgba(255,247,232,0.55) 0%, rgba(255,247,232,0.18) 40%, rgba(255,247,232,0) 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  // Build the depth stack. Front layer is z=0, each subsequent layer
  // pushes back in z and warms toward the bronze accent for a chiseled
  // material feel.
  const layers = 14;
  const stack = Array.from({ length: layers }, (_, i) => {
    const t = i / (layers - 1); // 0 = front, 1 = back
    // Color ramp: foreground (#1a1815) → bronze accent shadow
    // Using HSL-ish blend via opacity stack on top of accent base.
    const back = `oklch(${(0.21 + t * 0.12).toFixed(3)} ${(0.012 + t * 0.05).toFixed(3)} ${(60 - t * 4).toFixed(1)})`;
    const z = -i * 1.6; // px
    const opacity = i === 0 ? 1 : 1 - t * 0.15;
    return { back, z, opacity, i };
  });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchEnd={onLeave}
      className={["relative select-none", className].join(" ")}
      style={{ perspective: 1600 }}
    >
      <motion.div
        className="relative will-change-transform"
        style={
          {
            transformStyle: "preserve-3d",
            rotateX: rotX,
            rotateY: rotY,
            x: shiftX,
            y: shiftY,
          } as unknown as CSSProperties
        }
      >
        {/* Receding depth layers (back-to-front so the front sits on top) */}
        {stack
          .slice()
          .reverse()
          .map(({ back, z, opacity, i }) => (
            <span
              key={i}
              aria-hidden
              className="absolute inset-0 font-display font-black leading-[0.82] tracking-[-0.05em]"
              style={{
                transform: `translateZ(${z}px)`,
                color: back,
                opacity,
                fontSize: "inherit",
              }}
            >
              {text}
              <span className="text-accent">.</span>
            </span>
          ))}

        {/* Front face — the readable layer */}
        <h1
          className="relative font-display font-black leading-[0.82] tracking-[-0.05em] text-foreground"
          style={{ transform: "translateZ(0px)" }}
        >
          {text}
          <span className="text-accent">.</span>
        </h1>

        {/* Specular sheen tracking the cursor */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage: sheen,
            transform: "translateZ(2px)",
          }}
        />
      </motion.div>

      {/* Soft floor shadow that follows the tilt */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 left-[6%] right-[6%] h-10 rounded-[50%] blur-2xl"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 50%, rgba(20,16,10,0.32) 0%, rgba(20,16,10,0) 70%)",
          x: shiftX,
        }}
      />
    </div>
  );
}
