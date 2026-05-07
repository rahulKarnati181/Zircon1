"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24"
    >
      {/* meta strip */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap items-center justify-between gap-4 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-accent"
            />
            Independent practice · Est. 2017
          </span>
          <span>Hyderabad / Bengaluru</span>
        </motion.div>
      </div>

      {/* oversized wordmark */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 mt-8 md:mt-14">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="font-display font-black leading-[0.82] tracking-[-0.05em] text-foreground"
          style={{ fontSize: "clamp(3.25rem, 14vw, 16rem)" }}
        >
          Zircon
          <span className="text-accent">.</span>
        </motion.h1>

        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-end">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="md:col-span-7 text-pretty text-xl md:text-2xl lg:text-[1.7rem] leading-[1.3] text-foreground/85 max-w-[36ch]"
          >
            An architecture studio shaping{" "}
            <span className="italic">quiet, considered</span> residences — where
            light, material and landscape are drawn into a single, unhurried
            whole.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="md:col-span-5 flex flex-col gap-4 md:items-end"
          >
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Selected Works · 2023 — 2025
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-5 py-3 text-background hover:bg-background hover:text-foreground transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em]">
                  View work
                </span>
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 hover:border-foreground transition-colors duration-300 cursor-pointer"
              >
                <span className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em]">
                  Enquire
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* signature image */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35, ease }}
        className="mx-auto max-w-[1400px] px-6 md:px-10 mt-14 md:mt-20"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-muted">
          <Image
            src="/assets/Lightwell House/Main.png"
            alt="Lightwell House — northern facade"
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent"
          />
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-3 rounded-full bg-background/85 backdrop-blur px-4 py-2 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-foreground">
            <span className="size-1.5 rounded-full bg-accent" />
            Lightwell House · Hyderabad
          </div>
        </div>
      </motion.div>
    </section>
  );
}
