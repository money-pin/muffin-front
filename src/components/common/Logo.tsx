import logo from "@/assets/logo.svg";

interface LogoProps {
  tagline?: boolean;
  size?: "lg" | "sm" | "xs";
  className?: string;
}

// Figma: 스플래시 로고 188×66(lg) / 로그인 로고 135×47(sm) / 홈 상단 80×28(xs), 주황 워드마크 + 태그라인
const TAGLINE = "매일 가볍게 즐기는 금융 핀셋 가이드";
const SIZE_CLASS = {
  lg: "h-[66px] w-[188px]",
  sm: "h-[47px] w-[135px]",
  xs: "h-[28px] w-[80px]",
} as const;

export default function Logo({
  tagline = false,
  size = "lg",
  className = "",
}: LogoProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <img
        src={logo}
        alt="Muffin"
        className={`${SIZE_CLASS[size]} object-contain`}
      />

      {tagline && (
        <p className="text-body-16-bd-tighter text-primary">{TAGLINE}</p>
      )}
    </div>
  );
}
