import type { Metadata } from "next";
import { Contact } from "@/components/site/contact";

export const metadata: Metadata = {
  title: "Contact — Zircon34",
  description: "Start a project with Zircon34 Design Studio.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Light spacer / intro — gives the (translucent, light) navbar a
          surface to float over before the dark CTA section begins. */}
      <header className="pt-32 md:pt-44 pb-16 md:pb-24 bg-background">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            <span className="text-accent">●</span>&nbsp;&nbsp;Contact
          </div>
          <h1
            className="font-display font-black leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            Start a project<span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-[60ch] text-foreground/75 text-lg leading-relaxed">
            We take on a handful of new projects each year. Reach out — we
            usually reply within a day or two.
          </p>
        </div>
      </header>

      <Contact />
    </div>
  );
}
