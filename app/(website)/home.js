"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// ── Reusable parallax hook ─────────────────────────────────────
// Each render gets its own ref; scroll progress is measured
// relative to that element's position in the viewport.
function useParallax(ref, options = {}) {
  const {
    yRange    = [60, -60],      // how far it travels vertically (px)
    blurRange = ["7px", "0px", "7px"], // blur: in → clear → out
    rotateRange = [-10, 0, 10], // rotate while scrolling
    scaleRange  = [0.95, 1, 0.95],
  } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // track from when element enters to when it leaves
  });

  const y      = useTransform(scrollYProgress, [0, 1], yRange);
  const blur   = useTransform(scrollYProgress, [0, 0.5, 1], blurRange);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], rotateRange);
  const scale  = useTransform(scrollYProgress, [0, 0.5, 1], scaleRange);

  // Convert blur array values to filter string
  const filter = useTransform(blur, (b) => `blur(${b})`);

  return { y, filter, rotate, scale };
}

export default function CollectionsPage() {
  const categories = [
    {
      id: 1,
      title: "BANGLES",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/7929B100-97F6-4D59-8A15-C20A0AAD1459-m-683x1024.jpg",
      link: "/bangles",
    },
    {
      id: 2,
      title: "BRACELETS",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
      link: "/bracelets",
    },
    {
      id: 3,
      title: "EARRINGS",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
      link: "/earrings",
    },
    {
      id: 4,
      title: "NECKLACES",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
      link: "/necklaces",
    },
  ];

  // ── Refs for each section ──────────────────────────────────
  const bloomySection   = useRef(null);
  const vellutoSection  = useRef(null);
  const veronaSection   = useRef(null);

  // ── Parallax values per render ─────────────────────────────
  // BLOOMY — scroll up (speed 2.2 like Elementor setting)
  const bloomy = useParallax(bloomySection, {
    yRange:     [80, -80],
    blurRange:  ["7px", "0px", "7px"],
    rotateRange:[-10, 0, 10],
    scaleRange: [1.2, 1, 1.2],
  });

  // VELLUTO bangle 1
  const velluto1 = useParallax(vellutoSection, {
    yRange:     [100, -60],
    blurRange:  ["14px", "0px", "14px"],
    rotateRange:[22, 0, -22],
    scaleRange: [0.85, 1, 0.85],
  });

  // VELLUTO bangle 2 — opposite rotation for depth
  const velluto2 = useParallax(vellutoSection, {
    yRange:     [60, -100],
    blurRange:  ["7px", "0px", "7px"],
    rotateRange:[-9, 0, 9],
    scaleRange: [0.9, 1, 0.9],
  });

  // VERONA earring
  const verona = useParallax(veronaSection, {
    yRange:     [120, -80],
    blurRange:  ["14px", "0px", "14px"],
    rotateRange:[-10, 0, 10],
    scaleRange: [1.2, 1, 1.2],
  });

  return (
    <>
      {/* ── Hero Video ─────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="/Videos/Teal and White Minimalist Visit Thailand Presentation (3).mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </section>

      <div className="min-h-screen bg-white">

        {/* ── BLOOMY ─────────────────────────────────────────────── */}
        <section ref={bloomySection} className="w-full py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">

              {/* Video */}
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source
                    src="https://laprimagioielli.com/wp-content/uploads/2025/11/Untitled-design-11.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

              {/* Text + animated render */}
              <div className="flex flex-col items-center justify-center space-y-6 py-16 text-center text-[#004065] font-barlow">
                <motion.div
                  style={{
                    y:      bloomy.y,
                    filter: bloomy.filter,
                    rotate: bloomy.rotate,
                    scale:  bloomy.scale,
                  }}
                  className="w-[350px] h-[350px] relative will-change-transform"
                >
                  <Image
                    src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_bangle_3d_02-e1756735534547.png"
                    alt="Bloomy bangle"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </motion.div>

                <h2 className="text-2xl font-bold tracking-tight text-[#004065] font-barlow md:text-5xl lg:text-2xl">
                  BLOOMY® COLLECTION
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-[#004065] font-inter md:text-lg">
                  The brand new Bloomy® collection embodies the essence of growth,
                  renewal and the beauty of nature in full bloom.
                </p>
                <button className="px-8 py-3 text-sm uppercase tracking-wider text-[#004065] font-barlow border border-[#004065] rounded">
                  Discover
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ── VELLUTO ────────────────────────────────────────────── */}
        <section ref={vellutoSection} className="w-full py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">

              {/* Text + animated renders */}
              <div className="order-2 flex flex-col items-center justify-center space-y-6 py-16 text-center md:order-1">
                <div className="mb-4 flex items-center justify-center gap-6">

                  {/* Large bangle */}
                  <motion.div
                    style={{
                      y:      velluto1.y,
                      filter: velluto1.filter,
                      rotate: velluto1.rotate,
                      scale:  velluto1.scale,
                    }}
                    className="will-change-transform"
                  >
                    <img
                      src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png"
                      alt="Velluto Bangle"
                      className="w-32 md:w-40"
                    />
                  </motion.div>

                  {/* Small bangle — opposite motion for depth */}
                  <motion.div
                    style={{
                      y:      velluto2.y,
                      filter: velluto2.filter,
                      rotate: velluto2.rotate,
                      scale:  velluto2.scale,
                    }}
                    className="will-change-transform"
                  >
                    <img
                      src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png"
                      alt="Velluto Ring"
                      className="w-20 md:w-24"
                    />
                  </motion.div>

                </div>

                <h2 className="text-2xl font-bold tracking-tight text-[#004065] font-barlow md:text-5xl lg:text-2xl">
                  VELLUTO COLLECTION
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-[#004065] font-inter md:text-lg">
                  The collection is a celebration of refined beauty, where smooth curves
                  and polished finishes create a sense of effortless grace.
                </p>
                <button className="px-8 py-3 text-sm uppercase tracking-wider text-[#004065] font-barlow border border-[#004065] rounded">
                  Discover
                </button>
              </div>

              {/* Video */}
              <div className="relative order-1 aspect-square w-full overflow-hidden rounded-sm bg-gray-100 md:order-2">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source
                    src="https://laprimagioielli.com/wp-content/uploads/2025/11/1110.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

            </div>
          </div>
        </section>

        {/* ── VERONA ─────────────────────────────────────────────── */}
        <section ref={veronaSection} className="w-full py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">

              {/* Video */}
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                  <source
                    src="https://laprimagioielli.com/wp-content/uploads/2025/11/11123-1-1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>

              {/* Text + animated render */}
              <div className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
                <motion.div
                  style={{
                    y:      verona.y,
                    filter: verona.filter,
                    rotate: verona.rotate,
                    scale:  verona.scale,
                  }}
                  className="will-change-transform"
                >
                  <img
                    src="https://laprimagioielli.com/wp-content/uploads/2024/07/verona_earring_3d.png"
                    alt="Verona earring"
                    className="mb-2 w-28 md:w-36"
                  />
                </motion.div>

                <h2 className="text-2xl font-bold tracking-tight text-[#004065] font-barlow md:text-5xl lg:text-2xl">
                  VERONA COLLECTION
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-[#004065] font-inter md:text-lg">
                  A true celebration of romance, elegance, and timeless beauty,
                  crafted with the utmost care and attention to detail.
                </p>
                <button className="px-8 py-3 text-sm uppercase tracking-wider text-[#004065] font-barlow border border-[#004065] rounded">
                  Discover
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ── CATEGORIES GRID ────────────────────────────────────── */}
        <section className="w-full bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl tracking-tight text-[#004065] font-barlow md:text-4xl lg:text-3xl">
              DISCOVER BY CATEGORY
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={cat.link}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-gray-100"
                >
                  <img
                    src={cat.image} 
                    alt={cat.title}
                    className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-black/0 transition duration-700 group-hover:bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-center text-xl font-bold tracking-wide text-white md:text-2xl drop-shadow-lg">
                      {cat.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}