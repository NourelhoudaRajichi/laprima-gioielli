export const runtime = "nodejs";

import { NextResponse } from "next/server";

async function getWpUserId(authHeader) {
  const res = await fetch(`${process.env.WP_BASE_URL}/wp-json/wp/v2/users/me`, {
    headers: { Authorization: authHeader },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.id ?? null;
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await getWpUserId(authHeader);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const creds = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");

    const res = await fetch(
      `${process.env.WP_BASE_URL}/wp-json/wc/v3/orders?customer=${userId}&per_page=20&orderby=date&order=desc`,
      { headers: { Authorization: `Basic ${creds}` } }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("WooCommerce orders error:", err);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: res.status });
    }

    const orders = await res.json();
    return NextResponse.json(orders);
  } catch (e) {
    console.error("Orders route error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
