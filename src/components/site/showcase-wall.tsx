"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showcase } from "@/lib/showcase";
import { videoUrl } from "@/lib/media";

export function ShowcaseWall() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Track which clips have been viewed in this lightbox session so 'next'
  // can pick a random one that hasn't played yet. Cleared on close.
  const [played, setPlayed] = useState<Set<number>>(new Set());

  const openAt = useCallback((i: number) => {
    setOpenIndex(i);
    setPlayed(new Set([i]));
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setPlayed(new Set());
  }, []);

  const shuffleNext = useCallback(() => {
    setOpenIndex((curr) => {
      if (curr === null) return null;
      const total = showcase.length;
      // If everything's been seen, reset the pool but exclude the current
      // clip so we never replay the one already on screen.
      let pool = played.size >= total ? new Set([curr]) : played;
      const candidates: number[] = [];
      for (let i = 0; i < total; i++) {
        if (!pool.has(i)) candidates.push(i);
      }
      if (candidates.length === 0) return curr;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      setPlayed(new Set([...pool, pick]));
      return pick;
    });
  }, [played]);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-16 pb-12 md:pt-20 lg:px-10">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:text-[11px]">
          Showcase
        </p>
        <h2 className="mt-3 font-display text-[clamp(1.9rem,6vw,3.4rem)] leading-[1.02] tracking-tight text-balance">
          my Seedance dump.
        </h2>
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
        playedCount={played.size}
        onClose={close}
        onShuffle={shuffleNext}
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

/* Lightbox — click-to-open, blur backdrop, video plays in a sharp frame
   WITH audio (autoplay unmuted; falls back to muted if the browser blocks).
   'Next' = random clip that hasn't been viewed in this session yet;
   pool resets once all 10 have played. Esc closes. */
function ShowcaseLightbox({
  clips,
  index,
  playedCount,
  onClose,
  onShuffle,
}: {
  clips: typeof showcase;
  index: number | null;
  playedCount: number;
  onClose: () => void;
  onShuffle: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const isOpen = index !== null;
  const clip = isOpen ? clips[index] : null;

  // Body scroll lock + keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft" ||
        e.key === " "
      ) {
        e.preventDefault();
        onShuffle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, onShuffle]);

  // Try unmuted first; if the browser blocks (iOS Safari can refuse audio
  // even after a click on a different element), silently fall back to muted
  // — the sound toggle is always visible so the user can flip it in one tap.
  useEffect(() => {
    if (!isOpen || !clip) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    setSoundOn(true);
    void v.play().catch(() => {
      v.muted = true;
      setSoundOn(false);
      v.play().catch(() => {});
    });
  }, [isOpen, clip]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !soundOn;
    v.muted = !next;
    if (next) v.volume = 1;
    setSoundOn(next);
    void v.play().catch(() => {});
  };

  if (!isOpen || !clip || index === null) return null;

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
            ref={videoRef}
            key={clip.slug}
            src={videoUrl(`/videos/showcase/${clip.slug}.mp4`)}
            poster={`/posters/showcase/${clip.slug}.jpg`}
            autoPlay
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Sound toggle — always visible. Defaults to ON when the browser
              allows, OFF when the browser blocks unmuted autoplay (iOS).
              Either way, one tap flips it. */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? "Mute" : "Unmute"}
            aria-pressed={soundOn}
            className="absolute left-3 bottom-3 inline-flex h-9 items-center gap-2 rounded-full border border-white/25 bg-black/55 pl-2.5 pr-3.5 text-[11px] font-mono uppercase tracking-[0.22em] text-white backdrop-blur transition-colors hover:bg-white hover:text-black md:left-4 md:bottom-4"
          >
            {soundOn ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M3 10v4a1 1 0 0 0 1 1h3l5 4V5L7 9H4a1 1 0 0 0-1 1Z" />
                <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7l-1.06-1.06a3 3 0 0 0 0-4.88L15.5 8.5Z" />
                <path d="M17.7 5.3a8 8 0 0 1 0 13.4l-1.05-1.06a6.5 6.5 0 0 0 0-11.28L17.7 5.3Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M3 10v4a1 1 0 0 0 1 1h3l5 4V5L7 9H4a1 1 0 0 0-1 1Z" />
                <path fillRule="evenodd" d="m14.59 9-.7.71L15.18 11l-1.3 1.29.71.71L15.88 11.7l1.3 1.3.7-.71L16.6 11l1.3-1.29-.7-.71-1.3 1.29L14.6 9Z" />
              </svg>
            )}
            {soundOn ? "Sound" : "Muted"}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/65 md:mt-4">
          <span className="truncate font-display text-base normal-case tracking-tight text-white md:text-lg">
            {clip.title}
          </span>
          <div className="flex items-center gap-3">
            <span className="tabular-nums">
              {String(playedCount).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onShuffle}
              aria-label="Next random clip"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/5 px-3.5 py-1.5 text-white/85 transition-colors hover:bg-white hover:text-black"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em]">Next</span>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
