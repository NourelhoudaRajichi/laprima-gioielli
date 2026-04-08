"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import './women.css';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const decades = [
  {
    id: "c15", label: "15th Century",
    events: [{
      year: "15th Century",
      text: "Pink has never been just a pretty color. It began in the 15th century, during the Renaissance. In The Birth of Venus by Botticelli, the goddess of love stands on a shell, her pale pink skin glowing with beauty and softness. This image connected pink with love, femininity, and divine beauty.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0131_VERONA-scaled-e1760609519877.jpg"
    }],
  },
  {
    id: "c18", label: "18th Century",
    events: [{
      year: "18th Century",
      text: "In the 18th century, pink became popular in France thanks to Madame de Pompadour, advisor to King Louis XV. She loved the color so much that a special shade was named after her: Rose Pompadour. Pink was a symbol of luxury, elegance, and high social class — worn by both women and men at the royal court.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_2200_PRESTIGE-scaled.jpg"
    }],
  },
  {
    id: "c19", label: "19th Century",
    events: [{
      year: "19th Century",
      text: "In the 19th century, pink started to be seen as a more feminine color. As men's fashion became darker and more serious, pink was linked more and more with women and softness.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_1576_VERONA-scaled-e1760608918351.jpg"
    }],
  },
  {
    id: "c20", label: "20th Century",
    events: [{
      year: "20th Century",
      text: "With industrialization in the early 20th century, dyes became cheaper, and pink became a color for everyone. Bright shades like fuchsia and magenta appeared in clothes, ads, and everyday items. Pink was now the people's color — bold, fun, and expressive.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0502_VELLUTO-scaled-e1760609039308.jpg"
    }],
  },
  {
    id: "d40", label: "1940s",
    events: [{
      year: "1940s",
      text: "During the 1940s, in wartime, pink was connected with women at home. While men wore dark military uniforms, women were often dressed in pink — a sign of domestic life, care, and softness.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_2397_PRESTIGE-scaled-e1760607365260.jpg"
    }],
  },
  {
    id: "d50", label: "1950s & 60s",
    events: [{
      year: "1950s & 60s",
      text: "In the 1950s and 60s, pink became powerful again. Mamie Eisenhower wore so much pink that Mamie Pink became famous. Jackie Kennedy brought elegance with her pink suits. Marilyn Monroe gave pink bold energy with her bright dress in Diamonds Are a Girl's Best Friend.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPimaGioielli_SS26_7338_VELLUTO-scaled-e1760608032624.jpg"
    }],
  },
  {
    id: "d80", label: "1980s",
    events: [{
      year: "1980s",
      text: "In the 1980s, pink became a symbol of hope and healing. The pink ribbon was created by the Susan G. Komen Foundation as the symbol for breast cancer awareness. Since then, pink has stood for support, strength, and care for millions of women around the world.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_1673_VERONA-scaled-e1760608285867.jpg"
    }],
  },
  {
    id: "today", label: "Today",
    events: [{
      year: "Today",
      text: "Today, pink is everywhere and means different things to different people. Stars like Paris Hilton, Ariana Grande, and Pink each made the color part of their image. Whether soft or bold, sweet or strong, pink has become a way to show personality and power.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0293_VELLUTO-scaled-e1760607771149.jpg"
    }],
  },
  {
    id: "y2018", label: "2018",
    events: [{
      year: "2018",
      text: "In 2018, the oldest known pigment in the world, found in the Sahara Desert, was pink — more than 1.1 billion years old. From goddesses and queens to pop stars and fighters, pink has always been more than a color. It's a symbol of beauty, strength, and identity.",
      bg: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0087_VERONA-scaled-e1760609829333.jpg"
    }],
  },
];

const allEvents = decades.flatMap((d) =>
  d.events.map((e) => ({ ...e, decadeId: d.id, decadeLabel: d.label }))
);

const HERO_VIDEO_URL = "/Videos/girl.mp4";
const HERO_POSTER    = "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0131_VERONA-scaled-e1760609519877.jpg";
const INK_VIDEO_URL  = "/Videos/hand.mp4";

/* ─────────────────────────────────────────────────────────────
   NEWSPAPER HERO
───────────────────────────────────────────────────────────── */
function NewspaperHero({ onPinkProgress }) {
  const stageRef    = useRef(null);
  const wrapRef     = useRef(null);
  const videoBoxRef = useRef(null);
  const fullRef     = useRef(null);
  const pinkWrapRef = useRef(null);
  const pinkVidRef  = useRef(null);
  const naturalVbox = useRef(null);
  const hintRef     = useRef(null);
  const lastP       = useRef(-1);

  useEffect(() => {
    const pinkVid = pinkVidRef.current;
    const full    = fullRef.current;

    if (full) {
      full.style.opacity       = "0";
      full.style.pointerEvents = "none";
    }

    const captureNatural = () => {
      const vbox = videoBoxRef.current;
      const wrap = wrapRef.current;
      if (!vbox || !wrap) return;
      const vr = vbox.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      naturalVbox.current = {
        cx: vr.left - wr.left + vr.width  / 2,
        cy: vr.top  - wr.top  + vr.height / 2,
        w:  vr.width, h: vr.height,
        wrapW: wr.width, wrapH: wr.height,
      };
    };
    const frame = requestAnimationFrame(captureNatural);

    function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    const onScroll = () => {
      const stage  = stageRef.current;
      const wrap   = wrapRef.current;
      const vbox   = videoBoxRef.current;
      const full   = fullRef.current;
      const pinkW  = pinkWrapRef.current;
      const hint   = hintRef.current;
      if (!stage || !wrap || !vbox || !full || !pinkW) return;

      const rect       = stage.getBoundingClientRect();
      const scrollable = stage.offsetHeight - window.innerHeight;
      const p          = clamp(-rect.top / scrollable, 0, 1);

      if (hint) hint.style.opacity = p < 0.02 ? "1" : `${Math.max(0, 1 - p * 35)}`;

      if (pinkVid) {
        if (lastP.current >= 0.50 && p < 0.50) {
          pinkVid.currentTime = 0;
          pinkVid.pause();
        }
        if (lastP.current < 0.50 && p >= 0.50) {
          pinkVid.currentTime = 0;
          pinkVid.loop = true;
          pinkVid.play().catch(() => {});
        }
      }
      lastP.current = p;

      if (p <= 0.15) {
        wrap.style.transformOrigin = "center center";
        wrap.style.transform       = `rotate(${-3 + (p / 0.15) * 3}deg)`;
        wrap.style.opacity         = "1";
        full.style.opacity         = "0";
        full.style.pointerEvents   = "none";
        pinkW.style.opacity        = "0";
        pinkW.style.pointerEvents  = "none";
        if (onPinkProgress) onPinkProgress(0);
        return;
      }

      if (p <= 0.50) {
        const t = clamp((p - 0.15) / 0.35, 0, 1);
        const e = easeOutCubic(t);
        if (!naturalVbox.current) captureNatural();
        const nat         = naturalVbox.current;
        const targetScale = Math.max(window.innerWidth / nat.w, window.innerHeight / nat.h) * 1.08;
        const scale       = 1 + e * (targetScale - 1);
        const ox          = (nat.cx / nat.wrapW * 100).toFixed(3) + "%";
        const oy          = (nat.cy / nat.wrapH * 100).toFixed(3) + "%";
        wrap.style.transformOrigin = `${ox} ${oy}`;
        wrap.style.transform       = `scale(${scale})`;
        wrap.style.opacity         = t > 0.88 ? `${1 - clamp((t - 0.88) / 0.12, 0, 1)}` : "1";
        const fa = t > 0.70 ? clamp((t - 0.70) / 0.30, 0, 1) : 0;
        full.style.opacity       = `${fa}`;
        full.style.pointerEvents = fa > 0.05 ? "auto" : "none";
        pinkW.style.opacity      = "0";
        pinkW.style.pointerEvents = "none";
        if (onPinkProgress) onPinkProgress(0);
        return;
      }

      if (p <= 0.62) {
        const t = clamp((p - 0.50) / 0.12, 0, 1);
        wrap.style.opacity        = "0";
        full.style.opacity        = `${1 - t}`;
        full.style.pointerEvents  = t > 0.95 ? "none" : "auto";
        pinkW.style.opacity       = `${t}`;
        pinkW.style.pointerEvents = t > 0.05 ? "auto" : "none";
        if (onPinkProgress) onPinkProgress(0);
        return;
      }

      if (p <= 0.72) {
        wrap.style.opacity        = "0";
        full.style.opacity        = "0";
        full.style.pointerEvents  = "none";
        pinkW.style.opacity       = "1";
        pinkW.style.pointerEvents = "auto";
        if (onPinkProgress) onPinkProgress(0);
        return;
      }

      const t4 = clamp((p - 0.72) / 0.28, 0, 1);
      wrap.style.opacity        = "0";
      full.style.opacity        = "0";
      full.style.pointerEvents  = "none";
      pinkW.style.opacity       = `${1 - t4}`;
      pinkW.style.pointerEvents = t4 > 0.95 ? "none" : "auto";
      if (onPinkProgress) onPinkProgress(t4);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, [onPinkProgress]);

  const todayStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const INK     = "#004065";
  const PINK    = "#ec9cb2";
  const INK_MID = "rgba(30,30,30,0.55)";
  const INK_DIM = "rgba(30,30,30,0.32)";
  const RULE    = "rgba(30,30,30,0.18)";
  const colHead = { fontFamily:"'Barlow Condensed',sans-serif", fontSize:"clamp(9px,1.1vw,11px)", fontWeight:700, letterSpacing:"0.20em", textTransform:"uppercase", color:INK, borderBottom:`1px solid ${RULE}`, paddingBottom:4, marginBottom:8 };
  const bodyTxt = { fontFamily:"'IM Fell English',serif", fontWeight:400, fontSize:"clamp(8px,0.92vw,10px)", color:INK, lineHeight:1.70, textAlign:"justify" };
  const orn     = { textAlign:"center", color:INK_DIM, fontSize:11, margin:"7px 0", letterSpacing:"0.3em" };

  return (
    <div ref={stageRef} data-hero style={{ position:"relative", height:"1200vh" }}>
      <div style={{
        position:       "sticky",
        top:            "var(--nav-height)",
        height:         "calc(100vh - var(--nav-height))",
        background:     "transparent",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        overflow:       "hidden",
         zIndex:         3,  
      }}>

        <div ref={wrapRef} style={{ width:"min(1160px,96vw)", position:"relative", zIndex:10, willChange:"transform,opacity", transform:"rotate(-3deg)", transformOrigin:"center center" }}>
          <div style={{ background:`url('/img/paper1.jpg') center center / cover no-repeat`, border:"1px solid rgba(0,0,0,0.20)", boxShadow:"1px 2px 4px rgba(0,0,0,0.06),6px 14px 40px rgba(0,0,0,0.18),0 30px 70px rgba(0,0,0,0.10)", position:"relative" }}>
            <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:25, opacity:0.28, backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")` }} />
            <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"linear-gradient(to bottom,transparent 4%,rgba(0,0,0,0.07) 18%,rgba(0,0,0,0.07) 82%,transparent 96%)", pointerEvents:"none", zIndex:24 }} />

            <div style={{ borderBottom:"3px double rgba(0,0,0,0.35)", padding:"12px 28px 10px", textAlign:"center" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'IM Fell English',serif", fontWeight:400, fontStyle:"italic", fontSize:"clamp(7px,0.82vw,9px)", color:INK_MID, letterSpacing:"0.16em", textTransform:"uppercase", borderBottom:`1px solid ${RULE}`, paddingBottom:5, marginBottom:7 }}>
                <span>Vol. CCCXXI · No. 47</span><span>Est. 15th Century</span><span>Commemorative Edition</span>
              </div>
              <div style={{ fontFamily:"'UnifrakturMaguntia',cursive", fontSize:"clamp(2rem,5.8vw,4.2rem)", color:"#ec9cb2", lineHeight:1 }}>Women and Pink</div>
              <div style={{ fontFamily:"'IM Fell English',serif", fontWeight:400, fontStyle:"italic", fontSize:"clamp(9px,1.1vw,12px)", color:INK_MID, letterSpacing:"0.12em", marginTop:5 }}>A History Since the 15th Century · La Prima Gioielli</div>
              <div style={{ height:1, background:`linear-gradient(to right,transparent,${RULE},transparent)`, marginTop:7 }} />
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 28px", borderBottom:`1px solid ${RULE}`, background:"rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily:"'IM Fell English',serif", fontSize:"clamp(12px,1.8vw,17px)", fontWeight:400, fontStyle:"italic", color:INK }}>{todayStr}</div>
              <div style={{ fontFamily:"'IM Fell English',serif", fontWeight:400, fontStyle:"italic", fontSize:"clamp(8px,0.9vw,10px)", color:INK_MID, textAlign:"right", lineHeight:1.5 }}>Special Edition<br/>Price: One Shilling</div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"0.75fr 2.5fr 0.75fr", borderBottom:`2px double rgba(0,0,0,0.25)` }}>
              <div style={{ padding:"13px 16px", borderRight:`1px solid ${RULE}` }}>
                <div style={colHead}>Fashion &amp; Society</div>
                <p style={bodyTxt}>In the courts of Versailles, a colour hitherto reserved for dawn itself became the signature of power. Madame de Pompadour ordered a shade so vivid — Rose Pompadour — that the world bent to her palette.</p>
                <div style={orn}>— ✦ —</div>
                <p style={bodyTxt}>Scholars of pigment record that no hue has travelled so far — from Botticelli&apos;s Venus to the ribbons of solidarity worn by millions worldwide today.</p>
                <div style={orn}>· · ·</div>
                <p style={bodyTxt}>Royal courts decreed that no other colour could so perfectly combine tenderness with authority. Pink was never small.</p>
                <div style={{ border:`1.5px solid ${RULE}`, borderTop:`2px solid rgba(0,0,0,0.30)`, padding:"9px 7px", textAlign:"center", marginTop:14, background:"rgba(0,0,0,0.03)" }}>
                  <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:8, color:INK_DIM, marginBottom:2, letterSpacing:"0.14em" }}>— Advertisement —</div>
                  <div style={{ fontFamily:"'Cormorant Garamond'", fontSize:"clamp(13px,1.6vw,17px)", color:PINK }}>La Prima Gioielli</div>
                  <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:9, color:INK_MID, marginTop:2 }}>Jewels for the Modern Goddess</div>
                </div>
              </div>

              <div style={{ padding:"13px 18px", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ fontFamily:"'IM Fell English',serif", fontSize:"clamp(15px,2.6vw,28px)", fontWeight:400, color:PINK, lineHeight:1.15, textAlign:"center" }}>
                  Women And Pink :<br/><em style={{ fontSize:"0.82em", color:INK }}>The Eternal Reign of Pink</em>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%" }}>
                  <div style={{ flex:1, height:1, background:RULE }}/><span style={{ color:INK_DIM, fontSize:11 }}>✦</span><div style={{ flex:1, height:1, background:RULE }}/>
                </div>
                <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"clamp(9px,1.15vw,12px)", color:PINK, textAlign:"center", lineHeight:1.55, borderLeft:`3px solid rgba(0,0,0,0.18)`, borderRight:`3px solid rgba(0,0,0,0.18)`, padding:"4px 10px" }}>
                  &quot;A colour of divine origin — worn by queens,<br/>mourned by none, forgotten by none.&quot;
                </div>
                <button
                  onClick={() => window.scrollBy({ top: window.innerHeight * 2, behavior: "smooth" })}
                  style={{
                    fontFamily:      "'Barlow Condensed', sans-serif",
                    fontWeight:      700,
                    fontSize:        "clamp(9px,1.05vw,13px)",
                    letterSpacing:   "0.28em",
                    textTransform:   "uppercase",
                    color:           "#fff",
                    background:      "#ec9cb2",
                    border:          "none",
                    padding:         "10px 28px",
                    cursor:          "pointer",
                    alignSelf:       "center",
                    boxShadow:       "0 3px 16px rgba(236,156,178,0.55)",
                    animation:       "pulse-pink 2s ease-in-out infinite",
                    flexShrink:      0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#d4819b"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#ec9cb2"; }}
                >
                  ↓ &nbsp; Scroll for more &nbsp; ↓
                </button>
                <div ref={videoBoxRef} style={{ width:"100%", position:"relative", flexShrink:0, border:`2px solid rgba(0,0,0,0.30)`, boxShadow:`3px 3px 0 rgba(0,0,0,0.10)` }}>
                  <div style={{ aspectRatio:"3/2", background:"#0a0d14", overflow:"hidden", position:"relative" }}>
                    <video src={HERO_VIDEO_URL} autoPlay muted loop playsInline style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    {[{left:0},{right:0}].map((pos,i)=>(
                      <div key={i} style={{ position:"absolute", top:0, bottom:0, width:10, ...pos, background:"repeating-linear-gradient(to bottom,rgba(0,0,0,0.30) 0,rgba(0,0,0,0.30) 5px,transparent 5px,transparent 11px)" }}/>
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"clamp(7px,0.82vw,9px)", color:INK_DIM, textAlign:"center", borderTop:`1px solid ${RULE}`, paddingTop:3, width:"100%", letterSpacing:"0.04em" }}>
                  Fig. I — The Pink Chronicle · A Visual History from 1400 to Present Day
                </div>
                <div style={{ fontFamily:"'IM Fell English',serif", columnCount:2, columnGap:11, columnRule:`1px solid ${RULE}`, fontSize:"clamp(7.5px,0.9vw,10px)", color:INK, lineHeight:1.70, textAlign:"justify" }}>
                  Since Renaissance painters first mixed rose madder with white lead, pink has existed at the intersection of beauty and power. Botticelli gave it to Venus. Pompadour gave it to politics. Eisenhower gave it to the White House. And Marilyn, bold as brass, draped herself in it while diamonds were declared a girl&apos;s best friend. The story of pink is the story of women who refused to be small — across six centuries of art, war, commerce, and revolution.
                </div>
              </div>

              <div style={{ padding:"13px 16px", borderLeft:`1px solid ${RULE}` }}>
                <div style={colHead}>Science &amp; Discovery</div>
                <p style={bodyTxt}>Geologists announced in 2018 that pigments recovered from the Sahara — over one billion years in age — tested positive for pink. The oldest colour ever recorded by science is an unmistakable rose.</p>
                <div style={orn}>— ✦ —</div>
                <p style={bodyTxt}>The pink ribbon, recognised across 195 nations, began as a simple gesture of solidarity in 1982. Today it stands as one of the most powerful symbols of collective care humanity has produced.</p>
                <div style={orn}>· · ·</div>
                <div style={colHead}>In This Edition</div>
                <p style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"clamp(8px,0.95vw,10px)", color:INK, lineHeight:2 }}>
                  · The Rose Pompadour<br/>· Marilyn&apos;s Diamonds<br/>· The 1.1B Year Pigment<br/>· Pink Ribbon, World Symbol<br/>· Today&apos;s Icons of Pink
                </p>
                <div style={{ border:`1px solid ${RULE}`, borderTop:`2px solid rgba(0,0,0,0.25)`, padding:"8px", textAlign:"center", marginTop:12, background:"rgba(0,0,0,0.02)" }}>
                  <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"clamp(9px,1.1vw,12px)", color:INK }}>&quot;Pink is the navy blue<br/>of India.&quot;</div>
                  <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:9, color:INK_MID, marginTop:4, letterSpacing:"0.10em" }}>— Diana Vreeland</div>
                </div>
              </div>
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 28px", borderTop:`1px solid ${RULE}` }}>
              {["Continued on Page 4 →","✦ La Prima Gioielli · All Rights Reserved ✦","← See also: Page 7"].map(t=>(
                <span key={t} style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"clamp(7px,0.8vw,9px)", color:INK_DIM }}>{t}</span>
              ))}
            </div>
          </div>

          <div ref={hintRef} style={{ position:"absolute", bottom:-72, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, pointerEvents:"none", transition:"opacity 0.3s" }}>
            <div className="scroll-chevron">
              <svg width="18" height="10" viewBox="0 0 20 11" fill="none"><path d="M1 1L10 10L19 1" stroke="#ec9cb2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="scroll-chevron" style={{ animationDelay:"0.18s", marginTop:-4 }}>
              <svg width="18" height="10" viewBox="0 0 20 11" fill="none"><path d="M1 1L10 10L19 1" stroke="rgba(236,156,178,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:10, color:"rgba(30,30,30,0.40)", letterSpacing:"0.25em", whiteSpace:"nowrap", marginTop:2 }}>scroll to enter</span>
          </div>
        </div>

        <div
          ref={fullRef}
          className="video-hero"
          style={{ position:"absolute", inset:0, opacity:0, pointerEvents:"none", zIndex:50, height:"100%" }}
        >
          <video className="video-hero__media" src={HERO_VIDEO_URL} poster={HERO_POSTER} autoPlay muted loop playsInline/>
          <div className="video-hero__overlay"/>
          <div className="video-hero__content">
            <p className="video-hero__eyebrow font-nter">La Prima Gioielli</p>
            <h1 className="video-hero__title font-barlow">Women<br/><em>and Pink</em></h1>
            <p className="video-hero__sub font-nter">Since the 15th Century</p>
          </div>
          <div className="video-hero__scroll">
            <div className="scroll-line"/>
            <span className="font-nter">Scroll</span>
          </div>
        </div>

        <div
          ref={pinkWrapRef}
          style={{ position:"absolute", inset:0, zIndex:51, opacity:0, pointerEvents:"none" }}
        >
          <video
            ref={pinkVidRef}
            src={INK_VIDEO_URL}
            muted
            loop
            playsInline
            preload="auto"
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function BuccellatiHistory() {
  const [activeIdx,      setActiveIdx]     = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [layoutOpacity,  setLayoutOpacity] = useState(0);

  const eventRefs         = useRef([]);
  const sectionRefs       = useRef({});
  const leftPanelRef      = useRef(null);
  const footerSentinelRef = useRef(null);
  const activeIdxRef      = useRef(activeIdx);

  useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  useEffect(() => {
    allEvents.forEach((ev, i) => {
      const img = new Image();
      img.fetchPriority = i === 0 ? "high" : "low";
      img.src = ev.bg;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / docH) * 100);

      if (footerSentinelRef.current && leftPanelRef.current) {
        const footerTop = footerSentinelRef.current.getBoundingClientRect().top;
        leftPanelRef.current.style.bottom =
          footerTop < window.innerHeight ? `${window.innerHeight - footerTop}px` : "0px";
      }

      const triggerY = window.innerHeight * 0.45;
      let best = 0;
      eventRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top <= triggerY) best = i;
      });
      if (best !== activeIdxRef.current) setActiveIdx(best);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePinkProgress = useRef(null);
  handlePinkProgress.current = (progress) => setLayoutOpacity(progress);
  const onPinkProgress = useMemo(() => (p) => handlePinkProgress.current(p), []);

  const scrollToDecade = (id) =>
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const active = allEvents[activeIdx];

  const indexedDecades = useMemo(() => {
    let idx = 0;
    return decades.map((d) => ({
      ...d,
      events: d.events.map((e) => ({ ...e, globalIdx: idx++ })),
    }));
  }, []);

  return (
    <>
      <div style={{ width: `${scrollProgress}%` }} className="progress-bar" />

      <NewspaperHero onPinkProgress={onPinkProgress} />

      {/* ── KEY FIX: layout is always rendered in-place, only opacity changes ── */}
      <div
        className="layout"
        style={{
          opacity: layoutOpacity,
          // Remove any transform that would push content off-screen.
          // Use visibility so the panel is present in DOM but invisible until ready.
          visibility: layoutOpacity > 0 ? "visible" : "hidden",
          transition: "none",
        }}
      >
        <div
          className="left-panel"
          ref={leftPanelRef}
          style={{ pointerEvents: layoutOpacity > 0.5 ? "auto" : "none" }}
        >
          <div className="left-panel-inner">
            {allEvents.map((ev, i) => (
              <div
                key={ev.bg + i}
                className="slide-layer"
                style={{
                  backgroundImage: `url(${ev.bg})`,
                  transform:       `translateY(${(i - activeIdx) * 100}%)`,
                  willChange:      Math.abs(i - activeIdx) <= 1 ? "transform" : "auto",
                }}
              />
            ))}
            <div className="bg-overlay" />
            <div className="panel-edge" />
          </div>

          <nav className="decade-nav">
            {decades.map((d) => (
              <button
                key={d.id}
                className={`decade-btn${active.decadeId === d.id ? " active" : ""}`}
                onClick={() => scrollToDecade(d.id)}
              >
                {d.label}
              </button>
            ))}
          </nav>

          <div className="year-display">
            <div className="year-number font-barlow">{active.year}</div>
            <div className="year-sub font-nter">The Pink Timeline</div>
          </div>
        </div>

        <div className="right-panel">
          {indexedDecades.map((decade) => (
            <div
              key={decade.id}
              id={decade.id}
              ref={(el) => (sectionRefs.current[decade.id] = el)}
              className="decade-section"
            >
              <div className="watermark font-barlow">{decade.label}</div>
              <div className="decade-header">
                <span className="decade-header-label font-nter">{decade.label}</span>
                <div className="decade-header-line" />
              </div>

              {decade.events.map((event) => {
                const isActive = event.globalIdx === activeIdx;
                return (
                  <div
                    key={`${decade.id}-${event.year}`}
                    ref={(el) => (eventRefs.current[event.globalIdx] = el)}
                    className={`event-row${isActive ? " is-active" : ""}`}
                  >
                    <div className="year-col">
                      <div className="year-dot" />
                      <span className="year-vertical font-barlow">{event.year}</span>
                    </div>
                    <div className="content-col">
                      <p className="event-tag font-nter">{decade.label}</p>
                      <h2 className="event-title font-barlow">{event.year}</h2>
                      <p className="event-text font-nter">{event.text}</p>
                      <div className="event-ornament">
                        <div className="orn-line" style={{ width: 44 }} />
                        <div className="orn-diamond" />
                        <div className="orn-line" style={{ width: 22 }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div ref={footerSentinelRef} />
    </>
  );
}