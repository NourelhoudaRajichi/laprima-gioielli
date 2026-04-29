import Verona from "./verona";

export const revalidate = 300;

const COLLECTION = "verona";
const SUB_TARGETS = ["bangles", "bracelets", "earring", "necklaces"];

async function getProducts() {
  try {
    const base  = process.env.WP_BASE_URL;
    const creds = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");
    const headers = { Authorization: `Basic ${creds}` };

    const catRes  = await fetch(`${base}/wp-json/wc/v3/products/categories?per_page=100`, { headers });
    if (!catRes.ok) throw new Error("categories fetch failed");
    const allCats = await catRes.json();

    const subCats = allCats.filter(c =>
      SUB_TARGETS.includes(c.slug?.toLowerCase()) ||
      SUB_TARGETS.includes(c.name?.toLowerCase())
    );
    if (!subCats.length) throw new Error("No sub-categories found");

    const results = await Promise.all(
      subCats.map(cat =>
        fetch(`${base}/wp-json/wc/v3/products?per_page=100&status=publish&category=${cat.id}`, { headers })
          .then(r => r.ok ? r.json() : [])
          .then(prods => (Array.isArray(prods) ? prods : []).map(p => ({ ...p, _subCat: cat })))
      )
    );

    const seen = new Set();
    const all  = results.flat().filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    const filtered = all.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(COLLECTION);
      const catMatch  = p.categories?.some(c =>
        c.slug?.toLowerCase().includes(COLLECTION) ||
        c.name?.toLowerCase().includes(COLLECTION)
      );
      return nameMatch || catMatch;
    });

    console.log(`Verona products found: ${filtered.length}`);
    return filtered.length ? filtered : null;
  } catch (e) {
    console.error("Verona fetch error:", e.message);
    return null;
  }
}

export default async function VeronaPage() {
  const wcProducts = await getProducts();
  return <Verona wcProducts={wcProducts} />;
}
