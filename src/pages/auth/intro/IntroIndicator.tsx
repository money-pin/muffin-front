interface IntroIndicatorProps {
  total: number;
  current: number;
}

// Figma Carousel Indicator: 현재 = 40×8 primary 막대, 나머지 = 8×8 회색 점, 간격 4px
export default function IntroIndicator({
  total,
  current,
}: IntroIndicatorProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${total}장 중 ${current + 1}번째`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current ? "bg-primary w-10" : "w-2 bg-neutral-100"
          }`}
        />
      ))}
    </div>
  );
}
