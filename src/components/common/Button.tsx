interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "soft";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  const base =
    "w-full h-[52px] rounded-[12px] text-body-16-bd-tighter transition-all px-5 flex items-center justify-center gap-1";
  const variants = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    outline: "border border-primary text-primary bg-white",
    // Figma PurchaseButton second: 연한 주황 배경 + primary-200 테두리 (예: 투자 결과 바텀시트 보조 버튼)
    soft: "border border-primary-200 bg-primary-50 text-primary",
  };
  // Figma: disabled = Neutral/Gray06 배경(#F5F5F5)
  const disabledStyle = "bg-neutral-50 text-neutral-400 border-transparent";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? disabledStyle : variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
