"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showcase } from "@/lib/showcase";
import { videoUrl } from "@/lib/media";

export function ShowcaseWall() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const openAt = useCallback((i: number) => setOpenIndex(i), []);
  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-16 pb-12 md:pt-20 lg:px-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:text-[11px]">
            Showcase
          </p>
          <h2 className="mt-3 font-display text-[clamp(1.9rem,6vw,3.4rem)] leading-[1.02] tracking-tight text-balance">
            kool shyt.
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
          <ShowcaseTile
            key={clip.slug}
            clip={clip}
            index={i}
            onOpen={openAt}
          />
        ))}
      </div>

      <ShowcaseLightbox
        clips={showcase}
        index={openIndex}
        onClose={close}
        onNavigate={openAt}
      />
    </section>
  );
}

function ShowcaseTile({
  clip,
  index,
  onOpen,
}: {
  clip: (typeof showcase)[number];
  index: number;
  onOpen: (i: number) => void;
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
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Play ${clip.title}`}
      className="group relative aspect-video w-full overflow-hidden rounded-xl bg-card text-left ring-1 ring-white/5 transition-shadow duration-500 hover:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {/* Title sits low and tight — only label on the tile.
          No LIVE badge, no tagline subtext. */}
      <div className="absolute inset-x-0 bottom-0 p-3 pb-3.5 md:p-4 md:pb-5">
        <h3 className="font-display text-base leading-tight tracking-tight text-white md:text-lg">
          {clip.title}
        </h3>
      </div>
    </button>
  );
}

/* Lightbox — click-to-open, blur backdrop, video plays in a sharp frame.
   Arrow keys / on-screen chevrons cycle clips. Esc closes. */
function ShowcaseLightbox({
  clips,
  index,
  onClose,
  onNavigate,
}: {
  clips: typeof showcase;
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const isOpen = index !== null;
  const clip = isOpen ? clips[index] : null;

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight")
        onNavigate(((index ?? 0) + 1) % clips.length);
      else if (e.key === "ArrowLeft")
        onNavigate(((index ?? 0) - 1 + clips.length) % clips.length);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, index, clips.length, onClose, onNavigate]);

  if (!isOpen || !clip || index === null) return null;

  const next = () => onNavigate((index + 1) % clips.length);
  const prev = () => onNavigate((index - 1 + clips.length) % clips.length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${clip.title} — showcase preview`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-2xl md:p-6"
      style={{ animation: "fadeIn 220ms ease-out both" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full"
        style={{ width: "min(100%, calc(78svh * 16 / 9))" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute -top-12 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-white/15 shadow-2xl">
          <video
            key={clip.slug}
            src={videoUrl(`/videos/showcase/${clip.slug}.mp4`)}
            poster={`/posters/showcase/${clip.slug}.jpg`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/65 md:mt-4">
          <span className="truncate font-display text-base normal-case tracking-tight text-white md:text-lg">
            {clip.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous clip"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={next}
              aria-label="Next clip"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/85 transition-colors hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
