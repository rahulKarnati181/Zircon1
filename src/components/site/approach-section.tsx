"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const principles = [
  {
    n: "01",
    title: "Site before form",
    body:
      "Every project begins with the slope of the land, the path of the sun, and the prevailing winds. Form is a consequence — never the brief.",
  },
  {
    n: "02",
    title: "Honest material",
    body:
      "Lime, oak, board-formed concrete, terracotta. We use materials that age — that record the building's life rather than fight it.",
  },
  {
    n: "03",
    title: "Considered detail",
    body:
      "We draw every junction. A reveal, a shadow gap, the meeting of stone and timber — these are where a building becomes precise.",
  },
  {
    n: "04",
    title: "Rooms for living",
    body:
      "Architecture should hold the slow rituals of a household — coffee, conversation, work, sleep — without effort or ceremony.",
  },
];

type Props = { showHeading?: boolean };

export function ApproachSection({ showHeading = true }: Props) {
  return (
    <section className="relative py-20 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {showHeading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                <span className="text-accent">●</span>&nbsp;&nbsp;Approach
              </div>
              <h1
                className="font-display font-black leading-[0.9] tracking-[-0.04em] text-foreground"
                style={{ fontSize: "clamp(2.25rem, 6vw, 5.5rem)" }}
              >
                Four principles we don&apos;t bend.
              </h1>
            </div>
          </motion.div>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 md:gap-y-16">
          {principles.map((p, i) => (
            <motion.li
              key={p.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease }}
              className="border-t border-border pt-6"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-accent">
                  {p.n}
                </span>
                <h2 className="font-display text-2xl md:text-[1.9rem] tracking-[-0.02em] text-foreground">
                  {p.title}
                </h2>
              </div>
              <p className="mt-4 text-foreground/75 leading-relaxed max-w-[52ch] md:pl-[3.5rem]">
                {p.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
