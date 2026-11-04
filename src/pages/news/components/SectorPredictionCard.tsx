import newsImpactNegativeIcon from "@/assets/icon-16px/news-impact-negative.svg";
import newsImpactPositiveIcon from "@/assets/icon-16px/news-impact-positive.svg";
import type { SectorImpactItem } from "@/lib/newsApi";

export type SectorGuess = "POSITIVE" | "NEGATIVE";

interface SectorPredictionCardProps {
  sector: SectorImpactItem;
  guess: SectorGuess | null;
  onGuess: (guess: SectorGuess) => void;
}

// Figma 시맨틱 Red/100 · Blue/100 (상승·하락 버튼 배경)
const POSITIVE_BG = "bg-[#feefef]";
const NEGATIVE_BG = "bg-[#d2e9ff]";

function ResultIcon({ correct }: { correct: boolean }) {
  return (
    <svg
      role="img"
      aria-label={correct ? "맞혔어요" : "틀렸어요"}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill={correct ? "var(--color-green)" : "var(--color-positive)"}
      />
      {correct ? (
        <path
          d="M7.5 12.5l3 3 6-6.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M8.8 8.8l6.4 6.4M15.2 8.8l-6.4 6.4"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

// 뉴스 상세 섹터 예측 (Figma 런칭 전 수정 > 뉴스 상세 보기, #309)
// "반도체 섹터가 어떻게 될까요?" → 상승·하락을 고르면 AI 분석 결과(정답)와 이유를 보여준다.
export default function SectorPredictionCard({
  sector,
  guess,
  onGuess,
}: SectorPredictionCardProps) {
  const isPositive = sector.impact === "POSITIVE";
  const isAnswered = guess !== null;
  const isCorrect = guess === sector.impact;
  const reason = sector.reason?.trim();

  return (
    <section
      aria-label={`${sector.sectorName} 섹터 예측`}
      className={`bg-neutral-0 flex w-full flex-col rounded-[16px] p-5 shadow-[0_0_2px_rgba(0,0,0,0.08)] ${
        isAnswered ? "gap-4" : "gap-3"
      }`}
    >
      <div className="flex items-center gap-1">
        <p className="text-body-14-md min-w-0 flex-1 text-neutral-900">
          {sector.sectorName} 섹터가 어떻게 될까요?
        </p>
        {isAnswered && <ResultIcon correct={isCorrect} />}
      </div>

      {isAnswered ? (
        <>
          <div
            className={`flex w-full items-center gap-1 rounded-[8px] px-5 py-2 ${
              isPositive ? POSITIVE_BG : NEGATIVE_BG
            }`}
          >
            <img
              src={isPositive ? newsImpactPositiveIcon : newsImpactNegativeIcon}
              alt=""
              aria-hidden="true"
              className="size-4 shrink-0"
              draggable={false}
            />
            <p
              className={`text-body-16-bd-tighter leading-[1.6] ${
                isPositive ? "text-positive" : "text-negative"
              }`}
            >
              {isPositive ? "상승 예상" : "하락 예상"}
            </p>
          </div>
          {reason && (
            <p className="text-body-16-rg-tighter leading-[1.5] break-keep text-neutral-700">
              {reason}
            </p>
          )}
        </>
      ) : (
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => onGuess("POSITIVE")}
            className={`text-body-16-bd-tighter text-positive flex-1 rounded-[8px] px-4 py-2 leading-[1.6] ${POSITIVE_BG}`}
          >
            상승
          </button>
          <button
            type="button"
            onClick={() => onGuess("NEGATIVE")}
            className={`text-body-16-bd-tighter text-negative flex-1 rounded-[8px] px-4 py-2 leading-[1.6] ${NEGATIVE_BG}`}
          >
            하락
          </button>
        </div>
      )}
    </section>
  );
}
