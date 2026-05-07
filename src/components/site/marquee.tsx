"use client";

import { motion } from "motion/react";

const items = [
  "Lime Plaster",
  "Board-formed Concrete",
  "Burma Teak",
  "Kota Stone",
  "Terracotta",
  "Patinated Brass",
  "Lime Wash",
  "Reclaimed Timber",
];

export function Marquee() {
  return (
    <section
      aria-label="Materials"
      className="relative overflow-hidden border-y border-border/70 bg-secondary py-8 md:py-10"
    >
      <motion.div
        className="flex gap-12 md:gap-20 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            className="font-display font-light italic tracking-[-0.02em] text-foreground/85 text-[clamp(2rem,5vw,4.5rem)] leading-none"
          >
            {it}
            <span aria-hidden className="text-accent not-italic ml-12">
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}
