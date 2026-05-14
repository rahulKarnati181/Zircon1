import type { Metadata } from "next";
import { Projects } from "@/components/site/projects";

export const metadata: Metadata = {
  title: "Work — Zircon34",
  description: "Selected residences and projects by Zircon34 Design Studio.",
};

export default function WorkPage() {
  return (
    <div className="pt-28 md:pt-32">
      <header className="mx-auto max-w-[1400px] px-6 md:px-10 mb-8 md:mb-12">
        <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
          <span className="text-accent">●</span>&nbsp;&nbsp;Index — 2023 / 2025
        </div>
        <h1
          className="font-display font-black leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: "clamp(3rem, 10vw, 10rem)" }}
        >
          Work<span className="text-accent">.</span>
        </h1>
        <p className="mt-6 max-w-[52ch] text-foreground/75 text-lg leading-relaxed">
          A selection of recent residences. Each project is led from sketch to
          handover by the same architect — and visited often after.
        </p>
      </header>
      <Projects />
    </div>
  );
}
