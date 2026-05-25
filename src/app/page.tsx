import { Hero } from "@/components/site/hero";
import { WorkGrid } from "@/components/site/work-grid";
import { ShowcaseWall } from "@/components/site/showcase-wall";
import { featuredWork, works } from "@/lib/works";

export default function HomePage() {
  const rest = works.filter((w) => w.slug !== featuredWork.slug);

  return (
    <>
      <Hero work={featuredWork} />
      {/* No <Reveal> wrappers on the below-the-fold sections. They were
          triggering opacity:0 → fade-in only after scroll crossed a
          threshold, which read as a black gap between the showcase wall
          and the work grid. Content now renders immediately. */}
      <ShowcaseWall />
      <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-16 md:pt-20 md:pb-24 lg:px-10">
        <WorkGrid works={rest} />
      </section>
    </>
  );
}
