export const runtime = "nodejs";
import { NextResponse } from "next/server";

const COLLECTIONS   = ["bloomy", "prestige", "velluto", "verona"];
const JEWELRY_TYPES = ["long necklace", "necklace", "earrings", "bangle", "ring", "bracelet"];
const STONES        = ["diamond", "full diamonds", "lapis", "malachite", "mixte stones", "mother of pearl", "rhodonite", "turchese", "pink sapphire", "ruby", "sapphire", "topaz", "tourmalinated", "cabochon", "gold and diamond"];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");
  if (!productId) return NextResponse.json([]);

  const base    = process.env.WP_BASE_URL;
  const creds   = Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString("base64");
  const headers = { Authorization: `Basic ${creds}` };
  const cache   = { next: { revalidate: 300 } };
  const pid     = parseInt(productId, 10);

  try {
    /* ── 1. Fetch the product to get its categories ── */
    const prodRes = await fetch(`${base}/wp-json/wc/v3/products/${pid}`, { headers, ...cache });
    if (!prodRes.ok) return NextResponse.json([]);
    const product = await prodRes.json();

    const categories = product.categories ?? [];
    if (!categories.length) return NextResponse.json([]);

    /* ── 2. Identify collection / type / stone category IDs ── */
    let collectionId = null, typeId = null, stoneId = null, typeName = null;

    for (const cat of categories) {
      const name = (cat.name || "").toLowerCase();
      for (const col of COLLECTIONS)   if (name.includes(col))  collectionId = cat.id;
      for (const typ of JEWELRY_TYPES) if (name.includes(typ)) { typeId = cat.id; typeName = typ; }
      for (const sto of STONES)        if (name.includes(sto))  stoneId = cat.id;
    }

    /* ── helpers ── */
    const NEEDED = 5;
    const collected = new Set();

    // Shuffle array in place (Fisher-Yates)
    const shuffle = arr => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    const fetchByCat = async (catId) => {
      const res = await fetch(
        `${base}/wp-json/wc/v3/products?per_page=50&status=publish&orderby=menu_order&order=asc&category=${catId}`,
        { headers, ...cache }
      );
      return res.ok ? (await res.json()) : [];
    };

    const intersect = (a, b) => {
      const bIds = new Set(b.map(p => p.id));
      return a.filter(p => bIds.has(p.id));
    };

    // productMap accumulates all fetched product objects so we can return full data
    const productMap = new Map();

    const addProducts = (prods) => {
      const candidates = shuffle(prods.filter(p => p.id !== pid && !collected.has(p.id)));
      for (const p of candidates) {
        if (collected.size >= NEEDED) break;
        collected.add(p.id);
        productMap.set(p.id, p);
      }
    };

    /* lazy-cached per-category fetches */
    let _colProds = null, _typeProds = null, _stoneProds = null;
    const getCol   = async () => { if (!_colProds   && collectionId) _colProds   = await fetchByCat(collectionId); return _colProds   || []; };
    const getType  = async () => { if (!_typeProds  && typeId)       _typeProds  = await fetchByCat(typeId);       return _typeProds  || []; };
    const getStone = async () => { if (!_stoneProds && stoneId)      _stoneProds = await fetchByCat(stoneId);      return _stoneProds || []; };

    /* ── STEP 1: same collection + same type + same stone ── */
    if (collected.size < NEEDED && collectionId && typeId && stoneId) {
      const [col, typ, sto] = await Promise.all([getCol(), getType(), getStone()]);
      addProducts(intersect(intersect(col, typ), sto));
    }

    /* ── STEP 2: same collection + same type ── */
    if (collected.size < NEEDED && collectionId && typeId) {
      const [col, typ] = await Promise.all([getCol(), getType()]);
      addProducts(intersect(col, typ));
    }

    /* ── STEP 3: same stone only ── */
    if (collected.size < NEEDED && stoneId) {
      addProducts(await getStone());
    }

    /* ── STEP 4: same collection only ── */
    if (collected.size < NEEDED && collectionId) {
      addProducts(await getCol());
    }

    /* ── STEP 5: same type only ── */
    if (collected.size < NEEDED && typeId) {
      addProducts(await getType());
    }

    /* ── STEP 6: fill by jewelry-type priority ── */
    if (collected.size < NEEDED) {
      const typePriority = ["long necklace", "necklace", "earrings", "bangle", "ring", "bracelet"];
      if (typeName) {
        const rest = typePriority.filter(t => t !== typeName);
        typePriority.splice(0, typePriority.length, typeName, ...rest);
      }

      const catsRes = await fetch(
        `${base}/wp-json/wc/v3/products/categories?per_page=100`,
        { headers, ...cache }
      );
      if (catsRes.ok) {
        const allCats = await catsRes.json();
        for (const tName of typePriority) {
          if (collected.size >= NEEDED) break;
          const typeCat = allCats.find(c => c.name.toLowerCase() === tName.toLowerCase());
          if (!typeCat) continue;
          const prods = await fetchByCat(typeCat.id);
          addProducts(prods);
        }
      }
    }

    /* ── STEP 7: safety net — any published products ── */
    if (collected.size < NEEDED) {
      const res = await fetch(
        `${base}/wp-json/wc/v3/products?per_page=20&status=publish&orderby=date&order=desc`,
        { headers, ...cache }
      );
      if (res.ok) {
        const prods = await res.json();
        addProducts(Array.isArray(prods) ? prods : []);
      }
    }

    /* ── 3. Return full product objects ── */
    const result = [];
    for (const id of Array.from(collected).slice(0, NEEDED)) {
      if (productMap.has(id)) {
        result.push(productMap.get(id));
      } else {
        const r = await fetch(`${base}/wp-json/wc/v3/products/${id}`, { headers, ...cache });
        if (r.ok) result.push(await r.json());
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Related route error:", e);
    return NextResponse.json([]);
  }
}
