import clock10Icon from "@/assets/clock-10.svg";

function InvestWeekendClosedPage() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--color-neutral-50)] px-5 pt-5 pb-[100px]">
      <section className="flex h-[219px] w-full flex-col items-center justify-center rounded-[12px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] px-8 py-5 text-center">
        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-secondary-50)]">
          <img src={clock10Icon} alt="" className="h-10 w-10" />
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          <h2 className="text-[length:var(--text-heading-18-bd)] leading-[var(--text-heading-18-bd--line-height)] font-[var(--text-heading-18-bd--font-weight)] tracking-[var(--text-heading-18-bd--letter-spacing)] text-[var(--color-neutral-900)]">
            주말엔 모의투자를 할 수 없어요.
          </h2>

          <p className="text-center text-[length:var(--text-body-14-md-tighter)] leading-[var(--text-body-14-md-tighter--line-height)] font-[var(--text-body-14-md-tighter--font-weight)] tracking-[var(--text-body-14-md-tighter--letter-spacing)] text-[var(--color-neutral-600)]">
            모의투자는 주식 시장이 열리는 평일만 진행돼요.
            <br />
            주말과 공휴일엔 잠시 쉬고,
            <br />
            <span className="text-[length:var(--text-body-14-bd)] leading-[var(--text-body-14-bd--line-height)] font-[var(--text-body-14-bd--font-weight)] text-[var(--color-primary)]">
              월요일 오전 10시
            </span>
            에 다시 만나요!
          </p>
        </div>
      </section>
    </div>
  );
}

export default InvestWeekendClosedPage;
