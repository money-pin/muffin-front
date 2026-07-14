import { useEffect, useId, useRef, useState } from "react";
import chevronDown from "@/assets/icon-20px/chevron-down.svg";

export interface SortOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface SortDropdownProps<T extends string> {
  options: readonly SortOption<T>[];
  value: T;
  onChange: (value: NoInfer<T>) => void;
  ariaLabel?: string;
  align?: "start" | "end";
  disabled?: boolean;
  className?: string;
}

export default function SortDropdown<const T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "정렬 기준 선택",
  align = "end",
  disabled = false,
  className = "",
}: SortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();

  const selectedOption = options.find((option) => option.value === value);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const firstEnabledIndex = options.findIndex((option) => !option.disabled);
  const isTriggerDisabled = disabled || firstEnabledIndex < 0;

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const index =
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : firstEnabledIndex;

    optionRefs.current[index]?.focus();
  }, [firstEnabledIndex, isOpen, options, selectedIndex]);

  const moveFocus = (currentIndex: number, direction: 1 | -1) => {
    for (let step = 1; step <= options.length; step += 1) {
      const nextIndex =
        (currentIndex + direction * step + options.length) % options.length;

      if (!options[nextIndex]?.disabled) {
        optionRefs.current[nextIndex]?.focus();
        return;
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-flex ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center justify-center gap-1 text-body-14-md text-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={
          selectedOption
            ? `${ariaLabel}, 현재 ${selectedOption.label}`
            : ariaLabel
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        disabled={isTriggerDisabled}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span>{selectedOption?.label ?? "정렬 선택"}</span>
        <img
          src={chevronDown}
          alt=""
          aria-hidden="true"
          className={`size-5 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute top-[calc(100%+4px)] z-50 flex w-[116px] flex-col gap-2 rounded-lg border border-neutral-100 bg-neutral-0 px-4 py-3 ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                disabled={option.disabled}
                className={`flex h-[22px] w-full items-center whitespace-nowrap text-left disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected
                    ? "text-body-14-md text-neutral-900"
                    : "text-body-14-rg text-neutral-600"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  requestAnimationFrame(() => triggerRef.current?.focus());
                }}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    requestAnimationFrame(() => setIsOpen(false));
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    moveFocus(index, 1);
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    moveFocus(index, -1);
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    optionRefs.current
                      .find((item) => item && !item.disabled)
                      ?.focus();
                  }
                  if (event.key === "End") {
                    event.preventDefault();
                    [...optionRefs.current]
                      .reverse()
                      .find((item) => item && !item.disabled)
                      ?.focus();
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
