"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import LazyVideo from "@/components/LazyVideo";

// ── Reusable parallax hook ─────────────────────────────────────
// 0 = element bottom enters viewport bottom, 1 = element top leaves viewport top
// Matches Elementor "start end → end start" scroll trigger.
function useParallax(ref, options = {}) {
  const {
    // Y
    yRange       = [60, -60],
    ySpeed       = 1,

    // Blur — legacy blurRange OR enhanced blur: { input, output }
    blurRange    = ["0px", "0px", "0px"],
    blur         = null,

    // Rotate — legacy rotateRange + rotateSpeed + baseRotate
    //          OR enhanced rotate: { input, output } (fully custom, ignores legacy fields)
    rotateRange  = [-10, 0, 10],
    rotateSpeed  = 1,
    baseRotate   = 0,           // baseline angle (deg) to correct image natural tilt
    rotate: rotateCfg = null,   // { input: [...], output: [...] }

    // Scale — legacy scaleRange OR enhanced scale: { input, output }
    scaleRange   = [0.95, 1, 0.95],
    scale: scaleCfg = null,     // { input: [...], output: [...] }
  } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
      offset: ["end start", "start end"], // 🔥 FIXED (Elementor-like flow)

  });

  // ── Y ──────────────────────────────────────────────────────────
  const y = useTransform(scrollYProgress, [0, 1], [
    yRange[0],
    yRange[1],
  ]);

  // ── Blur → filter (single-pass, no chaining) ───────────────────
  const blurIn  = blur ? blur.input  : [0, 0.5, 1];
  const blurOut = (blur ? blur.output : blurRange).map((b) => `blur(${b})`);
  const filter  = useTransform(scrollYProgress, blurIn, blurOut);

  // ── Rotate ─────────────────────────────────────────────────────
  const rotIn  = rotateCfg
    ? rotateCfg.input
    : rotateRange.length === 2 ? [0, 1] : [0, 0.5, 1];
  const rotOut = rotateCfg
    ? rotateCfg.output
    : rotateRange.map((v) => baseRotate + v * rotateSpeed);
  const rotate = useTransform(scrollYProgress, rotIn, rotOut);

  // ── Scale ──────────────────────────────────────────────────────
  const scaleIn  = scaleCfg ? scaleCfg.input  : [0, 0.5, 1];
  const scaleOut = scaleCfg ? scaleCfg.output : scaleRange;
  const scale    = useTransform(scrollYProgress, scaleIn, scaleOut);

  return { y, filter, rotate, scale };
}

export default function CollectionsPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.cookie = "lpg_agent_ref=;path=/;max-age=0";
    document.cookie = "lpg_agent_page=;path=/;max-age=0";
  }, []);

  const categories = [
    {
      id: 1,
      title: t.home.bangles,
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/7929B100-97F6-4D59-8A15-C20A0AAD1459-m-683x1024.jpg",
      link: "/bangles",
    },
    {
      id: 2,
      title: t.home.bracelets,
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
      link: "/bracelets",
    },
    {
      id: 3,
      title: t.home.earrings,
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
      link: "/earrings",
    },
    {
      id: 4,
      title: t.home.necklaces,
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
  // BLOOMY — Elementor: scroll up speed 2.2, blur fade-in-out level 7 (17%-79%), rotate to left 0.2
  const scrollBlur = { input: [0, 0.5, 0.7, 1], output: ["10px", "0px", "0px", "10px"] };

  const bloomy = useParallax(bloomySection, {
    yRange:      [150, -150],
    ySpeed:      2.2,
    rotateRange: [0, -2],
    scaleRange:  [1, 1, 1],
    blur:        scrollBlur,
  });

const velluto1 = useParallax(vellutoSection, {
  yRange: [-80, 60],
  rotate: { input: [0, 1], output: [-30, -12] },
  blur:   scrollBlur,
});

const velluto2 = useParallax(vellutoSection, {
  yRange: [150, -150],
  rotate: { input: [0, 1], output: [90, 0] },
  scale:  { input: [0, 0.5, 1], output: [1.2, 0.85, 1.2] },
  blur:   scrollBlur,
});

  const verona = useParallax(veronaSection, {
    yRange:      [150, -150],
    rotateRange: [0, -2],
    scaleRange:  [1, 1, 1],
    blur:        scrollBlur,
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
        <section className="w-full py-16 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">

              {/* Video */}
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
                <LazyVideo src="https://laprimagioielli.com/wp-content/uploads/2025/11/Untitled-design-11.mp4" />
              </div>

              {/* Text + animated render */}
              <div ref={bloomySection} className="flex flex-col items-center justify-center space-y-6 py-16 text-center text-[#004065] font-barlow">
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
                  {t.home.bloomyTitle}
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-[#004065] font-inter md:text-lg">
                  {t.home.bloomyDesc}
                </p>
                <Link href="/bloomy" className="px-8 py-3 text-sm uppercase tracking-wider text-[#004065] font-barlow border border-[#004065] rounded hover:bg-[#004065] hover:text-white transition-colors">
                  {t.home.discover}
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── VELLUTO ────────────────────────────────────────────── */}
<section ref={vellutoSection} className="w-full py-12 md:py-20 overflow-visible">          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-end gap-8 md:grid-cols-2 md:gap-12">

              {/* Left column — bangles float freely, text anchored at bottom */}
<div 
  className="order-2 relative md:order-1" 
  style={{ minHeight: "750px", overflow: "visible" }}  // ← overflow: visible!
>
                  {/* Large bangle — lower-left, in front */}
                  {/* Bangle 1 — large, lower-left, IN FRONT */}
<motion.div
  style={{
    y:        velluto1.y,
    filter:   velluto1.filter,
    rotate:   velluto1.rotate,
    scale:    velluto1.scale,
    position: "absolute",
    left:     "10%",
    top:      "10%",
    zIndex:   2,
    transformOrigin: "center center",  // ← rotate around its own center
  }}
  className="will-change-transform"
>
  <img
    src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.png"
    alt="Velluto Bangle"
    className="w-40 md:w-48"
  />
</motion.div>

{/* Bangle 2 — smaller, upper-right, BEHIND */}
<motion.div
  style={{
    y:        velluto2.y,
    filter:   velluto2.filter,
    rotate:   velluto2.rotate,
    scale:    velluto2.scale,
    position: "absolute",
    left:     "42%",
    top:      "2%",
    zIndex:   1,
    transformOrigin: "center center",
  }}
  className="will-change-transform"
>
  <img
    src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png"
    alt="Velluto Ring"
    className="w-36 md:w-44"
  />
</motion.div>

                {/* Text — anchored at bottom, never affected by bangle transforms */}
                <div className="absolute bottom-0 w-full space-y-4 pb-8 text-center">
                  <h2 className="text-2xl font-bold tracking-tight text-[#004065] font-barlow md:text-5xl lg:text-2xl">
                    {t.home.vellutoTitle}
                  </h2>
                  <p className="max-w-lg mx-auto text-base leading-relaxed text-[#004065] font-inter md:text-lg">
                    {t.home.vellutoDesc}
                  </p>
                  <Link href="/velluto" className="mt-4 inline-block px-8 py-3 text-sm uppercase tracking-wider text-[#004065] font-barlow border border-[#004065] rounded hover:bg-[#004065] hover:text-white transition-colors">
                    {t.home.discover}
                  </Link>
                </div>
              </div>

              {/* Video */}
              <div className="relative order-1 aspect-square w-full overflow-hidden rounded-sm bg-gray-100 md:order-2">
                <LazyVideo src="https://laprimagioielli.com/wp-content/uploads/2025/11/1110.mp4" />
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
                <LazyVideo src="https://laprimagioielli.com/wp-content/uploads/2025/11/11123-1-1.mp4" />
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
                  {t.home.veronaTitle}
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-[#004065] font-inter md:text-lg">
                  {t.home.veronaDesc}
                </p>
                <Link href="/verona" className="px-8 py-3 text-sm uppercase tracking-wider text-[#004065] font-barlow border border-[#004065] rounded hover:bg-[#004065] hover:text-white transition-colors">
                  {t.home.discover}
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* ── CATEGORIES GRID ────────────────────────────────────── */}
        <section className="w-full bg-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl tracking-tight text-[#004065] font-barlow md:text-4xl lg:text-3xl">
              {t.home.discoverByCategory}
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