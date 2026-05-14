import type { Metadata } from "next";
import { ApproachSection } from "@/components/site/approach-section";

export const metadata: Metadata = {
  title: "Approach — Zircon34",
  description:
    "Four principles that shape every Zircon34 project — from the first site visit to the last detail drawing.",
};

export default function ApproachPage() {
  return (
    <div className="pt-32 md:pt-44">
      <header className="mx-auto max-w-[1400px] px-6 md:px-10 mb-12 md:mb-16">
        <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
          <span className="text-accent">●</span>&nbsp;&nbsp;Approach
        </div>
        <h1
          className="font-display font-black leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: "clamp(2.75rem, 9vw, 9rem)" }}
        >
          Principles<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[60ch] text-foreground/75 text-lg leading-relaxed">
          We work slowly, on a small number of projects each year, and we
          don&apos;t take shortcuts on what follows.
        </p>
      </header>
      <ApproachSection showHeading={false} />
    </div>
  );
}
