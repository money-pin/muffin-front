import { useState, useRef } from "react";

interface CarouselProps {
  children: React.ReactNode[];
}

export default function Carousel({ children }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    
    if (diffX > 50 && currentIndex < children.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diffX < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-[16px]">
      <div 
        className="w-full overflow-hidden px-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out gap-[12px]"
          style={{ 
            transform: `translateX(calc(-${currentIndex * 85}% - ${currentIndex * 12}px))` 
          }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-[85%] min-w-[85%] sm:w-auto sm:min-w-[350px] shrink-0">
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-[4px] h-[8px]">
        {children.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <div
              key={index}
              className={`h-[8px] transition-all duration-300 rounded-full ${
                isActive 
                  ? "w-[40px] bg-primary" 
                  : "w-[8px] bg-neutral-100"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}