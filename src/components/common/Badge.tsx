interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "gray";
  className?: string;
}

export default function Badge({
  children,
  variant = "orange",
  className = "",
}: BadgeProps) {
  const base =
    "inline-flex items-center justify-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold tracking-tight select-none";

  const variants = {
    orange: "bg-[#FFF4EA] text-[#F46C0E]",
    gray: "bg-[#F5F5F5] text-[#999999]",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}