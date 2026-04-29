import { NextResponse } from "next/server";
import { headers } from "next/headers";

const COUNTRY_CURRENCY = {
  US: "USD", CA: "CAD", MX: "MXN",
  GB: "GBP",
  AU: "AUD", NZ: "NZD",
  CH: "CHF",
  JP: "JPY", CN: "CNY", KR: "KRW",
  SG: "SGD", HK: "HKD",
  AE: "AED", SA: "SAR", QA: "AED", KW: "AED", BH: "AED",
  IN: "INR",
  BR: "BRL",
  NO: "NOK", SE: "SEK", DK: "DKK",
  ZA: "ZAR",
  TN: "TND",
};

export async function GET() {
  const h = await headers();
  const xff = h.get("x-forwarded-for") ?? "";
  const ip  = xff.split(",")[0].trim();

  let countryCode = null;

  if (ip && ip !== "::1" && ip !== "127.0.0.1" && !ip.startsWith("192.168")) {
    try {
      const geo  = await fetch(`https://ipwho.is/${ip}`, { next: { revalidate: 3600 } });
      const data = await geo.json();
      countryCode = data?.country_code ?? null;
    } catch {}
  }

  const code = (countryCode && COUNTRY_CURRENCY[countryCode]) || "EUR";

  let rate = 1;
  if (code !== "EUR") {
    try {
      const fx   = await fetch(`https://open.er-api.com/v6/latest/EUR`, { next: { revalidate: 3600 } });
      const data = await fx.json();
      rate = data?.rates?.[code] ?? 1;
    } catch {}
  }

  return NextResponse.json(
    { code, rate, country: countryCode },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
