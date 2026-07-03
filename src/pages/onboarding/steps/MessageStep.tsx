import type { ReactNode } from "react";

import Button from "@/components/common/Button";

interface MessageStepProps {
  title: ReactNode;
  subtitle?: ReactNode;
  buttonLabel: string;
  onNext: () => void;
  children?: ReactNode; // 추천 섹터 칩 등 부가 요소
}

// 중앙 정렬 안내 메시지 + 하단 버튼 (웰컴 / 결과 / 완료 스텝 공용)
export default function MessageStep({
  title,
  subtitle,
  buttonLabel,
  onNext,
  children,
}: MessageStepProps) {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <h2 className="text-heading-20-bd leading-[1.5] text-neutral-1000">
          {title}
        </h2>
        {subtitle && (
          <p className="text-body-16-md-tighter leading-[1.6] text-neutral-600">
            {subtitle}
          </p>
        )}
        {children}
      </div>

      <Button onClick={onNext}>{buttonLabel}</Button>
    </div>
  );
}
