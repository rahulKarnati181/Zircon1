"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { projects } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

export function Projects() {
  return (
    <section
      id="work"
      className="relative scroll-mt-24 py-20 md:py-32 border-t border-border/70"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20"
        >
          <div>
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              <span className="text-accent">●</span>&nbsp;&nbsp;01 — Selected Work
            </div>
            <h2
              className="font-display font-black leading-[0.85] tracking-[-0.04em] text-foreground"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              Built with <span className="italic font-light">restraint.</span>
            </h2>
          </div>
          <p className="md:max-w-sm text-foreground/75 text-[1rem] md:text-[1.05rem] leading-relaxed">
            Four recent residences. Each shaped by its site, its climate and the
            quiet rituals of the people who live there.
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-16 md:gap-y-24">
          {projects.map((p, i) => {
            // Alternate sizing for editorial rhythm
            const layouts = [
              "md:col-span-7 md:col-start-1",
              "md:col-span-5 md:col-start-8 md:mt-24",
              "md:col-span-6 md:col-start-1",
              "md:col-span-6 md:col-start-7 md:mt-16",
            ];
            const aspects = [
              "aspect-[4/5]",
              "aspect-[3/4]",
              "aspect-[5/4]",
              "aspect-[4/5]",
            ];

            return (
              <motion.li
                key={p.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease }}
                className={layouts[i % layouts.length]}
              >
                <a
                  href={`#${p.slug}`}
                  className="group block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  aria-label={`${p.name}, ${p.location}`}
                >
                  <div
                    className={`relative ${aspects[i % aspects.length]} w-full overflow-hidden rounded-sm bg-muted`}
                  >
                    <Image
                      src={p.cover}
                      alt={`${p.name} — ${p.location}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500"
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/85 backdrop-blur px-3 py-1.5 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-foreground">
                      <span
                        aria-hidden
                        className={`size-1.5 rounded-full ${
                          p.status === "Completed" ? "bg-accent" : "bg-foreground/40"
                        }`}
                      />
                      {p.status}
                    </div>
                    <div className="absolute bottom-4 right-4 size-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center text-foreground transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                      <span aria-hidden>↗</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                        {String(i + 1).padStart(2, "0")} ·{" "}
                        <span className="text-foreground/70">{p.typology}</span>
                      </div>
                      <h3 className="font-display text-2xl md:text-[2rem] leading-tight tracking-[-0.02em] text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-3 text-foreground/70 leading-relaxed max-w-[40ch]">
                        {p.blurb}
                      </p>
                    </div>
                    <div className="text-right shrink-0 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      <div>{p.location}</div>
                      <div className="mt-1 text-foreground/70">{p.year}</div>
                    </div>
                  </div>
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
