"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/components/CurrencyContext";
import Image from "next/image";
import { useCart } from "../../../components/Context";

function catToUI(slug = "", name = "") {
  const s = slug.toLowerCase(), n = name.toLowerCase();
  if (s === "bangles"   || n === "bangles")   return "bangles";
  if (s === "bracelets" || n === "bracelets") return "bangles";
  if (s === "earring"   || n === "earring" || s === "earrings" || n === "earrings") return "earrings";
  if (s === "necklaces" || n === "necklaces") return "necklaces";
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
  const uiCat  = p._subCat ? catToUI(p._subCat.slug || "", p._subCat.name || "") : null;
  return {
    id: p.id,
    name: (p.name || "").toUpperCase(),
    price: p.price ? formatPrice(p.price) : "—",
    category: uiCat ?? guessFromName(p.name),
    image: images[0]?.src ?? "",
    hoverImage: images[1]?.src ?? "",
    isActive: p.status === "publish" && parseFloat(p.price || "0") > 0,
    sku: p.sku || "",
  };
}
const fallbackProducts = [
  { id: 1, name: "VELLUTO BANGLE WITH DIAMOND", price: "3,670.00", category: "bangles", image: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.189.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.187.jpg", isActive: true },
  { id: 2, name: "VELLUTO BRACELET WITH DIAMONDS", price: "1,730.00", category: "bangles", image: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.98.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.97.jpg", isActive: true },
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

export default function VellutoCollection({ wcProducts }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { format } = useCurrency();
  const productsRef    = useRef(null);
  const banglesRef     = useRef(null);
  const earringsRef    = useRef(null);
  const necklacesRef   = useRef(null);

  const fromBottom = { yRange: [150, -150], rotateRange: [0, 2] };
  const single     = { yRange: [150, -150], rotateRange: [0, -2] };

  const banglesP1   = useParallax(banglesRef,   { yRange: [-80,   60], rotate: { input: [0, 1], output: [-30, -12] } });
  const banglesP2   = useParallax(banglesRef,   fromBottom);
  const earringBlur = { input: [0, 0.4, 0.6, 1], output: ["6px", "0px", "0px", "6px"] };
  const earringsP1  = useParallax(earringsRef,  { yRange: [-80,  60], rotateRange: [0, 0], blur: earringBlur });
  const earringsP2  = useParallax(earringsRef,  { yRange: [80, -80], rotate: { input: [0, 1], output: [-15, -8] }, blur: earringBlur });
  const necklacesP  = useParallax(necklacesRef, single);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleToggleWishlist = (product, variation) => {
    if (isInWishlist(product.id, variation.name)) {
      removeFromWishlist(product.id, variation.name);
    } else {
      addToWishlist(product, variation);
    }
  };

  const handleAddToCart = (product, variation) => {
    addToCart(product, variation);
    setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const categories = [
    { id: "all", name: "All Velluto" },
    { id: "bangles", name: "Bangles & Bracelets" },
    { id: "earrings", name: "Earrings" },
    { id: "necklaces", name: "Necklaces" }
  ];

  const products = wcProducts?.length ? wcProducts.map(transformWcProduct) : fallbackProducts;
  const filteredProducts = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory);

  const Materials = ({ items }) => (
    <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 pt-1">
      {items.map(({ src, label }) => (
        <div key={label + src} className="flex flex-col items-center gap-1.5 sm:gap-2">
          <img src={src} alt={label} className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
          <span className="font-inter text-[10px] sm:text-xs text-[#004065]">{label}</span>
        </div>
      ))}
    </div>
  );

  const ViewBtn = () => (
    <button
      onClick={scrollToProducts}
      className="rounded border border-[#004065] px-6 sm:px-8 py-2.5 sm:py-3 font-barlow text-xs sm:text-sm uppercase tracking-wider text-[#004065] transition-colors hover:bg-[#004065] hover:text-white">
      View Collection
    </button>
  );

  const ProductCard = ({ product }) => {
    const hovered = hoveredProducts[product.id] || false;
    const displayedImage = hovered && product.hoverImage ? product.hoverImage : product.image;
    const wasAdded = addedFeedback[product.id] || false;
    const inWishlist = isInWishlist(product.id, product.name);

    const handleCart = () => {
      addToCart({ ...product, variations: [{ name: product.name, defaultImage: product.image }] }, { name: product.name, defaultImage: product.image });
      setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => setAddedFeedback(prev => ({ ...prev, [product.id]: false })), 1500);
    };
    const handleWishlist = () => {
      if (isInWishlist(product.id, product.name)) removeFromWishlist(product.id, product.name);
      else addToWishlist({ ...product, variations: [{ name: product.name, defaultImage: product.image }] }, { name: product.name, defaultImage: product.image });
    };

    return (
      <div className="group flex cursor-pointer flex-col items-center text-center">
        <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`} className="mb-3 sm:mb-4 aspect-square w-full overflow-hidden block"
          onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
          onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
          {displayedImage
            ? <img src={displayedImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            : <div className="h-full w-full bg-gray-100" />}
        </Link>

        <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(product.image)}`}>
          <h3 className="mb-1 font-barlow text-xs sm:text-sm tracking-wide text-[#004065] leading-tight hover:text-[#ec9cb2] transition-colors">{product.name}</h3>
        </Link>

        {product.isActive ? (
          <>
            <div className="relative hidden sm:block h-6 w-full">
              <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">{format(product.price)}</p>
              <div className="absolute left-0 top-0 flex w-full translate-y-2 transform items-center justify-center gap-3 opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <button onClick={handleCart} className={`bg-transparent py-0 text-sm font-semibold underline ${wasAdded ? "text-[#ec9cb2]" : "text-[#004065]"}`}>
                  {wasAdded ? "Added ✓" : "Add to Cart"}
                </button>
                <button onClick={handleWishlist} className="flex items-center justify-center transition-transform duration-200 hover:scale-110">
                  <Heart size={14} className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065] hover:text-[#ec9cb2]"}`} />
                </button>
              </div>
            </div>
            <div className="sm:hidden flex flex-col items-center gap-2 w-full mt-1">
              <p className="font-serif text-xs text-[#004065]">{format(product.price)}</p>
              <div className="flex items-center gap-3">
                <button onClick={handleCart} className={`flex items-center gap-1 rounded border px-2.5 py-1 text-[10px] uppercase tracking-wide font-barlow transition-colors ${wasAdded ? "border-[#ec9cb2] text-[#ec9cb2]" : "border-[#004065] text-[#004065]"}`}>
                  <ShoppingBag size={10} />{wasAdded ? "Added ✓" : "Add"}
                </button>
                <button onClick={handleWishlist} className="touch-manipulation">
                  <Heart size={14} className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065]"}`} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="font-barlow text-[9px] sm:text-[10px] text-[#ec9cb2] mt-1">AVAILABLE IN YOUR NEAREST STORE</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">

      {/* ── Hero Banner ─────────────────────────────────────────────── */}
      <section
        className="relative w-full bg-center bg-no-repeat aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7]"
        style={{ backgroundImage: "url('https://laprimagioielli.com/wp-content/uploads/2025/09/velluto-web-scaled.jpg')", backgroundSize: "contain" }}
      />

      {/* ── Hero Text ───────────────────────────────────────────────── */}
      <section className="w-full bg-white py-10 sm:py-14 lg:py-16">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-10 lg:px-16">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
            <h1 className="font-barlow text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide text-[#ec9cb2]">VELLUTO</h1>
            <div className="font-inter w-full space-y-2 text-sm sm:text-base leading-relaxed text-[#004065]">
              <p>Shhh… can you feel it?</p>
              <p className="font-bold">I am Velluto.</p>
              <p>I was born in the palaces of Genoa, Venice, and Florence, when velvet was more than a fabric — it was a masterpiece.</p>
              <p>Woven through a unique process, velvet became the symbol of luxury: soft as a whisper, powerful enough to dress emperors and queens.</p>
              <p>Today, I am that same masterpiece, reborn as jewelry. Gold is my fabric, light is my texture, and every cage-like detail carries the rhythm of velvet&apos;s creation — intricate, magnetic, unforgettable.</p>
              <p>On your skin, I&apos;m not just seen — I&apos;m felt.</p>
              <p>I am confidence, presence, emotion.</p>
              <p>I am Velluto — timeless beauty with a pulse, alive in every moment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bangles ─────────────────────────────────────────────────── */}
      <section ref={banglesRef} className="w-full py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-5 sm:space-y-6 text-center text-[#004065]">
              <div className="relative flex items-center justify-center">
                <motion.div style={{ y: banglesP1.y, rotate: banglesP1.rotate }} className="will-change-transform z-20">
                  <img src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png" alt="Bangle front" className="w-28 sm:w-36 md:w-44" />
                </motion.div>
                <motion.div style={{ y: banglesP2.y, rotate: banglesP2.rotate }} className="will-change-transform z-10 -ml-12 sm:-ml-16 md:-ml-24">
                  <img src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.png" alt="Bangle back" className="w-24 sm:w-28 md:w-34" />
                </motion.div>
              </div>
              <h2 className="font-barlow text-2xl sm:text-3xl text-[#ec9cb2]">VELLUTO BANGLES</h2>
              <p className="font-inter w-full text-sm sm:text-base leading-relaxed text-[#004065]">
                The Velluto bangles are all made by a 18 KT Gold, polished finish, with a sturdy clasp and diamonds.
              </p>
              <Materials items={[
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/18k_disk.png", label: "Yellow Gold" },
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "5 Diamonds" }
              ]} />
              <ViewBtn />
            </div>
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Image src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPimaGioielli_SS26_7223_VELLUTO-scaled.jpg" alt="Velluto bangles" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ── Earrings ────────────────────────────────────────────────── */}
      <section ref={earringsRef} className="w-full py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
              <Image src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPrimaGioielli_SS26_0578_VELLUTO-scaled.jpg" alt="Velluto earrings" fill className="object-cover" priority />
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex items-center justify-center">
                <motion.div style={{ y: earringsP1.y, rotate: earringsP1.rotate, filter: earringsP1.filter }} className="will-change-transform z-20">
                  <img src="https://laprimagioielli.com/wp-content/uploads/2024/07/velluto_earring_3d.459.png" alt="Front earring" className="w-16 sm:w-20 md:w-24" />
                </motion.div>
                <motion.div style={{ y: earringsP2.y, rotate: earringsP2.rotate, filter: earringsP2.filter }} className="will-change-transform z-10 -ml-4 sm:-ml-6">
                  <img src="https://laprimagioielli.com/wp-content/uploads/2024/07/velluto_earring_3d.458.png" alt="Back earring" className="w-36 sm:w-40 md:w-48" />
                </motion.div>
              </div>
              <h2 className="font-barlow text-2xl sm:text-3xl text-[#ec9cb2]">VELLUTO EARRINGS</h2>
              <p className="font-inter w-full text-sm sm:text-base leading-relaxed text-[#004065]">
                The Velluto earrings are all made by a 18 KT Gold, polished finish and diamonds.
              </p>
              <Materials items={[
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/18k_disk.png", label: "Yellow Gold" },
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "1 Diamond" },
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "5 Diamonds" }
              ]} />
              <ViewBtn />
            </div>
          </div>
        </div>
      </section>

      {/* ── Necklaces ───────────────────────────────────────────────── */}
      <section ref={necklacesRef} className="w-full py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
            <div className="order-2 flex flex-col items-center justify-center space-y-4 text-center md:order-1">
              <motion.div style={{ y: necklacesP.y, rotate: necklacesP.rotate }} className="will-change-transform">
                <img src="https://laprimagioielli.com/wp-content/uploads/2024/05/velluto_necklace_3D.jpg" alt="Necklace" className="w-28 sm:w-36 md:w-44" />
              </motion.div>
              <h2 className="font-barlow text-2xl sm:text-3xl text-[#ec9cb2]">VELLUTO NECKLACES</h2>
              <p className="font-inter w-full text-sm sm:text-base leading-relaxed text-[#004065]">
                The Velluto necklaces are all made by a 18 KT Gold, polished finish, with a sturdy clasp and diamonds.
              </p>
              <Materials items={[
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/18k_disk.png", label: "Yellow Gold" },
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "1 Diamond" },
                { src: "https://laprimagioielli.com/wp-content/uploads/2024/04/diamond-side.png", label: "5 Diamonds" }
              ]} />
              <ViewBtn />
            </div>
            <div className="relative order-1 aspect-square w-full overflow-hidden rounded-sm bg-gray-100 md:order-2">
              <Image src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPimaGioielli_SS26_7368_VELLUTO-scaled.jpg" alt="Velluto necklaces" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ───────────────────────────────────────────── */}
      <section ref={productsRef} className="bg-white px-4 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-14 lg:mb-16 flex justify-start sm:justify-center gap-5 sm:gap-8 overflow-x-auto pb-2 sm:pb-0 px-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 pb-2 text-xs sm:text-sm tracking-widest transition-colors ${
                  activeCategory === cat.id ? "border-b-2 border-[#004065] text-[#004065]" : "text-gray-400 hover:text-[#004065]"
                }`}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </div>
  );
}