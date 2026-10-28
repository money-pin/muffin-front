import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import TopBar from "@/components/common/TopBar";
import { getSectorMeta } from "@/pages/invest/constants/sectorMeta";
import {
  useInvestmentSectorsQuery,
  useSectorGuideQuery,
} from "@/pages/invest/trade/investQueries";
import type { SectorGuideItem } from "@/pages/invest/trade/types/invest";

interface InvestSectorGuideProps {
  onClose: () => void;
}

interface SectorGuideCardProps {
  sector: SectorGuideItem;
}

function SectorGuideCard({ sector }: SectorGuideCardProps) {
  return (
    <article
      aria-labelledby={`guide-${sector.sectorCode}`}
      className="flex w-full min-w-0 flex-col gap-2 rounded-xl border-[0.7px] border-neutral-100 bg-white p-4"
    >
      <div className="flex items-center gap-3">
        <img
          src={getSectorMeta(sector.sectorCode).iconSrc}
          alt=""
          width={48}
          height={48}
          className="size-12 shrink-0 object-contain"
        />
        <h3
          id={`guide-${sector.sectorCode}`}
          className="text-body-16-bd-tighter min-w-0 flex-1 leading-[1.6] break-keep text-neutral-900"
        >
          {sector.name}
        </h3>
      </div>
      <p className="text-body-14-bd text-primary break-keep">
        {sector.referenceAsset.name}
      </p>
      {sector.referenceAsset.description && (
        <p className="text-body-14-rg break-keep text-neutral-700">
          {sector.referenceAsset.description}
        </p>
      )}
      <p className="text-caption-12-md text-right break-words text-neutral-400">
        {sector.referenceAsset.type === "ETF" ? "종목코드" : "자산코드"}:{" "}
        {sector.referenceAsset.code}
      </p>
    </article>
  );
}

export default function InvestSectorGuide({ onClose }: InvestSectorGuideProps) {
  const guideRef = useRef<HTMLDivElement>(null);
  const guideQuery = useSectorGuideQuery();
  const sectorsQuery = useInvestmentSectorsQuery();
  const data = guideQuery.data;
  const isPending = guideQuery.isPending || sectorsQuery.isPending;
  const isError = guideQuery.isError || sectorsQuery.isError;
  const isFetching = guideQuery.isFetching || sectorsQuery.isFetching;
  const refetch = () =>
    Promise.all([guideQuery.refetch(), sectorsQuery.refetch()]);
  const guideByCode = new Map(
    data?.sectors.map((sector) => [sector.sectorCode, sector]),
  );
  // 그룹·순서는 기존 섹터 API, 표시할 상품 정보는 안내 API를 사용한다.
  const groups = [...(sectorsQuery.data?.groups ?? [])]
    .sort((a, b) => a.groupOrder - b.groupOrder)
    .map((group) => ({
      ...group,
      items: [...group.sectors]
        .sort((a, b) => a.sectorOrder - b.sectorOrder)
        .flatMap((sector) => {
          const guide = guideByCode.get(sector.sectorCode);
          return guide ? [guide] : [];
        }),
    }))
    .filter((group) => group.items.length > 0);
  const groupedCodes = new Set(
    groups.flatMap((group) => group.items.map((sector) => sector.sectorCode)),
  );
  // 두 API의 갱신 시점이 달라도 안내 항목을 임의로 숨기지 않는다.
  const ungrouped =
    data?.sectors.filter((sector) => !groupedCodes.has(sector.sectorCode)) ??
    [];

  useEffect(() => {
    const previousFocus = document.activeElement;
    guideRef.current?.focus({ preventScroll: true });
    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  return createPortal(
    <RemoveScroll>
      <div
        ref={guideRef}
        role="dialog"
        aria-modal="true"
        aria-label="섹터별 종목"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key === "Tab") {
            const buttons =
              guideRef.current?.querySelectorAll<HTMLButtonElement>(
                "button:not(:disabled)",
              );
            if (!buttons?.length) return;
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (
              event.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === guideRef.current)
            ) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
        className="fixed inset-0 z-[60] overflow-y-auto bg-white outline-none"
      >
        <div className="mx-auto min-h-full w-full max-w-[var(--max-width-app)]">
          <header className="sticky top-0 z-10 bg-white [&_button]:size-11">
            <TopBar
              title="섹터별 종목"
              showBack
              onBack={onClose}
              rightIcon={<span className="size-11 shrink-0" />}
            />
          </header>
          <div className="flex w-full flex-col gap-5 px-5 pt-3 pb-11">
            <section
              aria-labelledby="reference-asset-description-title"
              className="bg-secondary-50 flex flex-col gap-3 rounded-xl p-4"
            >
              <h2
                id="reference-asset-description-title"
                className="text-body-16-bd-tighter flex h-[19px] items-center leading-[1.6] text-[var(--color-invest-deposit)]"
              >
                ETF가 뭐예요?
              </h2>
              <p className="text-body-14-md-tighter break-keep text-neutral-600">
                여러 회사의 주식을 한 바구니에 담아, 주식처럼 한 번에 사고팔 수
                있게 만든 상품이에요.
              </p>
            </section>
            {isPending && (
              <div
                role="status"
                aria-label="종목 정보 불러오는 중"
                className="flex flex-col gap-3"
              >
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    aria-hidden="true"
                    className="flex flex-col gap-3 rounded-xl border border-neutral-100 p-4 motion-safe:animate-pulse"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 rounded-lg bg-neutral-50" />
                      <div className="h-5 w-1/3 rounded bg-neutral-50" />
                    </div>
                    <div className="h-5 w-2/3 rounded bg-neutral-50" />
                    <div className="h-10 w-full rounded bg-neutral-50" />
                  </div>
                ))}
              </div>
            )}
            {isError && (
              <div
                role="alert"
                className="flex flex-col items-center gap-3 rounded-xl border border-neutral-100 p-4"
              >
                <p className="text-body-14-md break-keep text-neutral-600">
                  종목 정보를 불러오지 못했어요.
                </p>
                <button
                  type="button"
                  disabled={isFetching}
                  onClick={() => void refetch()}
                  className="text-body-14-bd text-primary min-h-11 rounded-lg px-4 disabled:opacity-50"
                >
                  {isFetching ? "불러오는 중..." : "다시 시도"}
                </button>
              </div>
            )}
            {data?.sectors.length === 0 && (
              <p
                role="status"
                className="text-body-14-md py-8 text-center break-keep text-neutral-400"
              >
                현재 안내할 수 있는 섹터가 없어요.
              </p>
            )}
            {!isPending &&
              groups.map((group) => (
                <section
                  key={group.groupCode}
                  aria-labelledby={`guide-group-${group.groupCode}`}
                  className="flex w-full flex-col gap-2"
                >
                  <h2
                    id={`guide-group-${group.groupCode}`}
                    className="text-body-16-bd-tighter leading-[1.6] break-keep text-neutral-900"
                  >
                    {group.groupName}
                  </h2>
                  {group.items.map((sector) => (
                    <SectorGuideCard key={sector.sectorCode} sector={sector} />
                  ))}
                </section>
              ))}
            {!isPending &&
              ungrouped.map((sector) => (
                <SectorGuideCard key={sector.sectorCode} sector={sector} />
              ))}
          </div>
        </div>
      </div>
    </RemoveScroll>,
    document.body,
  );
}
