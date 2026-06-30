import { useState, useRef, useEffect } from "react";

export interface FilterOption<T extends string = string> {
  
  value: T;
  
  label: string;
}

interface FilterProps<T extends string = string> {
  
  options: FilterOption<T>[];
  
  selected: T;
  
  onChange: (value: T) => void;
  
  align?: "left" | "right";
  className?: string;
}

export default function Filter<T extends string = string>({
  options,
  selected,
  onChange,
  align = "right",
  className = "",
}: FilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  
  const currentOption = options.find((opt) => opt.value === selected) || options[0];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* 필터 Trigger 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-bold text-[#535353] transition-all hover:text-[#1B1B1B]"
      >
        <span>{currentOption?.label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#535353"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* 드롭다운 메뉴 박스 */}
      {isOpen && (
        <div
          className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-1.5 w-[120px] rounded-[8px] border border-[#E2E2E2] bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-50`}
        >
          {options.map((option) => {
            const isCurrent = option.value === selected;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors
                  ${
                    isCurrent
                      ? "text-[#F46C0E] bg-[#FFF4EA]"
                      : "text-[#535353] hover:bg-[#F5F5F5]"
                  }`}
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