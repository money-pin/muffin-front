interface IndicatorProps {
  total: number;
  current: number;
}

// Figma: 동일 너비 세그먼트 바 / 높이 4px / 간격 8px / 활성 Primary500(#F46C0E)
export default function Indicator({ total, current }: IndicatorProps) {
  return (
    <div className="flex w-full gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all ${
            i < current ? "bg-[#F46C0E]" : "bg-[#E2E2E2]"
          }`}
        />
      ))}
    </div>
  );
}
