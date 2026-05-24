# AI Filmmaker Portfolio

A personal portfolio for AI-generated film and motion work. Built with [Next.js 16](https://nextjs.org), React 19, and Tailwind v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

In local dev, video assets are served from `public/videos/` on disk. In production, they're served from Cloudflare R2 — see below.

## Project layout

```
src/
  app/                    # Next 16 app router pages
    page.tsx              # Home (hero + work grid + showcase)
    about/                # About page
    work/[slug]/          # Per-project detail pages
  components/site/        # Page components (hero, nav, work-card, etc.)
  lib/
    works.ts              # Source-of-truth list of works
    showcase.ts           # Source-of-truth list of showcase clips
    media.ts              # videoUrl() — resolves video paths to R2 or local
public/
  posters/                # Thumbnails (in repo, ~2 MB)
  videos/                 # Videos (NOT in repo — hosted on R2)
```

## Media hosting (Cloudflare R2)

Video files are too large to live in Git (`showreel.mp4` alone is 187 MB, the full set is ~590 MB). They're hosted on a public Cloudflare R2 bucket and the site fetches them at runtime via a single env var.

### 1. Create the R2 bucket

1. In the Cloudflare dashboard, go to **R2 → Create bucket**. Name it (e.g. `ai-filmmaker-media`), pick a region.
2. Open the bucket → **Settings → Public access** → enable **Allow Access** under the **r2.dev** subdomain. Copy the URL it gives you, something like:
   ```
   https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev
   ```

### 2. Upload the videos

The site expects R2 keys to mirror the local `public/` tree. So `public/videos/showreel.mp4` must end up at `videos/showreel.mp4` in the bucket (note the leading `videos/` prefix is part of the key).

**Option A — Cloudflare dashboard (easiest, one folder at a time):**

1. Click **Upload** in the bucket and create a folder `videos`.
2. Drag in every file from `public/videos/` (the 12 top-level mp4s).
3. Inside `videos/`, create a `showcase` folder and drag in the 10 files from `public/videos/showcase/`.

**Option B — Wrangler CLI (recursive, one command per file):**

```bash
# install once
npm i -g wrangler
wrangler login

# upload all top-level videos
for f in public/videos/*.mp4; do
  key="videos/$(basename "$f")"
  wrangler r2 object put "ai-filmmaker-media/$key" --file "$f" --remote
done

# upload showcase clips
for f in public/videos/showcase/*.mp4; do
  key="videos/showcase/$(basename "$f")"
  wrangler r2 object put "ai-filmmaker-media/$key" --file "$f" --remote
done
```

Replace `ai-filmmaker-media` with your bucket name.

**Option C — `rclone` (best for resumable, parallel uploads, recommended):**

A helper script is included at [`scripts/upload-r2.sh`](scripts/upload-r2.sh):

```bash
brew install rclone
rclone config        # add a Cloudflare R2 remote called "r2" (instructions in the script header)
BUCKET=ai-filmmaker-media ./scripts/upload-r2.sh
```

The script is non-destructive — it copies new/changed files only, and never touches the local copy.

### 3. Point the site at R2

Create `.env.local` (already gitignored) from the template:

```bash
cp .env.example .env.local
```

Set the URL you copied from step 1:

```env
NEXT_PUBLIC_MEDIA_BASE_URL=https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev
```

Restart `npm run dev`. The site should now load every video from R2 instead of disk.

> **Build-time inlining:** `NEXT_PUBLIC_*` env vars get baked into the JavaScript bundle during `next build`. When deploying to Netlify / Vercel / Cloudflare Pages, set `NEXT_PUBLIC_MEDIA_BASE_URL` in the host's environment **before** triggering the build, otherwise videos will 404 in production.

> **r2.dev caveat:** The `pub-*.r2.dev` URL is rate-limited and intended for dev/preview. For real traffic, attach a custom domain (e.g. `media.yourdomain.com`) to the bucket. The env var is the only thing that needs to change.

### File manifest

These are the 22 files the bucket needs to contain (`~590 MB` total). Anything missing will 404 on the live site.

| Bucket key                                | Size     |
| ----------------------------------------- | -------- |
| `videos/showreel.mp4`                     | 187.4 MB |
| `videos/showcase-reel.mp4`                |  63.4 MB |
| `videos/african-heat-ep1.mp4`             |  58.1 MB |
| `videos/bird-woman.mp4`                   |  45.8 MB |
| `videos/ganjahan.mp4`                     |  36.9 MB |
| `videos/falling-in-love-vampire.mp4`      |  35.4 MB |
| `videos/arrival.mp4`                      |  25.3 MB |
| `videos/hero-loop.mp4`                    |  24.5 MB |
| `videos/heist-goes-wrong.mp4`             |  13.9 MB |
| `videos/outfit-change.mp4`                |  12.8 MB |
| `videos/uppeel-spot-1.mp4`                |  11.0 MB |
| `videos/uppeel-spot-2.mp4`                |  10.1 MB |
| `videos/showcase/cyclist.mp4`             |  10.8 MB |
| `videos/showcase/parkour-2.mp4`           |   8.0 MB |
| `videos/showcase/parkour-1.mp4`           |   7.4 MB |
| `videos/showcase/fairy-puppy.mp4`         |   6.4 MB |
| `videos/showcase/young-man-mayhem.mp4`    |   6.4 MB |
| `videos/showcase/female-dancer.mp4`       |   5.6 MB |
| `videos/showcase/capybara-barista.mp4`    |   5.4 MB |
| `videos/showcase/surfer.mp4`              |   4.8 MB |
| `videos/showcase/warrior-dragon.mp4`      |   4.8 MB |
| `videos/showcase/woman-vr.mp4`            |   4.0 MB |

### How the URL resolution works

[`src/lib/media.ts`](src/lib/media.ts) exposes one function:

```ts
videoUrl("/videos/showreel.mp4")
// -> "/videos/showreel.mp4"                                  (dev, env unset)
// -> "https://pub-xxx.r2.dev/videos/showreel.mp4"            (prod, env set)
```

Every `<video src>` and showreel `<a href>` in the codebase goes through it.

## Deployment

Any static-friendly host works (Netlify, Vercel, Cloudflare Pages). Two env vars to remember:

| Var                          | Required | Notes                                                    |
| ---------------------------- | -------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | yes      | Set to your r2.dev or custom domain. Inlined at build.   |

## Scripts

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build
npm run start    # next start (production server)
```
