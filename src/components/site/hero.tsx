"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Work } from "@/lib/works";
import { formatDuration } from "@/lib/works";
import { videoUrl } from "@/lib/media";

const ROTATING_LINES = [
  "Generative cinema.",
  "Models render. The cut decides.",
  "Latent space, sharpened.",
];

export function Hero({ work }: { work: Work }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

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

  // Rotate tagline every 3.4s
  useEffect(() => {
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % ROTATING_LINES.length);
    }, 3400);
    return () => window.clearInterval(id);
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

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pt-28 pb-12 lg:px-10">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/70">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          Now playing · {work.category}
        </div>

        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">
            Featured / {work.year}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.6rem,8vw,7rem)] leading-[0.92] tracking-tight text-balance text-white">
            {work.title.split("—")[0].trim()}
            {work.title.includes("—") && (
              <span className="block italic text-white/80">
                — {work.title.split("—")[1].trim()}
              </span>
            )}
          </h1>

          {/* Cycling tagline — single line, no static duplicate below */}
          <div className="relative mt-6 h-7 max-w-xl overflow-hidden md:h-8">
            {ROTATING_LINES.map((t, i) => (
              <span
                key={t}
                className="absolute inset-0 text-base text-white/80 transition-all duration-700 md:text-lg"
                style={{
                  opacity: i === lineIndex ? 1 : 0,
                  transform:
                    i === lineIndex
                      ? "translateY(0)"
                      : i === (lineIndex - 1 + ROTATING_LINES.length) %
                            ROTATING_LINES.length
                        ? "translateY(-100%)"
                        : "translateY(100%)",
                }}
                aria-hidden={i !== lineIndex}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
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
              About the work
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className="hidden gap-2 sm:flex">
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
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 backdrop-blur">
              Showcase loop · 60s
            </span>
          </div>

          <div className="ml-auto flex items-end gap-6 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
            <div>
              <p className="text-white/45">Runtime</p>
              <p className="text-white">{formatDuration(work.durationSec)}</p>
            </div>
            <div>
              <p className="text-white/45">Resolution</p>
              <p className="text-white">{work.resolution}</p>
            </div>
            <div className="hidden md:block">
              <p className="text-white/45">Tooling</p>
              <p className="text-white">{work.tools.join(" · ")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center">
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span>Scroll</span>
          <span className="h-8 w-px animate-[scrollLine_2.4s_ease-in-out_infinite] bg-gradient-to-b from-white/60 to-transparent" />
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
