"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  ChevronRight,
  Minus,
  Plus,
  Check,
  X,
  Twitter,
  Facebook,
  Mail,
  Copy
} from "lucide-react";
import { useCart } from "../../../components/Context";

const ProductPage = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomedImageIndex, setZoomedImageIndex] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [hoveredProducts, setHoveredProducts] = useState({});
  const [addedFeedback, setAddedFeedback] = useState({});
  const [mainAdded, setMainAdded] = useState(false);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const imageRefs = useRef([]);
  const containerRef = useRef(null);

  const mainProduct = {
    id: "verona-earrings-3diamonds",
    name: "Verona Earrings with 3 Diamonds",
    price: "2,450.00",
    variations: [
      {
        name: "Rose Gold",
        defaultImage:
          "https://laprimagioielli.com/wp-content/uploads/2024/07/earrings_gold_diamonds_la_prima_gioielli.2169.jpg",
        isActive: true
      }
    ]
  };

  const mainVariation = mainProduct.variations[0];
  const liked = isInWishlist(mainProduct.id, mainVariation.name);

  const images = [
    "https://laprimagioielli.com/wp-content/uploads/2024/07/earrings_gold_diamonds_la_prima_gioielli.2169.jpg",
    "https://laprimagioielli.com/wp-content/uploads/2024/07/LA_PRIMA_GIOIELLI_verona_earrings_model.jpg"
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

  const handleMainAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(mainProduct, mainVariation);
    }
    setMainAdded(true);
    setTimeout(() => setMainAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    if (liked) {
      removeFromWishlist(mainProduct.id, mainVariation.name);
    } else {
      addToWishlist(mainProduct, mainVariation);
    }
  };

  const handleRelatedAddToCart = (product, variation) => {
    addToCart(product, variation);
    setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const handleMouseMove = (e, idx) => {
    if (zoomedImageIndex !== idx) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let maxVisibleIndex = 0;
      let maxVisibleArea = 0;
      imageRefs.current.forEach((img, idx) => {
        if (!img) return;
        const rect = img.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          maxVisibleIndex = idx;
        }
      });
      setActiveIndex(maxVisibleIndex);
      const lastImage = imageRefs.current[images.length - 1];
      if (lastImage) {
        const rect = lastImage.getBoundingClientRect();
        setShowScrollIndicator(rect.bottom > window.innerHeight / 2);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  useEffect(() => {
    document.body.style.overflow = fullscreenImage !== null ? "hidden" : "unset";
  }, [fullscreenImage]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

            {/* LEFT – IMAGES */}
            <div className="relative" ref={containerRef}>
              <div className="space-y-10">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    ref={el => { if (el) imageRefs.current[idx] = el; }}
                    className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-50"
                    onMouseEnter={() => setZoomedImageIndex(idx)}
                    onMouseLeave={() => setZoomedImageIndex(null)}
                    onMouseMove={e => handleMouseMove(e, idx)}
                    onClick={() => setFullscreenImage(idx)}>
                    <img
                      src={img}
                      alt={`Verona Earrings ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300"
                      style={
                        zoomedImageIndex === idx
                          ? { transform: "scale(2)", transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }
                          : {}
                      }
                    />
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-gray-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Plus className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>

              {showScrollIndicator && (
                <div className="fixed right-6 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 lg:right-[calc((100vw-1280px)/2+616px+24px)]">
                  {images.map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className={`h-2 w-2 rounded-full transition-all duration-300 ${activeIndex === idx ? "scale-110 bg-gray-900" : "bg-gray-400"}`} />
                      {idx < images.length - 1 && <span className="h-6 w-px bg-gray-400" />}
                    </React.Fragment>
                  ))}
                  <span className="text-xs text-gray-400 transition-transform duration-300" style={{ transform: `translateY(${activeIndex * 44}px)` }}>↓</span>
                </div>
              )}
            </div>

            {/* RIGHT – PRODUCT DETAILS */}
            <div className="sticky top-28 space-y-6 self-start">
              <nav className="flex items-center text-sm font-bold text-[#004065]">
                <a href="#" className="hover:underline">Home</a>
                <ChevronRight className="mx-2 h-4 w-4" />
                <span className="font-bold text-[#004065]">Earrings</span>
              </nav>

              <h1 className="font-barlow text-3xl font-bold uppercase text-[#004065]">
                Verona Earrings with 3 Diamonds
              </h1>

              <p className="font-barlow text-[#004065]">Verona earrings in 18KT Rose Gold with 3 diamonds</p>
              <div className="text-1xl font-inter text-gray-900">2.450,00 €</div>
              <p className="font-inter text-sm text-gray-500">Delivery expected in 2–5 working days</p>

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="font-barlow text-[#004065]">Product details</h3>
                {isExpanded && (
                  <>
                    <div className="font-inter space-y-2 font-barlow text-sm text-[#004065]">
                      <p className="font-semibold text-[#004065]">Diamonds</p>
                      <p>– Weight: 0.102 CT</p>
                      <p>– Purity: VS</p>
                      <p>– Color: G</p>
                      <p>– Cut: round brilliant</p>
                    </div>
                    <div className="space-y-1 font-barlow text-sm text-[#004065]">
                      <p className="font-semibold">Gold</p>
                      <p>18KT Rose polished</p>
                    </div>
                    <div className="space-y-1 font-barlow text-sm text-[#004065]">
                      <p className="font-semibold">Size</p>
                      <p>18.5 × 14 mm</p>
                    </div>
                    <p className="font-barlow text-sm italic text-[#004065]">Being handmade, slight variations may occur.</p>
                  </>
                )}
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-medium text-gray-500 hover:underline">
                  {isExpanded ? "Read less" : "Read more"}
                </button>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-500">
                  <Check className="h-3 w-3 text-gray-500" />
                </div>
                <span className="font-barlow font-medium">IN STOCK</span>
              </div>

              {/* Quantity & Cart */}
              <div className="flex gap-4">
                <div className="flex items-center rounded-lg border border-gray-300">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-12 border-x border-gray-300 text-center outline-none"
                  />
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-50">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleMainAddToCart}
                  className={`px-7 py-3 font-barlow text-sm font-semibold transition ${
                    mainAdded ? "bg-[#ec9cb2] text-white" : "bg-[#f8e3e8] text-[#004065] hover:bg-[#ec9cb2] hover:text-white"
                  }`}>
                  {mainAdded ? "ADDED ✓" : "ADD TO CART"}
                </button>

                {/* ✅ Wishlist button — toggles & syncs with context */}
                <button
                  onClick={handleToggleWishlist}
                  className="group relative flex items-center gap-2 text-sm font-medium text-[#004065]">
                  <Heart
                    className={`h-5 w-5 transition-colors duration-300 ${
                      liked ? "fill-[#ec9cb2] text-[#ec9cb2]" : "text-[#004065] group-hover:text-[#ec9cb2]"
                    }`}
                  />
                  <span className="relative overflow-hidden font-barlow text-[#004065]">
                    {liked ? "IN WISHLIST" : "ADD TO WISHLIST"}
                    <span className="absolute bottom-0 left-0 h-[1.5px] w-full origin-right scale-x-0 transform bg-[#004065] transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </button>
              </div>

              <p className="text-sm text-gray-500">SKU: VRN0009EAFUPE00DAU750_R</p>

              {/* Share */}
              <div className="flex items-center gap-3 border-t pt-4">
                <span className="text-sm font-medium text-[#004065]">SHARE</span>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-[#004065] transition hover:text-[#ec9cb2]">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-[#004065] transition hover:text-[#ec9cb2]">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="p-2 text-[#004065] transition hover:text-[#ec9cb2]" title="WhatsApp">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M20.5 3.5A10.5 10.5 0 003.2 18.6L2 22l3.5-.9A10.5 10.5 0 1020.5 3.5zm-8.4 15a8.2 8.2 0 01-4.2-1.2l-.3-.2-2.5.7.7-2.4-.2-.3a8.3 8.3 0 1110.4 3.4zm4.5-6.2c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.6.7-.7.9-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.3-.6 1.5-1.1.2-.5.2-.9.1-1-.1-.1-.3-.2-.5-.3z" />
                  </svg>
                </a>
                <a href={`mailto:?subject=Check this product&body=${encodeURIComponent(currentUrl)}`} className="p-2 text-[#004065] transition hover:text-[#ec9cb2]">
                  <Mail className="h-5 w-5" />
                </a>
                <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="p-2 text-[#004065] transition hover:text-[#ec9cb2]">
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Modal */}
        {fullscreenImage !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setFullscreenImage(null)}>
            <button onClick={() => setFullscreenImage(null)} className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20">
              <X className="h-6 w-6" />
            </button>
            <img
              src={images[fullscreenImage]}
              alt={`Verona Earrings ${fullscreenImage + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>

      <div className="mb-8 h-[7px] w-full bg-[#F9FAFB]"></div>

      {/* PACKAGING SECTION */}
      <section className="w-full bg-white py-32">
        <div className="mx-auto max-w-[1600px] px-10 xl:px-24">
          <div className="grid grid-cols-1 items-center gap-24 lg:grid-cols-[38%_62%]">
            <div className="max-w-md text-[#004065]">
              <h2 className="mb-6 font-barlow text-3xl uppercase tracking-widest">A Jewel, Curated in Pink</h2>
              <p className="mb-4 font-barlow text-sm leading-relaxed">Each La Prima Gioielli creation is delivered in our signature packaging — designed to preserve, protect, and elevate the experience of fine jewelry.</p>
              <p className="mb-4 font-barlow text-sm leading-relaxed">From the jewelry box to the outer bag, every detail reflects Italian craftsmanship and timeless elegance.</p>
              <p className="font-barlow text-sm italic text-gray-500">Perfect for gifting. Memorable for keeping.</p>
            </div>
            <div className="relative h-[72vh] w-full overflow-hidden pr-10 xl:pr-24">
              <img src="/img/bags-box.jpg" alt="La Prima Gioielli Packaging" className="absolute inset-0 h-full w-full object-cover object-left" />
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <h2 className="mb-8 ml-10 font-barlow text-xs font-medium uppercase tracking-[0.2em] text-gray-500">RELATED PRODUCTS</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products.map(product => {
          const hovered = hoveredProducts[product.id] || false;
          const currentVariation =
            selectedVariations[product.id] ||
            product.variations.find(v => v.isActive) ||
            product.variations[0];
          const displayedImage = hovered ? currentVariation.hoverImage : currentVariation.defaultImage;
          const wasAdded = addedFeedback[product.id] || false;

          return (
            <div key={product.id} className="group flex cursor-pointer flex-col items-center text-center">
              <div
                className="mb-4 aspect-square w-full overflow-hidden"
                onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
                onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
                <img src={displayedImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mb-1 font-barlow text-sm tracking-wide text-[#004065]">{product.name}</h3>
              <div className="relative h-6 w-full">
                {currentVariation.isActive ? (
                  <>
                    <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                      € {product.price}
                    </p>
                    <button
                      onClick={() => handleRelatedAddToCart(product, currentVariation)}
                      className={`absolute left-0 top-0 w-full translate-y-2 transform bg-transparent py-0 font-semibold underline opacity-0 transition-opacity transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${
                        wasAdded ? "text-[#ec9cb2]" : "text-[#004065]"
                      }`}>
                      {wasAdded ? "Added ✓" : "Add to Cart"}
                    </button>
                  </>
                ) : (
                  <p className="font-barlow font-serif text-[10px] text-[#ec9cb2]">AVAILABLE IN YOUR NEAREST STORE</p>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                {product.variations.map(v => (
                  <button
                    key={v.name}
                    className={`squared-full h-6 w-6 border ${currentVariation.name === v.name ? "ring-2 ring-[#004065]" : ""}`}
                    style={{ backgroundImage: `url(${v.defaultImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    onClick={() => setSelectedVariations(prev => ({ ...prev, [product.id]: v }))}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductPage;