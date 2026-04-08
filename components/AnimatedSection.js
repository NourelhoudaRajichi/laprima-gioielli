"use client";
import { useState } from "react";
import Image from "next/image";

export default function JewelEffect() {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const { offsetWidth: width, offsetHeight: height } = e.currentTarget;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    // calculate rotation
    const rotateX = ((y - height / 2) / height) * 10;
    const rotateY = ((x - width / 2) / width) * -10;

    // set tilt + perspective
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({ transform: "perspective(800px) rotateX(0deg) rotateY(0deg)" });
  };

  return (
    <div
      className="relative w-80 h-80 mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <Image
        src="https://laprimagioielli.com/wp-content/uploads/2024/09/bloomy_bangle_3d_02-e1756735534547.png"
        alt="Jewelry Bangle"
        fill
        style={{ objectFit: "contain", transition: "transform 0.2s ease" }}
      />

      {/* Diamond Shine Overlay */}
      <div className="diamond-shine"></div>

      <style jsx>{`
        .diamond-shine {
          position: absolute;
          top: 20%;       /* Adjust to match diamond vertical position */
          left: -50%;
          width: 30%;     /* Adjust width to cover diamond */
          height: 30%;    /* Adjust height to cover diamond */
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg); /* Angle of shine */
          filter: blur(2px);
          animation: shine 2s infinite;
          pointer-events: none;
        }

        @keyframes shine {
          0% { left: -50%; }
          100% { left: 120%; }
        }
      `}</style>
    </div>
  );
}
