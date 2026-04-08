"use client";


import { React,useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
export default function CollectionsPage() {
  const categories = [
    {
      id: 1,
      title: "BANGLES",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/7929B100-97F6-4D59-8A15-C20A0AAD1459-m-683x1024.jpg",
      link: "/bangles"
    },
    {
      id: 2,
      title: "BRACELETS",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/943CF260-52E4-4227-A4B7-6E5F1DDE4D83-m-683x1024.jpg",
      link: "/bracelets"
    },
    {
      id: 3,
      title: "EARRINGS",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/1139905C-4954-4BB8-B105-BCBC0EB8BB6A-s.jpg",
      link: "/earrings"
    },
    {
      id: 4,
      title: "NECKLACES",
      image:
        "https://laprimagioielli.com/wp-content/uploads/2025/08/DB334A47-6E63-4BE9-B343-5ABD1BCC7F3A-m-2-683x1024.jpg",
      link: "/necklaces"
    }
  ];
 const ref = useRef(null);

  // Use viewport scroll instead of element target
  const { scrollY } = useScroll();

  // Map scrollY to your effects (tweak 0–500 for effect range)
  const blur = useTransform(scrollY, [0, 500], ["10px", "0px"]);
  const scale = useTransform(scrollY, [0, 500], [1.2, 1]);
  const rotate = useTransform(scrollY, [0, 500], [-10, 0]);
  const translateY = useTransform(scrollY, [0, 500], [50, 0]);
  const opacity = useTransform(scrollY, [0, 500], [0, 1]);

  return (
    <>
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30" />

     
    </section>
  
    <div className="min-h-screen bg-white">
      {/* BLOOMY SECTION */}
      <section className="w-full py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100 ">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source
                  src="https://laprimagioielli.com/wp-content/uploads/2025/11/Untitled-design-11.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div  ref={ref} className="flex flex-col items-center justify-center space-y-6 py-16 text-center text-[#004065] font-barlow">
              <motion.div
                     style={{
                       filter: blur,
                       scale,
                       rotate,
                       y: translateY,
                       opacity,
                     }}
                     className="w-[350px] h-[350px] relative will-change-transform"
                   >
                     <Image
                       src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_bangle_3d_02-e1756735534547.png"
                       alt="bangle"
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

      {/* VELLUTO SECTION */}
      <section className="w-full py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="order-2 flex flex-col items-center justify-center space-y-6 py-16 text-center md:order-1">
              <div className="mb-4 flex items-center justify-center gap-6">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png"
                  alt="Velluto Bangle"
                  className="w-32 md:w-40"
                />
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/02/Velluto_Bangle_2025.1310.png"
                  alt="Velluto Ring"
                  className="w-20 md:w-24"
                />
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

            <div className="relative order-1 aspect-square w-full overflow-hidden rounded-sm bg-gray-100 md:order-2">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source
                  src="https://laprimagioielli.com/wp-content/uploads/2025/11/1110.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* VERONA SECTION */}
      <section className="w-full py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-gray-100">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source
                  src="https://laprimagioielli.com/wp-content/uploads/2025/11/11123-1-1.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
              <img
                src="https://laprimagioielli.com/wp-content/uploads/2024/07/verona_earring_3d.png"
                alt="Verona Ring"
                className="mb-2 w-28 md:w-36"
              />

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

      {/* CATEGORIES GRID */}
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
                  className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-700 group-hover:bg-black/40"></div>
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
