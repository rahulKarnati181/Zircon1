import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12 md:py-16 grid grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-6">
        <div className="col-span-2 md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 cursor-pointer">
            <span aria-hidden className="block size-2.5 rounded-full bg-foreground" />
            <span className="font-display text-lg tracking-tight font-semibold">
              Zircon34
            </span>
          </Link>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-sm">
            An independent design studio working on residences and small
            cultural buildings across South India.
          </p>
        </div>

        <nav className="col-span-1 md:col-span-3">
          <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Pages
          </div>
          <ul className="flex flex-col gap-2 text-foreground/80">
            <li>
              <Link href="/work" className="hover:text-foreground cursor-pointer">
                Work
              </Link>
            </li>
            <li>
              <Link href="/studio" className="hover:text-foreground cursor-pointer">
                Studio
              </Link>
            </li>
            <li>
              <Link href="/approach" className="hover:text-foreground cursor-pointer">
                Approach
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground cursor-pointer">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-span-1 md:col-span-4">
          <div className="font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
            Studio
          </div>
          <address className="not-italic text-foreground/80 leading-relaxed">
            12 Banjara Hills, Road No. 3
            <br />
            Hyderabad, IN
            <br />
            <Link
              href="mailto:studio@zircon.archi"
              className="hover:text-foreground cursor-pointer"
            >
              studio@zircon.archi
            </Link>
          </address>
        </div>

        <div className="col-span-2 md:col-span-12 mt-6 pt-6 border-t border-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono-grotesk text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <div>© {new Date().getFullYear()} Zircon34 Design Studio</div>
          <div className="flex items-center gap-6">
            <Link href="https://instagram.com" className="hover:text-foreground cursor-pointer">
              Instagram
            </Link>
            <Link href="https://are.na" className="hover:text-foreground cursor-pointer">
              Are.na
            </Link>
            <Link href="https://linkedin.com" className="hover:text-foreground cursor-pointer">
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
