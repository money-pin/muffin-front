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
    orange: "bg-primary-50 text-primary",
    gray: "bg-neutral-50 text-neutral-400",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}