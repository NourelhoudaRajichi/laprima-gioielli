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

function wcCreds() {
  return Buffer.from(
    `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
  ).toString("base64");
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await getWpUserId(authHeader);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const res = await fetch(`${process.env.WP_BASE_URL}/wp-json/wc/v3/customers/${userId}`, {
      headers: { Authorization: `Basic ${wcCreds()}` },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("WooCommerce customer error:", err);
      return NextResponse.json({ error: "Failed to fetch customer" }, { status: res.status });
    }

    const customer = await res.json();
    return NextResponse.json({
      billing: customer.billing,
      shipping: customer.shipping,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
    });
  } catch (e) {
    console.error("Customer GET error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = await getWpUserId(authHeader);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const res = await fetch(`${process.env.WP_BASE_URL}/wp-json/wc/v3/customers/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${wcCreds()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("WooCommerce customer update error:", err);
      return NextResponse.json({ error: "Failed to update customer" }, { status: res.status });
    }

    const customer = await res.json();
    return NextResponse.json({
      billing: customer.billing,
      shipping: customer.shipping,
    });
  } catch (e) {
    console.error("Customer PUT error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
