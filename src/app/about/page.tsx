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

export default function AboutPage() {
  return (
    <article className="pb-24 md:pb-32">
      {/* Big statement — phrase split into two sizes so 'Making films'
          reads as the headline and the rest sits underneath like a
          spoken continuation, not a second headline. */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-10 md:pt-32 md:pb-12 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:text-xs">
          Abhiraj Singh — AI Filmmaker
        </p>
        <h1 className="mt-5 font-display tracking-tight text-balance md:mt-6">
          <span className="block text-[clamp(2.4rem,9vw,6.5rem)] leading-[0.95]">
            Making films
          </span>
          <span className="mt-3 block text-[clamp(1.1rem,3vw,2rem)] italic leading-snug text-muted-foreground md:mt-4">
            is something I&rsquo;m always excited about.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground text-pretty md:mt-10 md:text-lg">
          New tools. Old discipline.
        </p>
      </section>

      {/* Tool stack */}
      <section className="mx-auto max-w-7xl border-t border-border px-6 py-12 md:py-16 lg:px-10">
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
