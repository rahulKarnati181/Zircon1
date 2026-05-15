"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Center-of-nav links shown on desktop
const desktopLinks = [
  { href: "/work", label: "Work" },
  { href: "/approach", label: "Approach" },
];

// Full link list shown inside the mobile hamburger drawer
const drawerLinks = [
  { href: "/work", label: "Work", n: "01" },
  { href: "/approach", label: "Approach", n: "02" },
  { href: "/contact", label: "Start a project", n: "03" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open; close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const headerSolid = scrolled || !isHome || open;

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300",
          headerSolid
            ? "bg-background/80 backdrop-blur-md border-b border-border/70"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <nav className="mx-auto max-w-[1400px] px-6 md:px-10 h-20 md:h-30 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center cursor-pointer"
            aria-label="Zircon34 Design Studio — home"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/assets/logo.png"
              alt="Zircon34 Design Studio"
              width={446}
              height={424}
              priority
              className="h-16 md:h-26 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </Link>

          {/* Desktop: centered nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {desktopLinks.map((l) => {
              const active =
                pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={[
                      "font-mono-grotesk text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 cursor-pointer",
                      active
                        ? "text-foreground"
                        : "text-foreground/65 hover:text-foreground",
                    ].join(" ")}
                  >
                    {l.label}
                    {active && (
                      <span
                        aria-hidden
                        className="ml-2 inline-block size-1 rounded-full bg-accent align-middle"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop: Start a project (right) */}
          <Link
            href="/contact"
            className="group hidden md:inline-flex items-center gap-2 font-mono-grotesk text-[11px] uppercase tracking-[0.22em] text-foreground hover:text-accent transition-colors cursor-pointer"
          >
            <span>Start a project</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>

          {/* Mobile: Hamburger toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="primary-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden group relative inline-flex items-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <span
              aria-hidden
              className="relative block w-9 h-9"
            >
              {/* Top bar */}
              <motion.span
                className="absolute left-1 right-1 h-[2px] bg-foreground origin-center"
                initial={false}
                animate={
                  open
                    ? { top: "50%", y: "-50%", rotate: 45 }
                    : { top: "32%", y: 0, rotate: 0 }
                }
                transition={{ duration: 0.35, ease }}
              />
              {/* Middle bar */}
              <motion.span
                className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[2px] bg-foreground origin-center"
                initial={false}
                animate={{ scaleX: open ? 0 : 1, opacity: open ? 0 : 1 }}
                transition={{ duration: 0.25, ease }}
              />
              {/* Bottom bar */}
              <motion.span
                className="absolute left-1 right-1 h-[2px] bg-foreground origin-center"
                initial={false}
                animate={
                  open
                    ? { top: "50%", y: "-50%", rotate: -45 }
                    : { top: "68%", y: 0, rotate: 0 }
                }
                transition={{ duration: 0.35, ease }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="primary-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Primary navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl"
          >
            <div className="absolute inset-0 overflow-y-auto">
              <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-28 md:pt-44 pb-16 min-h-full flex flex-col">
                <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-10 md:mb-14">
                  <span className="text-accent">●</span>&nbsp;&nbsp;Index
                </div>

                <ul className="flex flex-col gap-3 md:gap-4">
                  {drawerLinks.map((l, i) => {
                    const active =
                      pathname === l.href || pathname.startsWith(l.href + "/");
                    return (
                      <motion.li
                        key={l.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: 0.08 + i * 0.06,
                          ease,
                        }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-6 md:gap-10 border-b border-border/60 py-4 md:py-6 cursor-pointer"
                        >
                          <span className="font-mono-grotesk text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-muted-foreground w-8 md:w-12">
                            {l.n}
                          </span>
                          <span
                            className="font-display font-black tracking-[-0.04em] leading-[0.95] flex-1"
                            style={{ fontSize: "clamp(2.5rem, 9vw, 7.5rem)" }}
                          >
                            {l.label}
                            {active && (
                              <span className="text-accent">.</span>
                            )}
                          </span>
                          <span
                            aria-hidden
                            className="hidden md:inline-flex size-12 items-center justify-center rounded-full border border-border text-foreground/70 transition-all duration-300 group-hover:border-foreground group-hover:text-foreground group-hover:bg-foreground/5 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.32, ease }}
                  className="mt-auto pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
                >
                  <div>
                    <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
                      Studio
                    </div>
                    <p className="text-foreground/85 leading-relaxed">
                      Zircon34 Design Studio
                      <br />
                      Hyderabad · Bengaluru
                    </p>
                  </div>
                  <div>
                    <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
                      Enquire
                    </div>
                    <Link
                      href="mailto:studio@zircon.archi"
                      onClick={() => setOpen(false)}
                      className="text-foreground hover:text-accent transition-colors cursor-pointer"
                    >
                      studio@zircon.archi
                    </Link>
                  </div>
                  <div>
                    <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3">
                      Elsewhere
                    </div>
                    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-foreground/80">
                      <li>
                        <Link
                          href="https://instagram.com"
                          className="hover:text-foreground cursor-pointer"
                        >
                          Instagram
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://are.na"
                          className="hover:text-foreground cursor-pointer"
                        >
                          Are.na
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://linkedin.com"
                          className="hover:text-foreground cursor-pointer"
                        >
                          LinkedIn
                        </Link>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
