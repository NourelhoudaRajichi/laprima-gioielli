export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type   = searchParams.get("type");   // bangles | bracelets | necklaces | earring | diamond …
    const parent = searchParams.get("parent"); // optional: restrict to this parent category slug/name

    const base  = process.env.WP_BASE_URL;
    const creds = Buffer.from(
      `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
    ).toString("base64");
    const headers = { Authorization: `Basic ${creds}` };

    // get all categories
    const catRes = await fetch(`${base}/wp-json/wc/v3/products/categories?per_page=100`, { headers });
    if (!catRes.ok) return NextResponse.json([], { status: 200 });
    const allCats = await catRes.json();

    let products = [];

    // earrings → earring (WC uses singular slug)
    const wcSlug = type === "earrings" ? "earring" : type;

    if (!type || type === "all") {
      const slugs = ["bangles", "bracelets", "earring", "necklaces"];
      const subCats = allCats.filter(c =>
        slugs.includes(c.slug?.toLowerCase()) || slugs.includes(c.name?.toLowerCase())
      );
      const results = await Promise.all(
        subCats.map(cat =>
          fetch(`${base}/wp-json/wc/v3/products?per_page=100&status=publish&orderby=menu_order&order=asc&category=${cat.id}`, { headers })
            .then(r => r.ok ? r.json() : [])
            .then(prods => (Array.isArray(prods) ? prods : []).map(p => ({ ...p, _subCat: cat })))
        )
      );
      const seen = new Set();
      products = results.flat().filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
    } else {
      // resolve optional parent category id first
      let parentId = null;
      if (parent) {
        const parentCat = allCats.find(c =>
          c.slug?.toLowerCase() === parent.toLowerCase() ||
          c.name?.toLowerCase() === parent.toLowerCase()
        );
        parentId = parentCat?.id ?? null;
      }

      // find the target category — if parentId is known, require it to match
      const cat = allCats.find(c => {
        const nameMatch =
          c.slug?.toLowerCase() === wcSlug.toLowerCase() ||
          c.name?.toLowerCase() === wcSlug.toLowerCase();
        if (!nameMatch) return false;
        if (parentId !== null) return c.parent === parentId;
        return true;
      });

      if (cat) {
        const res = await fetch(`${base}/wp-json/wc/v3/products?per_page=100&status=publish&orderby=menu_order&order=asc&category=${cat.id}`, { headers });
        const prods = res.ok ? await res.json() : [];
        products = (Array.isArray(prods) ? prods : []).map(p => ({ ...p, _subCat: cat }));
      }
    }

    return NextResponse.json(products);
  } catch (e) {
    console.error("Products route error:", e);
    return NextResponse.json([], { status: 200 });
  }
}
