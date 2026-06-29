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
    "w-full h-[52px] rounded-[12px] font-bold text-base transition-all px-5 flex items-center justify-center gap-1";
  const variants = {
    primary: "bg-[#F46C0E] text-white",
    secondary: "bg-[#FF9900] text-white",
    outline: "border border-[#F46C0E] text-[#F46C0E] bg-white",
  };
  // Figma: disabled = Neutral/Gray06 배경(#F5F5F5)
  const disabledStyle = "bg-[#F5F5F5] text-[#999999] border-transparent";

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
