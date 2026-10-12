import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";

import { useDemoPhase } from "./useDemoPhase";

// 0: 카드 그리드 → 1: 예금 카드 선택(배지 등장)
const PHASE_DELAYS = [700] as const;
const REDUCED_PHASE = 1;

const DEMO_SELECTED_ASSET_ID = INVEST_ASSET_SECTIONS[0].items[0].id;

// 소개 3: "100만원으로 시작하는 나의 첫 투자" — 모의투자 섹터 카드 미리보기
// Figma는 투자 화면 카드를 72×88로 줄여 배치(축소 카드 목업이 아니라 화면 위에 바로 놓임)
export default function InvestDemo() {
  const phase = useDemoPhase(PHASE_DELAYS, REDUCED_PHASE);
  const isPicked = phase >= 1;

  return (
    <div
      aria-hidden="true"
      className="absolute top-[236px] left-[calc(50%-175px)] flex w-[351px] flex-col gap-[18px] px-[18px]"
    >
      {INVEST_ASSET_SECTIONS.map((section) => (
        <section key={section.id} className="flex flex-col gap-[7px]">
          <h3 className="text-body-14-bd text-neutral-900">{section.title}</h3>
          <div className="flex items-center justify-between">
            {section.items.map((asset) => {
              const isActive = isPicked && asset.id === DEMO_SELECTED_ASSET_ID;

              return (
                <div
                  key={asset.id}
                  className="bg-neutral-0 relative flex h-[88px] w-[72px] flex-col items-center justify-center gap-1 rounded-[11px]"
                >
                  <span
                    className={`rounded-[7px] p-[3.6px] transition-colors duration-300 ${
                      isActive ? "bg-secondary-50" : ""
                    }`}
                  >
                    <img
                      src={isActive ? asset.activeIcon : asset.icon}
                      alt=""
                      className="size-9"
                      draggable={false}
                    />
                  </span>
                  <span
                    className={`text-caption-12-md-tighter ${
                      isActive ? "text-neutral-900" : "text-neutral-600"
                    }`}
                  >
                    {asset.name}
                  </span>
                  {asset.id === DEMO_SELECTED_ASSET_ID && (
                    <span
                      className={`bg-primary text-caption-12-bd text-neutral-0 absolute top-[7px] left-[43px] flex size-[22px] items-center justify-center rounded-full transition-transform duration-300 ${
                        isPicked ? "scale-100" : "scale-0"
                      }`}
                    >
                      1
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
