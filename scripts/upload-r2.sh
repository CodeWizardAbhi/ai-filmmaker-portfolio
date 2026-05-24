#!/usr/bin/env bash
# Upload public/videos/ to a Cloudflare R2 bucket using rclone.
#
# Prereqs (one-time):
#   1. Create the bucket in the Cloudflare dashboard (R2 → Create bucket).
#   2. Cloudflare dashboard → R2 → Manage R2 API Tokens → Create API token
#      with Object Read & Write. Note the Access Key ID + Secret Access Key
#      and your account ID.
#   3. Run `rclone config` and add a new remote of type `s3`, provider `Cloudflare`:
#        - name: r2
#        - access_key_id: <your key>
#        - secret_access_key: <your secret>
#        - endpoint: https://<account-id>.r2.cloudflarestorage.com
#      Accept defaults for the rest.
#
# Usage:
#   BUCKET=ai-filmmaker-media ./scripts/upload-r2.sh
#
# Optional env:
#   REMOTE=r2                # rclone remote name (default: r2)
#   BUCKET=ai-filmmaker-media # required: target bucket name
#   SRC=public/videos        # source dir (default: public/videos)
#   DEST_PREFIX=videos       # bucket key prefix (default: videos)
#   TRANSFERS=4              # parallel uploads (default: 4)
#
# The script never deletes anything locally or remotely; it only copies new
# or changed objects (rclone `copy`, not `sync`).

set -euo pipefail

REMOTE="${REMOTE:-r2}"
BUCKET="${BUCKET:-}"
SRC="${SRC:-public/videos}"
DEST_PREFIX="${DEST_PREFIX:-videos}"
TRANSFERS="${TRANSFERS:-4}"

if [[ -z "$BUCKET" ]]; then
  echo "error: set BUCKET=<your-r2-bucket-name>" >&2
  echo "  example: BUCKET=ai-filmmaker-media $0" >&2
  exit 1
fi

if ! command -v rclone >/dev/null 2>&1; then
  echo "error: rclone not installed. brew install rclone" >&2
  exit 1
fi

if ! rclone listremotes 2>/dev/null | grep -q "^${REMOTE}:$"; then
  echo "error: rclone remote '${REMOTE}:' not configured. run 'rclone config'." >&2
  exit 1
fi

if [[ ! -d "$SRC" ]]; then
  echo "error: source dir '$SRC' not found (run from repo root)" >&2
  exit 1
fi

DEST="${REMOTE}:${BUCKET}/${DEST_PREFIX}"

echo "Uploading $SRC -> $DEST"
echo "  (rclone copy is non-destructive; local files are untouched)"
echo

rclone copy "$SRC" "$DEST" \
  --progress \
  --transfers "$TRANSFERS" \
  --checksum

echo
echo "Done. Verify with:"
echo "  rclone ls $DEST"
