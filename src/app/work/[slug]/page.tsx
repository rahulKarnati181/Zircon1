import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return { title: "Not found — Zircon34" };
  return {
    title: `${p.name} — Zircon34`,
    description: p.blurb,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="pt-28 md:pt-32">
      <header className="mx-auto max-w-[1400px] px-6 md:px-10 mb-12 md:mb-16">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span aria-hidden>←</span>
          <span>All work</span>
        </Link>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              <span className="text-accent">●</span>&nbsp;&nbsp;{project.typology}
            </div>
            <h1
              className="font-display font-black leading-[0.85] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.75rem, 9vw, 9rem)" }}
            >
              {project.name}
            </h1>
            <p className="mt-6 text-foreground/80 text-lg md:text-xl leading-relaxed max-w-[52ch]">
              {project.blurb}
            </p>
          </div>

          <dl className="md:col-span-4 grid grid-cols-2 gap-y-6 gap-x-4">
            {[
              ["Location", project.location],
              ["Year", project.year],
              ["Area", project.area],
              ["Status", project.status],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-2 text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Cover */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-muted">
          <Image
            src={project.cover}
            alt={`${project.name} — main view`}
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Gallery */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {project.gallery.map((src, i) => {
          const layout =
            i % 3 === 0
              ? "md:col-span-7"
              : i % 3 === 1
                ? "md:col-span-5"
                : "md:col-span-12";
          const aspect = i % 2 === 0 ? "aspect-[4/5]" : "aspect-[16/10]";
          return (
            <div
              key={src + i}
              className={`relative ${aspect} w-full overflow-hidden rounded-sm bg-muted ${layout}`}
            >
              <Image
                src={src}
                alt={`${project.name} — view ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </section>

      {/* Project notes */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            <span className="text-accent">●</span>&nbsp;&nbsp;On the project
          </div>
          <h2
            className="font-display font-black leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            Site, light, and the slow life within.
          </h2>
        </div>
        <div className="md:col-span-7 md:pl-6 space-y-6 text-foreground/80 leading-relaxed text-lg">
          <p>{project.blurb}</p>
          <p>
            The plan is organised around a single, generous living volume —
            uninterrupted by partition — with private rooms folded gently to its
            northern edge. Every aperture was studied at 1:20 and again at
            full-size on site.
          </p>
          <p>
            Materials were selected for the way they accept time: lime-washed
            walls, oiled teak joinery, locally quarried Kota stone underfoot.
            Nothing here is meant to look new for long.
          </p>
        </div>
      </section>

      {/* Next project */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 mt-24 md:mt-36 mb-20 md:mb-28">
        <Link
          href={`/work/${next.slug}`}
          className="group block border-t border-border pt-10"
        >
          <div className="flex items-center justify-between mb-6 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>Next project</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h3
              className="font-display font-black leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              {next.name}
            </h3>
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {next.location} · {next.year}
            </div>
          </div>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm bg-muted mt-8">
            <Image
              src={next.cover}
              alt={`${next.name} — preview`}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Link>
      </section>
    </article>
  );
}
