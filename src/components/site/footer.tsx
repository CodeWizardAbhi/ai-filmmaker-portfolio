import Link from "next/link";
import { videoUrl } from "@/lib/media";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/abhirajfr_/" },
  { label: "X / Twitter", href: "https://x.com/Abhilome" },
];

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <p className="font-display text-3xl leading-[1.05] tracking-tight md:text-5xl">
            Let&rsquo;s make something
            <br />
            <span className="italic text-muted-foreground">that moves.</span>
          </p>
          <a
            href="mailto:usaabhiraj2@gmail.com"
            className="mt-6 inline-flex items-center gap-3 text-base break-all text-foreground hover:text-[var(--accent)]"
          >
            <span className="border-b border-foreground/40 pb-0.5 group-hover:border-[var(--accent)]">
              usaabhiraj2@gmail.com
            </span>
            <span aria-hidden className="shrink-0">↗</span>
          </a>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Elsewhere
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
                >
                  {s.label}
                  <span aria-hidden className="opacity-50">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Index
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-[var(--accent)]">
                Work
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[var(--accent)]">
                About
              </Link>
            </li>
            <li>
              <a
                href={videoUrl("/videos/showcase-reel.mp4")}
                className="hover:text-[var(--accent)]"
              >
                Showreel
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-muted-foreground lg:px-10">
          <p>© {new Date().getFullYear()} Abhiraj Singh. All frames generated.</p>
          <p className="font-mono">
            Built in Next.js · Designed in the dark.
          </p>
        </div>
      </div>
    </footer>
  );
}
