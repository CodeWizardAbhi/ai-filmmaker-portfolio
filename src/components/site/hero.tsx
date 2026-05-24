"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { videoUrl } from "@/lib/media";

export function Hero({ work }: { work: Work }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        v.muted = true;
        await v.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };
    void tryPlay();
  }, []);

  // Mouse-following spotlight
  useEffect(() => {
    const section = sectionRef.current;
    const spot = spotlightRef.current;
    if (!section || !spot) return;

    let rafId = 0;
    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        spot.style.setProperty("--mx", `${x}%`);
        spot.style.setProperty("--my", `${y}%`);
        spot.style.opacity = "1";
      });
    };
    const onLeave = () => {
      spot.style.opacity = "0";
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate -mt-16 h-[100svh] min-h-[640px] w-full overflow-hidden bg-black grain"
    >
      <video
        ref={videoRef}
        src={videoUrl("/videos/hero-loop.mp4")}
        poster={`/posters/${work.slug}.jpg`}
        muted
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-85"
      />

      {/* Mouse spotlight */}
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), oklch(0.78 0.16 65 / 0.18), transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Vignette layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/45 via-transparent to-black/90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pt-24 pb-14 md:pt-28 lg:px-10">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/70 md:text-[11px]">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          {work.category} · {work.year}
        </div>

        <div className="max-w-4xl">
          <h1 className="font-display text-[clamp(2.6rem,9vw,7rem)] leading-[0.92] tracking-tight text-balance text-white">
            {work.title.split("—")[0].trim()}
            {work.title.includes("—") && (
              <span className="block italic text-white/80">
                — {work.title.split("—")[1].trim()}
              </span>
            )}
          </h1>

          <p className="mt-5 max-w-md text-sm text-white/65 text-pretty md:mt-6 md:max-w-xl md:text-base">
            {work.tagline}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-8">
            <Link
              href={`/work/${work.slug}`}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <PlayIcon className="h-4 w-4" />
              Watch the reel
              <span
                aria-hidden
                className="absolute inset-0 -z-10 translate-y-full bg-[var(--accent)] transition-transform duration-500 group-hover:translate-y-0"
              />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              About
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Bottom row: play toggle (desktop) + scroll cue (desktop) — mobile gets nothing here so nothing can collide. */}
        <div className="hidden items-end justify-between md:flex">
          <button
            type="button"
            onClick={togglePlay}
            aria-pressed={playing}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition-colors hover:bg-white/15"
            aria-label={playing ? "Pause hero video" : "Play hero video"}
          >
            {playing ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </button>
          <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/45">
            <span>Scroll</span>
            <span className="h-8 w-px animate-[scrollLine_2.4s_ease-in-out_infinite] bg-gradient-to-b from-white/60 to-transparent" />
          </div>
          <span className="w-10" aria-hidden />
        </div>
      </div>
    </section>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.5v13a.5.5 0 0 0 .77.42l10-6.5a.5.5 0 0 0 0-.84l-10-6.5A.5.5 0 0 0 8 5.5Z" />
    </svg>
  );
}
function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <rect x="6.5" y="5" width="4" height="14" rx="1" />
      <rect x="13.5" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
