"use client";

import { React, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useCart } from "../../../components/Context";

export default function CollectionsPage() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [selectedVariations, setSelectedVariations] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});
  const [wishlistFeedback, setWishlistFeedback] = useState({});

  const categories = [
    {
      id: 1,
      title: "BRACELETS",
      image: "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
      link: "/bracelets"
    },
    {
      id: 2,
      title: "EARRINGS",
      image: "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
      link: "/earrings"
    },
    {
      id: 3,
      title: "NECKLACES",
      image: "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
      link: "/necklaces"
    }
  ];

  const ref = useRef(null);
  const productsRef = useRef(null);

  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 500], ["10px", "0px"]);
  const scale = useTransform(scrollY, [0, 500], [1.2, 1]);
  const rotate = useTransform(scrollY, [0, 500], [-10, 0]);
  const translateY = useTransform(scrollY, [0, 500], [50, 0]);
  const opacity = useTransform(scrollY, [0, 500], [0, 1]);


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

  const categorie = [
    { id: "all", name: "All " },
    { id: "Bloomy", name: "Bloomy " },
    { id: "Velluto", name: "Velluto " },
    { id: "Verona", name: "Verona " }
  ];

  const products = [
    {
      id: 1,
      name: "BLOOMY BANGLE WITH DIAMOND",
      price: "3,670.00",
      category: "bangles",
      type: "Bloomy",
      stone: "diamond",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.150.jpg",
          hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.152.jpg",
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
      stone: "MOTHER OF PEARL",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage: "/renders/bloomy%20ecommerce.413.jpg",
          hoverImage: "/renders/bloomy%20ecommerce.414.jpg",
          isActive: false
        },
        {
          name: "Rose Gold",
          defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.189.jpg",
          hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/08/bloomy.187.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 3,
      name: "VELLUTO BANGLE WITH DIAMONDS",
      price: "6,190.00",
      category: "Bangles",
      type: "Velluto",
      stone: "diamond",
      variations: [
        {
          name: "Yellow Gold",
          defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold.jpg",
          hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/07/Velluto_Bangle_yellow_gold_diamonds.jpg",
          isActive: true
        }
      ]
    },
    {
      id: 4,
      name: "BLOOMY WITH LAPIS AND DIAMONDS",
      price: "6,710.00",
      category: "Bangles",
      type: "Verona",
      stone: "diamond",
      variations: [
        {
          name: "Rose Gold",
          defaultImage: "https://laprimagioielli.com/wp-content/uploads/2024/07/bangle_diamonds_rose_gold_verona_la_prima_gioielli.1785.jpg",
          hoverImage: "https://laprimagioielli.com/wp-content/uploads/2024/07/bangle_diamonds_rose_gold_verona_la_prima_gioielli.1791.jpg",
          isActive: true
        }
      ]
    }
  ];

  const filteredProducts = products
    .filter(p => p.stone === "diamond")
    .filter(p => activeCategory === "all" || p.type === activeCategory);

  return (
    <>
      <div className="bg-white">
        <section className="flex py-40 items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-12 font-barlow text-[45px] text-[#004065] leading-tight uppercase">
              DIAMONDS
            </h1>
            <div className="mx-auto h-[2px] w-16 bg-[#004065]"></div>
          </div>
        </section>

        {/* Products Grid */}
        <section ref={productsRef} className="bg-white px-4 pt-5 pb-24">
          <div className="mx-auto max-w-7xl">
            {/* Category Filter */}
            <div className="mb-8 flex justify-center gap-8">
              {categorie.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`pb-2 text-sm tracking-widest ${
                    activeCategory === cat.id ? "border-b-2 border-[#004065]" : "text-gray-400"
                  }`}>
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map(product => {
                const hovered = hoveredProducts[product.id] || false;
                const currentVariation =
                  selectedVariations[product.id] ||
                  product.variations.find(v => v.isActive) ||
                  product.variations[0];
                const displayedImage = hovered ? currentVariation.hoverImage : currentVariation.defaultImage;
                const wasAdded = addedFeedback[product.id] || false;
              const inWishlist = isInWishlist(product.id, currentVariation.name);

                return (
                  <div key={product.id} className="group flex cursor-pointer flex-col items-center text-center">
                    <div
                      className="mb-4 aspect-square w-full overflow-hidden"
                      onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
                      onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
                      <img
                        src={displayedImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <h3 className="mb-1 font-barlow text-sm tracking-wide text-[#004065]">{product.name}</h3>

                    <div className="relative h-6 w-full">
                      {currentVariation.isActive ? (
                        <>
                          <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                            € {product.price}
                          </p>
                          <div className="absolute left-0 top-0 flex w-full translate-y-2 transform items-center justify-center gap-3 opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleAddToCart(product, currentVariation)}
                              className={`bg-transparent py-0 font-semibold underline ${
                                wasAdded ? "text-[#ec9cb2]" : "text-[#004065]"
                              }`}>
                              {wasAdded ? "Added ✓" : "Add to Cart"}
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(product, currentVariation)}
                              className="flex items-center justify-center transition-transform duration-200 hover:scale-110"
                              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                              <Heart
                                size={14}
                                className={`transition-colors duration-200 ${
                                  inWishlist ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065] hover:text-[#ec9cb2]"
                                }`}
                              />
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="font-barlow font-serif text-[10px] text-[#ec9cb2]">
                          AVAILABLE IN YOUR NEAREST STORE
                        </p>
                      )}
                    </div>

                    <div className="mt-2 flex gap-2">
                      {product.variations.map(v => (
                        <button
                          key={v.name}
                          className={`squared-full h-6 w-6 border ${
                            currentVariation.name === v.name ? "ring-2 ring-[#004065]" : ""
                          }`}
                          style={{
                            backgroundImage: `url(${v.defaultImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                          }}
                          onClick={() => setSelectedVariations(prev => ({ ...prev, [product.id]: v }))}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section className="mt-24 w-full bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center font-barlow text-3xl tracking-tight text-[#004065] md:text-4xl lg:text-3xl">
              DISCOVER All JEWELS
            </h2>
            <div className="flex justify-center">
              <div className="grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map(cat => (
                  <a
                    key={cat.id}
                    href={cat.link}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-gray-100">
                    <img
                      src={cat.image}
                      className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-125"
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-700 group-hover:bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-center text-xl font-bold tracking-wide text-white drop-shadow-lg md:text-2xl">
                        {cat.title}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}