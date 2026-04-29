"use client";

import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "../../../../components/Context";
import { useLanguage } from "../../../../components/LanguageContext";

/* ── content per type ───────────────────────────────────────────── */
const CONTENT = {
  all: {
    title: "All Jewels",
    lines: [
      { text: "Every piece tells a story.", italic: true },
      { text: "From bangles to earrings, necklaces to bracelets —" },
      { text: "Italian gold crafted to illuminate every moment of your life." },
    ],
    wcType: "all",
  },
  bangles: {
    title: "Bangles",
    lines: [
      { text: "I circle your wrist with luminous grace.", italic: true },
      { text: "Alone, I am presence." },
      { text: "Together, we create a symphony of elegance — modern, magnetic, eternal." },
    ],
    filters: [
      { id: "all",    name: "All Bangles",    video: "/Videos/allbangles.mp4",            hoverImage: null },
      { id: "Bloomy", name: "Bloomy",         image: "/img/renders/bbl.png",     hoverImage: "/img/model/bbl.png" },
      { id: "Velluto",name: "Velluto",        image: "/img/renders/vlb.png",     hoverImage: "/img/model/vb.png" },
      { id: "Verona", name: "Verona",         image: "/img/renders/verona.png",      hoverImage: "/img/model/vrb.png" },
    ],
    wcType: "bangles",
  },
  bracelets: {
    title: "Bracelets",
    lines: [
      { text: "Shaped with refinement, I shine on the wrist with sophistication and vitality.", italic: true },
      { text: "Natural stones and diamonds flow through me, glowing with elegance in every movement." },
    ],
    filters: [
      { id: "all",    name: "All Bracelets",  image: "/img/brr.png",                                   hoverImage: "/img/brrac.png" },
      { id: "Bloomy", name: "Bloomy",         image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",      hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",        image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",     hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",         image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",      hoverImage: null },
    ],
    wcType: "bracelets",
  },
  necklaces: {
    title: "Necklaces",
    lines: [
      { text: "I rest on your skin like a secret.", italic: true },
      { text: "I breathe in gold, I exhale diamonds." },
      { text: "With every color, every stone, I tell you — I was made to shine with you." },
    ],
    filters: [
      { id: "all",    name: "All Necklaces",  image: "/img/nek.png",                                   hoverImage: "/img/LaPrimaGioielli_SS26_0817_VERONA.png" },
      { id: "Bloomy", name: "Bloomy",         image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",      hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",        image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",     hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",         image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",      hoverImage: null },
    ],
    wcType: "necklaces",
  },
  earrings: {
    title: "Earrings",
    lines: [
      { text: "I am light in motion.", italic: true },
      { text: "I sparkle when you turn, I dance when you smile." },
      { text: "In gold and diamonds, I carry a brilliance that is modern, magnetic, unforgettable." },
    ],
    filters: [
      { id: "all",    name: "All Earrings",   image: "/img/err.png",                                   hoverImage: "/img/errin.png" },
      { id: "Bloomy", name: "Bloomy",         image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",      hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",        image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",     hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",         image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",      hoverImage: null },
    ],
    wcType: "earring",
  },

  /* ── stone / material pages ─────────────────────────────────────── */
  diamond: {
    title: "Diamond",
    lines: [],
    wcParent: "Stones",
    filters: [
      { id: "all",    name: "All Diamond",   image: "/img/LaPrimaGioielli_SS26_2237_PRESTIGE.png",  hoverImage: "/img/LaPrimaGioielli_SS26_2261_PRESTIGE.png" },
      { id: "Bloomy", name: "Bloomy",        image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",    hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",       image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",   hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",        image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",    hoverImage: null },
    ],
    wcType: "diamond",
  },
  lapis: {
    title: "Lapis Lazuli",
    lines: [],
    wcParent: "Stones",
    wcType: "lapis",
  },
  "mother-of-pearl": {
    title: "Mother of Pearl",
    lines: [],
    wcType: "mother-of-pearl-stones",
  },

  /* ── gold colour pages ──────────────────────────────────────────── */
  "yellow-gold": {
    title: "Yellow Gold",
    lines: [],
    filters: [
      { id: "all",    name: "All Yellow Gold", image: "/img/bangle.jpg",                             hoverImage: "/img/bng.png" },
      { id: "Bloomy", name: "Bloomy",          image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",   hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",         image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",  hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",          image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",   hoverImage: null },
    ],
    wcType: "Yellow",
  },
  "white-gold": {
    title: "White Gold",
    lines: [],
    filters: [
      { id: "all",    name: "All White Gold",  image: "/img/necklaces.jpg",                          hoverImage: "/img/nek.png" },
      { id: "Bloomy", name: "Bloomy",          image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",   hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",         image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",  hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",          image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",   hoverImage: null },
    ],
    wcType: "White",
  },
  "rose-gold": {
    title: "Rose Gold",
    lines: [],
    filters: [
      { id: "all",    name: "All Rose Gold",   image: "/img/LaPrimaGioielli_SS26_1897_BLOOMY.jpg",   hoverImage: "/img/LaPrimaGioielli_SS26_1883_BLOOMY.jpg" },
      { id: "Bloomy", name: "Bloomy",          image: "/img/LaPrimaGioielli_SS26_1521_BLOOMY.jpg",   hoverImage: "/img/LaPrimaGioielli_SS26_1826_BLOOMY.jpg" },
      { id: "Velluto",name: "Velluto",         image: "/img/LaPrimaGioielli_SS26_0323_VELLUTO.png",  hoverImage: "/img/LaPrimaGioielli_SS26_1056_VELLUTO.png" },
      { id: "Verona", name: "Verona",          image: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",   hoverImage: null },
    ],
    wcType: "Rose",
  },
};

/* ── type navigation tabs for the "all" page ────────────────────── */
const ALL_TYPE_TABS = [

  {
    id: "earrings",
    label: "Earrings",
    image: "/img/err.png",
    hoverImage: "/img/errin.png",
  },
  {
    id: "bracelets",
    label: "Bracelets",
    image: "/img/website(4).png",
    hoverImage: "/img/brrac.png",
  },
  {
    id: "all",
    label: "All Jewels",
    image: "/img/all.png",
    video: "/Videos/LP_REEL_VERONA_N1_V2.mp4",
  },
  {
    id: "bangles",
    label: "Bangles",
    image: "/img/BLO0015BAFUPE00DAU750Y_1xx.png",
    hoverImage: "/img/website(1).png",
  },
  {
    id: "necklaces",
    label: "Necklaces",
    image: "/img/Design2.png",
    hoverImage: "/img/LaPrimaGioielli_SS26_0817_VERONA.png",
  },
];

const DISCOVER = [
  { type: "bangles",   title: "BANGLES",   image: "https://laprimagioielli.com/wp-content/uploads/2025/09/LaPrimaGioielli_SS26_1912_VERONA-scaled.jpg" },
  { type: "bracelets", title: "BRACELETS", image: "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg" },
  { type: "earrings",  title: "EARRINGS",  image: "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg" },
  { type: "necklaces", title: "NECKLACES", image: "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg" },
];

const COLLECTIONS = ["bloomy", "velluto", "verona", "prestige"];

function getCollection(categories = []) {
  for (const cat of categories) {
    const slug = (cat.slug ?? "").toLowerCase();
    const name = (cat.name ?? "").toLowerCase();
    for (const col of COLLECTIONS) {
      if (slug.includes(col) || name.includes(col)) {
        return col.charAt(0).toUpperCase() + col.slice(1);
      }
    }
  }
  return "other";
}

function transformProduct(p) {
  const images = p.images ?? [];
  return {
    id: p.id,
    name: (p.name || "").toUpperCase(),
    price: p.price ? formatPrice(p.price) : "—",
    type: getCollection(p.categories ?? []),
    image: images[0]?.src ?? "",
    hoverImage: images[1]?.src ?? "",
    isActive: p.status === "publish" && parseFloat(p.price || "0") > 0,
  };
}

export default function JewelTypePage({ type, initialProducts = null }) {
  const isAllPage = type === "all";

  /* for the "all" page: track which type tab is active */
  const [activeTypeTab, setActiveTypeTab] = useState("all");

  /* resolve the content to display based on page type */
  const displayType   = isAllPage ? activeTypeTab : type;
  const content       = CONTENT[displayType] ?? CONTENT.all;
  const fetchWcType   = content.wcType;
  const fetchWcParent = content.wcParent ?? null;

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { t } = useLanguage();

  // Translated title & lines (fall back to CONTENT defaults if no translation key)
  const titleKey   = { all: "allJewels", bangles: "bangles", bracelets: "bracelets", necklaces: "necklaces", earrings: "earrings", diamond: "diamond", lapis: "lapis", "mother-of-pearl": "motherOfPearl", "yellow-gold": "yellowGold", "white-gold": "whiteGold", "rose-gold": "roseGold" };
  const linesKey   = { all: "allJewelsLines", bangles: "banglesLines", bracelets: "braceletsLines", necklaces: "necklacesLines", earrings: "earringsLines" };
  const tTitle     = t.jewels[titleKey[displayType]] ?? content.title;
  const tLines     = t.jewels[linesKey[displayType]] ?? content.lines;

  const [activeCategory, setActiveCategory] = useState("all");
  const [wcProducts, setWcProducts]         = useState(() => initialProducts ? initialProducts.map(transformProduct) : []);
  const [loading, setLoading]               = useState(!initialProducts);
  const skipFirstFetch                      = useRef(!!initialProducts);
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [addedFeedback, setAddedFeedback]     = useState({});
  const [hoveredTab, setHoveredTab]           = useState(null);
  const [hoveredFilter, setHoveredFilter]     = useState(null);

  const productsRef = useRef(null);

  /* fetch from WooCommerce — re-runs when the effective wcType changes */
  useEffect(() => {
    if (skipFirstFetch.current) { skipFirstFetch.current = false; return; }
    setLoading(true);
    setActiveCategory("all");
    const url = fetchWcParent
      ? `/api/woo/products?type=${encodeURIComponent(fetchWcType)}&parent=${encodeURIComponent(fetchWcParent)}`
      : `/api/woo/products?type=${encodeURIComponent(fetchWcType)}`;
    fetch(url)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setWcProducts(Array.isArray(data) ? data.map(transformProduct) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [fetchWcType, fetchWcParent]);

  const filteredProducts = activeCategory === "all"
    ? wcProducts
    : wcProducts.filter(p => p.type?.toLowerCase() === activeCategory.toLowerCase());

  const handleAddToCart = (product) => {
    addToCart(
      { ...product, variations: [{ name: product.name, defaultImage: product.image }] },
      { name: product.name, defaultImage: product.image }
    );
    setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedFeedback(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.id, product.name)) removeFromWishlist(product.id, product.name);
    else addToWishlist(
      { ...product, variations: [{ name: product.name, defaultImage: product.image }] },
      { name: product.name, defaultImage: product.image }
    );
  };

  return (
    <>
      <div className="bg-white">

        {/* ── Filter section (all pages) ───────────────────────── */}
        {(isAllPage || (!isAllPage && content.filters)) && (
          <section className="bg-white px-6 pt-32 pb-10">
            <div className="mx-auto max-w-6xl">
              <p className="mb-10 text-center font-barlow text-xs tracking-[0.35em] text-gray-400">
                {t.jewels.discover}
              </p>

              {/* All Jewels: type tabs */}
              {isAllPage && (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {ALL_TYPE_TABS.map(tab => {
                    const isActive = activeTypeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTypeTab(tab.id);
                          productsRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        className="group flex flex-col items-center gap-3 focus:outline-none">
                        <div className={`w-full overflow-hidden transition-all duration-300 ${isActive ? "ring-2 ring-[#f8e3e8]" : "ring-0"}`}>
                          {tab.video ? (
                            <video
                              src={tab.video}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="relative w-full aspect-[3/4]">
                              <NextImage
                                src={tab.image}
                                alt={tab.label}
                                fill
                                sizes="(max-width: 640px) 50vw, 20vw"
                                className="object-cover transition-opacity duration-150"
                                style={{ opacity: hoveredTab === tab.id && tab.hoverImage ? 0 : 1 }}
                                priority
                              />
                              {tab.hoverImage && (
                                <NextImage
                                  src={tab.hoverImage}
                                  alt=""
                                  fill
                                  sizes="(max-width: 640px) 50vw, 20vw"
                                  className="object-cover transition-opacity duration-150"
                                  style={{ opacity: hoveredTab === tab.id ? 1 : 0 }}
                                  priority
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <span className={`font-barlow text-[10px] tracking-[0.25em] transition-colors duration-300 ${isActive ? "text-[#004065]" : "text-gray-400 group-hover:text-[#004065]"}`}>
                          {(t.jewels[{ earrings:"earrings", bracelets:"bracelets", all:"allJewels", bangles:"bangles", necklaces:"necklaces" }[tab.id]] ?? tab.label).toUpperCase()}
                        </span>
                        <span
                          className="block h-px bg-[#f8e3e8] transition-all duration-400"
                          style={{ width: isActive ? "2rem" : "0rem" }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type pages: collection filter cards */}
              {!isAllPage && content.filters && (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {content.filters.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const isHov    = hoveredFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          productsRef.current?.scrollIntoView({ behavior: "smooth" });
                        }}
                        onMouseEnter={() => setHoveredFilter(cat.id)}
                        onMouseLeave={() => setHoveredFilter(null)}
                        className="group flex flex-col items-center gap-3 focus:outline-none">
                        <div className={`w-full overflow-hidden transition-all duration-300 ${isActive ? "ring-2 ring-[#f8e3e8]" : "ring-0"}`}>
                          <div className="relative w-full aspect-[3/4]">
                            {cat.video ? (
                              <video
                                src={cat.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            ) : (
                              <>
                                <NextImage
                                  src={cat.image}
                                  alt={cat.name}
                                  fill
                                  sizes="(max-width: 640px) 50vw, 25vw"
                                  className="object-cover transition-opacity duration-150"
                                  style={{ opacity: isHov && cat.hoverImage ? 0 : 1 }}
                                  priority
                                />
                                {cat.hoverImage && (
                                  <NextImage
                                    src={cat.hoverImage}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                    className="object-cover transition-opacity duration-150"
                                    style={{ opacity: isHov ? 1 : 0 }}
                                    priority
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <span className={`font-barlow text-[10px] tracking-[0.25em] transition-colors duration-300 ${isActive ? "text-[#004065]" : "text-gray-400 group-hover:text-[#004065]"}`}>
                          {(cat.id === "all" ? (t.jewels.filterAll[type] ?? cat.name) : cat.name).toUpperCase()}
                        </span>
                        <span
                          className="block h-px bg-[#f8e3e8] transition-all duration-300"
                          style={{ width: isActive ? "2rem" : "0rem" }}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Products Grid ─────────────────────────────────────── */}
        <section ref={productsRef} className="bg-white px-4 pt-16 pb-24">
          <div className="mx-auto max-w-7xl">


            {/* ── Title + lines (all pages) ─────────────────────── */}
            <div className="mb-10 text-center">
              <h1 className="mb-4 font-barlow text-3xl text-[#004065] md:text-4xl">
                {tTitle}
              </h1>
              {tLines.length > 0 && (
                <div className="space-y-2 text-sm leading-relaxed text-[#004065] md:text-base">
                  {tLines.map((line, i) => (
                    <p key={i} className={line.italic ? "italic" : ""}>{line.text}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className="aspect-square w-full bg-gray-100 animate-pulse rounded" />
                    <div className="h-3 w-3/4 bg-gray-100 animate-pulse rounded" />
                    <div className="h-3 w-1/3 bg-gray-100 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center py-20">
                <p className="font-barlow text-gray-400 tracking-widest text-sm">{t.jewels.noProducts}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map(product => {
                  const hovered    = hoveredProducts[product.id] || false;
                  const img        = hovered && product.hoverImage ? product.hoverImage : product.image;
                  const wasAdded   = addedFeedback[product.id] || false;
                  const inWishlist = isInWishlist(product.id, product.name);

                  return (
                    <div key={product.id} className="group flex cursor-pointer flex-col items-center text-center">

                      {/* Image */}
                      <Link
                        href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`}
                        className="mb-4 aspect-square w-full overflow-hidden block"
                        onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
                        onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
                        <img
                          src={img}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>

                      {/* Name */}
                      <h3 className="mb-1 font-barlow text-sm tracking-wide text-[#004065]">{product.name}</h3>

                      {/* Price / Add to Cart */}
                      <div className="relative h-6 w-full">
                        {product.isActive ? (
                          <>
                            <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                              {product.price} €
                            </p>
                            <div className="absolute left-0 top-0 flex w-full translate-y-2 transform items-center justify-center gap-3 opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className={`bg-transparent py-0 font-semibold underline ${wasAdded ? "text-[#ec9cb2]" : "text-[#004065]"}`}>
                                {wasAdded ? t.jewels.added : t.jewels.addToCart}
                              </button>
                              <button
                                onClick={() => handleToggleWishlist(product)}
                                className="flex items-center justify-center transition-transform duration-200 hover:scale-110"
                                title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                                <Heart
                                  size={14}
                                  className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065] hover:text-[#ec9cb2]"}`}
                                />
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="font-barlow font-serif text-[10px] text-[#ec9cb2]">
                            {t.jewels.availableInStore}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Discover other types ──────────────────────────────── */}
        <section className="mt-24 w-full bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center font-barlow text-3xl tracking-tight text-[#004065] md:text-4xl lg:text-3xl">
              {t.jewels.discoverAllJewels}
            </h2>
            <div className="flex justify-center">
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {DISCOVER.filter(d => d.type !== type).slice(0, 3).map(cat => (
                  <Link
                    key={cat.type}
                    href={`/${cat.type}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
                    <img
                      src={cat.image}
                      alt={t.jewels[cat.type] ?? cat.title}
                      className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-700 group-hover:bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-center text-xl font-bold tracking-wide text-white drop-shadow-lg md:text-2xl">
                        {(t.jewels[cat.type] ?? cat.title).toUpperCase()}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
