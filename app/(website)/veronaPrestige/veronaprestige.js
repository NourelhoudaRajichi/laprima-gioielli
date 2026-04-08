"use client";

import { React, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import VeronaCarousel from "@/components/veronaCarousel";

export default function CollectionsPage() {
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
            src="https://laprimagioielli.com/wp-content/uploads/2025/11/verona-prestige-edit.mp4"
            type="video/mp4"
          />
        </video>
      </section>

      <main className="w-full bg-white px-8 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Title */}
          <h1 className="mb-12 font-barlow text-5xl font-bold text-[#ec9cb2] md:text-6xl ">
            Verona Prestige
          </h1>

          {/* First paragraph */}
          <p className="font-inter mb-6 text-lg leading-relaxed text-[#004065]">
            You&apos;ve probably met my sisters before me.
            <br />
            each born under the moon, each shining in her own way.
          </p>

          {/* Bold statement */}
          <p className="font-inter mb-6 text-xl font-semibold text-[#004065]">
            I am the Prestige one who carries its heartbeat.
          </p>

          {/* Main poetic text */}
          <p className="font-inter mb-6 text-lg leading-relaxed text-[#004065]">
            My curves trace the lines of Verona,
            <br />
            my light remembers every promise ever made.
            <br />
            I am sculpted from diamonds and emotion,
            <br />
            crafted in Vicenza, where love becomes art.
          </p>

          {/* Additional verse */}
          <p className="font-inter mb-8 text-lg leading-relaxed text-[#004065]">
            I don’t wait for romance — I create it.
            <br />
            Every sparkle is a vow,
            <br />
            every reflection, a feeling reborn.
          </p>

          {/* Final statement */}
          <p className="font-inter mb-2 text-xl font-bold text-[#004065]">
            I am Verona Prestige
          </p>
          <p className="font-inter text-lg font-semibold text-[#004065]">
            where love turns to light, and light becomes eternal.
          </p>
        </div>
      </main>

      {/* Carousel */}
      <div className="w-full">
        <VeronaCarousel />
      </div>
    </>
  );
}
