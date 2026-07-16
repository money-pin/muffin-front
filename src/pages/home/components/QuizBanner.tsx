import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";
import muffinPlain from "@/assets/avatars/muffin-plain.png";

interface QuizBannerProps {
  onClick?: () => void;
}

// Figma Quiz Header: 주황 배경에 캐릭터 얼굴이 살짝 보이는 45px 썸네일
// + "오늘의 한 입 퀴즈" 타이틀/설명 + 우측 화살표
export default function QuizBanner({ onClick }: QuizBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-[12px] border border-neutral-100 bg-white px-4 pb-3 pt-4"
    >
      <span className="flex items-center gap-4">
        <span className="relative h-[45px] w-[45px] shrink-0 overflow-hidden rounded-[8px] bg-primary">
          <img
            src={muffinPlain}
            alt=""
            aria-hidden="true"
            className="absolute -left-5 top-1.5 h-[100px] w-[104px] max-w-none"
            draggable={false}
          />
        </span>
        <span className="flex flex-col items-start">
          <span className="text-body-16-bd-tighter text-neutral-900">
            오늘의 한 입 퀴즈
          </span>
          <span className="text-caption-12-md-tighter text-neutral-600">
            퀴즈를 풀고 지난 이슈를 복습해봐요.
          </span>
        </span>
      </span>
      <img
        src={chevronRightIcon}
        alt=""
        aria-hidden="true"
        className="h-6 w-6 shrink-0"
        draggable={false}
      />
    </button>
  );
}
