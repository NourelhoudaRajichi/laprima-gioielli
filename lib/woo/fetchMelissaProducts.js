async function fetchAllPages(url, headers, cache) {
  const results = [];
  let page = 1;
  while (true) {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}per_page=100&page=${page}`, { headers, ...cache });
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

export async function fetchMelissaProducts() {
  const base    = process.env.WP_BASE_URL;
  const creds   = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}` };
  const cache   = { next: { revalidate: 300 } };

  try {
    const allCats = await fetchAllPages(`${base}/wp-json/wc/v3/products/categories`, headers, cache);

    const pageOnlyCat = allCats.find(c =>
      c.slug === "page-only" || c.name?.toLowerCase() === "page-only"
    );
    if (!pageOnlyCat) return { products: [], allCats: [] };

    const products = await fetchAllPages(
      `${base}/wp-json/wc/v3/products?status=publish&category=${pageOnlyCat.id}&orderby=date&order=desc`,
      headers,
      cache
    );

    return {
      products: Array.isArray(products) ? products : [],
      allCats:  Array.isArray(allCats)  ? allCats  : [],
    };
  } catch {
    return { products: [], allCats: [] };
  }
}
