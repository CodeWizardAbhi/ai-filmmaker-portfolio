import { Hero } from "@/components/site/hero";
import { WorkGrid } from "@/components/site/work-grid";
import { ShowcaseWall } from "@/components/site/showcase-wall";
import { Reveal } from "@/components/site/reveal";
import { featuredWork, works } from "@/lib/works";

export default function HomePage() {
  const rest = works.filter((w) => w.slug !== featuredWork.slug);

  return (
    <>
      <Hero work={featuredWork} />

      <Reveal>
        <ShowcaseWall />
      </Reveal>

      <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-16 md:pt-20 md:pb-24 lg:px-10">
        <Reveal delay={120}>
          <WorkGrid works={rest} />
        </Reveal>
      </section>
    </>
  );
}
