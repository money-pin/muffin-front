import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RemoveScroll } from "react-remove-scroll";
import TopBar from "@/components/common/TopBar";
import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
import { SECTOR_PRODUCTS } from "@/pages/invest/trade/constants/sectorProducts";

interface InvestSectorGuideProps {
  onClose: () => void;
}

export default function InvestSectorGuide({ onClose }: InvestSectorGuideProps) {
  const guideRef = useRef<HTMLDivElement>(null);

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
            // 안내의 유일한 조작부는 뒤로가기다. 배경 화면으로 포커스가 나가지 않게 한다.
            event.preventDefault();
            guideRef.current
              ?.querySelector<HTMLButtonElement>("button")
              ?.focus();
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
              aria-labelledby="etf-description-title"
              className="bg-secondary-50 flex flex-col gap-3 rounded-xl p-4"
            >
              <h2
                id="etf-description-title"
                className="text-body-16-bd-tighter flex h-[19px] items-center leading-[1.6] text-[var(--color-invest-deposit)]"
              >
                ETF가 뭐예요?
              </h2>
              <p className="text-body-14-md-tighter break-keep text-neutral-600">
                여러 회사의 주식을 한 바구니에 담아, 주식처럼 한 번에 사고팔 수
                있게 만든 상품이에요.
              </p>
            </section>
            {INVEST_ASSET_SECTIONS.map((section) => (
              <section
                key={section.id}
                aria-labelledby={`guide-${section.id}`}
                className="flex w-full flex-col gap-2"
              >
                <h2
                  id={`guide-${section.id}`}
                  className="text-body-16-bd-tighter leading-[1.6] text-neutral-900"
                >
                  {section.title}
                </h2>
                {section.items.map((asset) => {
                  const product = SECTOR_PRODUCTS[asset.id];
                  return (
                    <article
                      key={asset.id}
                      aria-labelledby={`guide-${asset.id}`}
                      className="flex w-full min-w-0 flex-col gap-2 rounded-xl border-[0.7px] border-neutral-100 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={asset.activeIcon}
                          alt=""
                          width={48}
                          height={48}
                          className="size-12 shrink-0 object-contain"
                        />
                        <h3
                          id={`guide-${asset.id}`}
                          className="text-body-16-bd-tighter min-w-0 flex-1 leading-[1.6] break-keep text-neutral-900"
                        >
                          {asset.name}
                        </h3>
                      </div>
                      <p className="text-body-14-bd text-primary min-h-[22.4px] break-keep">
                        {product.name}
                      </p>
                      <p className="text-body-14-rg min-h-[22.4px] break-keep text-neutral-700">
                        {product.description}
                      </p>
                      <p className="text-caption-12-md min-h-[19.2px] text-right text-neutral-400">
                        {product.code ? `종목코드: ${product.code}` : ""}
                      </p>
                    </article>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      </div>
    </RemoveScroll>,
    document.body,
  );
}
