export type Orientation = "vertical" | "landscape";
export type Category =
  | "Showreel"
  | "Short Film"
  | "Series"
  | "Music Video"
  | "Commercial"
  | "Experimental";

export type Work = {
  slug: string;
  title: string;
  category: Category;
  year: number;
  durationSec: number;
  orientation: Orientation;
  resolution: string;
  tagline: string;
  description: string;
  tools: string[];
  featured?: boolean;
};

export const works: Work[] = [
  {
    slug: "showcase-reel",
    title: "Reel — 2026",
    category: "Showreel",
    year: 2026,
    durationSec: 150,
    orientation: "landscape",
    resolution: "1280×720",
    tagline: "Two and a half minutes of AI cinema.",
    description:
      "A condensed look at this year's generative work — animals, athletes, fantasy, VR. Ten trials rendered in single takes and sequenced into one continuous cut. Built with generative video models, in-house pipelines, and an old-fashioned obsession with rhythm.",
    tools: ["Seedance", "Runway", "Kling", "DaVinci Resolve"],
    featured: true,
  },
  {
    slug: "arrival",
    title: "Arrival — Day Two",
    category: "Short Film",
    year: 2025,
    durationSec: 115,
    orientation: "landscape",
    resolution: "3840×2160",
    tagline: "A first contact, the morning after.",
    description:
      "Day two of an arrival that didn't go the way the brochures said it would. A short on memory, dust, and the strange ordinariness of the impossible.",
    tools: ["Runway Gen-3", "Topaz", "Resolve"],
  },
  {
    slug: "bird-woman",
    title: "Bird Woman",
    category: "Experimental",
    year: 2025,
    durationSec: 96,
    orientation: "landscape",
    resolution: "3840×2160",
    tagline: "A figure between feather and flesh.",
    description:
      "A sequence study exploring metamorphosis in latent space. Hand-keyed motion brushed against model hallucination.",
    tools: ["Kling 1.6", "Magnific", "After Effects"],
  },
  {
    slug: "ganjahan",
    title: "GanJahan",
    category: "Music Video",
    year: 2025,
    durationSec: 137,
    orientation: "landscape",
    resolution: "1920×1080",
    tagline: "A green and gold incantation.",
    description:
      "Music video built around a single chant. Frames generated, treated, then re-projected onto the soundtrack until the cut could feel the beat.",
    tools: ["Runway", "Suno", "Premiere"],
  },
  {
    slug: "african-heat-ep1",
    title: "African Heat — Ep. 1",
    category: "Series",
    year: 2025,
    durationSec: 122,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "Vertical drama, equator-bright.",
    description:
      "Episode one of a vertical series built for the feed. Heat, color, and small choices that decide who walks away.",
    tools: ["Runway", "Kling", "ElevenLabs"],
  },
  {
    slug: "falling-in-love-vampire",
    title: "Falling in Love with a Vampire",
    category: "Short Film",
    year: 2025,
    durationSec: 99,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "Wrong century. Right person.",
    description:
      "A vertical romance shot in the language of the algorithm — pinks, blacks, a thousand-year smile.",
    tools: ["Runway", "Suno", "CapCut"],
  },
  {
    slug: "heist-goes-wrong",
    title: "The Heist Goes Wrong",
    category: "Short Film",
    year: 2025,
    durationSec: 32,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "Thirty-two seconds. One bad plan.",
    description:
      "A micro-thriller designed for the scroll. Three beats, one twist, no fat.",
    tools: ["Runway", "ElevenLabs"],
  },
  {
    slug: "outfit-change",
    title: "Outfit Change",
    category: "Experimental",
    year: 2025,
    durationSec: 23,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "A wardrobe in twenty-three seconds.",
    description:
      "An exercise in identity loops. Each change of cloth a small reincarnation.",
    tools: ["Kling", "Magnific"],
  },
  {
    slug: "uppeel-spot-1",
    title: "Uppeel — Spot 01",
    category: "Commercial",
    year: 2025,
    durationSec: 24,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "A brand film for the thumb.",
    description:
      "Twenty-four seconds of product story, built to live inside a feed and still feel like cinema.",
    tools: ["Runway", "Suno", "After Effects"],
  },
  {
    slug: "uppeel-spot-2",
    title: "Uppeel — Spot 02",
    category: "Commercial",
    year: 2025,
    durationSec: 24,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "The second cut.",
    description:
      "Sibling spot to Uppeel 01 — same world, different angle, sharper hook.",
    tools: ["Runway", "Suno", "After Effects"],
  },
];

export function getWork(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export const featuredWork = works.find((w) => w.featured) ?? works[0];

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
