import fireIcon from "@/assets/icon-20px/fire.svg";

interface StreakWeekCardProps {
  streakDays: number;
  weekChecks: boolean[]; // 일~토 순서
  todayIndex: number;
}

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// Figma 마이 스트릭: 배지(위쪽 라운드, AssetCard와 동일 패턴) + 요일 체크 카드
// 연속 체크 구간은 이어진 캡슐 형태로 표시
export default function StreakWeekCard({
  streakDays,
  weekChecks,
  todayIndex,
}: StreakWeekCardProps) {
  const getCheckClass = (index: number) => {
    if (!weekChecks[index]) return "rounded-full bg-neutral-50";

    const prevChecked = index > 0 && weekChecks[index - 1];
    const nextChecked = index < weekChecks.length - 1 && weekChecks[index + 1];
    const rounded = `${prevChecked ? "" : "rounded-l-full"} ${nextChecked ? "" : "rounded-r-full"}`;
    return `${rounded} bg-primary`;
  };

  return (
    <div className="flex w-full flex-col">
      <div className="px-4">
        <span className="inline-flex h-7 items-center gap-1 rounded-t-[8px] bg-secondary-100 px-2">
          <img
            src={fireIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
            draggable={false}
          />
          <span className="text-caption-12-bd text-primary">
            {streakDays}일 연속 학습!
          </span>
        </span>
      </div>

      <div className="w-full rounded-[16px] bg-white px-4 pb-4 pt-3 shadow-[0px_1px_3px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-7">
          {WEEK_LABELS.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span
                className={`text-caption-12-bd ${
                  index === todayIndex ? "text-primary" : "text-neutral-400"
                }`}
              >
                {label}
              </span>
              <div
                className={`flex h-8 w-full items-center justify-center ${getCheckClass(index)}`}
              >
                {weekChecks[index] && (
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
