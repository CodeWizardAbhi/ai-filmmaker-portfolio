import { Hero } from "@/components/site/hero";
import { WorkGrid } from "@/components/site/work-grid";
import { ShowcaseWall } from "@/components/site/showcase-wall";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";
import { featuredWork, works } from "@/lib/works";
import Link from "next/link";

export default function HomePage() {
  const rest = works.filter((w) => w.slug !== featuredWork.slug);

  return (
    <>
      <Hero work={featuredWork} />

      {/* Kinetic marquee */}
      <section
        aria-hidden
        className="border-y border-border bg-background py-6 overflow-hidden"
      >
        <div className="flex animate-[marquee_38s_linear_infinite] whitespace-nowrap gap-12 font-display text-xl tracking-tight text-muted-foreground md:text-3xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <Marquee key={i} />
          ))}
        </div>
      </section>

      {/* Showcase wall — Seedance trials */}
      <Reveal>
        <ShowcaseWall />
      </Reveal>

      {/* Section heading */}
      <section className="mx-auto w-full max-w-7xl px-6 pt-16 md:pt-24 lg:px-10">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
                Selected Work
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,7vw,4rem)] leading-[1.02] tracking-tight text-balance">
                Cinema, generated.
                <br />
                <span className="italic text-muted-foreground">
                  Edited like it&rsquo;s sacred.
                </span>
              </h2>
            </div>
            <Link
              href="/about"
              className="hidden whitespace-nowrap text-sm text-muted-foreground hover:text-foreground md:inline"
            >
              About →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Work grid with filter */}
      <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-10">
        <Reveal delay={120}>
          <WorkGrid works={rest} />
        </Reveal>
      </section>

      {/* Stats / claims */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-4 md:gap-12">
            <Stat
              n={<Counter to={20} />}
              label="Pieces shipped"
              sub="Shorts, drama, commercials, trials."
            />
            <Stat
              n={<Counter to={8} suffix="+" />}
              label="Generative models"
              sub="Seedance · Kling · Runway · Recraft · Nano Banana."
            />
            <Stat
              n={<Counter to={150} suffix="s" />}
              label="In the showcase reel"
              sub="Ten trials, one continuous cut."
            />
            <Stat n="∞" label="Iterations / sec" sub="Render. Watch. Cut. Repeat." />
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Marquee() {
  const items = [
    "Generative cinema",
    "Vertical drama",
    "Short films",
    "Commercials",
    "Latent space, sharpened",
    "Edited frame by frame",
  ];
  return (
    <>
      {items.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-12">
          <span>{t}</span>
          <span aria-hidden className="text-[var(--accent)]">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

function Stat({
  n,
  label,
  sub,
}: {
  n: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="border-t border-border pt-6">
      <p className="font-display text-6xl leading-none tracking-tight md:text-7xl">
        {n}
      </p>
      <p className="mt-4 text-sm font-medium tracking-wide text-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">{sub}</p>
    </div>
  );
}
