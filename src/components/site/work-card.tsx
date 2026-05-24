"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { formatDuration } from "@/lib/works";
import { videoUrl } from "@/lib/media";

type Props = {
  work: Work;
  index: number;
  /** When true, render a larger feature tile */
  feature?: boolean;
};

export function WorkCard({ work, index, feature = false }: Props) {
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
    if (v) {
      v.pause();
    }
  };

  const aspect =
    feature
      ? "aspect-[16/9]"
      : work.orientation === "vertical"
        ? "aspect-[9/16]"
        : "aspect-[16/9]";

  return (
    <Link
      href={`/work/${work.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="group relative block w-full"
      aria-label={`${work.title} — ${work.category}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-card ${aspect}`}
      >
        {/* Poster */}
        <img
          src={`/posters/${work.slug}.jpg`}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hovered && ready ? "opacity-0" : "opacity-100"
          }`}
          loading={feature ? "eager" : "lazy"}
        />
        {/* Hover-preview video */}
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

        {/* Top-left index + category */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-foreground/80 mix-blend-difference">
          <span className="font-mono">
            {String(index).padStart(2, "0")}
          </span>
          <span className="h-px w-6 bg-foreground/50" />
          <span>{work.category}</span>
        </div>

        {/* Bottom gradient + title */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 md:p-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl leading-tight tracking-tight text-pretty md:text-3xl">
                {work.title}
              </h3>
              <p className="mt-1 text-sm text-white/70 text-pretty">
                {work.tagline}
              </p>
            </div>
            <div className="hidden shrink-0 text-right md:block">
              <p className="font-mono text-xs uppercase tracking-widest text-white/60">
                {work.year}
              </p>
              <p className="font-mono text-xs uppercase tracking-widest text-white/60">
                {formatDuration(work.durationSec)}
              </p>
            </div>
          </div>
        </div>

        {/* Hover affordance */}
        <div
          className={`absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white backdrop-blur transition-all duration-300 ${
            hovered ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Preview
        </div>
      </div>
    </Link>
  );
}
