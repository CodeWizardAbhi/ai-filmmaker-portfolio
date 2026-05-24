"use client";

import { useEffect, useRef } from "react";
import { showcase } from "@/lib/showcase";
import { videoUrl } from "@/lib/media";

export function ShowcaseWall() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-16 pb-12 md:pt-20 lg:px-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:text-[11px]">
            Showcase
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,6vw,3.4rem)] leading-[1.02] tracking-tight text-balance">
            Ten trials, one reel.
          </h2>
        </div>
        <a
          href={videoUrl("/videos/showcase-reel.mp4")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-border bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Play full reel
          <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
        {showcase.map((clip, i) => (
          <ShowcaseTile key={clip.slug} clip={clip} index={i} />
        ))}
      </div>
    </section>
  );
}

function ShowcaseTile({
  clip,
  index,
}: {
  clip: (typeof showcase)[number];
  index: number;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article
      className="group relative overflow-hidden rounded-xl bg-card aspect-video"
      style={{
        animation: `tileIn 700ms cubic-bezier(0.16,1,0.3,1) ${index * 60}ms both`,
      }}
    >
      <video
        ref={ref}
        src={videoUrl(`/videos/showcase/${clip.slug}.mp4`)}
        poster={`/posters/showcase/${clip.slug}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white/85 backdrop-blur">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
        Live
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <h3 className="font-display text-base leading-tight tracking-tight text-white md:text-lg">
          {clip.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-white/65 md:text-xs">
          {clip.tagline}
        </p>
      </div>
    </article>
  );
}
