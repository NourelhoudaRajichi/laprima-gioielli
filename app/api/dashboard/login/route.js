import { NextResponse } from "next/server";

const PASSWORD = process.env.DASHBOARD_PASSWORD;

export async function POST(request) {
  const { password } = await request.json();
  if (password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("dashboard_auth", "1", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
    sameSite: "lax",
  });
  return res;
}
