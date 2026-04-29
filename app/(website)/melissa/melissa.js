"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/components/CurrencyContext";
import { useCart } from "@/components/Context";

const navy  = "#004065";
const pink  = "#ec9cb2";
const blush = "#f8e3e8";

const AGENT_PAGE  = "melissa";
const HERO_IMAGE  = "https://laprimagioielli.com/wp-content/uploads/2026/02/VIDEOSPHOTOS-WEBSITE-3240-x-1000-px.jpg";

/* ── filter groups from product categories ── */
function buildFilterGroups(products, allCats) {
  const catMap = new Map(allCats.map(c => [c.id, c]));
  const typesParent        = allCats.find(c => c.name?.toLowerCase() === "types");
  const stoneParent        = allCats.find(c => c.name?.toLowerCase() === "stone");
  const specialStoneParent = allCats.find(c => c.name?.toLowerCase() === "special stones");
  const TYPE_NAMES = ["ring", "bracelet", "bangle", "necklace", "long necklace", "earrings"];
  const EXCLUDE    = new Set(["stone","types","uncategorized","page-only","categories","special stones","white","rose","yellow","color"]);
  const collections = new Map(), types = new Map(), stones = new Map(), specialStones = new Map();
  for (const product of products) {
    for (const cat of product.categories ?? []) {
      const full = catMap.get(cat.id) ?? cat;
      const nl   = (cat.name ?? "").toLowerCase();
      if (EXCLUDE.has(nl)) continue;
      if (typesParent && full.parent === typesParent.id)               collections.set(cat.id, cat);
      else if (specialStoneParent && full.parent === specialStoneParent.id) specialStones.set(cat.id, cat);
      else if (stoneParent && full.parent === stoneParent.id)          stones.set(cat.id, cat);
      else if (TYPE_NAMES.some(t => nl.includes(t)))                   types.set(cat.id, cat);
    }
  }
  return {
    collections:   [...collections.values()].sort((a,b) => a.name.localeCompare(b.name)),
    types:         [...types.values()].sort((a,b) => a.name.localeCompare(b.name)),
    stones:        [...stones.values()].sort((a,b) => a.name.localeCompare(b.name)),
    specialStones: [...specialStones.values()].sort((a,b) => a.name.localeCompare(b.name)),
  };
}

function applyFilters(products, active) {
  return products.filter(p => {
    const catIds = new Set((p.categories ?? []).map(c => c.id));
    if (active.collections.size   > 0 && ![...active.collections].some(id => catIds.has(id)))   return false;
    if (active.types.size         > 0 && ![...active.types].some(id => catIds.has(id)))         return false;
    if (active.stones.size        > 0 && ![...active.stones].some(id => catIds.has(id)))        return false;
    if (active.specialStones.size > 0 && ![...active.specialStones].some(id => catIds.has(id))) return false;
    return true;
  });
}

function transformProduct(p) {
  return {
    id:         p.id,
    name:       (p.name || "").toUpperCase(),
    price:      p.price ? formatPrice(p.price) : "—",
    image:      p.images?.[0]?.src ?? "",
    hoverImage: p.images?.[1]?.src ?? "",
    isActive:   p.status === "publish" && parseFloat(p.price || "0") > 0,
    categories: p.categories ?? [],
    sku:        p.sku || "",
  };
}

function FilterGroup({ title, options, active, toggle }) {
  const [open, setOpen] = useState(true);
  if (!options.length) return null;
  return (
    <div style={{ borderBottom: `1px solid ${blush}`, paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"none", border:"none", cursor:"pointer", padding:0, marginBottom: open ? 10 : 0 }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700,
          textTransform:"uppercase", letterSpacing:"0.1em", color:navy }}>{title}</span>
        <span style={{ color:pink, fontSize:10 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {options.map(opt => {
            const checked = active.has(opt.id);
            return (
              <label key={opt.id} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer",
                padding:"4px 6px", borderRadius:4, background: checked ? blush : "transparent" }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(opt.id)}
                  style={{ accentColor:pink, width:14, height:14, cursor:"pointer" }} />
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, color:navy }}>
                  {opt.name}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

const PER_PAGE = 16;

export default function MelissaPage({ products: rawProducts, allCats }) {
  const searchParams = useSearchParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { format } = useCurrency();

  /* ── agent tracking ── */
  useEffect(() => {
    const ref = searchParams.get("ref") || AGENT_PAGE;
    document.cookie = `lpg_agent_ref=${encodeURIComponent(ref)};path=/;max-age=86400`;
    document.cookie = `lpg_agent_page=${encodeURIComponent(AGENT_PAGE)};path=/;max-age=86400`;
    sessionStorage.setItem("lpg_agent_ref", ref);
    sessionStorage.setItem("lpg_agent_page", AGENT_PAGE);
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: AGENT_PAGE, ref }),
    }).catch(() => {});
  }, [searchParams]);

  /* ── exit agent session when user navigates back from /melissa ──
     Clears sessionStorage so the destination page gets normal navbar/footer.
     Full reload ensures the server re-reads cookies for the destination. */
  useEffect(() => {
    const handlePop = () => {
      sessionStorage.removeItem("lpg_agent_ref");
      sessionStorage.removeItem("lpg_agent_page");
      window.location.reload();
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const products     = useMemo(() => rawProducts.map(transformProduct), [rawProducts]);
  const filterGroups = useMemo(() => buildFilterGroups(rawProducts, allCats), [rawProducts, allCats]);

  const [active, setActive]   = useState({ collections: new Set(), types: new Set(), stones: new Set(), specialStones: new Set() });
  const [page,   setPage]     = useState(1);
  const [hovered,  setHovered]  = useState({});
  const [added,    setAdded]    = useState({});

  const toggle = (group, id) => {
    setActive(prev => {
      const next = new Set(prev[group]);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, [group]: next };
    });
    setPage(1);
  };

  const clearAll = () => {
    setActive({ collections: new Set(), types: new Set(), stones: new Set(), specialStones: new Set() });
    setPage(1);
  };

  const totalActive  = active.collections.size + active.types.size + active.stones.size + active.specialStones.size;
  const filtered     = useMemo(() => applyFilters(products, active), [products, active]);
  const totalPages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated    = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAddToCart = (product) => {
    addToCart(
      { ...product, variations: [{ name: product.name, defaultImage: product.image }] },
      { name: product.name, defaultImage: product.image }
    );
    setAdded(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.id, product.name)) removeFromWishlist(product.id, product.name);
    else addToWishlist(
      { ...product, variations: [{ name: product.name, defaultImage: product.image }] },
      { name: product.name, defaultImage: product.image }
    );
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* ── Hero: full-screen background photo ── */}
      <section style={{ position: "relative", width: "100%", height: "100vh",
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)" }} />
      </section>

      {/* ── Products + Filters ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 24px 80px", display: "flex", gap: 32, alignItems: "flex-start" }}>

        {/* Sidebar */}
        <aside className="lpg-agent-sidebar" style={{ width: 240, flexShrink: 0, background: "#fff",
          border: `1px solid ${blush}`, borderRadius: 8, padding: "20px 16px",
          alignSelf: "flex-start", position: "sticky", top: 80 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.12em", color:navy }}>Filters</span>
            {totalActive > 0 && (
              <button onClick={clearAll} style={{ background:"none", border:"none", cursor:"pointer",
                fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:pink, textDecoration:"underline" }}>
                Clear ({totalActive})
              </button>
            )}
          </div>
          <FilterGroup title="Collection" options={filterGroups.collections}
            active={active.collections} toggle={id => toggle("collections", id)} />
          <FilterGroup title="Type" options={filterGroups.types}
            active={active.types} toggle={id => toggle("types", id)} />
          <FilterGroup title="Stone" options={filterGroups.stones}
            active={active.stones} toggle={id => toggle("stones", id)} />
          <FilterGroup title="Special Stones" options={filterGroups.specialStones}
            active={active.specialStones} toggle={id => toggle("specialStones", id)} />
        </aside>

        {/* Products */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, color:navy,
            opacity:0.5, marginBottom:24 }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, color:navy, opacity:0.4 }}>
                No products match your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="lpg-agent-grid">
                {paginated.map(product => {
                  const isHov    = hovered[product.id] || false;
                  const img      = isHov && product.hoverImage ? product.hoverImage : product.image;
                  const wasAdded = added[product.id] || false;
                  const inWish   = isInWishlist(product.id, product.name);
                  return (
                    <div key={product.id} className="lpg-agent-card">
                      <Link
                        href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`}
                        style={{ display:"block", width:"100%", aspectRatio:"1/1", overflow:"hidden", marginBottom:12 }}
                        onMouseEnter={() => setHovered(prev => ({ ...prev, [product.id]: true }))}
                        onMouseLeave={() => setHovered(prev => ({ ...prev, [product.id]: false }))}>
                        <img src={img} alt={product.name}
                          style={{ width:"100%", height:"100%", objectFit:"cover",
                            transition:"transform 0.5s ease",
                            transform: isHov ? "scale(1.1)" : "scale(1)" }} />
                      </Link>
                      <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13,
                        fontWeight:600, color:navy, letterSpacing:"0.06em", marginBottom:6, textAlign:"center" }}>
                        {product.name}
                      </h3>
                      <div className="lpg-price-wrap" style={{ position:"relative", height:28, width:"100%",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {product.isActive ? (
                          <>
                            <p className="lpg-price-label" style={{ fontFamily:"serif", fontSize:14,
                              color:navy, margin:0, transition:"opacity .3s, transform .3s" }}>
                              {format(product.price)}
                            </p>
                            <div className="lpg-cart-actions" style={{ position:"absolute", inset:0,
                              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
                              opacity:0, transition:"opacity .3s" }}>
                              <button onClick={() => handleAddToCart(product)}
                                style={{ background:"none", border:"none", cursor:"pointer", padding:0,
                                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700,
                                  textDecoration:"underline", color: wasAdded ? pink : navy }}>
                                {wasAdded ? "Added ✓" : "Add to Cart"}
                              </button>
                              <button onClick={() => handleToggleWishlist(product)}
                                style={{ background:"none", border:"none", cursor:"pointer", padding:0,
                                  display:"flex", alignItems:"center" }}>
                                <Heart size={14} style={{ color: inWish ? pink : navy,
                                  fill: inWish ? pink : "none", transition:"color .2s, fill .2s" }} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10,
                            color:pink, letterSpacing:"0.08em", textAlign:"center" }}>
                            AVAILABLE IN YOUR NEAREST STORE
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:48, flexWrap:"wrap" }}>
                  {page > 1 && (
                    <button onClick={() => { setPage(p=>p-1); window.scrollTo({top:0,behavior:"smooth"}); }}
                      style={pageBtnStyle(false)}>← Prev</button>
                  )}
                  {Array.from({ length: totalPages }, (_,i) => i+1).map(n => (
                    <button key={n} onClick={() => { setPage(n); window.scrollTo({top:0,behavior:"smooth"}); }}
                      style={pageBtnStyle(n === page)}>{n}</button>
                  ))}
                  {page < totalPages && (
                    <button onClick={() => { setPage(p=>p+1); window.scrollTo({top:0,behavior:"smooth"}); }}
                      style={pageBtnStyle(false)}>Next →</button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .lpg-agent-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .lpg-agent-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          cursor: pointer;
        }
        .lpg-agent-card:hover .lpg-price-label { opacity: 0; transform: translateY(-6px); }
        .lpg-agent-card:hover .lpg-cart-actions { opacity: 1 !important; }
        @media (max-width: 1024px) {
          .lpg-agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lpg-agent-sidebar { display: none !important; }
        }
        @media (max-width: 600px) {
          .lpg-agent-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

const pageBtnStyle = (active) => ({
  display:"inline-flex", alignItems:"center", justifyContent:"center",
  minWidth:40, height:40, padding:"0 12px", borderRadius:6,
  border:`2px solid ${pink}`, cursor:"pointer",
  background: active ? pink : "#fff",
  color: active ? "#fff" : pink,
  fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700,
});
