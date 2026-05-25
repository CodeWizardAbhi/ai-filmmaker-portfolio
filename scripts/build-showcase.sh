#!/usr/bin/env bash
set -euo pipefail

SRC="/Users/abhirajsingh/WORK Machine/Data/My Gens/Seedance trial works"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_VID="$ROOT/public/videos/showcase"
OUT_POS="$ROOT/public/posters/showcase"
OUT_REEL="$ROOT/public/videos"
LOG="$ROOT/scripts/showcase.log"
TMP="$(mktemp -d -t seedance.XXXXXX)"

mkdir -p "$OUT_VID" "$OUT_POS"
: > "$LOG"

# slug | source filename | poster timestamp (sec) | tagline
ENTRIES=(
  "capybara-barista|Capybara Barista (2).mp4|2|A capybara, a calling, an espresso machine."
  "cyclist|Cyclist downhill run (1).mp4|4|Gravity's preferred camera angle."
  "fairy-puppy|Fairy Puppy Nose (1).mp4|3|Dust, light, and a small wet nose."
  "female-dancer|Female dancer (1).mp4|3|Body as choreography, choreography as render."
  "parkour-1|Parkour Cityscape (2).mp4|4|Concrete is just suggestion."
  "parkour-2|Parkour Cityscape (3).mp4|4|Concrete is suggestion, cont'd."
  "surfer|Surfer in Barrel (1).mp4|2|Inside the green room."
  "warrior-dragon|Warrior Dragon (1).mp4|2|Mythic, in real time."
  "woman-vr|Woman VR (1).mp4|3|First contact with her own avatar."
  "young-man-mayhem|Young Man Mayhem (2).mp4|3|Twenty-three frames per scream."
)

echo "[1/3] Compressing individual clips" | tee -a "$LOG"

# Pass 1: normalize each clip to a uniform encoding (1280x720, 24fps, yuv420p,
# silent) so we can concat losslessly later, and produce a poster.
for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r slug fname ts _ <<<"$entry"
  src_path="$SRC/$fname"
  out_mp4="$OUT_VID/$slug.mp4"
  out_jpg="$OUT_POS/$slug.jpg"
  norm_path="$TMP/$slug.mp4"

  if [ ! -f "$src_path" ]; then
    echo "[skip] missing: $src_path" | tee -a "$LOG"
    continue
  fi

  echo "  - $slug" | tee -a "$LOG"

  # Normalized version (uniform encode + AAC audio) — also used for web
  # playback in the lightbox. Audio is kept (44.1 → 48k AAC stereo) so
  # the showcase clips and the concatenated showcase-reel have sound.
  ffmpeg -y -i "$src_path" \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=black,fps=24,format=yuv420p" \
    -c:v libx264 -preset fast -crf 22 -profile:v high \
    -c:a aac -b:a 128k -ar 48000 -ac 2 \
    -movflags +faststart \
    "$norm_path" >>"$LOG" 2>&1

  cp "$norm_path" "$out_mp4"

  ffmpeg -y -ss "$ts" -i "$src_path" -frames:v 1 -q:v 3 "$out_jpg" >>"$LOG" 2>&1
done

echo "[2/3] Building 60s hero highlight (6s × 10)" | tee -a "$LOG"

# Build a concat list with trimmed 6-second windows from each normalized clip.
HIGHLIGHT_LIST="$TMP/highlight.txt"
: > "$HIGHLIGHT_LIST"
for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r slug _ _ _ <<<"$entry"
  norm_path="$TMP/$slug.mp4"
  trimmed="$TMP/${slug}.trim.mp4"
  ffmpeg -y -ss 2 -t 6 -i "$norm_path" \
    -c:v libx264 -preset fast -crf 22 -an -movflags +faststart "$trimmed" >>"$LOG" 2>&1
  echo "file '$trimmed'" >> "$HIGHLIGHT_LIST"
done

ffmpeg -y -f concat -safe 0 -i "$HIGHLIGHT_LIST" \
  -c copy "$OUT_REEL/hero-loop.mp4" >>"$LOG" 2>&1

echo "[3/3] Building full ~2:30 showcase reel" | tee -a "$LOG"

REEL_LIST="$TMP/reel.txt"
: > "$REEL_LIST"
for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r slug _ _ _ <<<"$entry"
  echo "file '$TMP/$slug.mp4'" >> "$REEL_LIST"
done

ffmpeg -y -f concat -safe 0 -i "$REEL_LIST" \
  -c copy "$OUT_REEL/showcase-reel.mp4" >>"$LOG" 2>&1

# Poster for the showcase reel (first clip @ 3s)
ffmpeg -y -ss 3 -i "$TMP/capybara-barista.mp4" -frames:v 1 -q:v 3 "$ROOT/public/posters/showcase-reel.jpg" >>"$LOG" 2>&1

echo "[DONE]" | tee -a "$LOG"
echo "  hero-loop.mp4      $(du -h "$OUT_REEL/hero-loop.mp4" | awk '{print $1}')" | tee -a "$LOG"
echo "  showcase-reel.mp4  $(du -h "$OUT_REEL/showcase-reel.mp4" | awk '{print $1}')" | tee -a "$LOG"

rm -rf "$TMP"
