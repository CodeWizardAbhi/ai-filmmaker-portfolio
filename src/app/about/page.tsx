import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Abhiraj Singh — an AI filmmaker working at the seam of generative models and traditional craft.",
};

const STACK = [
  {
    label: "Generation",
    items: [
      "Seedance 2.0",
      "Kling O3 / V3",
      "Recraft V4",
      "GPT Image 2",
      "Nano Banana Pro / 2",
    ],
  },
  {
    label: "Gen Tools",
    items: ["Morphic AI", "Higgsfield AI", "Lumalabs", "Google Flow"],
  },
  {
    label: "Tools",
    items: ["DaVinci Resolve Studio", "Milanote", "Pr / AE", "Topaz", "Claude"],
  },
  {
    label: "Iterate",
    items: [
      "Claude Code",
      "Cursor",
      "Antigravity",
      "ComfyUI (learning)",
      "Agentic workflows (experimental)",
    ],
  },
];

const SERVICES = [
  {
    title: "Short films",
    body: "Long-form generative narrative, edited like it matters.",
  },
  {
    title: "Vertical drama",
    body: "Built for the phone — episodic, addictive, end-to-end.",
  },
  {
    title: "Commercials",
    body: "Spots that live in the feed and still feel like cinema.",
  },
  {
    title: "Pipelines & R&D",
    body: "In-house tooling for teams who'd rather make work than wait for renders.",
  },
];

export default function AboutPage() {
  return (
    <article className="pb-24 md:pb-32">
      {/* Big statement */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-10 md:pt-32 md:pb-12 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
          Abhiraj Singh — AI Filmmaker
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.2rem,8vw,6rem)] leading-[0.95] tracking-tight text-balance md:mt-6">
          I make films
          <span className="italic text-muted-foreground"> that didn&rsquo;t exist </span>
          a second ago.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground text-pretty md:mt-8 md:text-lg">
          New tools. Old discipline.
        </p>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl border-t border-border px-6 py-16 md:py-24 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl tracking-tight md:text-5xl">
            What I make.
          </h2>
          <p className="hidden text-sm text-muted-foreground md:block">
            Briefs and weird ideas welcome.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-border md:mt-12 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-background p-6 transition-colors hover:bg-foreground/[0.03] md:p-8"
            >
              <h3 className="font-display text-xl tracking-tight md:text-3xl">
                {s.title}
              </h3>
              <p className="mt-2 max-w-md text-sm text-pretty text-muted-foreground md:mt-3 md:text-base">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool stack */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-10">
        <h2 className="font-display text-3xl tracking-tight md:text-5xl">
          The stack.
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-12 md:gap-12 lg:grid-cols-4">
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

    </article>
  );
}
