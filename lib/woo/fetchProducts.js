export async function fetchWooProducts(type, parent) {
  const base  = process.env.WP_BASE_URL;
  const creds = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}` };
  const cache  = { next: { revalidate: 300 } }; // cache 5 min

  try {
    const catRes = await fetch(`${base}/wp-json/wc/v3/products/categories?per_page=100`, { headers, ...cache });
    if (!catRes.ok) return [];
    const allCats = await catRes.json();

    const wcSlug = type === "earrings" ? "earring" : type;
    let products = [];

    if (!type || type === "all") {
      const slugs = ["bangles", "bracelets", "earring", "necklaces"];
      const subCats = allCats.filter(c =>
        slugs.includes(c.slug?.toLowerCase()) || slugs.includes(c.name?.toLowerCase())
      );
      const results = await Promise.all(
        subCats.map(cat =>
          fetch(`${base}/wp-json/wc/v3/products?per_page=100&status=publish&orderby=menu_order&order=asc&category=${cat.id}`, { headers, ...cache })
            .then(r => r.ok ? r.json() : [])
            .then(prods => (Array.isArray(prods) ? prods : []).map(p => ({ ...p, _subCat: cat })))
        )
      );
      const seen = new Set();
      products = results.flat().filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
    } else {
      let parentId = null;
      if (parent) {
        const parentCat = allCats.find(c =>
          c.slug?.toLowerCase() === parent.toLowerCase() ||
          c.name?.toLowerCase() === parent.toLowerCase()
        );
        parentId = parentCat?.id ?? null;
      }
      const cat = allCats.find(c => {
        const nameMatch = c.slug?.toLowerCase() === wcSlug.toLowerCase() || c.name?.toLowerCase() === wcSlug.toLowerCase();
        if (!nameMatch) return false;
        if (parentId !== null) return c.parent === parentId;
        return true;
      });
      if (cat) {
        const res = await fetch(`${base}/wp-json/wc/v3/products?per_page=100&status=publish&orderby=menu_order&order=asc&category=${cat.id}`, { headers, ...cache });
        const prods = res.ok ? await res.json() : [];
        products = (Array.isArray(prods) ? prods : []).map(p => ({ ...p, _subCat: cat }));
      }
    }

    return products;
  } catch {
    return [];
  }
}
