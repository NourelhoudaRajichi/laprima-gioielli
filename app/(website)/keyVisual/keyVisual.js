"use client";
import React from "react";
import { useEffect, useState } from "react";
export default function JewelryJourney() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover">
          <source
            src="https://laprimagioielli.com/wp-content/uploads/2025/08/final_orizzontal_v3-3.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
      </section>
      <div className="min-h-screen ">
        {/* Title */}
        <div className="py-12 text-center md:py-16">
          <h1
            className="text-5xl font-bold text-[#ec9cb2] md:text-6xl lg:text-7xl"
            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}>
            Key visual
          </h1>
        </div>

       <div className="min-h-screen bg-white">
      {/* Pink Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-16">
        <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-2 lg:gap-2">
          {/* Text Content - Left Side */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}>
            <div>
              <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-[#ec9cb2] md:text-4xl">
                Pink
              </h2>
              <p className="text-base leading-relaxed text-[#2c5f6f] md:text-lg">
                Why live in black and white when you can paint your<br />
                world in pink?<br />
                Pink is not just a color,<br />
                it&apos;s a feeling. It&apos;s feminine, modern, emotional.<br />
                Pink is our key visual because it reflects the Cycle of Pink,<br />
                a journey where every woman truly becomes herself again —<br />
                and chooses pink not because she has to,<br />
                but because she wants to.
              </p>
              </div>
            </div>
          </div>

          {/* Image - Right Side */}
          <div
            className={`flex justify-center transition-all delay-200 duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            }`}>
            <img
              src="https://laprimagioielli.com/wp-content/uploads/2025/12/Ads_z-34-x-34-cm-1-2-1024x1024.jpg"
              alt="Pink themed fashion"
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-2 lg:gap-2">
          {/* Video - Left Side */}
          <div
            className={`flex justify-center transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}>
            <video
              className="w-full h-auto object-cover aspect-square"
              autoPlay
              loop
              muted
              playsInline>
              <source
                src="https://laprimagioielli.com/wp-content/uploads/2025/12/11123-1-1-1.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          {/* Feathers Text - Right Side */}
          <div
            className={`space-y-8 flex items-center justify-center transition-all delay-200 duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-12 opacity-0"
            }`}>
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold text-[#ec9cb2] md:text-4xl">
                Feathers
              </h2>
              <p className="text-base leading-relaxed text-[#2c5f6f] md:text-lg">
                Feathers are part of our visual language.<br />
                They invite you to slow down,<br />
                to look closer, to feel.<br />
                Feathers turn every jewel into a memory,<br />
                and every collection into an experience to feel.<br />
                They are the detail<br />
                that transforms a product into a moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
      <div className="w-full bg-white mt-16 md:mt-24">
        {/* Hero Section - Titles on top of background with flowers */}
        <div className="relative h-[400px] w-full overflow-hidden md:h-[500px]">
          {/* Background Image with flowers */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://laprimagioielli.com/wp-content/uploads/2025/11/Untitled-design-44-1.png')"
            }}
          />

          {/* Titles Grid - Each title above its corresponding flower */}
          <div className="relative z-10 h-full ">
            <div className="grid h-full grid-cols-4">
              {/* Birth */}
              <div className="flex items-start justify-center pt-8 md:pt-12">
                <h1 className="font-barlow text-2xl font-bold text-[#F8E3E8] md:text-4xl lg:text-5xl">
                  Birth
                </h1>
              </div>

              {/* Rebellion */}
              <div className="flex items-start justify-center pt-8 md:pt-12 ">
                <h1 className="font-barlow text-2xl font-bold text-[#004065] md:text-4xl  lg:text-5xl">
                  Rebellion
                </h1>
              </div>

              {/* Awakening */}
              <div className="flex items-start justify-center pt-8 md:pt-12 ">
                <h1 className="font-barlow text-2xl font-bold text-[#F9D5DA] md:text-4xl  lg:text-5xl">
                  Awakening
                </h1>
              </div>

              {/* Wholeness */}
              <div className="flex items-start justify-center pt-8 md:pt-12">
                <h1 className="font-barlow text-2xl font-bold text-[#EC9CB2] md:text-4xl lg:text-5xl">
                  Wholeness
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - 2x2 Grid with small icons beside text */}
<div className="mx-auto max-w-[1400px] px-4 pt-0 pb-10 md:px-8 md:pt-2 md:pb-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-20 md:gap-y-16">
            {/* Birth */}
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 md:h-20 md:w-20">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/08/3-1024x1024.png"
                  alt="Birth"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                At birth, the world wraps her in pink — the color of
                dreams, comfort, and beginnings.
              </p>
            </div>

            {/* Awakening */}
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 md:h-20 md:w-20">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/08/5-1024x1024.png"
                  alt="Awakening"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                But pink returns, quietly, chosen this time — elegant,
                magnetic, a layer of power and tenderness
              </p>
            </div>

            {/* Rebellion */}
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 md:h-20 md:w-20">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/08/4-1024x1024.png"
                  alt="Rebellion"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                As she grows, pink feels too soft, too expected — she
                chooses strength, freedom, and darker shades.
              </p>
            </div>

            {/* Wholeness */}
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 flex-shrink-0 md:h-20 md:w-20">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/08/62-1024x1024.png"
                  alt="Wholeness"
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                When she wears it again, it is her own choice — a sign
                of harmony between the girl she was, the woman she is,
                and all the selves in between.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
