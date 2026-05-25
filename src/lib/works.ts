export type Orientation = "vertical" | "landscape";
export type Category =
  | "Showreel"
  | "Short Film"
  | "Vertical Drama"
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
    tagline: "Experimental stuff when I try new models.",
    description:
      "Ten one-take generative trials, sequenced into one continuous cut. New models, an old obsession with rhythm.",
    tools: ["Seedance", "Runway", "Kling", "DaVinci Resolve"],
    featured: true,
  },
  {
    slug: "mahashakti",
    title: "Mahashakti",
    category: "Short Film",
    year: 2026,
    durationSec: 451,
    orientation: "landscape",
    resolution: "1920×1080",
    tagline: "The armory speaks before the warrior does.",
    description:
      "The breath before the war — steel, gods, a body finding its weight. One performer, a thousand iterations.",
    tools: ["Runway", "Kling", "Seedance", "DaVinci Resolve"],
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
      "An arrival that didn't go the way the brochures said. Memory, dust, the ordinariness of the impossible.",
    tools: ["Runway Gen-3", "Topaz", "Resolve"],
  },
  {
    slug: "ganjahan",
    title: "GanJahan",
    category: "Short Film",
    year: 2026,
    durationSec: 137,
    orientation: "landscape",
    resolution: "1920×1080",
    tagline: "A green and gold incantation.",
    description:
      "Built around a single chant. Frames re-projected onto the track until the cut found the beat.",
    tools: ["Runway", "Suno", "Premiere"],
  },
  {
    slug: "african-heat-ep1",
    title: "African Heat — Ep. 1",
    category: "Vertical Drama",
    year: 2026,
    durationSec: 122,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "Vertical drama, equator-bright.",
    description:
      "Episode one. Heat, color, and small choices that decide who walks away.",
    tools: ["Runway", "Kling", "ElevenLabs"],
  },
  {
    slug: "falling-in-love-vampire",
    title: "Falling in Love with a Vampire",
    category: "Vertical Drama",
    year: 2026,
    durationSec: 99,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "Wrong century. Right person.",
    description:
      "A vertical romance in the language of the algorithm — pinks, blacks, a thousand-year smile.",
    tools: ["Runway", "Suno", "CapCut"],
  },
  {
    slug: "heist-goes-wrong",
    title: "The Heist Goes Wrong",
    category: "Commercial",
    year: 2026,
    durationSec: 32,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "Thirty-two seconds. One bad plan.",
    description:
      "A micro-thriller spot designed for the scroll. Three beats, one twist, no fat.",
    tools: ["Runway", "ElevenLabs"],
  },
  {
    slug: "outfit-change",
    title: "Outfit Change",
    category: "Commercial",
    year: 2026,
    durationSec: 23,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "A wardrobe in twenty-three seconds.",
    description:
      "Identity loops — each change of cloth a small reincarnation. Fashion the algorithm can't scroll past.",
    tools: ["Kling", "Magnific"],
  },
  {
    slug: "uppeel-spot-1",
    title: "Uppeel — Spot 01",
    category: "Commercial",
    year: 2026,
    durationSec: 24,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "A brand film for the thumb.",
    description:
      "Twenty-four seconds of product story, built for the feed.",
    tools: ["Runway", "Suno", "After Effects"],
  },
  {
    slug: "uppeel-spot-2",
    title: "Uppeel — Spot 02",
    category: "Commercial",
    year: 2026,
    durationSec: 24,
    orientation: "vertical",
    resolution: "1080×1920",
    tagline: "The second cut.",
    description:
      "Sibling spot to Uppeel 01 — same world, different angle, sharper hook.",
    tools: ["Runway", "Suno", "After Effects"],
  },
  {
    slug: "bird-woman",
    title: "Bird Woman",
    category: "Experimental",
    year: 2026,
    durationSec: 96,
    orientation: "landscape",
    resolution: "3840×2160",
    tagline: "A figure between feather and flesh.",
    description:
      "A study in metamorphosis. Hand-keyed motion brushed against model hallucination.",
    tools: ["Kling 1.6", "Magnific", "After Effects"],
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

/**
 * Roman-numeral display for category sections — borrowed from print editorial
 * masthead conventions. Lets the design lean on typography for visual hierarchy
 * instead of color-coded chips.
 */
export const CATEGORY_NUMERAL: Record<Category, string> = {
  Showreel: "00",
  "Short Film": "I",
  "Vertical Drama": "II",
  Commercial: "III",
  Experimental: "IV",
};

/** Short editorial blurb shown under each category section heading. */
export const CATEGORY_KICKER: Record<Category, string> = {
  Showreel: "The reel.",
  "Short Film": "Long-form, narrative cuts.",
  "Vertical Drama": "For the phone, scored for the thumb.",
  Commercial: "Spots, ads, brand films.",
  Experimental: "Latent-space studies.",
};

/** Display order for grouped sections on the Work area. */
export const CATEGORY_ORDER: Category[] = [
  "Short Film",
  "Vertical Drama",
  "Commercial",
  "Experimental",
];
