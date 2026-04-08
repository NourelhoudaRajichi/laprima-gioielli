import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FashionCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideRef = useRef(null);

  const slides = [
    "https://laprimagioielli.com/wp-content/uploads/2025/11/7.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/8.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/6.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/5.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/1.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/2-4.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/3.png",
    "https://laprimagioielli.com/wp-content/uploads/2025/11/4-1.png"
  ];

  const totalSlides = slides.length;

  // Duplicate slides for seamless infinite loop
  const infiniteSlides = [...slides, ...slides];

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex(prev => prev + 1);
    slideRef.current.style.transition = "transform 0.7s ease-out";
  };

  const prevSlide = () => {
    if (currentIndex <= 0) {
      setCurrentIndex(totalSlides);
      slideRef.current.style.transition = "none";
      slideRef.current.style.transform = `translateX(-${totalSlides * 50}%)`;
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        slideRef.current.style.transition = "transform 0.7s ease-out";
      }, 50);
    } else {
      setCurrentIndex(prev => prev - 1);
      slideRef.current.style.transition = "transform 0.7s ease-out";
    }
  };

  // Reset position when reaching duplicated slides
  useEffect(() => {
    if (currentIndex >= infiniteSlides.length - 2) {
      setTimeout(() => {
        setCurrentIndex(totalSlides - 2);
        slideRef.current.style.transition = "none";
        slideRef.current.style.transform = `translateX(-${(totalSlides - 2) * 50}%)`;
      }, 300);
    }
  }, [currentIndex, infiniteSlides.length, totalSlides]);

  const goToSlide = idx => {
    setCurrentIndex(idx);
    setIsAutoPlaying(false);
    slideRef.current.style.transition = "transform 0.7s ease-out";
  };

  return (
    <div className="mb-8 w-full overflow-hidden">
      {/* Carousel */}
      <div className="relative h-[500px] w-full md:h-[600px] lg:h-[700px]">
        {/* Slides */}
        <div
          ref={slideRef}
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}>
          {infiniteSlides.map((img, i) => (
            <div key={i} className="h-full w-1/2 flex-shrink-0">
              <img
                src={img}
                alt={`Slide ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/30 p-3 hover:bg-white/50">
          <ChevronLeft
            className="h-6 w-6 text-[#004065]"
            strokeWidth={2}
          />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/30 p-3 hover:bg-white/50">
          <ChevronRight
            className="h-6 w-6 text-[#004065]"
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`rounded-full transition-all ${
              currentIndex % totalSlides === i
                ? "h-2 w-8 bg-gray-800"
                : "h-2 w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
