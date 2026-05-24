#!/usr/bin/env bash
set -euo pipefail

SRC="/Users/abhirajsingh/WORK Machine/Data/My Gens/Media"
OUT_VID="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
OUT_POS="$(cd "$(dirname "$0")/.." && pwd)/public/posters"
LOG="$(cd "$(dirname "$0")/.." && pwd)/scripts/compress.log"

mkdir -p "$OUT_VID" "$OUT_POS"
: > "$LOG"

# slug | source filename | poster timestamp (seconds)
ENTRIES=(
  "showreel|MS_Final 2K_14 05 26_Ver 02.mp4|30"
  "arrival|Arrival D2.mp4|10"
  "bird-woman|Bird Woman Seq may 13 v2f.mov|8"
  "ganjahan|GanJahan.mp4|15"
  "african-heat-ep1|African Heat EP1 V3.mp4|8"
  "falling-in-love-vampire|Falling in Love with Vampire V4.mp4|6"
  "heist-goes-wrong|Heist Goes Wrong.mp4|3"
  "outfit-change|Outfit Change.mp4|2"
  "uppeel-spot-1|Uppeel AD 1 Final.mp4|2"
  "uppeel-spot-2|Uppeel AD 2_8.mp4|2"
)

encode_landscape () {
  local in="$1" out="$2"
  ffmpeg -y -i "$in" \
    -vf "scale='min(1920,iw)':'-2'" \
    -c:v libx264 -preset fast -crf 24 -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart \
    "$out" >>"$LOG" 2>&1
}

encode_vertical () {
  local in="$1" out="$2"
  ffmpeg -y -i "$in" \
    -vf "scale='-2':'min(1920,ih)'" \
    -c:v libx264 -preset fast -crf 24 -profile:v high -pix_fmt yuv420p \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart \
    "$out" >>"$LOG" 2>&1
}

extract_poster () {
  local in="$1" out="$2" ts="$3"
  ffmpeg -y -ss "$ts" -i "$in" -frames:v 1 -q:v 3 "$out" >>"$LOG" 2>&1
}

is_vertical () {
  local in="$1"
  local w h
  w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$in")
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$in")
  [ "$h" -gt "$w" ]
}

for entry in "${ENTRIES[@]}"; do
  IFS='|' read -r slug fname ts <<<"$entry"
  src_path="$SRC/$fname"
  out_mp4="$OUT_VID/$slug.mp4"
  out_jpg="$OUT_POS/$slug.jpg"

  if [ ! -f "$src_path" ]; then
    echo "[skip] missing: $src_path" | tee -a "$LOG"
    continue
  fi

  echo "[encode] $slug" | tee -a "$LOG"
  if is_vertical "$src_path"; then
    encode_vertical "$src_path" "$out_mp4"
  else
    encode_landscape "$src_path" "$out_mp4"
  fi
  echo "[poster] $slug @${ts}s" | tee -a "$LOG"
  extract_poster "$src_path" "$out_jpg" "$ts"
  echo "[done]   $slug -> $(du -h "$out_mp4" | awk '{print $1}')" | tee -a "$LOG"
done

echo "[ALL DONE]" | tee -a "$LOG"
