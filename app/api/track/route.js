import { NextResponse } from "next/server";
import { logVisit } from "@/lib/tracker";

async function detectCountry(request) {
  // Vercel injects this header automatically in production
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) return vercelCountry;

  // Fallback: resolve via IP geolocation (localhost = skip)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  if (!ip || ip === "127.0.0.1" || ip === "::1") return null;

  try {
    const res = await fetch(`https://ipwho.is/${ip}`, { next: { revalidate: 86400 } });
    const data = await res.json();
    return data?.country_code || null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    const { page, ref } = await request.json();
    if (!["melissa", "vip", "website"].includes(page)) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    }
    const country = await detectCountry(request);
    logVisit(page, ref, country);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
