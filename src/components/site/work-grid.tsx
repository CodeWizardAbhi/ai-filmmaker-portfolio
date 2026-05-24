"use client";

import { useMemo, useState } from "react";
import type { Category, Work } from "@/lib/works";
import { WorkCard } from "./work-card";

const FILTERS: ("All" | Category)[] = [
  "All",
  "Short Film",
  "Series",
  "Music Video",
  "Commercial",
  "Experimental",
];

export function WorkGrid({ works }: { works: Work[] }) {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? works : works.filter((w) => w.category === active)),
    [works, active],
  );

  // Stable count of works per filter for the pill badge
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", works.length);
    for (const w of works) {
      map.set(w.category, (map.get(w.category) ?? 0) + 1);
    }
    return map;
  }, [works]);

  return (
    <div>
      {/* Filter pills */}
      <div className="sticky top-16 z-30 -mx-2 mb-10 flex flex-wrap items-center gap-2 overflow-x-auto bg-background/80 px-2 py-3 backdrop-blur-xl">
        {FILTERS.map((f) => {
          const n = counts.get(f);
          if (!n && f !== "All") return null;
          const isActive = active === f;
          return (
            <button
              type="button"
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={isActive}
              className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-foreground/5 text-foreground/80 hover:text-foreground"
              }`}
            >
              <span>{f}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                  isActive
                    ? "bg-background/15 text-background"
                    : "bg-foreground/10 text-foreground/60"
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div
        key={active /* re-mount to retrigger entrance anim */}
        className="grid grid-cols-12 gap-5 md:gap-7"
      >
        {filtered.map((w, i) => (
          <div
            key={w.slug}
            style={{
              animation: `tileIn 700ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both`,
            }}
            className={i === 0 && active === "All" ? "col-span-12" : "col-span-12 lg:col-span-6"}
          >
            <WorkCard work={w} index={i + 1} feature={i === 0 && active === "All"} />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-12 py-24 text-center text-muted-foreground">
            Nothing here yet — pick another filter.
          </p>
        )}
      </div>
    </div>
  );
}
