"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { formatDuration } from "@/lib/works";
import { videoUrl } from "@/lib/media";

type Props = {
  work: Work;
  index: number;
  /** Mount this card eagerly (above-the-fold). */
  priority?: boolean;
};

export function WorkCard({ work, index, priority = false }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);

  const onEnter = () => {
    setHovered(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  };
  const onLeave = () => {
    setHovered(false);
    const v = videoRef.current;
    if (v) v.pause();
  };

  const aspect =
    work.orientation === "vertical" ? "aspect-[9/16]" : "aspect-[16/9]";

  return (
    <Link
      href={`/work/${work.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="group relative block w-full transition-transform duration-500 hover:-translate-y-0.5 focus-visible:outline-none"
      aria-label={`${work.title} — ${work.category}`}
    >
      {/* Editorial top strip: index · category · year — outside the frame, like print captions */}
      <div className="mb-2.5 flex items-baseline justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground md:mb-3 md:text-[10px] md:tracking-[0.28em]">
        <span className="flex min-w-0 items-baseline gap-2 md:gap-3">
          <span className="text-foreground/80">
            {String(index).padStart(2, "0")}
          </span>
          <span className="h-px w-4 translate-y-[-3px] bg-border md:w-5" />
          <span className="truncate">{work.category}</span>
        </span>
        <span className="shrink-0">{work.year}</span>
      </div>

      <div
        className={`relative overflow-hidden rounded-xl bg-card ring-1 ring-white/5 transition-shadow duration-500 group-hover:ring-white/20 ${aspect}`}
      >
        <img
          src={`/posters/${work.slug}.jpg`}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out group-hover:scale-[1.04] ${
            hovered && ready ? "opacity-0" : "opacity-100"
          }`}
          loading={priority ? "eager" : "lazy"}
        />
        <video
          ref={videoRef}
          src={videoUrl(`/videos/${work.slug}.mp4`)}
          muted
          playsInline
          loop
          preload="metadata"
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hovered && ready ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Faint hover affordance — tiny dot + word, no pills/colors */}
        <div
          className={`absolute right-4 top-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/80 transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-white/90" />
          Playing
        </div>

        {/* Bottom: title typography stamped on the image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3.5 md:p-7">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-lg leading-[0.98] tracking-tight text-pretty text-white sm:text-xl md:text-3xl xl:text-4xl">
                {work.title}
              </h3>
              <p className="mt-1.5 line-clamp-1 max-w-[28ch] text-[11px] italic text-white/65 text-pretty md:mt-2 md:text-sm">
                {work.tagline}
              </p>
            </div>
            <div className="shrink-0 self-end font-mono text-[9px] uppercase tracking-[0.22em] text-white/55 md:text-[11px] md:tracking-[0.28em]">
              {formatDuration(work.durationSec)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
