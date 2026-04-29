import Bloomy from "./bloomy";

export const revalidate = 300;

async function getBloomyProducts() {
  try {
    const base  = process.env.WP_BASE_URL;
    const creds = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");
    const headers = { Authorization: `Basic ${creds}` };

    // 1 — get all categories
    const catRes  = await fetch(`${base}/wp-json/wc/v3/products/categories?per_page=100`, { headers });
    if (!catRes.ok) throw new Error("categories fetch failed: " + catRes.status);
    const allCats = await catRes.json();

    // 2 — find the 4 sub-category IDs (Bangles, Bracelets, Earring, Necklaces)
    const subTargets = ["bangles", "bracelets", "earring", "necklaces"];
    const subCats = allCats.filter(c =>
      subTargets.includes(c.slug?.toLowerCase()) ||
      subTargets.includes(c.name?.toLowerCase())
    );

    console.log("Found sub-cats:", subCats.map(c => `${c.name}(${c.id})`));

    if (!subCats.length) throw new Error("No sub-categories found");

    // 3 — fetch products from each sub-category in parallel
    const results = await Promise.all(
      subCats.map(cat =>
        fetch(
          `${base}/wp-json/wc/v3/products?per_page=100&status=publish&category=${cat.id}`,
          { headers }
        )
          .then(r => r.ok ? r.json() : [])
          .then(prods =>
            // tag each product with its matched sub-category
            (Array.isArray(prods) ? prods : []).map(p => ({ ...p, _subCat: cat }))
          )
      )
    );

    // 4 — flatten + deduplicate (a product might appear in Bangles AND Bracelets)
    const seen = new Set();
    const all  = results.flat().filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    // 5 — keep only products that have BLOOMY in their name or categories
    const bloomy = all.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes("bloomy");
      const catMatch  = p.categories?.some(c =>
        c.slug?.toLowerCase().includes("bloomy") ||
        c.name?.toLowerCase().includes("bloomy")
      );
      return nameMatch || catMatch;
    });

    console.log(`Bloomy products found: ${bloomy.length}`);
    return bloomy.length ? bloomy : null;
  } catch (e) {
    console.error("Bloomy fetch error:", e.message);
    return null;
  }
}

export default async function BloomyPage() {
  const wcProducts = await getBloomyProducts();
  return <Bloomy wcProducts={wcProducts} />;
}
