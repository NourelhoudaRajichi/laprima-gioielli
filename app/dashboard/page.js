export const dynamic = "force-dynamic";

import AnalyticsClient from "./analytics-client";
import { getVisits } from "@/lib/tracker";

async function fetchAllOrders() {
  const base  = process.env.WP_BASE_URL;
  const creds = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}` };

  const results = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${base}/wp-json/wc/v3/orders?per_page=100&page=${page}&orderby=date&order=desc&status=pending,processing,on-hold,completed,cancelled,refunded`,
      { headers, cache: "no-store" }
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

export default async function DashboardPage() {
  const [orders, visits] = await Promise.all([
    fetchAllOrders().catch(() => []),
    Promise.resolve(getVisits()),
  ]);
  return <AnalyticsClient orders={orders} visits={visits} />;
}
