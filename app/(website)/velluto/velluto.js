"use client";

import React, { useState, useRef } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "../../../components/Context";

export default function VellutoCollection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const productsRef = useRef(null);

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

  const products = [
    {
      id: 1,
      name: "BLOOMY BANGLE WITH DIAMOND",
      price: "3,670.00",
      category: "bangles",
      variations: [{ name: "Yellow Gold", defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.189.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.187.jpg", isActive: true }]
    },
    {
      id: 2,
      name: "BLOOMY BRACELET WITH DIAMONDS",
      price: "1,730.00",
      category: "bangles",
      variations: [{ name: "Yellow Gold", defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.98.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.97.jpg", isActive: true }]
    },
    {
      id: 3,
      name: "BLOOMY BANGLE MOTHER OF PEARL",
      price: "3,210.00",
      category: "bangles",
      variations: [
        { name: "Yellow Gold", defaultImage: "/renders/bloomy%20ecommerce.413.jpg", hoverImage: "/renders/bloomy%20ecommerce.414.jpg", isActive: false },
        { name: "Rose Gold", defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.108.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.109.jpg", isActive: true }
      ]
    },
    {
      id: 4,
      name: "BLOOMY EARRINGS WITH DIAMONDS",
      price: "2,590.00",
      category: "earrings",
      variations: [
        { name: "Yellow Gold", defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/09/Bloomy_earrings_gold_diamonds.1441-1920x1920.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/09/Bloomy_earrings_gold_diamonds.1442-1920x1920.jpg", isActive: true },
        { name: "White Gold", defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/09/Bloomy_earrings_gold_diamonds.1444-1920x1920.jpg", hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/09/Bloomy_earrings_gold_diamonds.1443-1920x1920.jpg", isActive: true }
      ]
    }
  ];

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
    const currentVariation = selectedVariations[product.id] || product.variations.find(v => v.isActive) || product.variations[0];
    const displayedImage = hovered ? currentVariation.hoverImage : currentVariation.defaultImage;
    const wasAdded = addedFeedback[product.id] || false;
    const inWishlist = isInWishlist(product.id, currentVariation.name);

    return (
      <div className="group flex cursor-pointer flex-col items-center text-center">
        <div
          className="mb-3 sm:mb-4 aspect-square w-full overflow-hidden"
          onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
          onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
          <img src={displayedImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>

        <h3 className="mb-1 font-barlow text-xs sm:text-sm tracking-wide text-[#004065] leading-tight">{product.name}</h3>

        {currentVariation.isActive ? (
          <>
            {/* Desktop: hover-reveal */}
            <div className="relative hidden sm:block h-6 w-full">
              <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                € {product.price}
              </p>
              <div className="absolute left-0 top-0 flex w-full translate-y-2 transform items-center justify-center gap-3 opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <button onClick={() => handleAddToCart(product, currentVariation)} className={`bg-transparent py-0 text-sm font-semibold underline ${wasAdded ? "text-[#ec9cb2]" : "text-[#004065]"}`}>
                  {wasAdded ? "Added ✓" : "Add to Cart"}
                </button>
                <button onClick={() => handleToggleWishlist(product, currentVariation)} className="flex items-center justify-center transition-transform duration-200 hover:scale-110">
                  <Heart size={14} className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065] hover:text-[#ec9cb2]"}`} />
                </button>
              </div>
            </div>

            {/* Mobile: always visible */}
            <div className="sm:hidden flex flex-col items-center gap-2 w-full mt-1">
              <p className="font-serif text-xs text-[#004065]">€ {product.price}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(product, currentVariation)}
                  className={`flex items-center gap-1 rounded border px-2.5 py-1 text-[10px] uppercase tracking-wide font-barlow transition-colors ${wasAdded ? "border-[#ec9cb2] text-[#ec9cb2]" : "border-[#004065] text-[#004065]"}`}>
                  <ShoppingBag size={10} />
                  {wasAdded ? "Added ✓" : "Add"}
                </button>
                <button onClick={() => handleToggleWishlist(product, currentVariation)} className="touch-manipulation">
                  <Heart size={14} className={`transition-colors duration-200 ${inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065]"}`} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="font-barlow text-[9px] sm:text-[10px] text-[#ec9cb2] mt-1">AVAILABLE IN YOUR NEAREST STORE</p>
        )}

        <div className="mt-2 flex gap-1.5 sm:gap-2">
          {product.variations.map(v => (
            <button
              key={v.name}
              className={`h-5 w-5 sm:h-6 sm:w-6 border touch-manipulation ${currentVariation.name === v.name ? "ring-2 ring-[#004065]" : ""}`}
              style={{ backgroundImage: `url(${v.defaultImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
              onClick={() => setSelectedVariations(prev => ({ ...prev, [product.id]: v }))}
              title={v.name}
            />
          ))}
        </div>
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
      <section className="w-full py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-5 sm:space-y-6 text-center text-[#004065]">
              <div className="relative flex items-center justify-center">
                <img src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png" alt="Bangle front" className="z-20 w-28 sm:w-36 md:w-44" />
                <img src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.png" alt="Bangle back" className="z-10 -ml-12 sm:-ml-16 md:-ml-24 w-24 sm:w-28 md:w-34" />
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
      <section className="w-full py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
              <Image src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPrimaGioielli_SS26_0578_VELLUTO-scaled.jpg" alt="Velluto earrings" fill className="object-cover" priority />
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex items-center justify-center">
                <img src="https://laprimagioielli.com/wp-content/uploads/2024/07/velluto_earring_3d.459.png" alt="Front earring" className="relative z-20 w-20 sm:w-24 scale-75" />
                <img src="https://laprimagioielli.com/wp-content/uploads/2024/07/velluto_earring_3d.458.png" alt="Back earring" className="-ml-4 relative z-10 w-20 sm:w-24 md:w-28" />
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
      <section className="w-full py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
            <div className="order-2 flex flex-col items-center justify-center space-y-4 text-center md:order-1">
              <img src="https://laprimagioielli.com/wp-content/uploads/2024/05/velluto_necklace_3D.jpg" alt="Necklace" className="w-28 sm:w-36 md:w-44" />
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