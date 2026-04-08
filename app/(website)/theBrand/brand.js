"use client";

import { useEffect, useRef, useState } from "react";

const BRAND_INTRO = [
  {
    id: "laprimagioielli",
    word: "La Prima\nGioielli",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0293_VELLUTO-scaled-e1760607771149.jpg",
    body: "A new language of luxury. La Prima Gioielli is a modern, fresh, and youthful Italian jewelry brand where emotion becomes visible and presence takes shape. Founded in Vicenza — a city renowned for its jewelry excellence — the brand carries the legacy of three generations. Born from a deep-rooted family tradition, reimagined by siblings Jessica and Jason Arfa, who bring bold energy and creative vision to every piece. Visual, emotional, unmistakably different. This is not just jewelry. This is a story to be seen — and felt.",
  },
  {
    id: "mission",
    word: "Mission",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/11/LaPrimaGioielli_SS26_2261_PRESTIGE-e1762183241824.jpg",
    body: "We create more than jewelry — we create meaning. Through atmosphere, emotion, and storytelling, we turn every moment with La Prima into something you'll remember. Not because of what you wear, but because of what you feel. We believe in beauty made with care, in people who become part of something real, and in doing things the Italian way: with heart, with hands, and with truth.",
  },
  {
    id: "vision",
    word: "Vision",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_1832_VERONA-1-scaled-e1760699688450.jpg",
    body: "To rewrite the rules of luxury with freshness, emotion and freedom. We believe luxury should be alive, surprising and unforgettable — not distant, not cold, not untouchable. We believe in a kind of luxury that takes risks, that surprises, that dares to feel. This is our vision: to stand apart even when it's not the safest choice.",
  },
];

const BRAND_VALUES = [
  {
    id: "italianity",
    word: "Italianity",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/10/LaPimaGioielli_SS26_7338_VELLUTO-scaled-e1760608032624.jpg",
    body: "It is our origin, our pride, and our essence. We were born in Vicenza, a city synonymous with Italian jewelry excellence. Our creations are crafted entirely in Italy, by hand, with passion. Because that's how we grew up: surrounded by beauty, raised to recognize it.",
  },
  {
    id: "family",
    word: "Family",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_2200_PRESTIGE-scaled.jpg",
    body: "Family is where we come from and what we believe in. We are a family business, but for us, family goes beyond kinship. It's about building trust, creating bonds, and making everyone feel part of something real.",
  },
  {
    id: "emotion",
    word: "Emotion",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0087_VERONA-scaled-e1760609829333.jpg",
    body: "Emotion is our purpose. We don't just create products — we create memories, experiences, atmospheres. Everything we do begins with a feeling and ends with a moment to remember.",
  },
  {
    id: "originality",
    word: "Originality",
    image: "https://staging16.laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_1842_VERONA-1-scaled-e1760699936848.jpg",
    body: "Originality is our way of staying true. We don't follow trends or expectations, but we create what feels right, even when it's different. Because being outside the rules is not a choice — it's who we are.",
  },
];

const HERO_PHOTOS = [
  "https://staging16.laprimagioielli.com/wp-content/uploads/2025/12/LaPrimaGioielli_SS26_0613_VERONA-e1764666859172.jpg",
  "https://staging16.laprimagioielli.com/wp-content/uploads/2025/12/4-1-1.png",
  "https://staging16.laprimagioielli.com/wp-content/uploads/2025/11/1.png",
  "https://staging16.laprimagioielli.com/wp-content/uploads/2025/11/6.png",
];

// ─── BUBBLE INTRO ───────────────────────────────────────────────────────────────
const SPLATTERS = [
  { angle: 0,   dist: 260, size: 14, white: false },
  { angle: 32,  dist: 310, size: 10, white: true  },
  { angle: 65,  dist: 240, size: 20, white: false },
  { angle: 98,  dist: 290, size: 8,  white: true  },
  { angle: 130, dist: 270, size: 16, white: false },
  { angle: 163, dist: 320, size: 12, white: true  },
  { angle: 195, dist: 250, size: 22, white: false },
  { angle: 228, dist: 300, size: 10, white: false },
  { angle: 260, dist: 265, size: 18, white: true  },
  { angle: 295, dist: 285, size: 14, white: false },
  { angle: 328, dist: 240, size: 8,  white: true  },
];

const BUBBLE_KEYFRAMES = `
  @keyframes splatterFly {
    0%   { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    70%  { opacity: 0.8; }
    100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.15); opacity: 0; }
  }
`;

function BubbleIntro({ onDone }) {
  const [phase, setPhase] = useState("playing"); // playing | burst
  const videoRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = BUBBLE_KEYFRAMES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const triggerBurst = () => {
    if (phase !== "playing") return;
    setPhase("burst");
    onDone();
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.duration && v.duration - v.currentTime <= 1) {
      triggerBurst();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        overflow: "hidden",
        pointerEvents: phase === "burst" ? "none" : "all",
      }}
    >
      {/* ── Video ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerBurst}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: phase === "burst" ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      >
        <source src="/Videos/bubble.mp4" type="video/mp4" />
      </video>

      {/* ── Splatter dots ── */}
      {phase === "burst" &&
        SPLATTERS.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const dx = Math.cos(rad) * s.dist;
          const dy = Math.sin(rad) * s.dist;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "52%",
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                background: s.white ? "rgba(255,255,255,0.88)" : "#ec9cb2",
                "--dx": `${dx}px`,
                "--dy": `${dy}px`,
                animation: `splatterFly 0.72s cubic-bezier(0.18,0,0,1) ${i * 28}ms both`,
                zIndex: 5,
                pointerEvents: "none",
              }}
            />
          );
        })}

      {/* ── Skip button ── */}
      {phase === "playing" && (
        <button
          onClick={triggerBurst}
          style={{
            position: "absolute",
            bottom: 48,
            right: 48,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "rgba(255,255,255,0.75)",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            padding: "10px 28px",
            cursor: "pointer",
            zIndex: 20,
            backdropFilter: "blur(6px)",
          }}
        >
          Skip
        </button>
      )}
    </div>
  );
}

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Cursor({ mouse }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  useEffect(() => {
    const tick = () => {
      ref.current.x += (mouse.x - ref.current.x) * 0.1;
      ref.current.y += (mouse.y - ref.current.y) * 0.1;
      setPos({ x: ref.current.x, y: ref.current.y });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [mouse]);
  return (
    <>
      <div style={{ position:"fixed", pointerEvents:"none", zIndex:9999, left:pos.x-20, top:pos.y-20, width:40, height:40, borderRadius:"50%", border:"1px solid rgba(236,156,178,0.6)", transition:"opacity 0.3s" }} />
      <div style={{ position:"fixed", pointerEvents:"none", zIndex:9999, left:mouse.x-3, top:mouse.y-3, width:6, height:6, borderRadius:"50%", background:"#ec9cb2" }} />
    </>
  );
}

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % HERO_PHOTOS.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ position:"relative", width:"100%", height:"calc(100vh - 40px)", marginTop:"60px", overflow:"hidden" }}>
      {HERO_PHOTOS.map((src, i) => (
        <div key={src} style={{ position:"absolute", inset:0, opacity: i === current ? 1 : 0, transition:"opacity 1s cubic-bezier(0.4,0,0.2,1)" }}>
          <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
      ))}
      <div style={{ position:"absolute", bottom:44, left:"50%", transform:"translateX(-50%)", display:"flex", gap:10, zIndex:4 }}>
        {HERO_PHOTOS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{ width: i===current ? 24 : 6, height:6, borderRadius:3, border:"none", cursor:"pointer", background: i===current ? "#ec9cb2" : "rgba(255,255,255,0.3)", transition:"all 0.4s ease", padding:0 }} />
        ))}
      </div>
    </section>
  );
}

// ─── HOVER SECTION ─────────────────────────────────────────────────────────────
function HoverSection({ title, items, mouse, winW, winH, imageRight = false }) {
  const [active, setActive] = useState(0);
  const [sectionRef, visible] = useReveal(0.1);

  const tiltX = winW ? ((mouse.x / winW) - 0.5) * 8 : 0;
  const tiltY = winH ? ((mouse.y / winH) - 0.5) * 8 : 0;

  return (
    <section
      ref={sectionRef}
      style={{
        display: "flex",
        flexDirection: imageRight ? "row-reverse" : "row",
        alignItems: "stretch",
        width: "100%",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* LEFT — image, exactly 50% wide, height driven by flex-stretch from right panel */}
      <div
        style={{
          width: "50%",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-30px)",
          transition: "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.7s ease",
            }}
          >
            <img
              src={item.image}
              alt={item.word}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `perspective(1200px) rotateX(${-tiltY * 0.25}deg) rotateY(${tiltX * 0.25}deg) scale(1.04)`,
                transition: "transform 0.2s ease",
                willChange: "transform",
              }}
            />
          </div>
        ))}
        {/* Subtle right-edge fade into white */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, transparent 70%, rgba(255,255,255,0.18) 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* RIGHT — item list, 50% wide */}
      <div
        style={{
          width: "50%",
          padding: "80px 6vw 80px 5vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(30px)",
          transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
        }}
      >
        {/* Section title */}
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#ec9cb2",
            marginBottom: 8,
          }}
        >
          {title}
        </p>
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(1.4rem, 2.2vw, 2.4rem)",
            fontWeight: 200,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#004065",
            marginBottom: 52,
          }}
        >
          {title}
        </h2>

        {/* Item rows */}
        {items.map((item, i) => (
          <div
            key={item.id}
            onMouseEnter={() => setActive(i)}
            style={{
              padding: "22px 0",
              borderBottom: "1px solid rgba(0,64,101,0.08)",
              cursor: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: i === active ? 10 : 0 }}>
              <div
                style={{
                  width: i === active ? 28 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === active ? "#ec9cb2" : "rgba(236,156,178,0.3)",
                  transition: "all 0.4s ease",
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: i === active ? "clamp(1.2rem, 1.8vw, 1.9rem)" : "clamp(0.95rem, 1.3vw, 1.4rem)",
                  fontWeight: 300,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: i === active ? "#004065" : "rgba(0,64,101,0.28)",
                  transition: "all 0.4s ease",
                  margin: 0,
                }}
              >
                {item.word.replace("\n", " ")}
              </h3>
            </div>

            {/* Scrollable body text — max-height + overflow-y: auto */}
            <div
              style={{
                paddingLeft: 44,
                maxHeight: i === active ? 180 : 0,
                opacity: i === active ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.55s ease, opacity 0.4s ease",
              }}
            >
              <div
                style={{
                  maxHeight: 170,
                  overflowY: "auto",
                  paddingRight: 8,
                  /* Custom scrollbar */
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(236,156,178,0.5) transparent",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: "rgba(0,64,101,0.65)",
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function BrandShowcase() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [win, setWin] = useState({ w: 1440, h: 900 });
  const [showIntro, setShowIntro] = useState(true);
  const [pageVisible, setPageVisible] = useState(false);

  useEffect(() => {
    const onMove = e => setMouse({ x: e.clientX, y: e.clientY });
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleIntroDone = () => {
    setPageVisible(true);
    setTimeout(() => setShowIntro(false), 900);
  };

  return (
    <>
      {showIntro && <BubbleIntro onDone={handleIntroDone} />}
      <div
        style={{
          background: "#fff",
          cursor: "none",
          overflowX: "hidden",
          clipPath: pageVisible ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
          transition: "clip-path 0.55s cubic-bezier(0.05, 0, 0, 1)",
        }}
      >
        <Cursor mouse={mouse} />
        <Hero />

        <HoverSection
          title="Brand Introduction"
          items={BRAND_INTRO}
          mouse={mouse}
          winW={win.w}
          winH={win.h}
          imageRight={true}
        />

        <HoverSection
          title="Brand Values"
          items={BRAND_VALUES}
          mouse={mouse}
          winW={win.w}
          winH={win.h}
        />
      </div>
    </>
  );
}