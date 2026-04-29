"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { formatPrice } from "@/lib/formatPrice";
import { useCurrency } from "@/components/CurrencyContext";

/* ── parse WC attributes into Diamonds / Gold / Size groups ── */
function parseAttrs(attributes = []) {
  const diamondKeys = ["weight", "purity", "color", "cut", "carats", "carat"];
  const goldKeys    = ["gold", "metal", "finish", "karat", "kt", "type"];
  const sizeKeys    = ["size", "length", "width", "dimension", "height", "internal", "external"];
  const diamonds = [], gold = [], size = [], other = [];
  for (const attr of attributes) {
    const key = (attr.name || "").toLowerCase();
    const val = Array.isArray(attr.options) ? attr.options.join(", ") : String(attr.options || "");
    if (!val) continue;
    const entry = { name: attr.name, value: val };
    if (diamondKeys.some(k => key.includes(k)))      diamonds.push(entry);
    else if (goldKeys.some(k => key.includes(k)))    gold.push(entry);
    else if (sizeKeys.some(k => key.includes(k)))    size.push(entry);
    else                                              other.push(entry);
  }
  return { diamonds, gold, size, other };
}

const ProductPage = () => {
  const searchParams  = useSearchParams();
  const productId     = searchParams.get("id");
  const paramName     = searchParams.get("name") ?? "";
  const paramPrice    = searchParams.get("price") ?? "";
  const paramImage    = searchParams.get("image") ?? "";

  const [wcProduct, setWcProduct] = useState(null);
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
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { format } = useCurrency();

  const imageRefs   = useRef([]);
  const containerRef = useRef(null);

  /* fetch real product from WooCommerce */
  useEffect(() => {
    if (!productId) return;
    fetch(`/api/woo/product/${productId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setWcProduct(data);
        if (!data) return;
        fetch(`/api/woo/related?id=${productId}`)
          .then(r => r.ok ? r.json() : [])
          .then(items => {
            setRelatedProducts((Array.isArray(items) ? items : []).map(p => ({
              id: p.id,
              name: (p.name || "").toUpperCase(),
              price: p.price ? formatPrice(p.price) : "—",
              image: p.images?.[0]?.src ?? "",
              hoverImage: p.images?.[1]?.src ?? p.images?.[0]?.src ?? "",
              variations: [{ name: p.name, defaultImage: p.images?.[0]?.src ?? "", hoverImage: p.images?.[1]?.src ?? "", isActive: true }],
            })));
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, [productId]);

  /* ── derive display values from WC data (fall back to placeholder if not loaded) ── */
  const wcImages     = wcProduct ? (wcProduct.images ?? []).map(i => i.src) : (paramImage ? [paramImage] : []);
  const wcName       = wcProduct?.name ?? paramName;
  const wcPrice      = wcProduct?.price
    ? format(wcProduct.price)
    : (paramPrice ? format(paramPrice) : "");
  const wcSku        = wcProduct?.sku ?? "";
  const wcInStock    = wcProduct ? wcProduct.stock_status === "instock" : true;
  const wcAttrs      = wcProduct ? parseAttrs(wcProduct.attributes ?? []) : { diamonds: [], gold: [], size: [], other: [] };
  const wcCategories = wcProduct?.categories ?? [];
  const collectionNames = ["bloomy", "verona", "velluto", "prestige"];
  const breadcrumbCat = wcCategories.find(c =>
    !collectionNames.includes(c.slug?.toLowerCase()) &&
    !collectionNames.includes(c.name?.toLowerCase())
  ) ?? wcCategories[0];

  const mainProduct = wcProduct
    ? { id: wcProduct.id, name: wcName, price: wcProduct.price, variations: [{ name: wcName, defaultImage: wcImages[0] ?? "", isActive: true }] }
    : { id: "", name: "", price: "", variations: [{ name: "", defaultImage: "", isActive: true }] };

  const mainVariation = mainProduct.variations[0];
  const liked = isInWishlist(mainProduct.id, mainVariation.name);

  const images = wcImages.length ? wcImages : [];

  const products = relatedProducts;

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
                      alt={`${wcName} ${idx + 1}`}
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
                <span className="font-bold text-[#004065]">{breadcrumbCat?.name ?? ""}</span>
              </nav>

              <h1 className="font-barlow text-3xl font-bold uppercase text-[#004065]">
                {wcName}
              </h1>

              <div className="text-1xl font-inter text-gray-900">{wcPrice}</div>
              <p className="font-inter text-sm text-gray-500">Delivery expected in 2–5 working days</p>

              {/* Product Details */}
              <div className="space-y-3">
                <h3 className="font-barlow text-[#004065]">Product details</h3>
                {isExpanded && (
                  <>
                    {/* Use WC attributes if available, otherwise fall back to short_description HTML */}
                    {(wcAttrs.diamonds.length > 0 || wcAttrs.gold.length > 0 || wcAttrs.size.length > 0 || wcAttrs.other.length > 0) ? (
                      <>
                        {wcAttrs.diamonds.length > 0 && (
                          <div className="font-inter space-y-2 font-barlow text-sm text-[#004065]">
                            <p className="font-semibold text-[#004065]">Diamonds</p>
                            {wcAttrs.diamonds.map(a => (
                              <p key={a.name}>– {a.name}: {a.value}</p>
                            ))}
                          </div>
                        )}
                        {wcAttrs.gold.length > 0 && (
                          <div className="space-y-1 font-barlow text-sm text-[#004065]">
                            <p className="font-semibold">Gold</p>
                            {wcAttrs.gold.map(a => <p key={a.name}>{a.value}</p>)}
                          </div>
                        )}
                        {wcAttrs.size.length > 0 && (
                          <div className="space-y-1 font-barlow text-sm text-[#004065]">
                            <p className="font-semibold">Size</p>
                            {wcAttrs.size.map(a => <p key={a.name}>{a.value}</p>)}
                          </div>
                        )}
                        {wcAttrs.other.length > 0 && (
                          <div className="space-y-1 font-barlow text-sm text-[#004065]">
                            {wcAttrs.other.map(a => <p key={a.name}>– {a.name}: {a.value}</p>)}
                          </div>
                        )}
                        <p className="font-barlow text-sm italic text-[#004065]">Being handmade, slight variations may occur.</p>
                      </>
                    ) : wcProduct?.short_description ? (
                      <div
                        className="font-barlow text-sm text-[#004065] space-y-1"
                        dangerouslySetInnerHTML={{
                          __html: wcProduct.short_description.replace(/product\s*details/gi, "").trim()
                        }}
                      />
                    ) : null}
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
                <span className="font-barlow font-medium">{wcInStock ? "IN STOCK" : "OUT OF STOCK"}</span>
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

                {/* Wishlist button */}
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

              {wcSku && <p className="text-sm text-gray-500">SKU: {wcSku}</p>}

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
              alt={`${wcName} ${fullscreenImage + 1}`}
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
              <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(currentVariation.name || product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(currentVariation.defaultImage)}`}
                className="mb-4 aspect-square w-full overflow-hidden block"
                onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [product.id]: true }))}
                onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [product.id]: false }))}>
                <img src={displayedImage} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <Link href={`/detailedPage?id=${product.id}&name=${encodeURIComponent(currentVariation.name || product.name)}&price=${encodeURIComponent(product.price)}&image=${encodeURIComponent(currentVariation.defaultImage)}`}>
                <h3 className="mb-1 font-barlow text-sm tracking-wide text-[#004065] hover:text-[#ec9cb2] transition-colors">{product.name}</h3>
              </Link>
              <div className="relative h-6 w-full">
                {currentVariation.isActive ? (
                  <>
                    <p className="transform font-serif text-[#004065] transition-opacity transition-transform duration-300 group-hover:-translate-y-2 group-hover:opacity-0">
                      {format(product.price)}
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
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductPage;
