import investmentIcon from "@/assets/icon-24px/investment-active.svg";
import quizImage from "@/assets/quiz-image.svg";

interface NewsFlowCtaProps {
  type: "quiz" | "invest";
  onClick: () => void;
}

const COPY = {
  quiz: {
    title: "오늘의 한 입 퀴즈",
    description: "이 뉴스, 퀴즈에 나올지도 몰라요",
  },
  invest: {
    title: "오늘의 투자 한 판",
    description: "오늘의 흐름을 보고 골라봐요",
  },
} as const;

// 뉴스 상세 하단 다음 단계 카드 (Figma 런칭 전 수정 > 뉴스 상세 보기 CTA Button, #309)
// 뉴스 → 퀴즈 → 모의투자 흐름으로 이어지게 한다.
export default function NewsFlowCta({ type, onClick }: NewsFlowCtaProps) {
  const copy = COPY[type];

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-neutral-0 flex w-full items-center justify-between rounded-[12px] border border-neutral-100 p-3 text-left"
    >
      <span className="flex min-w-0 items-center gap-4">
        {type === "quiz" ? (
          <img
            src={quizImage}
            alt=""
            aria-hidden="true"
            className="size-[45px] shrink-0"
            draggable={false}
          />
        ) : (
          <span className="bg-primary-50 flex size-[45px] shrink-0 items-center justify-center rounded-[8px]">
            <img
              src={investmentIcon}
              alt=""
              aria-hidden="true"
              className="size-6"
              draggable={false}
            />
          </span>
        )}
        <span className="flex min-w-0 flex-col">
          <span className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
            {copy.title}
          </span>
          <span className="text-caption-12-md-tighter text-neutral-600">
            {copy.description}
          </span>
        </span>
      </span>
      <span className="bg-primary-50 text-body-14-md text-primary flex h-7 shrink-0 items-center rounded-[8px] px-3">
        보기
      </span>
    </button>
  );
}
