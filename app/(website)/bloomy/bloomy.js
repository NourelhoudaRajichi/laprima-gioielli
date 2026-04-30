"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/components/CurrencyContext";
import Image from "next/image";
import { useCart } from "../../../components/Context";

// Map exact WC sub-category slug/name → UI tab id
function catToUI(slug = "", name = "") {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();
  if (s === "bangles"   || n === "bangles")   return "bangles";
  if (s === "bracelets" || n === "bracelets") return "bangles"; // grouped under bangles tab
  if (s === "earring"   || n === "earring" || s === "earrings" || n === "earrings") return "earrings";
  if (s === "necklaces" || n === "necklaces") return "necklaces";
  // broader fallback
  if (s.includes("bangle") || s.includes("bracelet") || n.includes("bangle") || n.includes("bracelet")) return "bangles";
  if (s.includes("earring") || n.includes("earring")) return "earrings";
  if (s.includes("necklace") || n.includes("necklace")) return "necklaces";
  return null;
}

function guessFromName(name = "") {
  const n = name.toLowerCase();
  if (n.includes("bangle") || n.includes("bracelet")) return "bangles";
  if (n.includes("earring")) return "earrings";
  if (n.includes("necklace")) return "necklaces";
  return "other";
}

function transformWcProduct(p) {
  const images = p.images ?? [];

  // _subCat is the single matched sub-category resolved by page.js
  const uiCat = p._subCat
    ? catToUI(p._subCat.slug || "", p._subCat.name || "")
    : guessFromName(p.name);

  return {
    id: p.id,
    name: (p.name || "").toUpperCase(),
    price: p.price ? formatPrice(p.price) : "—",
    category: uiCat ?? guessFromName(p.name),
    image: images[0]?.src ?? "",
    hoverImage: images[1]?.src ?? "",
    isActive: p.status === "publish" && parseFloat(p.price || "0") > 0,
    slug: p.slug,
    sku: p.sku || "",
  };
}

// Hardcoded fallback products (original 4)
const fallbackProducts = [
  { id: 1, name: "BLOOMY BANGLE WITH DIAMOND", price: "3,670.00", category: "bangles", image: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.189.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.187.jpg", isActive: true },
  { id: 2, name: "BLOOMY BRACELET WITH DIAMONDS", price: "1,730.00", category: "bangles", image: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.98.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.97.jpg", isActive: true },
  { id: 3, name: "BLOOMY BANGLE MOTHER OF PEARL", price: "3,210.00", category: "bangles", image: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.108.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.109.jpg", isActive: true },
  { id: 4, name: "BLOOMY EARRINGS WITH DIAMONDS", price: "2,590.00", category: "earrings", image: "https://laprimagioielli.com/wp-content/uploads/2024/09/Bloomy_earrings_gold_diamonds.1441-1920x1920.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/09/Bloomy_earrings_gold_diamonds.1442-1920x1920.jpg", isActive: true },
];

function useParallax(ref, options = {}) {
  const { yRange = [60,-60], rotateRange = [0,0], rotate: rotateCfg = null, scaleRange = [1,1,1], blur: blurCfg = null } = options;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end start", "start end"] });
  const y      = useTransform(scrollYProgress, [0, 1], yRange);
  const rotIn  = rotateCfg ? rotateCfg.input  : (rotateRange.length === 2 ? [0, 1] : [0, 0.5, 1]);
  const rotOut = rotateCfg ? rotateCfg.output : rotateRange;
  const rotate = useTransform(scrollYProgress, rotIn, rotOut);
  const scale  = useTransform(scrollYProgress, [0, 0.5, 1], scaleRange);
  const blurIn  = blurCfg ? blurCfg.input  : [0, 0.5, 1];
  const blurOut = blurCfg ? blurCfg.output : ["0px", "0px", "0px"];
  const filter  = useTransform(scrollYProgress, blurIn, blurOut.map(b => `blur(${b})`));
  return { y, rotate, scale, filter };
}

export default function BloomyCollection({ wcProducts }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});


  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { format } = useCurrency();
  const productsRef    = useRef(null);
  const banglesRef     = useRef(null);
  const earringsRef    = useRef(null);
  const necklacesRef   = useRef(null);

  const scrollBlur = { input: [0, 0.25, 0.6, 1], output: ["10px", "0px", "0px", "10px"] };
  const fromBottom = { yRange: [150, -150], rotateRange: [0,  2], blur: scrollBlur };
  const single     = { yRange: [150, -150], rotateRange: [0, -2], blur: scrollBlur };

  const banglesP1   = useParallax(banglesRef,   { yRange: [-80, 60], rotate: { input: [0, 1], output: [-30, -12] }, blur: scrollBlur });
  const banglesP2   = useParallax(banglesRef,   fromBottom);
  const earringsP1  = useParallax(earringsRef,  fromBottom);
  const earringsP2  = useParallax(earringsRef,  { yRange: [-80, 60], rotateRange: [0, -2], blur: scrollBlur });
  const necklacesP  = useParallax(necklacesRef, single);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleToggleWishlist = (product) => {
    if (isInWishlist(product.id, product.name)) {
      removeFromWishlist(product.id, product.name);
    } else {
      addToWishlist({ ...product, variations: [{ name: product.name, defaultImage: product.image }] },
        { name: product.name, defaultImage: product.image });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(
      { ...product, variations: [{ name: product.name, defaultImage: product.image }] },
      { name: product.name, defaultImage: product.image }
    );
    setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedFeedback(prev => ({ ...prev, [product.id]: false })), 1500);
  };

  const categories = [
    { id: "all", name: "All Bloomy" },
    { id: "bangles", name: "Bangles & Bracelets" },
    { id: "earrings", name: "Earrings" },
    { id: "necklaces", name: "Necklaces" }
  ];

  // Use WC products if available, otherwise fallback
  const products = wcProducts?.length
    ? wcProducts.map(transformWcProduct)
    : fallbackProducts;

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      {/*
        Mobile:  aspect-[4/3] (tall enough to read the image)
        Tablet:  aspect-[16/9]
        Desktop: aspect-[16/7] (original)
      */}
      <section
        className="relative w-full bg-center bg-no-repeat aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7]"
        style={{
          backgroundImage: "url('https://laprimagioielli.com/wp-content/uploads/2025/09/BLOOMY-WEB-scaled.jpg')",
          backgroundSize: "contain"
        }}
      />

      {/* ── Hero Text ───────────────────────────────────────────────── */}
      <section className="w-full bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
            <h1 className="font-barlow text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-[#ec9cb2]">
              BLOOMY<sup className="text-2xl sm:text-3xl md:text-4xl">®</sup>
            </h1>
            <div className="font-inter w-full space-y-2 text-sm sm:text-base leading-relaxed text-[#004065]">
              <p className="font-semibold">Still searching for me?</p>
              <p>Not everyone can find me. Only those with a pure heart will see me bloom.</p>
              <p>
                I was born in a secret Tuscan garden, a flower that opens only under the moon. My scent — white, soft,
                unforgettable — carried through the night before I was ever seen.
              </p>
              <p>
                They say I was born from the moon itself, and maybe that&apos;s why I shine with a beauty so rare, so
                magnetic. Now I live as jewelry — blooming on your skin, lighting up your story, making every moment
                feel alive.
              </p>
              <p>If you want happiness, fall in love with me.</p>
              <p>I am Bloomy. And I was made to bloom with you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bangles & Bracelets ─────────────────────────────────────── */}
      <section ref={banglesRef} className="w-full py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">

            {/* Info column */}
            <div className="flex flex-col items-center space-y-5 sm:space-y-6 text-center text-[#004065]">
              <div className="relative flex items-center justify-center">
                <motion.div style={{ y: banglesP1.y, rotate: banglesP1.rotate, filter: banglesP1.filter }} className="will-change-transform z-20">
                  <img
                    src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_bangle_3d_01.png"
                    alt="Bangle front"
                    className="w-28 sm:w-36 md:w-44"
                  />
                </motion.div>
                <motion.div style={{ y: banglesP2.y, rotate: banglesP2.rotate, filter: banglesP2.filter }} className="will-change-transform z-10 -ml-12 sm:-ml-16 md:-ml-24">
                  <img
                    src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_bangle_3d_02-e1756735534547.png"
                    alt="Bangle back"
                    className="w-24 sm:w-28 md:w-34"
                  />
                </motion.div>
              </div>
              <h2 className="font-barlow text-2xl sm:text-3xl text-[#ec9cb2]">BLOOMY BANGLES & BRACELETS</h2>
              <p className="font-inter w-full text-sm sm:text-base leading-relaxed text-[#004065]">
                The Bloomy bangles and bracelets are all made by 18 KT Gold, polished finish, with a sturdy clasp and diamonds.
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1">
                {[
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/18k_disk.png", label: "Yellow Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/rose_gold_disk.png", label: "Rose Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "Diamonds" }
                ].map(({ src, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <img src={src} alt={label} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                    <span className="font-inter text-[10px] sm:text-xs text-[#004065]">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToProducts}
                className="rounded border border-[#004065] px-6 sm:px-8 py-2.5 sm:py-3 font-barlow text-xs sm:text-sm uppercase tracking-wider text-[#004065] transition-colors hover:bg-[#004065] hover:text-white">
                View Collection
              </button>
            </div>

            {/* Photo */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image
                src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPrimaGioielli_SS26_1912_VERONA-scaled.jpg"
                alt="Bloomy bangles"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Earrings ────────────────────────────────────────────────── */}
      <section ref={earringsRef} className="w-full py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">

            {/* Photo — first on mobile, first on desktop */}
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
              <Image
                src="https://laprimagioielli.com/wp-content/uploads/2025/08/079FE7C9-37FF-493A-8644-8596B48F842B-m.jpg"
                alt="Bloomy earrings"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info column */}
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-4 text-center">
              <div className="relative flex items-center justify-center">
                <motion.div style={{ y: earringsP1.y, rotate: earringsP1.rotate, filter: earringsP1.filter }} className="will-change-transform z-10">
                  <img src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_earrings_3d_02-1.png" alt="Earring 2" className="w-28 sm:w-36 md:w-44" />
                </motion.div>
                <motion.div style={{ y: earringsP2.y, rotate: earringsP2.rotate, filter: earringsP2.filter }} className="will-change-transform z-20">
                  <img src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_earrings_3d_01.png" alt="Earring 1" className="w-24 sm:w-28 md:w-32" />
                </motion.div>
              </div>
              <h2 className="font-barlow text-2xl sm:text-3xl text-[#ec9cb2]">BLOOMY EARRINGS</h2>
              <p className="font-inter w-full text-sm sm:text-base leading-relaxed text-[#004065]">
                The Bloomy earrings are all made by 18 KT Gold, polished finish and diamonds.
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1">
                {[
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/18k_disk.png", label: "Yellow Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/rose_gold_disk.png", label: "Rose Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/white_gold_disk.png", label: "White Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "Diamonds" }
                ].map(({ src, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <img src={src} alt={label} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                    <span className="font-inter text-[10px] sm:text-xs text-[#004065]">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToProducts}
                className="rounded border border-[#004065] px-6 sm:px-8 py-2.5 sm:py-3 font-barlow text-xs sm:text-sm uppercase tracking-wider text-[#004065] hover:bg-[#004065] hover:text-white transition-colors">
                View Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Necklaces ───────────────────────────────────────────────── */}
      <section ref={necklacesRef} className="w-full py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">

            {/* Info — second on mobile (order-2 md:order-1) */}
            <div className="order-2 flex flex-col items-center justify-center space-y-4 text-center md:order-1">
              <motion.div style={{ y: necklacesP.y, rotate: necklacesP.rotate, filter: necklacesP.filter }} className="will-change-transform">
                <img src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_necklace_3D.jpg" alt="Necklace" className="w-28 sm:w-36 md:w-44" />
              </motion.div>
              <h2 className="font-barlow text-2xl sm:text-3xl text-[#ec9cb2]">BLOOMY NECKLACES</h2>
              <p className="font-inter w-full text-sm sm:text-base leading-relaxed text-[#004065]">
                The Bloomy necklaces are all made by 18 KT Gold, polished finish, with a sturdy clasp and diamonds.
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-6 pt-1">
                {[
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/18k_disk.png", label: "Yellow Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/rose_gold_disk.png", label: "Rose Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/white_gold_disk.png", label: "White Gold" },
                  { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "Diamonds" }
                ].map(({ src, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <img src={src} alt={label} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                    <span className="font-inter text-[10px] sm:text-xs text-[#004065]">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToProducts}
                className="rounded border border-[#004065] px-6 sm:px-8 py-2.5 sm:py-3 font-barlow text-xs sm:text-sm uppercase tracking-wider text-[#004065] hover:bg-[#004065] hover:text-white transition-colors">
                View Collection
              </button>
            </div>

            {/* Photo — first on mobile (order-1 md:order-2) */}
            <div className="relative order-1 aspect-square w-full overflow-hidden rounded-sm bg-gray-100 md:order-2">
              <Image
                src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPrimaGioielli_SS26_1548_VERONA-scaled.jpg"
                alt="Bloomy necklaces"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ───────────────────────────────────────────── */}
      <section ref={productsRef} className="bg-white px-4 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">

          {/* Category filter — scrollable row on mobile */}
          <div className="mb-10 sm:mb-14 lg:mb-16 flex justify-start sm:justify-center gap-5 sm:gap-8 overflow-x-auto pb-2 sm:pb-0 px-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 pb-2 text-xs sm:text-sm tracking-widest transition-colors ${
                  activeCategory === cat.id
                    ? "border-b-2 border-[#004065] text-[#004065]"
                    : "text-gray-400 hover:text-[#004065]"
                }`}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Grid — 2 cols on mobile/tablet, 4 on desktop */}
          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
            {filteredProducts.map(product => {
              const hovered = hoveredProducts[product.id] || false;
              const displayedImage = hovered && product.hoverImage ? product.hoverImage : product.image;
              const wasAdded = addedFeedback[product.id] || false;
              const inWishlist = isInWishlist(product.id, product.name);

              return (
                <div key={product.id} className="group flex cursor-pointer flex-col items-center text-center">

                  {/* Image */}
                  <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`} className="mb-3 sm:mb-4 aspect-square w-full overflow-hidden block"
                    onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
                    onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
                    {displayedImage ? (
                      <img
                        src={displayedImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100" />
                    )}
                  </Link>

                  {/* Name */}
                  <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`}>
                    <h3 className="mb-1 font-barlow text-xs sm:text-sm tracking-wide text-[#004065] leading-tight hover:text-[#ec9cb2] transition-colors">{product.name}</h3>
                  </Link>

                  {/* Price + actions */}
                  {product.isActive ? (
                    <>
                      {/* Desktop: hover-reveal */}
                      <div className="relative hidden sm:block h-6 w-full">
                        <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                          {format(product.price)}
                        </p>
                        <div className="absolute left-0 top-0 flex w-full translate-y-2 transform items-center justify-center gap-3 opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`bg-transparent py-0 text-sm font-semibold underline ${wasAdded ? "text-[#ec9cb2]" : "text-[#004065]"}`}>
                            {wasAdded ? "Added ✓" : "Add to Cart"}
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className="flex items-center justify-center transition-transform duration-200 hover:scale-110"
                            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                            <Heart size={14} className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065] hover:text-[#ec9cb2]"}`} />
                          </button>
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="sm:hidden flex flex-col items-center gap-2 w-full mt-1">
                        <p className="font-serif text-xs text-[#004065]">{format(product.price)}</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex items-center gap-1 rounded border px-2.5 py-1 text-[10px] uppercase tracking-wide font-barlow transition-colors ${
                              wasAdded ? "border-[#ec9cb2] text-[#ec9cb2]" : "border-[#004065] text-[#004065] hover:bg-[#004065] hover:text-white"
                            }`}>
                            <ShoppingBag size={10} />
                            {wasAdded ? "Added ✓" : "Add"}
                          </button>
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className="touch-manipulation"
                            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                            <Heart size={14} className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065]"}`} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="font-barlow text-[9px] sm:text-[10px] text-[#ec9cb2] mt-1">
                      AVAILABLE IN YOUR NEAREST STORE
                    </p>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}