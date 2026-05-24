/**
 * Resolves a video asset path to its final URL.
 *
 * When `NEXT_PUBLIC_MEDIA_BASE_URL` is set (e.g. a Cloudflare R2
 * `pub-*.r2.dev` URL or a custom domain), the given path is appended
 * to that base. Otherwise the path is returned unchanged so local dev
 * keeps working against files in `public/videos/`.
 *
 * The bucket layout is expected to mirror the local tree, so calls
 * use the same leading `/videos/...` path in both modes.
 */
export function videoUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
