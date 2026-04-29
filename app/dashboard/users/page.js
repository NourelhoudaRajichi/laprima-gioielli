export const revalidate = 120;
import UsersClient from "./users-client";

async function fetchUsers() {
  const base  = process.env.WP_BASE_URL;
  const creds = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}` };

  const results = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${base}/wp-json/wp/v2/users?context=edit&per_page=100&page=${page}`,
      { headers, next: { revalidate: 120 } }
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

async function fetchWCCustomers() {
  const base  = process.env.WP_BASE_URL;
  const creds = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}` };

  const results = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${base}/wp-json/wc/v3/customers?per_page=100&page=${page}&orderby=registered_date&order=desc`,
      { headers, next: { revalidate: 120 } }
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

export default async function UsersPage() {
  const [wpUsers, wcCustomers] = await Promise.all([
    fetchUsers().catch(() => []),
    fetchWCCustomers().catch(() => []),
  ]);
  return <UsersClient wpUsers={wpUsers} wcCustomers={wcCustomers} />;
}
