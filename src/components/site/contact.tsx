"use client";

import Link from "next/link";
import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 py-24 md:py-36 bg-foreground text-background"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-background/60"
        >
          <span className="text-accent">●</span>&nbsp;&nbsp;Contact
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
          className="mt-8 font-display font-black leading-[0.82] tracking-[-0.05em]"
          style={{ fontSize: "clamp(3rem, 12vw, 13rem)" }}
        >
          Let&apos;s
          <br />
          <span className="italic font-light">build something.</span>
        </motion.h1>

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="md:col-span-6 md:col-start-1"
          >
            <p className="text-background/80 text-lg md:text-xl leading-relaxed max-w-[44ch]">
              We take on a handful of new projects each year. If you&apos;re
              considering a residence, a retreat or a small cultural building,
              we&apos;d like to hear from you.
            </p>

            <Link
              href="mailto:studio@zircon.archi"
              className="group mt-10 inline-flex items-center gap-4 cursor-pointer"
            >
              <span
                className="font-display font-medium tracking-[-0.02em] underline-offset-[6px] decoration-1 group-hover:decoration-accent transition-colors"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)" }}
              >
                studio@zircon.archi
              </span>
              <span
                aria-hidden
                className="inline-flex size-12 md:size-14 items-center justify-center rounded-full border border-background/40 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-foreground group-hover:rotate-[-12deg]"
              >
                ↗
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="md:col-span-5 md:col-start-8 grid grid-cols-2 gap-y-10 gap-x-6 self-end"
          >
            {[
              ["Hyderabad", "12 Banjara Hills,\nRoad No. 3"],
              ["Bengaluru", "Indiranagar,\n100 ft Road"],
              ["Press", "press@zircon.archi"],
              ["Careers", "careers@zircon.archi"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-background/55">
                  {k}
                </div>
                <div className="mt-2 whitespace-pre-line text-background/90 leading-relaxed">
                  {v}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
