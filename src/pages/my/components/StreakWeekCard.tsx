import fireIcon from "@/assets/icon-20px/fire.svg";

interface StreakWeekCardProps {
  streakDays: number;
  weekChecks: boolean[]; // 일~토 순서
  todayIndex: number;
}

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// Figma 스펙: 원 28px, 원 사이 간격 15px (고정), 가운데 정렬
const CELL = 28;
const GAP = 15;

function CheckMark() {
  return (
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
  );
}

// Figma 마이 스트릭: 배지(위쪽 라운드) + 요일 체크 카드
// 연속 체크 구간은 이어진 그라데이션 캡슐, 단독 체크는 원형으로 표시
export default function StreakWeekCard({
  streakDays,
  weekChecks,
  todayIndex,
}: StreakWeekCardProps) {
  // 연속된 체크/미체크 구간으로 묶기 (캡슐 하나에 그라데이션이 이어지도록)
  const segments: { checked: boolean; start: number; length: number }[] = [];
  for (let i = 0; i < weekChecks.length; ) {
    const checked = weekChecks[i];
    let end = i;
    while (end < weekChecks.length && weekChecks[end] === checked) end += 1;
    segments.push({ checked, start: i, length: end - i });
    i = end;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="px-4 leading-none">
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

      <div className="flex w-full flex-col items-center gap-1 rounded-[16px] bg-white px-4 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.15)]">
        <div className="flex" style={{ gap: GAP }}>
          {WEEK_LABELS.map((label, index) => (
            <span
              key={label}
              className={`text-center text-caption-12-bd ${
                index === todayIndex ? "text-primary" : "text-neutral-400"
              }`}
              style={{ width: CELL }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex" style={{ gap: GAP }}>
          {segments.map((segment) =>
            segment.checked ? (
              <div
                key={segment.start}
                className="flex items-center rounded-full bg-gradient-to-r from-secondary-400 to-primary"
                style={{
                  height: CELL,
                  width: segment.length * CELL + (segment.length - 1) * GAP,
                  gap: GAP,
                }}
              >
                {Array.from({ length: segment.length }).map((_, offset) => (
                  <span
                    key={offset}
                    className="flex items-center justify-center"
                    style={{ width: CELL }}
                  >
                    <CheckMark />
                  </span>
                ))}
              </div>
            ) : (
              Array.from({ length: segment.length }).map((_, offset) => (
                <div
                  key={segment.start + offset}
                  className="rounded-full bg-neutral-100"
                  style={{ width: CELL, height: CELL }}
                />
              ))
            ),
          )}
        </div>
      </div>
    </div>
  );
}
