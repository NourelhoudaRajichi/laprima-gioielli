const WP_BASE = process.env.WP_BASE_URL;

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);

  // Validate JWT
  const meRes = await fetch(`${WP_BASE}/wp-json/wp/v2/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!meRes?.ok) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }

  const me = await meRes.json();

  // Get roles — try edit context (admins), then custom endpoint, then allow any valid user
  let roles = [];
  const editRes = await fetch(`${WP_BASE}/wp-json/wp/v2/users/me?context=edit`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (editRes?.ok) {
    roles = (await editRes.json()).roles ?? [];
  } else {
    const roleRes = await fetch(`${WP_BASE}/wp-json/lpg/v1/my-role`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
    if (roleRes?.ok) roles = (await roleRes.json()).roles ?? [];
  }

  // Enforce role check only if we actually got roles back
  if (roles.length > 0) {
    const lc = roles.map((r) => r.toLowerCase());
    if (!lc.some((r) => r.includes("private")) && !lc.includes("administrator") && !lc.includes("editor")) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // ── Try WP File Download folders (public endpoint, no auth needed) ─────────
  const wfuRes = await fetch(`${WP_BASE}/wp-json/lpg/v1/marketing-files`, {
    cache: "no-store",
  }).catch((e) => { console.error("marketing-files fetch error:", e); return null; });

  if (wfuRes?.ok) {
    const { folders } = await wfuRes.json();
    return Response.json({
      user: { name: me.name, email: me.email, roles },
      folders: Array.isArray(folders) ? folders : [],
      media: [], // not used when folders are available
    });
  }

  // ── Fallback: WP standard media library ───────────────────────────────────
  const mediaRes = await fetch(
    `${WP_BASE}/wp-json/wp/v2/media?per_page=100&orderby=date&order=desc`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  ).catch(() => null);

  const media = mediaRes?.ok ? await mediaRes.json() : [];

  return Response.json({
    user: { name: me.name, email: me.email, roles },
    folders: null, // signal to use MIME-type grouping
    media: Array.isArray(media) ? media : [],
  });
}
