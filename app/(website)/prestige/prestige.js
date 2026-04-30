"use client";

import React, { useEffect, useRef, useState } from "react";
import "./prestigeCollection.css";
import LazyVideo from "@/components/LazyVideo";

const PrestigeCollection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const heroRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px"
    };

    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          const section = entry.target.closest(".collection-section");
          if (section) section.classList.add("visible");
        }
      });
    }, observerOptions);

    // ✅ WAIT FOR LAYOUT
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-scroll]").forEach(el => {
        observerRef.current.observe(el);
      });
    });

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setScrollProgress(scrollPercent);
      setShowProgress(scrollPercent > 0);

      if (heroRef.current && scrollTop < window.innerHeight) {
        heroRef.current.style.transform = `translateY(${scrollTop * 0.5}px)`;
        heroRef.current.style.opacity = 1 - scrollTop / 800;
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const scrollToNext = e => {
    e.preventDefault();
    const currentSection = e.target.closest("section");
    if (!currentSection) return;

    function findNextSection(startEl) {
      let node = startEl.nextElementSibling;
      while (node) {
        if (node.tagName === "SECTION") return node;
        if (node.querySelector) {
          const inside = node.querySelector("section");
          if (inside) return inside;
        }
        node = node.nextElementSibling;
      }
      const allSections = Array.from(
        document.querySelectorAll("section")
      );
      const idx = allSections.indexOf(startEl);
      if (idx >= 0 && allSections[idx + 1])
        return allSections[idx + 1];
      return null;
    }

    const nextSection = findNextSection(currentSection);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <>
      <div className="bg-animation"></div>

      <div
        className={`scroll-progress-circle ${showProgress ? "visible" : ""}`}>
        <svg className="progress-ring" width="60" height="60">
          <circle
            className="progress-ring-circle"
            cx="30"
            cy="30"
            r="25"
          />
          <circle
            className="progress-ring-progress"
            cx="30"
            cy="30"
            r="25"
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className="progress-percentage">
          {Math.round(scrollProgress)}%
        </div>
      </div>

      <div className="content-wrapper">
        <section className="hero-section" ref={heroRef}>
          <h1 className="title font-barlow">Prestige</h1>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="scroll-down" onClick={scrollToNext}>
            Scroll Down
          </div>
        </section>

        <section className="hero-text-section" data-scroll>
          <div className="hero-text-wrapper">
            <p className="hero-description">
              For too long, diamonds were locked away, waiting for
              grand nights, for galas, for special occasions.
              <br />
              <br />
              <b>That is not my story.</b>
              <br />
              <br />I was not born to wait — I was born to live.
              <br />
              With me, every day is enough.
              <br />
              Morning coffee, golden afternoons, midnight escapes — I
              shine in all of them.
              <br />
              <br />
              On your skin,
              <br />I am not distant luxury, I am movement,
              <br />I am rhythm, I am electricity.
              <br />
              In the daylight, I am bold, fearless, alive.
              <br />
              At night, I turn magnetic, unforgettable, impossible to
              ignore.
              <br />I don&apos;t follow moments — I create them.
              <br />
              <br />I am not a jewel you keep for later.
              <br />I am the jewel that makes &quot;now&quot; feel
              extraordinary.
              <br />
              <br />
              <b>
                They call me High Jewelry.
                <br />I call myself Prestige
                <br />
                all diamond, all feeling, all the time.
              </b>
            </p>
          </div>
          <div
            className="scroll-down second-scroll"
            onClick={scrollToNext}>
            Scroll Down
          </div>
        </section>

        <div className="collection-wrapper">
          <section className="collection-section" data-scroll>
            <div className="image-container" data-scroll>
              <div className="main-image">
                <div class="video-circle"></div>{" "}
                <LazyVideo src="https://laprimagioielli.com/wp-content/uploads/2025/11/BLOOMY-PRESTIGE-WEBPAGE-1-1.mp4" className="h-full w-full object-cover" />
                <div className="image-frame"></div>
              </div>
              <div className="accent-image">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/09/LaPrimaGioielli_SS26_2261_PRESTIGE-scaled.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="collection-content" data-scroll>
              <div className="collection-number">BLOOMY PRESTIGE</div>
              <h2
                className="collection-name"
                data-text="BLOOMY PRESTIGE font-barlow">
                BLOOMY
                <br />
                PRESTIGE
              </h2>
              <p className="collection-tagline">
                Still searching for me?
              </p>
              <p className="collection-description">
                You&apos;ve probably met my sisters before me.
                <br />
                Each born under the moon, each shining in her own way.
                <br />
                <b>But I am the Prestige one.</b>
              </p>
              <a href="/bloomyPrestige/" className="cta-link">
                Discover collection
              </a>
            </div>
          </section>

          <section className="collection-section reverse" data-scroll>
            <div className="collection-content" data-scroll>
              <div className="collection-number font-barlow">
                VERONA PRESTIGE
              </div>
              <h2
                className="collection-name"
                data-text="VERONA PRESTIGE">
                VERONA
                <br />
                PRESTIGE
              </h2>
              <p className="collection-tagline">
                Knock, knock… do you hear it?
              </p>
              <p className="collection-description">
                You may have heard my name.
                <br />
                whispered where love first awakens.
                <br />
                <b>
                  I am the Prestige — the one that carries its
                  heartbeat.
                </b>
              </p>
              <a href="/veronaPrestige/" className="cta-link">
                Discover collection
              </a>
            </div>
            <div className="image-container" data-scroll>
              <div className="main-image">
                <div class="video-circle"></div>{" "}
                <LazyVideo src="https://laprimagioielli.com/wp-content/uploads/2025/11/6666-1.mp4" className="h-full w-full object-cover" />
                <div className="image-frame"></div>
              </div>
              <div className="accent-image">
                <img
                  src="https://laprimagioielli.com/wp-content/uploads/2025/11/LaPrimaGioielli_SS26_0402_VERONA-e1764060573782.jpg"
                  alt=""
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrestigeCollection;


