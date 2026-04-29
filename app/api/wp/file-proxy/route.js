const ALLOWED_ORIGIN = process.env.WP_BASE_URL; // e.g. https://laprimagioielli.com

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) return new Response("Missing url", { status: 400 });

  // Only proxy files from our own WordPress domain
  if (!url.startsWith(ALLOWED_ORIGIN + "/")) {
    return new Response("Forbidden", { status: 403 });
  }

  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  if (!res?.ok) return new Response("Failed to fetch file", { status: 502 });

  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "application/octet-stream";

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
