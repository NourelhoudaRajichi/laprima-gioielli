export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const creds = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");

    const res = await fetch(`${process.env.WP_BASE_URL}/wp-json/wc/v3/customers`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username: username || email,
        first_name: firstName ?? "",
        last_name: lastName ?? "",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Registration failed." },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
