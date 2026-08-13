import type { ReactNode } from "react";

import Button from "@/components/common/Button";

interface MessageStepProps {
  title: ReactNode;
  subtitle?: ReactNode;
  buttonLabel: string;
  onNext: () => void;
  disabled?: boolean; // 제출 중 등 버튼 비활성화
  media?: ReactNode; // 타이틀 위 일러스트/카드 (머핀 캐릭터, 자금 카드 등)
  children?: ReactNode; // 타이틀·부제 아래 부가 요소 (추천 섹터 칩 등)
}

// 중앙 정렬 안내 메시지 + 하단 버튼 (웰컴 / 결과 / 완료 스텝 공용)
export default function MessageStep({
  title,
  subtitle,
  buttonLabel,
  onNext,
  disabled = false,
  media,
  children,
}: MessageStepProps) {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {media && <div className="mb-7">{media}</div>}

        <div className="flex flex-col gap-3">
          <h2 className="text-heading-20-bd text-neutral-1000 leading-[1.5]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-body-16-md-tighter leading-[1.6] text-neutral-600">
              {subtitle}
            </p>
          )}
        </div>

        {children && <div className="mt-8 w-full">{children}</div>}
      </div>

      <Button onClick={onNext} disabled={disabled}>
        {buttonLabel}
      </Button>
    </div>
  );
}
