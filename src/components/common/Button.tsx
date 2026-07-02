interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
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
