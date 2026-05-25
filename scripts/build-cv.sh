#!/usr/bin/env bash
# Render cv/Abhiraj_Singh_CV.html → cv/Abhiraj_Singh_CV.pdf
# Uses the system Google Chrome in headless mode. No extra deps.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTML="$ROOT/cv/Abhiraj_Singh_CV.html"
PDF="$ROOT/cv/Abhiraj_Singh_CV.pdf"

# Resolve Chrome
CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for cand in \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
    "$(command -v google-chrome 2>/dev/null || true)" \
    "$(command -v chromium 2>/dev/null || true)"; do
    if [ -n "$cand" ] && [ -x "$cand" ]; then
      CHROME="$cand"
      break
    fi
  done
fi

if [ -z "$CHROME" ] || [ ! -x "$CHROME" ]; then
  echo "✗ Chrome / Chromium not found." >&2
  echo "  Install Google Chrome or set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi

if [ ! -f "$HTML" ]; then
  echo "✗ Source not found: $HTML" >&2
  exit 1
fi

echo "→ Rendering CV with: $CHROME"
echo "  source: $HTML"
echo "  output: $PDF"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf-no-header \
  --virtual-time-budget=10000 \
  --print-to-pdf="$PDF" \
  "file://$HTML" 2>/dev/null

if [ -f "$PDF" ]; then
  size=$(stat -f%z "$PDF" 2>/dev/null || stat -c%s "$PDF")
  echo "✓ PDF ready ($size bytes)"
else
  echo "✗ PDF was not produced." >&2
  exit 1
fi
