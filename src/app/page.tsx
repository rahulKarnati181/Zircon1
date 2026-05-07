import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/site/hero";
import { projects } from "@/lib/projects";

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Selected work — slim teaser pulling readers into /work */}
      <section className="relative py-20 md:py-28 border-t border-border/70 bg-background">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                <span className="text-accent">●</span>&nbsp;&nbsp;Selected Work
              </div>
              <h2
                className="font-display font-black leading-[0.9] tracking-[-0.04em]"
                style={{ fontSize: "clamp(2.25rem, 6vw, 5rem)" }}
              >
                Three recent residences.
              </h2>
            </div>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-foreground hover:text-accent transition-colors cursor-pointer self-start md:self-end"
            >
              <span>All projects</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted">
                    <Image
                      src={p.cover}
                      alt={`${p.name} — ${p.location}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-xl md:text-2xl tracking-[-0.02em]">
                      {p.name}
                    </h3>
                    <span className="font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {p.location}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Studio CTA */}
      <section className="relative py-24 md:py-36 border-t border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              <span className="text-accent">●</span>&nbsp;&nbsp;The Studio
            </div>
            <h2
              className="font-display font-black leading-[0.85] tracking-[-0.04em] max-w-[15ch]"
              style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            >
              A small studio, deeply involved.
            </h2>
          </div>
          <div className="md:col-span-4 flex flex-col gap-6 md:items-end">
            <p className="text-foreground/75 leading-relaxed md:text-right max-w-sm">
              We take on a handful of projects each year and draw, detail and
              visit them ourselves.
            </p>
            <Link
              href="/studio"
              className="group inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-5 py-3 text-background hover:bg-background hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              <span className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em]">
                About the studio
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
