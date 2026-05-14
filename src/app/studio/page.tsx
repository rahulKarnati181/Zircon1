import type { Metadata } from "next";
import Link from "next/link";
import { StudioSection } from "@/components/site/studio-section";

export const metadata: Metadata = {
  title: "Studio — Zircon34",
  description:
    "Zircon34 is an independent design studio working on residences and small cultural buildings across South India.",
};

export default function StudioPage() {
  return (
    <div className="pt-28 md:pt-40">
      <StudioSection />

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-24 md:pb-32 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-border/70 pt-16">
        <div className="md:col-span-8">
          <p className="text-foreground/80 text-lg md:text-xl leading-relaxed max-w-[60ch]">
            Curious how we work? Read the four principles that shape every
            project — from the first site visit to the last detail drawing.
          </p>
        </div>
        <div className="md:col-span-4 md:text-right">
          <Link
            href="/approach"
            className="group inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-5 py-3 text-background hover:bg-background hover:text-foreground transition-colors duration-300 cursor-pointer"
          >
            <span className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em]">
              Read our approach
            </span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
