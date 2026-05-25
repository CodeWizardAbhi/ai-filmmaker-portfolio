import { getWork, works, formatDuration } from "@/lib/works";
import { videoUrl } from "@/lib/media";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) return { title: "Not found" };
  return {
    title: work.title,
    description: work.tagline,
    openGraph: {
      title: work.title,
      description: work.tagline,
      images: [{ url: `/posters/${work.slug}.jpg` }],
    },
  };
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const i = works.findIndex((w) => w.slug === work.slug);
  const next = works[(i + 1) % works.length];
  const prev = works[(i - 1 + works.length) % works.length];

  return (
    <article className="pb-24 md:pb-32">
      {/* Tight title block — single compact strip so the video lands
          inside the viewport on page load instead of forcing a scroll. */}
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-4 md:pt-24 md:pb-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground md:text-[11px]">
          <Link href="/" className="hover:text-foreground">
            Work
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate">{work.category}</span>
        </div>
        <div className="mt-3 flex flex-col gap-2 md:mt-4 md:flex-row md:items-end md:justify-between md:gap-8">
          <h1 className="font-display text-[clamp(1.9rem,5vw,3.4rem)] leading-[0.98] tracking-tight text-balance">
            {work.title}
          </h1>
          <p className="max-w-md text-sm italic text-muted-foreground text-pretty md:text-base md:text-right">
            {work.tagline}
          </p>
        </div>
      </header>

      {/* Player — capped at ~72svh so it fits the viewport on any common
          screen without scrolling. Container width derives from min of
          (parent width, height-derived width) so aspect ratio is honored
          but height never overshoots. */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          style={{
            width:
              work.orientation === "vertical"
                ? "min(100%, 420px, calc(72svh * 9 / 16))"
                : "min(100%, calc(72svh * 16 / 9))",
          }}
          className={`relative mx-auto overflow-hidden rounded-2xl bg-black ring-1 ring-white/5 ${
            work.orientation === "vertical"
              ? "aspect-[9/16]"
              : "aspect-video"
          }`}
        >
          <video
            src={videoUrl(`/videos/${work.slug}.mp4`)}
            poster={`/posters/${work.slug}.jpg`}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Meta strip */}
      <section className="mx-auto mt-10 max-w-7xl px-6 md:mt-14 lg:px-10">
        <div className="grid grid-cols-2 gap-5 border-t border-border pt-5 md:grid-cols-4 md:gap-6 md:pt-6">
          <Meta label="Year" value={String(work.year)} />
          <Meta label="Runtime" value={formatDuration(work.durationSec)} />
          <Meta label="Resolution" value={work.resolution} />
          <Meta
            label="Format"
            value={work.orientation === "vertical" ? "9:16" : "16:9"}
          />
        </div>
      </section>

      {/* Description + tools */}
      <section className="mx-auto mt-12 grid max-w-7xl gap-10 px-6 md:mt-16 md:gap-12 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
            Notes from the cut
          </p>
          <p className="mt-4 max-w-2xl text-balance text-lg leading-relaxed text-foreground md:mt-5 md:text-2xl md:leading-relaxed lg:text-3xl">
            {work.description}
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
            Tooling
          </p>
          <ul className="mt-4 flex flex-wrap gap-2 md:mt-5">
            {work.tools.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-foreground/5 px-3 py-1.5 text-xs font-medium tracking-wide text-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Prev / Next */}
      <nav
        aria-label="More work"
        className="mx-auto mt-20 grid max-w-7xl gap-3 border-t border-border px-6 pt-10 md:mt-28 md:gap-4 md:pt-12 md:grid-cols-2 lg:px-10"
      >
        <Link
          href={`/work/${prev.slug}`}
          className="group flex flex-col gap-2 rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:bg-card md:flex-row md:items-center md:gap-6 md:p-6"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
            ← Previous
          </span>
          <span className="font-display text-xl tracking-tight text-foreground md:text-2xl">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col gap-2 rounded-2xl border border-border bg-card/50 p-5 text-right transition-colors hover:bg-card md:flex-row md:items-center md:justify-end md:gap-6 md:p-6"
        >
          <span className="font-display text-xl tracking-tight text-foreground md:text-2xl">
            {next.title}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
            Next →
          </span>
        </Link>
      </nav>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-xl tracking-tight text-foreground md:text-2xl">
        {value}
      </p>
    </div>
  );
}
