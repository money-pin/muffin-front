import type { ReactNode } from "react";

type BadgeVariant = "orange" | "gray" | "positive" | "negative";

type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export default function Badge({
  children,
  variant = "orange",
  size = "sm",
  className = "",
}: BadgeProps) {
  const base =
    "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-center select-none";

  const variants: Record<BadgeVariant, string> = {
    orange: "bg-primary-50 text-primary",
    gray: "bg-neutral-50 text-neutral-700",
    positive: "bg-positive-50 text-positive",
    negative: "bg-negative-50 text-negative",
  };

  const sizes: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-caption-12-md-tighter",
    md: "h-[22px] gap-1 pl-1.5 pr-1 py-1 text-caption-12-bd",
  };

  return (
    <span
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
