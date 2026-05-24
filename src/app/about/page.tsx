import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Abhiraj Singh — an AI filmmaker working at the seam of generative models and traditional craft.",
};

const STACK = [
  { label: "Generation", items: ["Runway Gen-3", "Kling 1.6", "Sora", "Hunyuan", "Veo 3", "Pika 2"] },
  { label: "Audio", items: ["Suno", "ElevenLabs", "Udio", "AudioGen"] },
  { label: "Finishing", items: ["DaVinci Resolve", "After Effects", "Premiere", "Topaz Video AI"] },
  { label: "Workflow", items: ["ComfyUI", "Magnific", "Krea", "Custom in-house tooling"] },
];

const SERVICES = [
  {
    title: "Brand films",
    body: "Short-form narrative built for the feed. Concept, model wrangling, edit and delivery in one pipeline.",
  },
  {
    title: "Music videos",
    body: "Sound-first generative cinema. The track sets the frame; the cut follows the beat.",
  },
  {
    title: "Series & shorts",
    body: "Episodic stories — vertical or wide — written and produced inside generative models.",
  },
  {
    title: "Pipelines & R&D",
    body: "Custom in-house pipelines for teams who want to make work, not wait for one perfect render.",
  },
];

export default function AboutPage() {
  return (
    <article className="pb-32">
      {/* Big statement */}
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-12 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Abhiraj Singh — AI Filmmaker, India
        </p>
        <h1 className="mt-6 font-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] tracking-tight text-balance">
          I make films
          <span className="italic text-muted-foreground"> that didn&rsquo;t exist </span>
          a second ago.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl">
          My practice sits at the seam of generative models and old-fashioned
          craft — frame composition, sound, rhythm, the cut. The tools are new;
          the discipline is the same one that has been there since the first
          edit suite.
        </p>
      </section>

      {/* Big quote */}
      <section className="mx-auto max-w-5xl border-y border-border bg-foreground/[0.02] px-6 py-20 lg:px-10">
        <p className="font-display text-3xl leading-tight tracking-tight text-balance md:text-5xl">
          “The model gives you a thousand frames.
          <br />
          <span className="italic text-muted-foreground">
            The filmmaker decides which three matter.”
          </span>
        </p>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="flex items-end justify-between gap-8">
          <h2 className="font-display text-3xl tracking-tight md:text-5xl">
            What I make.
          </h2>
          <p className="hidden text-sm text-muted-foreground md:block">
            Briefs, decks and weird ideas equally welcome.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-background p-8 transition-colors hover:bg-foreground/[0.03]"
            >
              <h3 className="font-display text-2xl tracking-tight md:text-3xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-md text-pretty text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool stack */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <h2 className="font-display text-3xl tracking-tight md:text-5xl">
          The stack.
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {STACK.map((g) => (
            <div key={g.label} className="border-t border-border pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {g.label}
              </p>
              <ul className="mt-4 space-y-2 text-base">
                {g.items.map((it) => (
                  <li key={it} className="text-foreground/85">
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-28 text-center lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Now booking — 2026
        </p>
        <h2 className="mt-6 font-display text-[clamp(2rem,6vw,5rem)] leading-[1.02] tracking-tight text-balance">
          Have a story
          <span className="italic text-muted-foreground"> that needs the cut?</span>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:belikeabhi99@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
          >
            Email me
            <span aria-hidden>↗</span>
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            See the work
          </Link>
        </div>
      </section>
    </article>
  );
}
