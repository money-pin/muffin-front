import { useEffect, useRef, useState } from "react";
import type { FocusEvent, Ref } from "react";
import InvestBottomAction from "@/pages/invest/trade/components/InvestBottomAction";
import { useQuantityKeyboard } from "@/pages/invest/trade/hooks/useQuantityKeyboard";

import minusIcon from "@/assets/icon-24px/minus.svg";
import plusIcon from "@/assets/icon-24px/plus.svg";
import plusDisabledIcon from "@/assets/icon-24px/plus-disabled.svg";
import { formatNumber } from "@/pages/invest/utils/profitFormat";

interface InvestAssetCountBarProps {
  containerRef?: Ref<HTMLDivElement>;
  isVisible: boolean;
  onKeyboardVisibilityChange: (isOpen: boolean) => void;
  onEditingChange: (isEditing: boolean) => void;
  name: string;
  totalAmount: number;
  unitAmount: number;
  quantity: number;
  maxQuantity: number;
  disabled: boolean;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onQuantityAdd: (quantity: number) => void;
  onQuantityChange: (quantity: number) => void;
}

const QUICK_QUANTITIES = [5, 10, 20] as const;

function getQuantityError(value: string, maxQuantity: number) {
  if (!value) return "수량을 입력해주세요.";
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
    return "0 이상의 정수만 입력해주세요.";
  }
  if (Number(value) > maxQuantity) {
    return `최대 ${formatNumber(maxQuantity)}개까지 입력할 수 있어요.`;
  }
  return "";
}

function InvestAssetCountBar({
  containerRef,
  isVisible,
  onKeyboardVisibilityChange,
  onEditingChange,
  name,
  totalAmount,
  unitAmount,
  quantity,
  maxQuantity,
  disabled,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
  onQuantityAdd,
  onQuantityChange,
}: InvestAssetCountBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [inputError, setInputError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const editorActionRef = useRef<HTMLDivElement>(null);
  const editingRef = useRef(false);
  const { keyboardInset, isKeyboardOpen } = useQuantityKeyboard(
    isEditing,
    inputRef,
  );
  const isDraftValid = !getQuantityError(draft, maxQuantity);
  const displayedAmount = !isEditing
    ? totalAmount
    : isDraftValid
      ? Number(draft) * unitAmount
      : null;
  const increaseEnabled =
    !disabled &&
    (isEditing ? isDraftValid && Number(draft) < maxQuantity : canIncrease);
  const decreaseEnabled =
    !disabled && (isEditing ? isDraftValid && Number(draft) > 0 : canDecrease);
  const stepQuantity = (delta: number) => {
    if (isEditing) {
      setDraft(String(Number(draft) + delta));
      setInputError("");
    } else if (delta > 0) onIncrease();
    else onDecrease();
  };
  useEffect(() => {
    onKeyboardVisibilityChange(isKeyboardOpen);
    return () => onKeyboardVisibilityChange(false);
  }, [isKeyboardOpen, onKeyboardVisibilityChange]);
  useEffect(() => {
    onEditingChange(isEditing);
    return () => onEditingChange(false);
  }, [isEditing, onEditingChange]);

  const finishEditing = (cancel = false, keepInvalidInput = false) => {
    if (!editingRef.current) return;
    const error =
      cancel || disabled ? "" : getQuantityError(draft, maxQuantity);
    if (error && keepInvalidInput) {
      setInputError(error);
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    editingRef.current = false;
    setIsEditing(false);
    setInputError(error ? `${error} 기존 수량을 유지했어요.` : "");
    inputRef.current?.blur();
    if (!cancel && !disabled && !error) onQuantityChange(Number(draft));
  };
  const handleEditorBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      !panelRef.current?.contains(event.relatedTarget) &&
      !editorActionRef.current?.contains(event.relatedTarget)
    )
      finishEditing();
  };

  return (
    <>
      <div
        ref={containerRef}
        role="group"
        aria-label="투자 수량 조절"
        aria-hidden={!isVisible}
        inert={!isVisible}
        style={isKeyboardOpen ? { bottom: keyboardInset } : undefined}
        onBlur={handleEditorBlur}
        className="fixed bottom-[156px] left-1/2 z-40 w-full max-w-[var(--max-width-app)] -translate-x-1/2"
      >
        <div
          ref={panelRef}
          data-invest-quantity-panel
          className={[
            "bg-secondary-100 flex flex-col gap-2 rounded-t-2xl px-5 py-3 shadow-[0_-2px_5px_rgba(0,0,0,0.07)] transition-[translate,opacity] duration-300 ease-[ease-out] motion-reduce:transition-none",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          ].join(" ")}
        >
          <div className="flex min-h-11 items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1">
              <strong className="text-heading-18-bd break-keep text-neutral-900">
                {name}
              </strong>
              <span className="text-body-14-md shrink-0 whitespace-nowrap text-neutral-700">
                (
                {displayedAmount === null
                  ? " - "
                  : formatNumber(displayedAmount)}
                원)
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                aria-label="수량 감소"
                disabled={!decreaseEnabled}
                onClick={() => stepQuantity(-1)}
                className="group focus-visible:outline-primary flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="bg-neutral-0 flex size-10 items-center justify-center rounded-full group-disabled:bg-neutral-50">
                  <img
                    src={minusIcon}
                    alt=""
                    className="size-6 shrink-0 object-contain"
                  />
                </span>
              </button>

              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                enterKeyHint="done"
                aria-label={`${name} 투자 수량`}
                aria-invalid={!!inputError}
                aria-describedby={
                  inputError ? "invest-quantity-error" : undefined
                }
                autoComplete="off"
                disabled={disabled}
                value={isEditing ? draft : String(quantity)}
                onFocus={(event) => {
                  if (editingRef.current) return;
                  editingRef.current = true;
                  setInputError("");
                  setDraft(String(quantity));
                  setIsEditing(true);
                  event.currentTarget.select();
                }}
                onChange={(event) => {
                  const value = event.target.value;
                  if (!/^\d{0,9}$/.test(value)) {
                    setInputError("0 이상의 정수를 9자리 이내로 입력해주세요.");
                    return;
                  }
                  setDraft(value);
                  setInputError(
                    value ? getQuantityError(value, maxQuantity) : "",
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    finishEditing(true);
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    finishEditing(false, true);
                  }
                }}
                className="text-heading-18-bd focus-visible:outline-primary min-h-11 w-11 min-w-0 rounded-lg bg-transparent text-center text-neutral-900 focus-visible:outline-2"
              />

              <button
                type="button"
                aria-label="수량 증가"
                disabled={!increaseEnabled}
                onClick={() => stepQuantity(1)}
                className="group focus-visible:outline-primary flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="bg-neutral-0 flex size-10 items-center justify-center rounded-full group-disabled:bg-neutral-50">
                  <img
                    src={increaseEnabled ? plusIcon : plusDisabledIcon}
                    alt=""
                    className="size-6 shrink-0 object-contain"
                  />
                </span>
              </button>
            </div>
          </div>

          {inputError && (
            <p
              id="invest-quantity-error"
              role="alert"
              className="text-caption-12-md text-primary break-keep"
            >
              {inputError}
            </p>
          )}
          {!isEditing && (
            <div className="grid w-full grid-cols-4 gap-2">
              {QUICK_QUANTITIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value}개 추가`}
                  disabled={disabled || quantity + value > maxQuantity}
                  onClick={() => onQuantityAdd(value)}
                  className="group focus-visible:outline-primary flex min-h-11 min-w-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="bg-neutral-0 text-caption-12-md flex min-h-7 w-full items-center justify-center rounded-lg text-neutral-600 group-disabled:text-neutral-300">
                    {value}개
                  </span>
                </button>
              ))}
              <button
                type="button"
                disabled={disabled || maxQuantity <= 0}
                onClick={() => onQuantityChange(maxQuantity)}
                className="group focus-visible:outline-primary flex min-h-11 min-w-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="bg-neutral-0 text-caption-12-md flex min-h-7 w-full items-center justify-center rounded-lg text-neutral-600 group-disabled:text-neutral-300">
                  최대
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing && !isKeyboardOpen && (
        <InvestBottomAction
          containerRef={editorActionRef}
          selectedTotalAmount={totalAmount}
          variant="quantityInput"
          disabled={disabled}
          showTopShadow={false}
          onReset={() => finishEditing(true)}
          onAction={() => finishEditing(false, true)}
          onBlur={handleEditorBlur}
        />
      )}
    </>
  );
}

export default InvestAssetCountBar;
