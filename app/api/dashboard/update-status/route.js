import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Statuses that send a customer notification email
const EMAIL_STATUSES = new Set(["processing", "on-hold", "completed", "cancelled", "refunded"]);

export async function POST(request) {
  const cookieStore = await cookies();
  if (cookieStore.get("dashboard_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, status } = await request.json();
  const validStatuses = ["pending", "processing", "on-hold", "completed", "cancelled", "refunded"];
  if (!orderId || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const base    = process.env.WP_BASE_URL;
  const creds   = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}`, "Content-Type": "application/json" };

  // Update status in WooCommerce
  const res = await fetch(`${base}/wp-json/wc/v3/orders/${orderId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const updated = await res.json();

  // Send customer status email (fire-and-forget — don't block the dashboard response)
  if (EMAIL_STATUSES.has(status) && updated.billing?.email) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://laprimagioielli.com";
    fetch(`${SITE_URL}/api/send-status-email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ order: updated, status }),
    }).catch(e => console.error("Status email dispatch error:", e));
  }

  return NextResponse.json({ ok: true, status: updated.status });
}
