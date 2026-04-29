export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const base  = process.env.WP_BASE_URL;
    const creds = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");

    const res = await fetch(
      `${base}/wp-json/wc/v3/products/${id}`,
      { headers: { Authorization: `Basic ${creds}` } }
    );

    if (!res.ok) return NextResponse.json({ error: "Product not found" }, { status: res.status });

    const product = await res.json();
    return NextResponse.json(product);
  } catch (e) {
    console.error("Product route error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
