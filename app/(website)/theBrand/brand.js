"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VALUES = [
  {
    num: "01",
    isVideo: false,
    src: "/img/italianity.png",
    title: "Italianity",
    text: "It is our origin, our pride, and our essence. We were born in Vicenza, a city synonymous with Italian jewelry excellence. Our creations are crafted entirely in Italy, by hand, with passion. Because that's how we grew up: surrounded by beauty, raised to recognize it.",
  },
  {
    num: "02",
    isVideo: false,
    src: "/img/family.jpg",
    title: "Family",
    text: "Family is where we come from and what we believe in. We are a family business, but for us, family goes beyond kinship. It's about building trust, creating bonds, and making everyone feel part of something real.",
  },
  {
    num: "03",
    isVideo: false,
    src: "/img/emotions.png",
    title: "Emotion",
    text: "Emotion is our purpose. We don't just create products — we create memories, experiences, atmospheres. Everything we do begins with a feeling and ends with a moment to remember.",
  },
  {
    num: "04",
    isVideo: false,
    src: "/img/originality.png",
    title: "Originality",
    text: "Originality is our way of staying true. We don't follow trends or expectations, but we create what feels right, even when it's different. Because being outside the rules is not a choice, it's who we are. It flows through every idea we bring to life, every gesture we refine, every experience we imagine.",
  },
];

/* ── shared style constants ── */
const F = { width: "100%", height: "100%", objectFit: "cover" };

function DesktopBrand({ isMobile }) {
  const outerRef             = useRef(null);
  const introOverlayRef      = useRef(null);
  const firstIntroVidRef     = useRef(null);
  const brandIntroRef        = useRef(null);
  const introTitleRef        = useRef(null);
  const introTextRef         = useRef(null);
  const intrVideoRef         = useRef(null);
  const section3ContainerRef = useRef(null);
  const waveVideoRef         = useRef(null);
  const waveVideo2Ref        = useRef(null);
  const waveVideo3Ref        = useRef(null);
  const section4Ref          = useRef(null);
  const s4TitleRef           = useRef(null);
  const s4TextRef            = useRef(null);
  const section5Ref          = useRef(null);
  const s5HeaderRef          = useRef(null);
  const s5TextRef            = useRef(null);
  const whiteBlurRef         = useRef(null);
  const valContainerRef      = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex]     = useState(null);

  const mediaRefs = useRef([]);
  const textRef   = useRef(null);
  const numRef    = useRef(null);
  const titleRef  = useRef(null);
  const lineRef   = useRef(null);
  const paraRef   = useRef(null);

  useLayoutEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(
      [numRef.current, titleRef.current, lineRef.current, paraRef.current],
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power3.out" }
    );
  }, [activeIndex]);

  useLayoutEffect(() => {
    if (prevIndex === null) return;
    const incoming = mediaRefs.current[activeIndex];
    const outgoing  = mediaRefs.current[prevIndex];
    if (!incoming || !outgoing) return;
    gsap.set(incoming, { opacity: 0, scale: 1.06 });
    gsap.to(outgoing, { opacity: 0, scale: 0.97, duration: 0.55, ease: "power2.in" });
    gsap.to(incoming, { opacity: 1, scale: 1, duration: 0.75, ease: "power2.out", delay: 0.15 });
    if (VALUES[activeIndex].isVideo && incoming.tagName === "VIDEO") {
      incoming.currentTime = 0;
      incoming.play().catch(() => {});
    }
  }, [activeIndex]);

  const handleHover = (i) => {
    if (i === activeIndex) return;
    setPrevIndex(activeIndex);
    setActiveIndex(i);
  };

  const active = VALUES[activeIndex];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(section3ContainerRef.current, { opacity: 0, clipPath: "inset(0% 0% 100% 100%)", scale: 1.1 });
      gsap.set([section4Ref.current, section5Ref.current], { yPercent: 100, autoAlpha: 1 });
      gsap.set([introTitleRef.current, introTextRef.current], { x: -50, opacity: 0 });
      gsap.set(intrVideoRef.current, { opacity: 0, x: 40 });
      gsap.set(whiteBlurRef.current,    { opacity: 0, backdropFilter: "blur(0px)" });
      gsap.set(valContainerRef.current, { opacity: 0 });

      gsap.to([introTitleRef.current, introTextRef.current], {
        x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out", delay: 0.3,
      });
      gsap.to(intrVideoRef.current, {
        x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "+=1600%",
          scrub: 0.6,
          pin: true,
        },
      });

      tl.to(section3ContainerRef.current, {
        opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1,
        duration: 2.5, ease: "expo.inOut",
        onStart: () => { if (waveVideoRef.current) waveVideoRef.current.play(); },
      });
      tl.to(brandIntroRef.current, { opacity: 0, scale: 0.9, duration: 1.5 }, "-=2");

      tl.to(section4Ref.current, { yPercent: 0, duration: 3, ease: "expo.inOut" }, "+=0.5");
      tl.to(section3ContainerRef.current, { opacity: 0, duration: 1.5 }, "-=2.5");
      tl.fromTo(
        [s4TitleRef.current, s4TextRef.current],
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, stagger: 0.3, ease: "power3.out" },
        "-=1.5"
      );

      tl.set(section3ContainerRef.current, { clipPath: "inset(0% 0% 100% 100%)", opacity: 0, scale: 1.1 });
      tl.to(section3ContainerRef.current, {
        opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1,
        duration: 2.5, ease: "expo.inOut",
        onStart: () => {
          if (waveVideoRef.current)  gsap.set(waveVideoRef.current,  { opacity: 0 });
          if (waveVideo2Ref.current) { gsap.set(waveVideo2Ref.current, { opacity: 1 }); waveVideo2Ref.current.play(); }
        },
      }, "+=0.3");
      tl.to(section4Ref.current, { opacity: 0, duration: 1.5 }, "-=2");

      tl.to(section5Ref.current, { yPercent: 0, duration: 2.2, ease: "expo.inOut" }, "+=0.3");
      tl.to(section3ContainerRef.current, { opacity: 0, duration: 1.2 }, "-=1.8");
      tl.fromTo(
        [s5HeaderRef.current, s5TextRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.18, ease: "power2.out" },
        "-=1.0"
      );

      tl.set(section3ContainerRef.current, { clipPath: "inset(0% 0% 100% 100%)", opacity: 0, scale: 1.1 });
      tl.set(waveVideo2Ref.current, { opacity: 0 });
      tl.set(waveVideo3Ref.current, { opacity: 1 });
      tl.to(section3ContainerRef.current, {
        opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1,
        duration: 2.5, ease: "expo.inOut",
      }, "+=0.3");
      tl.to(section5Ref.current, { opacity: 0, duration: 1.5 }, "-=2");

      tl.to(valContainerRef.current, { opacity: 1, duration: 1.5, ease: "power2.out" }, "+=0.5");
      tl.to(section3ContainerRef.current, { opacity: 0, duration: 1.2 }, "-=1.0");

      if (firstIntroVidRef.current) {
        firstIntroVidRef.current.onended = () => {
          gsap.to(introOverlayRef.current, {
            opacity: 0, duration: 1.2,
            onComplete: () => {
              if (introOverlayRef.current) introOverlayRef.current.style.display = "none";
            },
          });
        };
      }
    }, outerRef);
    return () => ctx.revert();
  }, []);

  /* ── responsive style helpers ── */
  const titleSize = isMobile ? "clamp(1.6rem, 7vw, 2.2rem)" : "3.5rem";
  const subSize   = isMobile ? "0.85rem" : "1rem";
  const paraSize  = isMobile ? "0.8rem"  : "1rem";
  const textPad   = isMobile ? "4% 7% 5%" : "0 6%";

  const pinkTitle = { fontSize: titleSize, fontWeight: 700, color: "#ec9cb2", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "2px" };
  const blueSub   = { fontSize: subSize,  fontWeight: 700, color: "#004065", marginBottom: isMobile ? "0.8rem" : "1.5rem", lineHeight: 1.4 };
  const bluePara  = { fontSize: paraSize, color: "#004065", lineHeight: 1.7 };
  const sectionDir = isMobile ? "column" : "row";

  return (
    <div
      ref={outerRef}
      style={{ width: "100%", height: "100vh", background: "#fff", position: "relative", overflow: "hidden" }}
    >
      {/* 0. INTRO VIDEO OVERLAY */}
      <div ref={introOverlayRef} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff" }}>
        <video ref={firstIntroVidRef} autoPlay muted playsInline preload="auto" style={F}>
          <source src="/Videos/nnnnnnnnnnnnn.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 1. BRAND INTRO */}
      <div ref={brandIntroRef} style={{
        position: "absolute", inset: 0, background: "#fff", opacity: 1, zIndex: 5,
        display: "flex", flexDirection: sectionDir,
      }}>
        {/* On mobile: video first (top), text second (bottom) */}
        {isMobile && (
          <div style={{ flex: "0 0 50%", position: "relative", overflow: "hidden" }} ref={intrVideoRef}>
            <video autoPlay muted loop playsInline style={F}>
              <source src="/Videos/pinky.mp4" type="video/mp4" />
            </video>
          </div>
        )}
        <div style={{
          flex: isMobile ? "0 0 50%" : "0.8",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: textPad, textAlign: "left", overflow: "auto",
        }}>
          <div ref={introTitleRef}>
            <h2 className="font-barlow" style={pinkTitle}>Brand Introduction</h2>
            <h3 className="font-sans" style={blueSub}>A new language of luxury.</h3>
          </div>
          <div ref={introTextRef}>
            <p className="font-sans" style={bluePara}>
              La Prima Gioielli is a modern, fresh, and youthful Italian jewelry brand where
              emotion becomes visible and presence takes shape. Founded in Vicenza — a city
              renowned for its jewelry excellence — the brand carries the legacy of three
              generations. Born from a deep-rooted family tradition, it has been reimagined by
              siblings Jessica and Jason Arfa, who bring bold energy and creative vision to every
              piece. La Prima Gioielli, visual, emotional, unmistakably different. This is not
              just jewelry. This is a story to be seen — and felt.
            </p>
          </div>
        </div>
        {/* Desktop: video on right */}
        {!isMobile && (
          <div style={{ flex: 1.2, position: "relative", overflow: "hidden" }} ref={intrVideoRef}>
            <video autoPlay muted loop playsInline style={F}>
              <source src="/Videos/pinky.mp4" type="video/mp4" />
            </video>
          </div>
        )}
      </div>

      {/* 3. BRIDGE */}
      <div ref={section3ContainerRef}
        style={{ position: "absolute", inset: 0, zIndex: 50, overflow: "hidden", background: "#fff", pointerEvents: "none" }}>
        <video ref={waveVideoRef} muted playsInline loop style={F}>
          <source src="/Videos/0424.mp4" type="video/mp4" />
        </video>
        <video ref={waveVideo2Ref} muted playsInline loop style={{ ...F, position: "absolute", inset: 0, opacity: 0 }}>
          <source src="/Videos/candy2.mp4" type="video/mp4" />
        </video>
        <video ref={waveVideo3Ref} autoPlay muted playsInline loop style={{ ...F, position: "absolute", inset: 0, opacity: 0 }}>
          <source src="/Videos/0423.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 4. MISSION */}
      <div ref={section4Ref} style={{
        position: "absolute", inset: 0, zIndex: 12, background: "#fff",
        display: "flex", flexDirection: sectionDir,
      }}>
        <div style={{ flex: isMobile ? "0 0 50%" : "1.2", position: "relative", overflow: "hidden" }}>
          <video autoPlay muted loop playsInline style={F}>
            <source src="/Videos/202604141235(1).mp4" type="video/mp4" />
          </video>
        </div>
        <div style={{
          flex: isMobile ? "0 0 50%" : "0.8",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: textPad, overflow: "auto",
        }}>
          <h2 ref={s4TitleRef} className="font-barlow" style={pinkTitle}>Mission</h2>
          <h3 className="font-sans" style={blueSub}>We create more than jewelry — we create meaning.</h3>
          <p ref={s4TextRef} className="font-sans" style={bluePara}>
            Through atmosphere, emotion, and storytelling, we turn every moment with LA PRIMA into
            something you&apos;ll remember. Not because of what you wear, but because of what you feel.
            We believe in beauty made with care, in people who become part of something real, and
            in doing things the Italian way: with heart, with hands, and with truth.
          </p>
        </div>
      </div>

      {/* 5. VISION */}
      <div ref={section5Ref} style={{
        position: "absolute", inset: 0, zIndex: 13, background: "#fff",
        display: "flex", flexDirection: sectionDir,
      }}>
        <div style={{
          flex: isMobile ? "0 0 50%" : "1",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: isMobile ? textPad : "0 6% 0 8%", overflow: "auto",
        }}>
          <h2 ref={s5HeaderRef} className="font-barlow" style={pinkTitle}>Vision</h2>
          <div ref={s5TextRef} style={{ maxWidth: isMobile ? "none" : "480px", marginTop: "0.8rem" }}>
            <p className="font-sans" style={{ ...blueSub, marginBottom: "0.8rem" }}>
              To rewrite the rules of luxury with freshness, emotion and freedom.
            </p>
            <p className="font-sans" style={bluePara}>
              We believe luxury should be alive, surprising and unforgettable — not distant, not
              cold, not untouchable. We believe in a kind of luxury that takes risks, that
              surprises, that dares to feel.
            </p>
          </div>
        </div>
        <div style={{ flex: isMobile ? "0 0 50%" : "1.2", position: "relative", overflow: "hidden" }}>
          <video autoPlay muted loop playsInline style={F}>
            <source src="/Videos/202604141235.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* 5.5. WHITE BLUR DISSOLVE OVERLAY */}
      <div ref={whiteBlurRef} style={{
        position: "absolute", inset: 0, zIndex: 54,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)",
        pointerEvents: "none", opacity: 0,
      }} />

      {/* 6. VALUES */}
      <div ref={valContainerRef} style={{
        position: "absolute", inset: 0, zIndex: 55,
        background: "#fff", overflow: "hidden",
        fontFamily: "'Cormorant Garamond', serif",
        ...(isMobile
          ? { display: "flex", flexDirection: "column" }
          : { display: "grid", gridTemplateColumns: "0.6fr 1.4fr", gridTemplateRows: "1fr" }
        ),
      }}>

        {isMobile ? (
          /* ── MOBILE VALUES: label → tabs → full-height image ── */
          <>
            <p style={{
              flexShrink: 0,
              textAlign: "center",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.55rem", letterSpacing: "8px",
              color: "#ec9cb2", textTransform: "uppercase",
              padding: "5% 0 3%",
            }}>
              Brand Values
            </p>

            {/* Tabs */}
            <div style={{ display: "flex", flexShrink: 0, borderTop: "0.5px solid rgba(0,64,86,0.12)", borderBottom: "0.5px solid rgba(0,64,86,0.08)" }}>
              {VALUES.map((v, i) => (
                <button key={v.num} onClick={() => handleHover(i)} style={{
                  flex: 1, padding: "0.8rem 0.2rem",
                  background: "none", border: "none",
                  borderTop: `2px solid ${i === activeIndex ? "#ec9cb2" : "transparent"}`,
                  borderRight: i < VALUES.length - 1 ? "0.5px solid rgba(0,64,86,0.1)" : "none",
                  cursor: "pointer", transition: "all 0.3s",
                }}>
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "0.45rem", letterSpacing: "3px",
                    color: i === activeIndex ? "#ec9cb2" : "rgba(0,64,86,0.3)",
                    display: "block", marginBottom: "0.2rem",
                  }}>
                    {v.num}
                  </span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.72rem",
                    color: i === activeIndex ? "#004056" : "rgba(0,64,86,0.4)",
                    fontWeight: 400, display: "block",
                  }}>
                    {v.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Image — fills all remaining height */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
              {VALUES.map((v, i) => (
                <div key={v.num} ref={(el) => (mediaRefs.current[i] = el)}
                  style={{ position: "absolute", inset: 0, opacity: i === activeIndex ? 1 : 0, transition: "opacity 0.65s ease" }}>
                  {v.isVideo ? (
                    <video autoPlay={i === activeIndex} muted loop playsInline style={F}>
                      <source src={v.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={v.src} alt={v.title} style={F} />
                  )}
                </div>
              ))}

              {/* Text overlay */}
              <div ref={textRef} style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "5% 6% 7%", zIndex: 3,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
              }}>
                <span ref={numRef} style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "0.55rem", letterSpacing: "6px",
                  color: "#ec9cb2", display: "block", marginBottom: "0.5rem",
                }}>
                  {active.num} / 04
                </span>
                <h2 ref={titleRef} style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
                  color: "#fff", fontWeight: 400, margin: "0 0 0.6rem", lineHeight: 1.05,
                  textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}>
                  {active.title}
                </h2>
                <div ref={lineRef} style={{
                  width: "36px", height: "1px",
                  background: "linear-gradient(to right, #ec9cb2, transparent)", marginBottom: "0.7rem",
                }} />
                <p ref={paraRef} style={{
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontSize: "clamp(0.72rem, 2.5vw, 0.85rem)",
                  color: "rgba(255,255,255,0.9)", lineHeight: 1.75,
                  margin: 0, fontWeight: 400,
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                }}>
                  {active.text}
                </p>
              </div>
            </div>
          </>
        ) : (
          /* ── DESKTOP VALUES: left list + right image ── */
          <>
            <div style={{
              display: "flex", flexDirection: "column", justifyContent: "center",
              padding: "8% 6% 8% 9%",
              borderRight: "0.5px solid rgba(0,64,86,0.12)",
              position: "relative", zIndex: 2, background: "#fff",
            }}>
              <p style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "0.6rem", letterSpacing: "8px", color: "#ec9cb2",
                textTransform: "uppercase", marginBottom: "3rem", opacity: 0.9,
              }}>
                Brand Values
              </p>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {VALUES.map((v, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <div key={v.num}
                      onMouseEnter={() => handleHover(i)}
                      onClick={() => handleHover(i)}
                      style={{
                        cursor: "pointer", padding: "1.2rem 0",
                        borderBottom: "0.5px solid rgba(0,64,86,0.1)",
                        display: "flex", alignItems: "center", gap: "1.5rem",
                        transition: "padding-left 0.4s ease",
                        paddingLeft: isActive ? "1rem" : "0",
                      }}>
                      <span style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: "0.58rem", letterSpacing: "4px",
                        color: isActive ? "#ec9cb2" : "rgba(0,64,86,0.3)",
                        transition: "color 0.4s ease", minWidth: "28px",
                      }}>
                        {v.num}
                      </span>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: isActive ? "clamp(1.6rem, 2.4vw, 2.6rem)" : "clamp(1.1rem, 1.7vw, 2rem)",
                        color: isActive ? "#004056" : "rgba(0,64,86,0.28)",
                        fontWeight: 400, margin: 0, lineHeight: 1,
                        transition: "all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        letterSpacing: isActive ? "0.02em" : "0.01em",
                      }}>
                        {v.title}
                      </h3>
                      <div style={{
                        flex: 1, height: "1px",
                        background: "linear-gradient(to right, #ec9cb2, transparent)",
                        opacity: isActive ? 1 : 0, transition: "opacity 0.4s ease", marginLeft: "0.5rem",
                      }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: "3rem", width: "40px", height: "1px", background: "rgba(236,156,178,0.5)" }} />
            </div>

            <div style={{ position: "relative", overflow: "hidden", height: "100%" }}>
              {VALUES.map((v, i) => (
                <div key={v.num} ref={(el) => (mediaRefs.current[i] = el)}
                  style={{ position: "absolute", inset: 0, opacity: i === activeIndex ? 1 : 0 }}>
                  {v.isVideo ? (
                    <video autoPlay={i === activeIndex} muted loop playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                      <source src={v.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={v.src} alt={v.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              ))}

              <div ref={textRef} style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "8% 9% 8%", zIndex: 3,
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
              }}>
                <span ref={numRef} style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "0.65rem", letterSpacing: "7px",
                  color: "#ec9cb2", textTransform: "uppercase",
                  display: "block", marginBottom: "1rem",
                }}>
                  {active.num} / 04
                </span>
                <h2 ref={titleRef} style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 3vw, 3.5rem)",
                  color: "#fff", fontWeight: 400, margin: "0 0 1rem", lineHeight: 1.05,
                  textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                }}>
                  {active.title}
                </h2>
                <div ref={lineRef} style={{
                  width: "52px", height: "1px",
                  background: "linear-gradient(to right, #ec9cb2, transparent)", marginBottom: "1.2rem",
                }} />
                <p ref={paraRef} style={{
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                  fontSize: "clamp(0.85rem, 1vw, 1rem)",
                  color: "rgba(255,255,255,0.92)", lineHeight: 1.85,
                  margin: 0, maxWidth: "400px", fontWeight: 400,
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                }}>
                  {active.text}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Root export ── */
export default function HeroChapter() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return null;
  return <DesktopBrand isMobile={isMobile} />;
}
