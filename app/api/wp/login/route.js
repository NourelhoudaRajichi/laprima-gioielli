const WP_BASE = process.env.WP_BASE_URL;

export async function POST(request) {
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) {
    return Response.json({ error: "Missing credentials" }, { status: 400 });
  }

  const res = await fetch(`${WP_BASE}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  }).catch(() => null);

  if (!res?.ok) {
    const err = await res?.json().catch(() => ({}));
    const msg = err?.message?.replace(/<[^>]*>/g, "").trim() || "Invalid credentials";
    return Response.json({ error: msg }, { status: 401 });
  }

  const data = await res.json();
  return Response.json({ token: data.token });
}
