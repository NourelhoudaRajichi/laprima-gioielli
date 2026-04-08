"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import './news.css'
export default function MagazinePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
     

      {/* Breadcrumb Navigation with hover effect */}
      <nav className="container mx-auto px-4 py-10 mt-20 animate-fade-in">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <a href="#" className="text-[#004065] hover:text-[#ec9cb2] transition-colors">Home</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <a href="#" className="text-[#004065] hover:text-[#ec9cb2] transition-colors">Stories</a>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#004065] font-barlow">Riyadh, We Know Pink Looks Good on You</span>
        </div>
      </nav>

      {/* Article Container */}
      <article className="container mx-auto px-4 max-w-4xl pb-20">
        {/* Title with gradient accent */}
        <div className="mb-12 text-center relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50" />
          <h1 className="text-3xl md:text-5xl text-[#004065] font-barlow mb-4 tracking-tight uppercase relative animate-slide-up">
            RIYADH, WE KNOW PINK LOOKS GOOD ON YOU </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            
          </div>
        </div>

        {/* Hero Image with overlay effect */}
        <div className="mb-16 group relative overflow-hidden shadow-2xl animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img 
            src="https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0649_VERONA-scaled-e1760976155726.jpg" 
            alt="Model wearing pink jewelry"
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Article Text with decorative elements */}
        <div className="relative">
          {/* Decorative line */}
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#ec9cb2] via-rose-400 to-pink-300 rounded-full opacity-20" />
          
          <div className="space-y-6 mb-16 text-[#004065] animate-fade-in">
            <p className="text-lg leading-relaxed first-letter:text-6xl first-letter:font-serif first-letter:text-[#ec9cb2] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
              Riyadh, October 2025 — From Vicenza to Riyadh, our Story in Pink continues to unfold — redefining what Italian luxury means, wherever we go.
            </p>

            <p className="text-base leading-relaxed text-[#004065]">
              At Jewels of the World, we brought more than jewels to Saudi Arabia — we brought our identity. A vision of beauty that speaks through emotion, and craftsmanship that carries three generations of Italian excellence. Our pink booth became a statement: refined, radiant, and unmistakably ours. A meeting point between two worlds — Italian artistry and Arabian elegance — united by the same appreciation for authenticity, creativity, and emotion.
            </p>

            {/* Pull Quote */}
          <p className="text-base leading-relaxed text-[#004065]">
                &quot;Every creation reflected our promise: jewelry that moves people, not just markets; jewelry that feels alive, and dares to be different.&quot;
              </p>
        

            <p className="text-base leading-relaxed text-[#004065]">
              We came to Saudi Arabia with our essence — and left with hearts touched in pink.<br />
              <span className="text-[#004065] font-medium">Thank you from the heart, Riyadh.</span>
            </p>
          </div>
        </div>

        {/* Two Images Side by Side with stagger animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="group relative overflow-hidden  shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-slide-left">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/0 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <img 
              src="https://laprimagioielli.com/wp-content/uploads/2025/10/751A6385-683x1024.jpg" 
              alt="Jewelry display"
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="group relative overflow-hidden  shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-slide-right">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/0 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
            <img 
              src="https://laprimagioielli.com/wp-content/uploads/2025/10/751A6382-683x1024.jpg" 
              alt="Exhibition booth"
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Shop Now Button with gradient and animation */}
        <div className="text-center mb-16 animate-fade-in">
          <button className="relative group overflow-hidden bg-[#ec9cb2] text-white px-12 py-4 text-sm font-semibold tracking-wider hover:from-pink-500 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span className="relative z-10">SHOP NOW</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>

        {/* Go Back Button with enhanced styling */}
        <div className="text-center animate-fade-in">
          <button className="inline-flex items-center space-x-2 border-2 border-[#ec9cb2] text-[#004065] px-8 py-3 text-sm font-semibold tracking-wider hover:bg-[#ec9cb2] hover:text-white transition-all duration-300 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>GO BACK TO STORIES</span>
          </button>
        </div>

    
      </article>

    
    </div>
  );
}