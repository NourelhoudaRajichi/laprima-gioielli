"use client";
import { useRef, useEffect, useState } from "react";

/**
 * Drops in place of <video autoPlay muted loop playsInline>.
 * The video element is not created until the container is within
 * 400px of the viewport, so off-screen videos cost zero bandwidth.
 */
export default function LazyVideo({ src, className = "h-full w-full object-cover", poster, style, children, ...props }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); io.disconnect(); } },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", ...style }}>
      {active ? (
        <video autoPlay muted loop playsInline preload="auto" className={className} poster={poster} {...props}>
          {src && <source src={src} type="video/mp4" />}
          {children}
        </video>
      ) : (
        <div className="w-full h-full bg-gray-100" style={poster ? { backgroundImage:`url(${poster})`, backgroundSize:"cover", backgroundPosition:"center" } : {}} />
      )}
    </div>
  );
}
