"use client";

import { useState } from "react";

const newsData = [
  {
    id: 1,
    date: "09",
    month: "Jan",
    year: "2026",
    image: "https://laprimagioielli.com/wp-content/uploads/2026/01/RH_09721.jpg",
    title: "Pink has a new address: La Prima Gioielli at Printemps",
    excerpt:
      "La Prima Gioielli enters Printemps — a house with a sharp eye and a strong sense of style, where beauty is chosen with intention.",
    full: [
      "For many, this will be a first meeting. A meeting with jewelry that speaks — sometimes softly, sometimes boldly — and always leaves a lasting impression. With lines that move, light that plays, and pink understood as a mood — modern, personal, alive.",
      "Inside Printemps, La Prima Gioielli reveals its world through Italian craftsmanship with a fresh, contemporary rhythm. Creations made to be discovered up close, worn naturally, and remembered without effort.",
      "This presence now unfolds across 8 Printemps stores in France:",
      "Printemps Haussmann\nPrintemps Lille\nPrintemps Lyon\nPrintemps Marseille – Les Terrasses du Port\nPrintemps Nation\nPrintemps Parly 2\nPrintemps Rouen\nPrintemps Toulon – Grand Var",
      "Each location becomes a place where pink feels alive, elegance feels relaxed, and emotion feels spontaneous — never forced, always right.",
      "A new energy. A shared vision. And another chapter where the Pink Movement keeps growing — lighter, bolder, and perfectly at home.",
    ],
  },
  {
    id: 2,
    date: "15",
    month: "Dec",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_2200_PRESTIGE-scaled.jpg",
    title: "Galeries Lafayette Luxembourg turns pink with La Prima Gioielli",
    excerpt:
      "La Prima Gioielli has officially joined Royal Quartz — a space known for selecting only what truly matters. ",
    full: [
      "For many, this may be the first encounter with our world. A world where jewelry speaks softly, where design carries stories, and where pink isn't just a color — it's a signature.",
      "At Royal Quartz, our creations can finally be seen up close: light pieces with character, Italian craftsmanship with a modern soul. We are grateful to the Royal Quartz – Galeries Lafayette Luxembourg team for welcoming us with such professionalism and trust.",
      "And to the women of Luxembourg: there is now a new place to discover La Prima, try it, feel it — and decide what pink means to you. Luxembourg becomes a new chapter on our map — a new country where the Pink Movement takes root and keeps growing.",
    ],
  },
  {
    id: 3,
    date: "20",
    month: "Nov",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2025/11/Untitled-design-45.png",
    title: "When Riyadh Turns Pink Again: La Prima's Unforgettable Moment at Jewellery Salon",
    excerpt:
      "Qeelin iconic Bo Bo Collection — inspired by the playful panda — is reborn in a new palette of midnight jade and champagne gold, a bridge between heritage and tomorrow.",
    full: [
      "From November 5 to 9, we presented our world at Jewellery Salon, ANB Arena, bringing Italian craftsmanship, feminine emotion, and our unmistakable pink identity to one of the region's most prestigious jewellery events. In Riyadh, our creations did more than sparkle. They connected. They moved. They spoke.",
      "This new presence in the Kingdom marks another step in our international pink journey — a journey made of encounters, admiration, and women who recognize themselves in the softness and strength of La Prima. Riyadh has become a place where our pink finds resonance, where our identity feels understood, and where our world continues to expand with intention. We extend our heartfelt gratitude to the visitors, clients, partners, and friends who made this edition unforgettable.",
      "Your warmth, your curiosity, and your enthusiasm turned this event into a true celebration of emotion and craftsmanship. Saudi Arabia glowed in pink once again — and this chapter is only the beginning.",
    ],
  },
  {
    id: 4,
    date: "03",
    month: "Nov",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0649_VERONA-scaled-e1760976155726.jpg",
    title: "Riyadh, We Know Pink Looks Good on You",
    excerpt:
      "Riyadh, October 2025 — From Vicenza to Riyadh, our Story in Pink continues to unfold — redefining what Italian luxury means, wherever we go.",
    full: [
      "At Jewels of the World, we brought more than jewels to Saudi Arabia — we brought our identity. A vision of beauty that speaks through emotion, and craftsmanship that carries three generations of Italian excellence. Our pink booth became a statement: refined, radiant, and unmistakably ours. A meeting point between two worlds — Italian artistry and Arabian elegance — united by the same appreciation for authenticity, creativity, and emotion.",
      "Every creation reflected our promise: jewelry that moves people, not just markets; jewelry that feels alive, and dares to be different.",
      "We came to Saudi Arabia with our essence — and left with hearts touched in pink. Thank you from the heart, Riyadh.",
    ],
  },
  {
    id: 5,
    date: "12",
    month: "Oct",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2026/01/RH_09721.jpg",
    title: "On September 8th, we opened the doors of our world with THE SHOW — CHAPTER I, a gala evening at the historic Villa di Montruglio.",
    excerpt:
      "A new chapter begins as Qeelin opens its doors in Seoul — a space where East meets East, and where the brand Chinese heritage is celebrated through a Korean lens.",
    full: [
      "On September 8th, we opened the doors of our world with THE SHOW — CHAPTER I, a gala evening at the historic Villa di Montruglio.",
      "It was more than a night — it was a symphony in pink, where light, music, and jewelry flowed together in pure emotion. Every moment carried our vision: a new language of luxury — bold, magnetic, and unapologetically different.",
      "In Vicenza, the heart of jewelry excellence, we welcomed our guests into a universe of creativity and heritage. Our collections — crafted entirely in Italy by master artisans — became stories of feeling, glowing on the skin, unforgettable in memory.",
      "At THE SHOW, we didn't just unveil jewelry — we unveiled ourselves. Pink, fresh, emotional, unmistakably La Prima. And this was only Chapter I. The next chapters are waiting — ready to be unveiled.",
    ],
  },
  {
    id: 6,
    date: "28",
    month: "Sep",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_2200_PRESTIGE-scaled.jpg",
    title: "Preziosa Magazine Embraces the Pink Touch of La Prima at Vicenzaoro 2025",
    excerpt:
      "A young brand that in just one year has conquered the world: 42 international boutiques, from the iconic windows of Paris to new openings across Europe, the Middle East, and Latin America.",
    full: "The moon is the eternal companion of the Italian soul. This limited edition features creations that took over 400 hours each to complete — a gift that carries a universe within.",
  },
  {
    id: 7,
    date: "10",
    month: "Sep",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2025/11/Untitled-design-45.png",
    title: "La Prima Gioielli Turns Vicenzaoro Pink — September 2025",
    excerpt:
      "We, La Prima Gioielli, the Italian fine jewelry brand that speaks a new language of luxury, lit up Vicenzaoro 2025 from September 5–9 at Hall 7 ICON, Booth 632.",
    full: "Hosted at Hall 7 ICON, our presence drew collectors and press from around the world. The event spotlighted the brand's most intricate craftsmanship — pieces that took over 400 hours each to complete.",
  },
  {
    id: 8,
    date: "22",
    month: "Aug",
    year: "2025",
    image: "https://laprimagioielli.com/wp-content/uploads/2025/10/LaPrimaGioielli_SS26_0649_VERONA-scaled-e1760976155726.jpg",
    title: "La Prima Gioielli Shines in Monte-Carlo: Winner of the DiamondExcellence Award 2025",
    excerpt:
      "We are delighted to announce that La Prima Gioielli has been honored with two prestigious accolades at The Unique Show Monte-Carlo 2025: the Diamond Excellence Award and the Guest Choice Recognition.",
    full: "Every La Prima creation is now an experience in itself. The new atelier service allows clients to choose from bespoke designs — jewelry that begins its story before it is even unwrapped.",
  },
];

function NewsCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="flex flex-col bg-white h-full" style={{ color: "#004065" }}>
      {/* Cover image — one per card */}
      <div className="relative w-full overflow-hidden" style={{ height: "55vh", minHeight: 300 }}>
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Date block */}
      <div
        className="flex items-baseline gap-3 pt-10 pb-5"
        style={{ paddingLeft: "clamp(2rem, 6%, 4rem)" }}
      >
        <span className="font-barlow text-7xl font-bold leading-none" style={{ color: "#004065" }}>
          {item.date}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase" style={{ color: "#ec9cb2" }}>
            {item.month}
          </span>
          <span className="font-inter text-[10px] tracking-[0.25em] uppercase" style={{ color: "#ec9cb2" }}>
            {item.year}
          </span>
        </div>
      </div>

      {/* Title */}
      <h2
        className="font-barlow text-2xl md:text-[1.65rem] font-semibold leading-snug pb-5 tracking-tight"
        style={{
          color: "#004065",
          paddingLeft: "clamp(2rem, 6%, 4rem)",
          paddingRight: "clamp(2rem, 6%, 4rem)",
        }}
      >
        {item.title}
      </h2>

      {/* Excerpt */}
      <p
        className="font-inter text-[13px] leading-relaxed pb-4"
        style={{
          color: "#004065",
          paddingLeft: "clamp(2rem, 6%, 4rem)",
          paddingRight: "clamp(2rem, 6%, 4rem)",
        }}
      >
        {item.excerpt}
      </p>

      {/* Expanded full text */}
      {expanded && (
        <div
          className="font-inter text-[13px] leading-relaxed mb-4 pl-4 border-l flex flex-col gap-3"
          style={{
            color: "#004065",
            borderColor: "#ec9cb2",
            marginLeft: "clamp(2rem, 6%, 4rem)",
            marginRight: "clamp(2rem, 6%, 4rem)",
          }}
        >
          {Array.isArray(item.full)
            ? item.full.map((block, i) => (
                <p key={i} style={{ whiteSpace: "pre-line" }}>{block}</p>
              ))
            : <p>{item.full}</p>
          }
        </div>
      )}

      {/* Divider + expand toggle */}
      <div
        className="mt-auto pb-10 pt-6"
        style={{
          paddingLeft: "clamp(2rem, 6%, 4rem)",
          paddingRight: "clamp(2rem, 6%, 4rem)",
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-full flex items-center justify-center">
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
              style={{ background: "rgba(0,64,101,0.15)" }}
            />
            <button
              onClick={() => setExpanded((v) => !v)}
              className="relative z-10 bg-white px-2 flex items-center justify-center transition-colors duration-200"
              style={{ color: expanded ? "#ec9cb2" : "rgba(0,64,101,0.4)" }}
              aria-label={expanded ? "Collapse" : "Read more"}
            >
              <span
                className="font-barlow text-3xl font-light leading-none select-none"
                style={{
                  display: "inline-block",
                  transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              >
                +
              </span>
            </button>
          </div>
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            style={{
              color: "rgba(0,64,101,0.3)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </article>
  );
}

function NewsPair({ pair }) {
  return (
    <div
      className="flex flex-col md:flex-row"
      style={{ gap: "1px", background: "rgba(0,64,101,0.12)" }}
    >
      {pair.map((item) => (
        <div key={item.id} className="flex-1 min-w-0">
          <NewsCard item={item} />
        </div>
      ))}
      {pair.length === 1 && <div className="flex-1 bg-white" />}
    </div>
  );
}

const INITIAL_PAIRS = 2;

export default function HappeningsPage() {
  const [visiblePairs, setVisiblePairs] = useState(INITIAL_PAIRS);

  const allPairs = [];
  for (let i = 0; i < newsData.length; i += 2) {
    allPairs.push(newsData.slice(i, i + 2));
  }

  const shownPairs = allPairs.slice(0, visiblePairs);
  const hasMore = visiblePairs < allPairs.length;

  return (
    <main className="bg-white min-h-screen pt-20">
      {shownPairs.map((pair, idx) => (
        <NewsPair key={idx} pair={pair} />
      ))}

      {/* Discover More */}
      <div className="flex flex-col items-center py-16 bg-white">
        {hasMore ? (
          <button
            onClick={() => setVisiblePairs((v) => v + 1)}
            className="group relative font-barlow text-sm tracking-[0.3em] uppercase px-14 py-4 border overflow-hidden"
            style={{ borderColor: "#004065", color: "#004065" }}
          >
            <span
              className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
              style={{ background: "#004065" }}
            />
            <span className="relative group-hover:text-white transition-colors duration-500">
              Discover More
            </span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-px w-16" style={{ background: "#ec9cb2" }} />
            <p
              className="font-inter text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "#ec9cb2" }}
            >
              End of Stories
            </p>
          </div>
        )}

        <p
          className="font-inter text-[11px] mt-5 tracking-widest"
          style={{ color: "#004065", opacity: 0.3 }}
        >
          {Math.min(visiblePairs * 2, newsData.length)} / {newsData.length}
        </p>
      </div>
    </main>
  );
}