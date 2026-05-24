"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Work } from "@/lib/works";
import { CATEGORY_KICKER, CATEGORY_NUMERAL, CATEGORY_ORDER } from "@/lib/works";
import { WorkCard } from "./work-card";

type Group = { category: Category; items: Work[] };

function slugifyCategory(c: Category) {
  return c.toLowerCase().replace(/\s+/g, "-");
}

export function WorkGrid({ works }: { works: Work[] }) {
  const groups: Group[] = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: works.filter((w) => w.category === cat),
  })).filter((g) => g.items.length > 0);

  const [activeId, setActiveId] = useState<string>(slugifyCategory(groups[0]?.category ?? "Short Film"));
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Highlight the in-view section in the jump nav.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    observerRef.current?.disconnect();
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost section whose top is above the bottom of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );
    for (const g of groups) {
      const el = document.getElementById(slugifyCategory(g.category));
      if (el) io.observe(el);
    }
    observerRef.current = io;
    return () => io.disconnect();
  }, [groups]);

  return (
    <div>
      {/* Sticky editorial jump-nav — typographic, no colored fills.
          On mobile: horizontally scrollable strip; on md+: wraps inline. */}
      <nav
        aria-label="Work categories"
        className="sticky top-16 z-30 -mx-6 mb-12 border-b border-border bg-background/85 backdrop-blur-xl md:-mx-2 md:mb-16"
      >
        <ul className="flex items-baseline gap-x-5 gap-y-2 overflow-x-auto whitespace-nowrap px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] md:flex-wrap md:gap-x-7 md:overflow-visible md:whitespace-normal md:px-2 md:py-4 md:text-[11px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map((g) => {
            const id = slugifyCategory(g.category);
            const isActive = activeId === id;
            return (
              <li key={g.category} className="flex shrink-0 items-baseline gap-1.5">
                <a
                  href={`#${id}`}
                  className={`transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mr-1.5 inline-block transition-opacity ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    →
                  </span>
                  {g.category}
                </a>
                <sup className="text-[9px] text-muted-foreground/60">
                  {g.items.length.toString().padStart(2, "0")}
                </sup>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-28 md:space-y-32">
        {groups.map((g, gi) => (
          <CategorySection key={g.category} group={g} sectionIndex={gi} />
        ))}
      </div>
    </div>
  );
}

function CategorySection({
  group,
  sectionIndex,
}: {
  group: Group;
  sectionIndex: number;
}) {
  const isAllVertical = group.items.every((w) => w.orientation === "vertical");
  const numeral = CATEGORY_NUMERAL[group.category];
  const kicker = CATEGORY_KICKER[group.category];

  return (
    <section
      id={slugifyCategory(group.category)}
      className="scroll-mt-28"
      aria-labelledby={`${slugifyCategory(group.category)}-heading`}
    >
      {/* Editorial section header — print-style: numeral, kicker, big serif title, count */}
      <header className="mb-8 border-b border-border pb-5 md:mb-10 md:pb-6">
        {/* Top meta row — visible on mobile and desktop */}
        <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70 md:tracking-[0.32em]">
          <span>Vol. {numeral}</span>
          <span>
            {group.items.length.toString().padStart(2, "0")} —{" "}
            {group.items.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        {/* Title + kicker */}
        <div className="mt-3 md:mt-4">
          <h3
            id={`${slugifyCategory(group.category)}-heading`}
            className="font-display text-[clamp(2rem,7vw,3.6rem)] leading-[0.95] tracking-tight text-balance"
          >
            {group.category}
          </h3>
          <p className="mt-2 max-w-xl text-sm italic text-muted-foreground text-pretty md:mt-3 md:text-base">
            {kicker}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-5 md:gap-7">
        {group.items.map((w, i) => (
          <div
            key={w.slug}
            style={{
              animation: `tileIn 700ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
            }}
            className={tileColSpan(w, isAllVertical, i)}
          >
            <WorkCard
              work={w}
              index={i + 1}
              priority={sectionIndex === 0 && i === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Tile sizing:
 * - All-vertical section: 2 / 3 / 4 per row.
 * - Mixed/landscape section: first landscape spans full width as feature,
 *   subsequent landscapes go 2-up, verticals take 1/3.
 */
function tileColSpan(work: Work, allVertical: boolean, indexInSection: number) {
  if (allVertical) {
    return "col-span-6 md:col-span-4 lg:col-span-3";
  }
  if (work.orientation === "vertical") {
    return "col-span-6 md:col-span-4";
  }
  if (indexInSection === 0) return "col-span-12";
  return "col-span-12 md:col-span-6";
}
