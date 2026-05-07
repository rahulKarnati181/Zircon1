"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "motion/react";

const WordmarkScene = dynamic(
  () => import("./wordmark-scene").then((m) => m.WordmarkScene),
  { ssr: false }
);

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden h-[100svh] min-h-[640px] w-full"
    >
      {/* Warm gradient backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 35%, oklch(0.985 0.014 80) 0%, oklch(0.95 0.02 78) 45%, oklch(0.88 0.045 70) 100%)",
        }}
      />
      {/* Subtle vignette */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, transparent 0%, transparent 60%, oklch(0.78 0.04 65 / 0.18) 100%)",
        }}
      />

      {/* Full-bleed 3D wordmark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease }}
        className="absolute inset-0"
      >
        <WordmarkScene />
      </motion.div>

      {/* Tagline below the mark */}
      <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-6 px-6 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="text-foreground/85 text-base md:text-lg tracking-wide"
        >
          We do architecture<span className="text-accent">.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease }}
          className="flex flex-col items-center gap-2 pointer-events-auto"
        >
          <Link
            href="/work"
            aria-label="View selected work"
            className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
          >
            Selected Work
          </Link>
          <span aria-hidden className="block w-px h-12 bg-foreground/40" />
        </motion.div>
      </div>
    </section>
  );
}
