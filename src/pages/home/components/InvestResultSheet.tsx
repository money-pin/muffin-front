import BottomSheet from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import closeIcon from "@/assets/icon-24px/close.svg";

import type { SettlementResult } from "@/pages/invest/settlementResultApi";

import PercentageBadge from "./PercentageBadge";

interface InvestResultSheetProps {
  isOpen: boolean;
  onClose: () => void;
  result: SettlementResult;
  onDetailClick?: () => void; // 섹터별 상세 내역 → 수익 통계
  onInvestClick?: () => void; // 오늘 투자하러 가기 → 모의투자
}

// Figma 투자 결과 바텀시트: 날짜 헤더 + 결과 문구(수익/손실 분기)
// + 최종 수익금 카드 + 투자 원금·최종 자산 + 이동 버튼 2개
export default function InvestResultSheet({
  isOpen,
  onClose,
  result,
  onDetailClick,
  onInvestClick,
}: InvestResultSheetProps) {
  const up = result.profit >= 0;
  const profitText = `${up ? "+" : "-"}${Math.abs(result.profit).toLocaleString()}원`;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} ariaLabel="투자 결과">
      <div className="relative flex flex-col items-center gap-6 p-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-5 right-5 flex h-6 w-6 items-center justify-center"
        >
          <img
            src={closeIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
            draggable={false}
          />
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-caption-12-md text-neutral-400">
            {result.date} 투자 결과
          </p>
          <p className="text-body-16-bd-tighter text-neutral-1000">
            {up ? (
              <>
                머핀이 노릇노릇하게
                <br />잘 구워졌어요!
              </>
            ) : (
              <>
                이런, 머핀이 타버렸어요
                <br />
                다음엔 더 잘 구워봐요!
              </>
            )}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-col gap-2 rounded-[12px] border border-neutral-100 px-4 py-3">
            <p className="text-caption-12-md-tighter text-neutral-400">
              최종 수익금
            </p>
            <div className="flex w-full items-center justify-between">
              <p
                className={`text-heading-24-md ${
                  up ? "text-positive" : "text-negative"
                }`}
              >
                {profitText}
              </p>
              {/* 배지 색은 수익금 부호 기준(빨강/파랑) — 수익률 부호를 수익금과 일치시킴 */}
              <PercentageBadge
                rate={Math.abs(result.profitRate) * (up ? 1 : -1)}
              />
            </div>
          </div>

          <div className="flex w-full gap-2">
            <div className="flex flex-1 flex-col items-center rounded-[12px] border border-neutral-100 px-3 py-2">
              <p className="text-caption-12-md-tighter text-neutral-400">
                투자 원금
              </p>
              <p className="text-body-16-md-tighter text-neutral-900">
                {result.principal.toLocaleString()}원
              </p>
            </div>
            <div className="flex flex-1 flex-col items-center rounded-[12px] border border-neutral-100 px-3 py-2">
              <p className="text-caption-12-md-tighter text-neutral-400">
                최종 자산
              </p>
              <p className="text-body-16-md-tighter text-neutral-900">
                {result.finalAssets.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Button onClick={onDetailClick}>섹터별 상세 내역 보러가기</Button>
          <Button variant="soft" onClick={onInvestClick}>
            오늘 투자하러 가기
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
