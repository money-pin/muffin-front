import { Children, useRef, useState } from "react";

interface CarouselProps {
  children: React.ReactNode;
}

export default function Carousel({ children }: CarouselProps) {
  const slides = Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;

    if (diffX > 50 && currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    if (diffX < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className="w-full overflow-hidden px-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-3 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 12}px))`,
          }}
        >
          {slides.map((child, index) => (
            <div key={index} className="w-full shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-2 items-center gap-1">
        {slides.map((_, index) => {
          const isActive = currentIndex === index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 슬라이드로 이동`}
              className={`h-2 rounded-full border-none p-0 transition-all duration-300 outline-none ${
                isActive ? "bg-primary w-10" : "w-2 bg-neutral-100"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
