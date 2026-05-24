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
    <article className="pb-32">
      {/* Title block */}
      <header className="mx-auto max-w-7xl px-6 pt-28 pb-10 lg:px-10">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Work
          </Link>
          <span aria-hidden>/</span>
          <span>{work.category}</span>
        </div>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] tracking-tight text-balance">
          {work.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
          {work.tagline}
        </p>
      </header>

      {/* Player */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div
          className={`relative mx-auto overflow-hidden rounded-2xl bg-black ring-1 ring-white/5 ${
            work.orientation === "vertical"
              ? "aspect-[9/16] max-w-[420px]"
              : "aspect-video w-full"
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
      <section className="mx-auto mt-14 max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-6 border-t border-border pt-6 md:grid-cols-4">
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
      <section className="mx-auto mt-16 grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Notes from the cut
          </p>
          <p className="mt-5 max-w-2xl text-balance text-2xl leading-relaxed text-foreground md:text-3xl">
            {work.description}
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Tooling
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
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
        className="mx-auto mt-28 grid max-w-7xl gap-4 border-t border-border px-6 pt-12 md:grid-cols-2 lg:px-10"
      >
        <Link
          href={`/work/${prev.slug}`}
          className="group flex flex-col gap-2 rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:bg-card md:flex-row md:items-center md:gap-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            ← Previous
          </span>
          <span className="font-display text-2xl tracking-tight text-foreground">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="group flex flex-col gap-2 rounded-2xl border border-border bg-card/50 p-6 text-right transition-colors hover:bg-card md:flex-row md:items-center md:justify-end md:gap-6"
        >
          <span className="font-display text-2xl tracking-tight text-foreground">
            {next.title}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
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
