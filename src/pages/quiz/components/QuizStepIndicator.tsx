interface QuizStepIndicatorProps {
  total: number;
  currentIndex: number;
}

// Figma: 완료 = 연주황 원, 현재 = primary 원, 이후 = 흰 원 + 회색 테두리, 사이 연결선
export default function QuizStepIndicator({
  total,
  currentIndex,
}: QuizStepIndicatorProps) {
  const getStepClass = (index: number) => {
    if (index < currentIndex) return "bg-primary-200 text-white";
    if (index === currentIndex) return "bg-primary text-white";
    return "border border-neutral-100 bg-white text-neutral-400";
  };

  return (
    <div className="flex items-center" aria-label={`${total}문제 중 ${currentIndex + 1}번째`}>
      {Array.from({ length: total }, (_, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <div className="h-px w-3 bg-neutral-100" />}
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-caption-12-bd ${getStepClass(index)}`}
          >
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
}
