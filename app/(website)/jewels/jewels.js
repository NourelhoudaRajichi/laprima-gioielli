"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CollectionsPage() {
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});
  const [activeBangleCategory, setActiveBangleCategory] = useState("all");
  const [activeBraceletCategory, setActiveBraceletCategory] = useState("all");
  const [activeNecklaceCategory, setActiveNecklaceCategory] = useState("all");
  const [activeEarringCategory, setActiveEarringCategory] = useState("all");

  const bangleCategories = [
    { id: "all", name: "All bangles" },
    { id: "Bloomy", name: "Bloomy Bangles" },
    { id: "Velluto", name: "Velluto Bangles" },
    { id: "Verona", name: "Verona Bangles" }
  ];

  const braceletCategories = [
    { id: "all", name: "All bracelets" },
    { id: "Tennis", name: "Tennis Bracelets" },
    { id: "Chain", name: "Chain Bracelets" }
  ];

  const necklaceCategories = [
    { id: "all", name: "All necklaces" },
    { id: "Pendant", name: "Pendant Necklaces" },
    { id: "Pearl", name: "Pearl Necklaces" }
  ];

  const earringCategories = [
    { id: "all", name: "All earrings" },
    { id: "Studs", name: "Stud Earrings" },
    { id: "Hoops", name: "Hoop Earrings" }
  ];

  const allProducts = [
    // BANGLES
    {
      id: 1,
      name: "BLOOMY BANGLE WITH DIAMOND",
      price: "3,670.00",
      category: "bangles",
      type: "Bloomy",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.150.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.152.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 2,
      name: "BLOOMY BANGLE MOTHER OF PEARL",
      price: "3,210.00",
      category: "bangles",
      type: "Bloomy",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage: "/renders/bloomy%20ecommerce.413.jpg",
          hoverImage: "/renders/bloomy%20ecommerce.414.jpg",
          isActive: false
        },
        {
          name: "Rose Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.189.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.187.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 3,
      name: "VELLUTO BANGLE WITH DIAMONDS",
      price: "6,190.00",
      category: "bangles",
      type: "Velluto",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold_diamonds.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 4,
      name: "VERONA BANGLE WITH DIAMONDS",
      price: "6,710.00",
      category: "bangles",
      type: "Verona",
      variations: [
        {
          name: "Rose Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/07/bangle_diamonds_rose_gold_verona_la_prima_gioielli.1785.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2024/07/bangle_diamonds_rose_gold_verona_la_prima_gioielli.1791.jpg",
          isActive: true
        }
      ]
    },

    // BRACELETS
    {
      id: 5,
      name: "DIAMOND TENNIS BRACELET",
      price: "4,850.00",
      category: "bracelets",
      type: "Tennis",
      variations: [
        {
          name: "White Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 6,
      name: "CHAIN LINK BRACELET",
      price: "2,990.00",
      category: "bracelets",
      type: "Chain",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
          isActive: true
        }
      ]
    },

    // NECKLACES
    {
      id: 7,
      name: "DIAMOND PENDANT NECKLACE",
      price: "5,120.00",
      category: "necklaces",
      type: "Pendant",
      variations: [
        {
          name: "White Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 8,
      name: "PEARL STRAND NECKLACE",
      price: "3,450.00",
      category: "necklaces",
      type: "Pearl",
      variations: [
        {
          name: "Classic",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
          isActive: true
        }
      ]
    },

    // EARRINGS
    {
      id: 9,
      name: "DIAMOND STUD EARRINGS",
      price: "4,200.00",
      category: "earrings",
      type: "Studs",
      variations: [
        {
          name: "White Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 10,
      name: "HOOP EARRINGS",
      price: "2,780.00",
      category: "earrings",
      type: "Hoops",
      variations: [
        {
          name: "Rose Gold",
          defaultImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
          hoverImage:
            "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
          isActive: true
        }
      ]
    }
  ];

  const ProductCard = ({ product }) => {
    const hovered = hoveredProducts[product.id] || false;
    const currentVariation =
      selectedVariations[product.id] ||
      product.variations.find(v => v.isActive) ||
      product.variations[0];

    const displayedImage = hovered
      ? currentVariation.hoverImage
      : currentVariation.defaultImage;

    return (
      <div className="group flex cursor-pointer flex-col items-center text-center">
        <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(currentVariation.name || product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(currentVariation.defaultImage)}`}
          className="mb-4 aspect-square w-full overflow-hidden block"
          onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
          onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
          <img
            src={displayedImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(currentVariation.name || product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(currentVariation.defaultImage)}`}>
          <h3 className="mb-1 font-barlow text-sm tracking-wide text-[#004065] hover:text-[#ec9cb2] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="relative h-6 w-full">
          {currentVariation.isActive ? (
            <>
              <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                {product.price} €
              </p>
              <button className="absolute left-0 top-0 w-full translate-y-2 transform bg-transparent py-0 font-semibold text-[#004065] underline opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Add to Cart
              </button>
            </>
          ) : (
            <p className="font-barlow text-[10px] text-[#ec9cb2]">
              AVAILABLE IN YOUR NEAREST STORE
            </p>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          {product.variations.map(v => (
            <button
              key={v.name}
              className={`h-6 w-6 border ${
                currentVariation.name === v.name ? "ring-2 ring-[#004065]" : ""
              }`}
              style={{
                backgroundImage: `url(${v.defaultImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
              onClick={() =>
                setSelectedVariations(prev => ({
                  ...prev,
                  [product.id]: v
                }))
              }></button>
          ))}
        </div>
      </div>
    );
  };

  const filteredBangles =
    activeBangleCategory === "all"
      ? allProducts.filter(p => p.category === "bangles")
      : allProducts.filter(
          p => p.category === "bangles" && p.type === activeBangleCategory
        );

  const filteredBracelets =
    activeBraceletCategory === "all"
      ? allProducts.filter(p => p.category === "bracelets")
      : allProducts.filter(
          p => p.category === "bracelets" && p.type === activeBraceletCategory
        );

  const filteredNecklaces =
    activeNecklaceCategory === "all"
      ? allProducts.filter(p => p.category === "necklaces")
      : allProducts.filter(
          p => p.category === "necklaces" && p.type === activeNecklaceCategory
        );

  const filteredEarrings =
    activeEarringCategory === "all"
      ? allProducts.filter(p => p.category === "earrings")
      : allProducts.filter(
          p => p.category === "earrings" && p.type === activeEarringCategory
        );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="flex py-40 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 font-barlow text-4xl text-[#004065] md:text-5xl lg:text-6xl">
           Bangles
          </h1>
          <div className="space-y-3 text-base leading-relaxed text-[#004065] md:text-lg">
            <p className="italic">I circle your wrist with luminous grace.</p>
            <p>Alone, I am presence.</p>
            <p>Together, we create a symphony of elegance — modern, magnetic, eternal.</p>
          </div>
        </div>
      </section>

      {/* BANGLES SECTION */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-barlow text-3xl tracking-tight text-[#004065]">
            BANGLES
          </h2>

          <div className="mb-8 flex justify-center gap-8">
            {bangleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveBangleCategory(cat.id)}
                className={`pb-2 text-sm tracking-widest ${
                  activeBangleCategory === cat.id
                    ? "border-b-2 border-[#004065]"
                    : "text-gray-400"
                }`}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredBangles.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
       <section className="flex py-40 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 font-barlow text-4xl text-[#004065] md:text-5xl lg:text-6xl">
           Bracelets
          </h1>
          <div className="space-y-3 text-base leading-relaxed text-[#004065] md:text-lg">
            <p className="italic">Shaped with refinement, I shine on the wrist with sophistication and vitality.</p>
            <p>Natural stones and diamonds flow through me, glowing with elegance in every movement.</p>
        
          </div>
        </div>
      </section>
       {/* bracelets SECTION */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-barlow text-3xl tracking-tight text-[#004065]">
            Bracelets
          </h2>

          <div className="mb-8 flex justify-center gap-8">
            {bangleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveBangleCategory(cat.id)}
                className={`pb-2 text-sm tracking-widest ${
                  activeBangleCategory === cat.id
                    ? "border-b-2 border-[#004065]"
                    : "text-gray-400"
                }`}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredBangles.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
 

     <section className="flex py-40 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 font-barlow text-4xl text-[#004065] md:text-5xl lg:text-6xl">
           Necklace
          </h1>
          <div className="space-y-3 text-base leading-relaxed text-[#004065] md:text-lg">
            <p className="italic">I rest on your skin like a secret.</p>
            <p>I breathe in gold, I exhale diamonds.</p>
            <p>With every color, every stone, I tell you — I was made to shine with you.</p>
          </div>
        </div>
      </section>
       {/* Necklace SECTION */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-barlow text-3xl tracking-tight text-[#004065]">
            Necklace
          </h2>

          <div className="mb-8 flex justify-center gap-8">
            {bangleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveBangleCategory(cat.id)}
                className={`pb-2 text-sm tracking-widest ${
                  activeBangleCategory === cat.id
                    ? "border-b-2 border-[#004065]"
                    : "text-gray-400"
                }`}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredBangles.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

   <section className="flex py-40 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-8 font-barlow text-4xl text-[#004065] md:text-5xl lg:text-6xl">
           Earrings
          </h1>
          <div className="space-y-3 text-base leading-relaxed text-[#004065] md:text-lg">
            <p className="italic">I am light in motion.</p>
            <p>I sparkle when you turn, I dance when you smile.</p>
            <p>In gold and diamonds, I carry a brilliance that is modern, magnetic, unforgettable.</p>
          </div>
        </div>
      </section>
       {/* Earrings SECTION */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center font-barlow text-3xl tracking-tight text-[#004065]">
            Earrings
          </h2>

          <div className="mb-8 flex justify-center gap-8">
            {bangleCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveBangleCategory(cat.id)}
                className={`pb-2 text-sm tracking-widest ${
                  activeBangleCategory === cat.id
                    ? "border-b-2 border-[#004065]"
                    : "text-gray-400"
                }`}>
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredBangles.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

  
    </div>
  );
}