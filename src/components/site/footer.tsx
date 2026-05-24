const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/abhirajfr_/" },
  { label: "X / Twitter", href: "https://x.com/Abhilome" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border bg-background md:mt-32">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20 lg:px-10">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
          {/* Primary: email. The point of the footer. */}
          <div className="w-full md:w-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:text-[11px]">
              Contact
            </p>
            <a
              href="mailto:usaabhiraj2@gmail.com"
              className="group mt-3 inline-flex max-w-full items-baseline gap-2 break-all font-display text-[clamp(1.5rem,6vw,3rem)] leading-[1.05] tracking-tight text-foreground transition-colors hover:text-[var(--accent)] md:mt-4"
            >
              usaabhiraj2@gmail.com
              <span aria-hidden className="shrink-0 text-base text-muted-foreground transition-colors group-hover:text-[var(--accent)]">
                ↗
              </span>
            </a>
          </div>

          {/* Secondary: socials. Compact, right-aligned on desktop. */}
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:justify-end">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground/75 transition-colors hover:text-foreground"
                >
                  {s.label}
                  <span aria-hidden className="opacity-50">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 text-[11px] text-muted-foreground lg:px-10">
          <p>© {new Date().getFullYear()} Abhiraj Singh</p>
          <p className="font-mono uppercase tracking-[0.22em]">India</p>
        </div>
      </div>
    </footer>
  );
}
