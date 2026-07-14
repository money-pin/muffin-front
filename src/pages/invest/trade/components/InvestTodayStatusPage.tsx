//오늘 투자 현황 페이지
import { useEffect, useState } from "react";

import clockIcon from "@/assets/icon-24px/clock.svg";
import lockIcon from "@/assets/icon-24px/lock.svg";

import type { InvestAssetId } from "@/pages/invest/trade/types/invest";

const FORCE_CLOSED_VIEW = false;

interface TodayInvestItem {
  assetId: InvestAssetId;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
}

interface InvestTodayStatusPageProps {
  items: TodayInvestItem[];
  onEdit: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function getKstDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
}

function getIsClosedTime() {
  const kstNow = getKstDate();
  const hour = kstNow.getHours();

  // 한국 시간 기준 00:00 이상, 10:00 전까지
  return hour >= 0 && hour < 10;
}

function getKstRemainingTimeText() {
  const kstNow = getKstDate();

  const midnight = new Date(kstNow);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = Math.max(0, midnight.getTime() - kstNow.getTime());
  const totalMinutes = Math.ceil(diffMs / 1000 / 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

function InvestTodayStatusPage({ items, onEdit }: InvestTodayStatusPageProps) {
  const [remainingTimeText, setRemainingTimeText] = useState(
    getKstRemainingTimeText,
  );

  const [isClosedTime, setIsClosedTime] = useState(
    FORCE_CLOSED_VIEW || getIsClosedTime(),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingTimeText(getKstRemainingTimeText());
      setIsClosedTime(FORCE_CLOSED_VIEW || getIsClosedTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-[var(--color-neutral-50)] px-5 pt-5 pb-[100px]">
      <section className="flex h-[66px] w-full items-center rounded-[12px] bg-[var(--color-neutral-0)] py-[14px] pl-5 pr-4 ring-1 ring-inset ring-[var(--color-neutral-100)]">
        {" "}
        {isClosedTime ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-secondary-200)]">
            <img src={lockIcon} alt="" className="h-6 w-6" />
          </div>
        ) : (
          <img src={clockIcon} alt="" className="h-6 w-6 shrink-0" />
        )}
        <div className="ml-4 flex flex-col">
          <strong
            className={[
              "text-[length:var(--text-body-14-bd)] leading-[var(--text-body-14-bd--line-height)] font-[var(--text-body-14-bd--font-weight)]",
              isClosedTime
                ? "text-[var(--color-neutral-900)]"
                : "text-[var(--color-primary)]",
            ].join(" ")}
          >
            {isClosedTime ? "투자가 마감됐어요" : "오늘 투자 진행 중"}
          </strong>

          <span className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-neutral-600)]">
            {isClosedTime
              ? "오전 10시부터 새 투자를 시작할 수 있어요"
              : "수정 마감까지 남은 시간"}
          </span>
        </div>
        {!isClosedTime && (
          <span className="ml-auto flex h-[30px] w-[54px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-secondary-200)] px-2 py-1 text-[length:var(--text-body-14-bd)] leading-[var(--text-body-14-bd--line-height)] font-[var(--text-body-14-bd--font-weight)] text-[var(--color-primary)]">
            {remainingTimeText}
          </span>
        )}
      </section>

      <section className="mt-6">
        <h2
          className={[
            "text-[length:var(--text-body-14-md-tighter)] leading-[var(--text-body-14-md-tighter--line-height)] font-[var(--text-body-14-md-tighter--font-weight)] tracking-[var(--text-body-14-md-tighter--letter-spacing)] text-[var(--color-neutral-600)]",
            isClosedTime && "opacity-50",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          오늘 투자 현황
        </h2>

        <div
          className={[
            "mt-2 rounded-[12px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] px-4 py-5",
            isClosedTime && "opacity-50",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const progressPercent = Math.max(
              0,
              Math.min(100, Number(item.percentage)),
            );
            const investColor = `var(--color-invest-${item.assetId})`;

            return (
              <div key={item.assetId}>
                <div className="w-full">
                  <div className="flex h-10 w-full items-center">
                    <img
                      src={item.icon}
                      alt=""
                      className="h-10 w-10 shrink-0"
                    />

                    <div className="ml-4 flex min-w-0 flex-1 flex-col">
                      <div className="flex h-[22px] w-full items-center">
                        <div className="flex min-w-0 flex-1 items-baseline">
                          <span className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-900)]">
                            {item.name}
                          </span>

                          <span className="ml-2 text-[length:var(--text-body-14-md)] leading-[var(--text-body-14-md--line-height)] font-[var(--text-body-14-md--font-weight)] text-[var(--color-neutral-400)]">
                            {progressPercent}%
                          </span>
                        </div>

                        <strong className="shrink-0 text-right text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-900)]">
                          {formatCurrency(item.amount)}원
                        </strong>
                      </div>

                      <div className="mt-2 h-1 w-full overflow-hidden rounded-[27px] bg-[var(--color-neutral-50)]">
                        <div
                          className="h-full rounded-[27px]"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: investColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {!isLast && (
                  <div className="my-4 h-px w-full bg-[var(--color-neutral-50)]" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {isClosedTime ? (
        <section className="mt-4 flex h-[73px] w-full flex-col justify-center rounded-[12px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] px-8 py-3 text-center">
          <p className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-900)]">
            투자 결과는{" "}
            <span className="text-[var(--color-primary)]">오전 10시</span>에
            공개돼요!
          </p>

          <p className="mt-1 text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-neutral-600)]">
            당일 시세 변동을 반영해 투자 수익을 집계해요.
          </p>
        </section>
      ) : (
        <>
          <button
            type="button"
            onClick={onEdit}
            className="mt-4 h-[52px] w-full rounded-[12px] border border-[var(--color-primary-300)] bg-[var(--color-primary-100)] text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-primary)]"
          >
            투자 수정하기
          </button>

          <p className="mt-[9px] text-center text-[length:var(--text-caption-12-md-tighter)] leading-[var(--text-caption-12-md-tighter--line-height)] font-[var(--text-caption-12-md-tighter--font-weight)] tracking-[var(--text-caption-12-md-tighter--letter-spacing)] text-[var(--color-neutral-400)]">
            자정 이후에는 오늘 투자를 수정할 수 없어요
          </p>
        </>
      )}
    </div>
  );
}

export default InvestTodayStatusPage;
