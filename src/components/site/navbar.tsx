"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#studio", label: "Studio" },
  { href: "#approach", label: "Approach" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/70"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto max-w-[1400px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <Link
          href="#top"
          className="group inline-flex items-center gap-3 cursor-pointer"
          aria-label="Zircon — home"
        >
          <span
            aria-hidden
            className="block size-2.5 rounded-full bg-foreground transition-transform duration-300 group-hover:scale-125"
          />
          <span className="font-display text-[1.05rem] md:text-lg tracking-tight font-semibold">
            Zircon
          </span>
          <span className="hidden md:inline font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Architecture Studio
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-foreground/70 hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#contact"
          className="group inline-flex items-center gap-2 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-foreground hover:text-accent transition-colors cursor-pointer"
        >
          <span>Start a project</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </nav>
    </motion.header>
  );
}
