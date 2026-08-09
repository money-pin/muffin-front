import fireIcon from "@/assets/icon-20px/fire.svg";
import checkIcon from "@/assets/icon-24px/check-2.5.svg";

interface StreakWeekCardProps {
  streakDays: number;
  weekChecks: boolean[]; // 일~토 순서
  todayIndex: number;
}

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 390px 기준 Figma 값은 cell 28px / gap 15px.
// 더 좁은 화면에서는 카드 내부 폭을 넘지 않도록 살짝 줄인다.
const CELL_SIZE = "clamp(24px, 7.18vw, 28px)";
const GAP_SIZE = "clamp(8px, 3.85vw, 15px)";

// Figma 마이 스트릭: 배지(위쪽 라운드) + 요일 체크 카드
// 연속 체크 구간은 이어진 그라데이션 캡슐, 단독 체크는 원형으로 표시
export default function StreakWeekCard({
  streakDays,
  weekChecks,
  todayIndex,
}: StreakWeekCardProps) {
  // 연속된 체크/미체크 구간으로 묶기 (캡슐 하나에 그라데이션이 이어지도록)
  const segments: { checked: boolean; start: number; length: number }[] = [];
  for (let i = 0; i < weekChecks.length;) {
    const checked = weekChecks[i];
    let end = i;
    while (end < weekChecks.length && weekChecks[end] === checked) end += 1;
    segments.push({ checked, start: i, length: end - i });
    i = end;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="px-4 leading-none">
        <span className="bg-secondary-100 inline-flex h-7 items-center gap-1 rounded-t-[8px] px-2">
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

      <div className="flex w-full flex-col items-center gap-1 rounded-[16px] border border-neutral-100 bg-white px-4 py-4">
        <div className="flex" style={{ gap: GAP_SIZE }}>
          {WEEK_LABELS.map((label, index) => (
            <span
              key={label}
              className={`text-caption-12-bd text-center ${
                index === todayIndex ? "text-primary" : "text-neutral-400"
              }`}
              style={{ width: CELL_SIZE }}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex" style={{ gap: GAP_SIZE }}>
          {segments.map((segment) =>
            segment.checked ? (
              <div
                key={segment.start}
                className="from-secondary-400 to-primary flex items-center rounded-full bg-gradient-to-r"
                style={{
                  height: CELL_SIZE,
                  width: `calc(${segment.length} * ${CELL_SIZE} + ${
                    segment.length - 1
                  } * ${GAP_SIZE})`,
                  gap: GAP_SIZE,
                }}
              >
                {Array.from({ length: segment.length }).map((_, offset) => (
                  <span
                    key={offset}
                    className="flex items-center justify-center"
                    style={{ width: CELL_SIZE }}
                  >
                    <img
                      src={checkIcon}
                      alt=""
                      aria-hidden="true"
                      className="size-6"
                      draggable={false}
                    />
                  </span>
                ))}
              </div>
            ) : (
              Array.from({ length: segment.length }).map((_, offset) => (
                <div
                  key={segment.start + offset}
                  className="rounded-full bg-neutral-100"
                  style={{ width: CELL_SIZE, height: CELL_SIZE }}
                />
              ))
            ),
          )}
        </div>
      </div>
    </div>
  );
}
