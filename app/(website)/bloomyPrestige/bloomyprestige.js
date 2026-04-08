"use client";


import { React,useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BloomyCarousel from "@/components/bloomyCarousel";

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
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source 
          src="https://laprimagioielli.com/wp-content/uploads/2025/11/prestige-web.mp4" 
          type="video/mp4" 
        />
      </video>

     

      
    </section>

    <main className="w-full bg-white py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-12 text-[#ec9cb2] font-barlow">
          Bloomy Prestige
        </h1>

        {/* First paragraph */}
        <p className="text-lg text-[#004065] mb-6 leading-relaxed font-inter" >
          You&apos;ve probably met my sisters before me.
          <br />
          each born under the moon, each shining in her own way.
        </p>

        {/* Bold statement */}
        <p className="text-xl font-semibold text-[#004065] font-inter mb-6">
          But I am the Prestige one
        </p>

        {/* Main poetic text */}
        <p className="text-lg text-[#004065] font-inter mb-6 leading-relaxed">
          the rare glow, the deeper heartbeat.
          <br />
          My soul is born of light and emotion,
          <br />
          and around me, precious stones breathe and move in
          <br />
          harmony, reflecting the warmth of my pink light.
        </p>

        {/* Additional verse */}
        <p className="text-lg text-[#004065] font-inter mb-8 leading-relaxed">
          I was born from moonlight and feeling,
          <br />
          crafted in Vicenza, where mastery
          <br />
          becomes emotion and beauty learns to move.
          <br />
          I&apos;m not just a jewel — I&apos;m rhythm, rebirth,
          <br />
          reflection. When I shine, the night turns pink.
        </p>

        {/* Final statement */}
        <p className="text-xl font-bold text-[#004065] font-inter mb-2">
          I am Bloomy Prestige
        </p>
        <p className="text-lg font-semibold text-[#004065] font-inter">
          all light, all feeling, all the time
        </p>
      </div>
    </main>


   {/* Carousel */}
      <div className="w-full">
        <BloomyCarousel />
      </div>
    </>
  );
}
