"use client";

import Image from "next/image";
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

export function About() {
  return (
    <section
      id="studio"
      className="relative scroll-mt-24 py-20 md:py-32 border-t border-border/70"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
            className="md:col-span-5"
          >
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              <span className="text-accent">●</span>&nbsp;&nbsp;02 — Studio
            </div>
            <h2
              className="font-display font-black leading-[0.85] tracking-[-0.04em] text-foreground"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
            >
              A small studio,
              <br />
              <span className="italic font-light">deeply involved.</span>
            </h2>

            <p className="mt-8 text-foreground/80 text-lg leading-relaxed max-w-[40ch]">
              Zircon is an independent architecture practice working on
              residences, weekend houses and small cultural buildings across
              South India.
            </p>
            <p className="mt-5 text-foreground/70 leading-relaxed max-w-[44ch]">
              We take on a small number of projects each year, and we draw,
              detail and visit them ourselves. The work is unhurried by design —
              and so is the relationship.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-y-8 gap-x-6">
              {[
                ["Founded", "2017"],
                ["Projects", "24+ built"],
                ["Studios", "Hyderabad · Bengaluru"],
                ["Team", "9 architects"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-2 font-display text-2xl md:text-3xl tracking-[-0.02em] text-foreground">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="md:col-span-7 md:pl-6"
          >
            <div className="relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden rounded-sm bg-muted">
              <Image
                src="/assets/Concrete Cabin Farmhouse/Outdoor.png"
                alt="Concrete Cabin Farmhouse — outdoor view"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex items-center justify-between font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>Concrete Cabin Farmhouse</span>
              <span>Coorg · 2024</span>
            </div>
          </motion.div>
        </div>

        {/* Approach / principles */}
        <div id="approach" className="scroll-mt-24 mt-24 md:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                <span className="text-accent">●</span>&nbsp;&nbsp;03 — Approach
              </div>
              <h3
                className="font-display font-black leading-[0.9] tracking-[-0.04em] text-foreground"
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
              >
                Four principles we don&apos;t bend.
              </h3>
            </div>
          </motion.div>

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
                  <h4 className="font-display text-2xl md:text-[1.9rem] tracking-[-0.02em] text-foreground">
                    {p.title}
                  </h4>
                </div>
                <p className="mt-4 text-foreground/75 leading-relaxed max-w-[52ch] md:pl-[3.5rem]">
                  {p.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
