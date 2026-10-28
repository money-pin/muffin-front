import Badge from "@/components/common/Badge";
import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import bookmarkLineWhite from "@/assets/icon-24px/bookmark-line-white.svg";
import arrowUpIcon from "@/assets/icon-24px/arrow-up.svg";

import PhoneMockup from "./PhoneMockup";
import { useDemoPhase } from "./useDemoPhase";

// 0: 카드가 아래에서 흐리게 올라옴 → 1: 브리핑 노출 → 2: '뉴스보기'로 확대 → 3: 뉴스 상세 진입
const PHASE_DELAYS = [300, 2400, 3000] as const;
const REDUCED_PHASE = 1;

// '뉴스보기'를 누르는 듯한 확대 연출 (Figma: 카드 312→544px, 윗변은 206px 근처에 고정)
// 카드는 우상단 근처를 기준으로 키우고, 안쪽 내용은 위로 올려 '뉴스보기'가 화면 가운데에 오게 한다.
const ZOOM_SCALE = 1.744;
const ZOOM_ORIGIN = "369.6px 12.1px";
const ZOOM_SCROLL_PX = 344; // 앱 화면 기준(축소 전) 위로 올리는 거리

function BriefingScreen({
  dimmed,
  scrolled,
}: {
  dimmed: boolean;
  scrolled: boolean;
}) {
  return (
    <div
      className="bg-neutral-0 relative h-[1200px] transition-transform duration-700 ease-out"
      style={{
        transform: scrolled ? `translateY(-${ZOOM_SCROLL_PX}px)` : undefined,
      }}
    >
      <div className="to-neutral-0 absolute inset-x-0 top-0 h-[726px] bg-gradient-to-b from-[rgba(254,243,225,0.5)] to-[61%]" />

      <header className="relative mt-[62px] flex h-14 items-center justify-between px-5">
        <img
          src={chevronLeftIcon}
          alt=""
          className="size-7"
          draggable={false}
        />
        <p className="text-heading-18-bd text-neutral-900">오늘의 브리핑</p>
        <span className="size-7" />
      </header>

      <div className="relative mt-3 flex flex-col gap-2 px-5">
        <article className="bg-neutral-0 flex flex-col items-end gap-1 rounded-[12px] border border-neutral-100 px-4 py-5">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-4">
              <p className="text-body-16-md-tighter text-neutral-900">
                01. 반도체 수출, 3개월째 증가
              </p>
              <p className="text-body-16-rg-tighter p-1 leading-[1.5] text-neutral-700">
                지난달 반도체 수출이 1년 전보다 늘었어요. AI 서버용 메모리
                주문이 계속 들어오고 있기 때문이에요.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              <div className="bg-secondary-50 rounded-[12px] py-[14px] pr-4 pl-5">
                <p className="text-caption-12-bd text-primary leading-[1.3]">
                  그래서 나한테는?
                </p>
                <p className="text-caption-12-md text-neutral-600">
                  반도체 카드의 흐름을 볼 때 참고할 만한 소식이에요.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="gray">채권</Badge>
                <Badge variant="gray">반도체</Badge>
              </div>
            </div>
          </div>
          <span className="text-body-14-md text-primary underline">
            뉴스보기
          </span>
        </article>

        <div className="bg-neutral-1000/[0.03] h-[150px] rounded-[12px]" />
        <div className="bg-neutral-1000/[0.03] h-[131px] rounded-[12px]" />
      </div>

      <div
        className={`bg-neutral-0/70 absolute inset-x-0 top-0 h-[726px] transition-opacity duration-700 ${
          dimmed ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function NewsDetailScreen() {
  return (
    <div className="bg-neutral-0 relative h-[1100px]">
      <div className="relative h-[225px] bg-neutral-900">
        <div className="absolute inset-0 bg-[rgba(255,243,225,0.3)]" />

        <header className="absolute inset-x-0 top-[62px] flex items-center justify-between px-5 py-3">
          <img
            src={chevronLeftIcon}
            alt=""
            className="size-7 brightness-0 invert"
            draggable={false}
          />
          <img
            src={bookmarkLineWhite}
            alt=""
            className="size-6"
            draggable={false}
          />
        </header>

        <div className="absolute inset-x-5 top-[122px] flex flex-col gap-2">
          <p className="text-heading-20-md text-neutral-0 leading-[1.4]">
            엔비디아 실적 발표, 국내 반도체 ETF에도 훈풍 부나?
          </p>
          <div className="flex items-center gap-2">
            <Badge>경제</Badge>
            <span className="text-caption-12-md-tighter text-neutral-100">
              2026-05-08
            </span>
          </div>
        </div>
      </div>

      {/* 히어로만 흐리게 덮는 베일 (본문·하단 카드는 그 위에 그려짐) */}
      <div className="absolute inset-x-0 top-0 h-[726px] bg-gradient-to-b from-[rgba(254,243,225,0.56)] to-[rgba(255,255,255,0.8)] to-[34%]" />

      <p className="text-body-16-rg-tighter text-neutral-1000 relative px-5 pt-6 whitespace-pre-line">
        {`엔비디아의 성공은 마치 금광을 캔 사람보다 곡괭이를 판 상인이 더 큰 돈을 벌었던 골드러시와 비슷해요. AI라는 금광을 캐려는 기업들이 엔비디아의 칩(곡괭이)을 사느라 줄을 서고 있죠.

이 열기는 한국의 반도체 ETF에도 영향을 주어, 마치 옆 가게도 덩달아 손님이 늘어나는 것처럼 함께 상승하고 있어요. `}
        <span className="text-primary underline">양적완화</span>가 지속되면 이런
        흐름은 더 강해질 수 있답니다.
      </p>

      <div className="relative mt-6 flex flex-col gap-3 bg-neutral-50/80 px-[21px] pt-5 pb-10">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="bg-neutral-0 h-[115px] rounded-[16px] shadow-[0_0_2px_rgba(0,0,0,0.08)]"
          />
        ))}
      </div>

      <span className="bg-neutral-0 absolute top-[760px] left-[328px] flex size-10 items-center justify-center rounded-full shadow-[0_0_4px_rgba(0,0,0,0.25)]">
        <img src={arrowUpIcon} alt="" className="size-6" draggable={false} />
      </span>
    </div>
  );
}

// 소개 1: "경제 뉴스, 이제 1분이면 충분해요" — 브리핑 → 뉴스 상세 흐름 미리보기
export default function BriefingDemo() {
  const phase = useDemoPhase(PHASE_DELAYS, REDUCED_PHASE);

  const isZoomed = phase >= 2;
  const briefingTransform =
    phase === 0
      ? "translateY(144px)"
      : isZoomed
        ? `scale(${ZOOM_SCALE})`
        : "none";

  return (
    <>
      <PhoneMockup
        className="top-[215px] h-[640px] rounded-[24px] transition-transform duration-700 ease-out"
        style={{ transform: briefingTransform, transformOrigin: ZOOM_ORIGIN }}
      >
        <BriefingScreen dimmed={phase === 0} scrolled={isZoomed} />
      </PhoneMockup>

      <PhoneMockup
        className={`top-[215px] h-[640px] rounded-[24px] transition-transform duration-500 ease-out ${
          phase >= 3 ? "translate-x-0" : "translate-x-[400px]"
        }`}
      >
        <NewsDetailScreen />
      </PhoneMockup>
    </>
  );
}
