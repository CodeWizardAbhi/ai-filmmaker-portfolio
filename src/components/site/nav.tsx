"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 text-sm font-medium tracking-tight sm:gap-3"
          aria-label="Abhiraj Singh — home"
        >
          <span className="relative inline-flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          </span>
          <span className="whitespace-nowrap font-display text-[15px] tracking-tight sm:text-base">
            Abhiraj Singh
          </span>
          <span className="hidden whitespace-nowrap text-xs uppercase tracking-[0.18em] text-muted-foreground md:inline">
            AI Filmmaker
          </span>
        </Link>

        <ul className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/" || pathname.startsWith("/work")
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-2.5 -bottom-0.5 h-px bg-foreground/70 sm:inset-x-3" />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="ml-1 sm:ml-2">
            <a
              href="mailto:usaabhiraj2@gmail.com"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-foreground/5 px-3 py-1.5 text-xs font-medium tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background sm:gap-2 sm:px-3.5"
              aria-label="Get in touch via email"
            >
              <span className="hidden sm:inline">Get in touch</span>
              <span className="sm:hidden">Hire</span>
              <span aria-hidden>→</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
