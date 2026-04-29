import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getVisits } from "@/lib/tracker";

export async function GET() {
  const cookieStore = await cookies();
  if (cookieStore.get("dashboard_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getVisits());
}
