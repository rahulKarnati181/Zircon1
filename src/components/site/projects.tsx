"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { projects, type Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial work index.
 *
 * Composition:
 *  1. Section masthead — large H2, eyebrow, paragraph.
 *  2. Featured project — full-bleed hero split into image (7 cols) + meta (5 cols).
 *  3. Asymmetric 12-col grid — varied col-spans give the page editorial rhythm
 *     rather than a uniform tiled feel.
 *  4. Closing wide project — full-width final tile.
 *
 * Each tile carries a small "00 / 08" marginalia tag, year, location, and a
 * hairline ruler that draws on hover. The whole page reads like a magazine
 * spread rather than a uniform card grid.
 */
export function Projects() {
  const [featured, ...rest] = projects;
  const closing = rest.length > 0 ? rest[rest.length - 1] : null;
  const middle = closing ? rest.slice(0, -1) : rest;
  const total = projects.length;

  // Asymmetric 12-col span pattern for the middle band. Cycles if more items.
  const spans = [
    "md:col-span-7",
    "md:col-span-5",
    "md:col-span-5",
    "md:col-span-7",
    "md:col-span-4",
    "md:col-span-8",
  ];

  // Slight per-tile vertical offsets for an editorial cadence.
  const yOffsets = ["md:mt-0", "md:mt-16", "md:mt-24", "md:mt-0", "md:mt-12", "md:mt-0"];

  return (
    <section
      id="work"
      className="relative scroll-mt-24 py-12 md:py-20 border-t border-border/70"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-20"
        >
          <div>
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              <span className="text-accent">●</span>&nbsp;&nbsp;01 — Selected Work · {String(total).padStart(2, "0")} projects
            </div>
            <h2
              className="font-display font-black leading-[0.85] tracking-[-0.04em] text-foreground"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              Built with <span className="italic font-light">restraint.</span>
            </h2>
          </div>
          <p className="md:max-w-sm text-foreground/75 text-[1rem] md:text-[1.05rem] leading-relaxed">
            Residences, retreats and small cultural buildings. Each shaped by
            its site, its climate and the quiet rituals of the people who live
            there.
          </p>
        </motion.div>

        {/* Featured hero */}
        {featured && <FeaturedProject project={featured} index={0} total={total} />}

        {/* Section ruler */}
        <div className="mt-20 md:mt-28 mb-10 md:mb-16 flex items-center gap-6">
          <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Index / Continued
          </div>
          <div className="h-px flex-1 bg-border/70" />
          <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            ↓
          </div>
        </div>

        {/* Asymmetric 12-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {middle.map((p, i) => (
            <div
              key={p.slug}
              className={`${spans[i % spans.length]} ${yOffsets[i % yOffsets.length]}`}
            >
              <ProjectTile project={p} index={i + 1} total={total} />
            </div>
          ))}
        </div>

        {/* Closing wide tile */}
        {closing && (
          <div className="mt-20 md:mt-28">
            <div className="mb-10 md:mb-14 flex items-center gap-6">
              <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Most recent
              </div>
              <div className="h-px flex-1 bg-border/70" />
            </div>
            <WideProject project={closing} index={total - 1} total={total} />
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Featured hero — image + meta panel, large display name, scrolling rule.
   ────────────────────────────────────────────────────────────────────────── */
function FeaturedProject({
  project: p,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease }}
      className="group"
    >
      <Link
        href={`/work/${p.slug}`}
        aria-label={`${p.name}, ${p.location}`}
        className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {/* Eyebrow rule */}
        <div className="mb-5 md:mb-7 flex items-center gap-4 font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="text-foreground/80">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-border/70" />
          <span>Featured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-stretch">
          {/* Image */}
          <div className="md:col-span-7">
            <div
              className="relative w-full overflow-hidden rounded-sm bg-muted"
              style={{ aspectRatio: 16 / 10 }}
            >
              <Image
                src={p.cover}
                alt={`${p.name} — ${p.location}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.035]"
              />
              {/* Status pill */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-foreground z-10">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${
                    p.status === "Completed" ? "bg-accent" : "bg-foreground/40"
                  }`}
                />
                {p.status}
              </div>
              {/* Soft bottom gradient on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
              {/* View chip */}
              <div className="pointer-events-none absolute bottom-5 right-5 inline-flex items-center gap-3 rounded-full bg-background/95 px-4 py-2 font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-foreground translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                View project
                <span aria-hidden>↗</span>
              </div>
            </div>
          </div>

          {/* Meta panel */}
          <div className="md:col-span-5 flex flex-col justify-between gap-8 md:py-2">
            <div>
              <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4">
                {p.typology}
              </div>
              <h3
                className="font-display font-black leading-[0.9] tracking-[-0.035em] text-foreground"
                style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)" }}
              >
                {p.name}
                <span className="text-accent">.</span>
              </h3>
              <p className="mt-6 max-w-[40ch] text-foreground/75 leading-relaxed">
                {p.blurb}
              </p>
            </div>

            {/* Spec strip */}
            <dl className="grid grid-cols-3 gap-4 border-t border-border/70 pt-5 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <div>
                <dt>Location</dt>
                <dd className="mt-1.5 text-foreground/85 normal-case tracking-normal text-[12px]">
                  {p.location}
                </dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd className="mt-1.5 text-foreground/85 tracking-normal text-[12px]">
                  {p.year}
                </dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd className="mt-1.5 text-foreground/85 normal-case tracking-normal text-[12px]">
                  {p.area}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Standard tile used in the asymmetric grid.
   ────────────────────────────────────────────────────────────────────────── */
function ProjectTile({
  project: p,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.05, ease }}
      className="group"
    >
      <Link
        href={`/work/${p.slug}`}
        aria-label={`${p.name}, ${p.location}`}
        className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {/* Marginalia row */}
        <div className="mb-4 flex items-center gap-3 font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="text-foreground/85">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-border/70 origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
          <span>{p.year}</span>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-sm bg-muted"
          style={{ aspectRatio: p.aspect }}
        >
          <Image
            src={p.cover}
            alt={`${p.name} — ${p.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />

          {/* Status pill */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-foreground z-10">
            <span
              aria-hidden
              className={`size-1.5 rounded-full ${
                p.status === "Completed" ? "bg-accent" : "bg-foreground/40"
              }`}
            />
            {p.status}
          </div>

          {/* Hover overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Hover content */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-7 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-background/80 mb-2">
              {p.typology}
            </div>
            <div className="flex items-end justify-between gap-4">
              <h3
                className="font-display font-black leading-[0.95] tracking-[-0.03em] text-background"
                style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.2rem)" }}
              >
                {p.name}
              </h3>
              <span
                aria-hidden
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-background/60 text-background transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:bg-background group-hover:text-foreground"
              >
                ↗
              </span>
            </div>
          </div>
        </div>

        {/* Caption beneath */}
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-1.5">
              {p.typology}
            </div>
            <h3 className="font-display text-lg md:text-xl tracking-[-0.02em] text-foreground truncate">
              {p.name}
            </h3>
          </div>
          <div className="text-right shrink-0 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <div>{p.location}</div>
            <div className="mt-1 text-foreground/70">{p.area}</div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Wide closing tile — full-width image with overlaid meta column.
   ────────────────────────────────────────────────────────────────────────── */
function WideProject({
  project: p,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease }}
      className="group"
    >
      <Link
        href={`/work/${p.slug}`}
        aria-label={`${p.name}, ${p.location}`}
        className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div
          className="relative w-full overflow-hidden rounded-sm bg-muted"
          style={{ aspectRatio: 21 / 9 }}
        >
          <Image
            src={p.cover}
            alt={`${p.name} — ${p.location}`}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.03]"
          />

          {/* Persistent bottom gradient for legibility */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent"
          />

          {/* Status pill */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-foreground z-10">
            <span
              aria-hidden
              className={`size-1.5 rounded-full ${
                p.status === "Completed" ? "bg-accent" : "bg-foreground/40"
              }`}
            />
            {p.status}
          </div>

          {/* Overlay content */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
              <div className="max-w-3xl">
                <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-background/80 mb-3">
                  {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")} · {p.typology}
                </div>
                <h3
                  className="font-display font-black leading-[0.92] tracking-[-0.035em] text-background"
                  style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
                >
                  {p.name}
                </h3>
                <p className="mt-4 max-w-[48ch] text-background/85 leading-relaxed text-sm md:text-base">
                  {p.blurb}
                </p>
              </div>

              <div className="flex items-end gap-6 md:gap-10 shrink-0">
                <dl className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-background/70">
                  <dt>Location</dt>
                  <dd className="text-background tracking-normal normal-case text-[12px]">
                    {p.location}
                  </dd>
                  <dt>Year</dt>
                  <dd className="text-background tracking-normal text-[12px]">{p.year}</dd>
                  <dt>Area</dt>
                  <dd className="text-background tracking-normal normal-case text-[12px]">
                    {p.area}
                  </dd>
                </dl>
                <span
                  aria-hidden
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-background/60 text-background transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:bg-background group-hover:text-foreground"
                >
                  ↗
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
