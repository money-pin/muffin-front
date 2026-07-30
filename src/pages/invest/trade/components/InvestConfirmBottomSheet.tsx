// 투자 확정 바텀시트
import BottomSheet from "@/components/common/BottomSheet";

import type { InvestAssetId } from "@/pages/invest/trade/types/invest";

interface InvestConfirmItem {
  assetId: InvestAssetId;
  name: string;
  icon: string;
  amount: number;
  percentage: number;
}

interface InvestConfirmBottomSheetProps {
  isOpen: boolean;
  items: InvestConfirmItem[];
  totalAmount: number;
  onClose: () => void;
  onConfirm: () => void;
}

function formatCurrency(value: number) {
  return value.toLocaleString("ko-KR");
}

function InvestConfirmBottomSheet({
  isOpen,
  items,
  totalAmount,
  onClose,
  onConfirm,
}: InvestConfirmBottomSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="오늘의 투자 확정"
    >
      <div className="max-h-[calc(100dvh-36px)] overflow-y-auto overscroll-contain px-5 py-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-[length:var(--text-heading-18-bd)] leading-[var(--text-heading-18-bd--line-height)] font-[var(--text-heading-18-bd--font-weight)] tracking-[var(--text-heading-18-bd--letter-spacing)] text-[var(--color-neutral-900)]">
            오늘의 투자를 확정할까요?
          </h2>

          <p className="text-[length:var(--text-body-14-md-tighter)] leading-[var(--text-body-14-md-tighter--line-height)] font-[var(--text-body-14-md-tighter--font-weight)] tracking-[var(--text-body-14-md-tighter--letter-spacing)] text-[var(--color-neutral-400)]">
            확정 후 밤 12시 전까지 수정 가능해요
          </p>
        </div>

        <div className="mt-4 rounded-[12px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] px-4 py-4">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <div key={item.assetId}>
                <div className="flex h-10 w-full items-center">
                  <img
                    src={item.icon}
                    alt=""
                    className="h-10 w-10 shrink-0"
                  />

                  <div className="ml-4 flex min-w-0 flex-1 items-baseline">
                    <span className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-900)]">
                      {item.name}
                    </span>

                    <span className="ml-2 text-[length:var(--text-body-14-md)] leading-[var(--text-body-14-md--line-height)] font-[var(--text-body-14-md--font-weight)] text-[var(--color-neutral-400)]">
                      {item.percentage}%
                    </span>
                  </div>

                  <strong className="shrink-0 text-right text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-900)]">
                    {formatCurrency(item.amount)}원
                  </strong>
                </div>

                {!isLast && (
                  <div className="my-3 h-px w-full bg-[var(--color-neutral-50)]" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex h-[70px] items-center justify-between rounded-[12px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] p-5">
          <span className="text-[length:var(--text-body-14-md-tighter)] leading-[var(--text-body-14-md-tighter--line-height)] font-[var(--text-body-14-md-tighter--font-weight)] tracking-[var(--text-body-14-md-tighter--letter-spacing)] text-[var(--color-neutral-700)]">
            총 투자 금액
          </span>

          <strong className="text-[length:var(--text-heading-20-bd)] leading-[var(--text-heading-20-bd--line-height)] font-[var(--text-heading-20-bd--font-weight)] text-[var(--color-neutral-900)]">
            {formatCurrency(totalAmount)}원
          </strong>
        </div>

        <div className="mt-8 flex w-full gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] w-[88px] shrink-0 rounded-[14px] border border-[var(--color-neutral-100)] bg-[var(--color-neutral-0)] text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-600)]"
          >
            취소
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-[52px] min-w-0 flex-1 rounded-[14px] bg-[var(--color-primary)] text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] tracking-[var(--text-body-16-bd-tighter--letter-spacing)] text-[var(--color-neutral-0)]"
          >
            구매 확정하기
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

export default InvestConfirmBottomSheet;