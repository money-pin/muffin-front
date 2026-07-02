import logo from "@/assets/logo.svg";
interface LogoProps {
  tagline?: boolean;
  className?: string;
}

// Figma: Logotype(Muffin 워드마크 188×66, 주황) + 태그라인.
//  워드마크는 이미지 에셋이라 우선 텍스트 placeholder. 태그라인 폰트크기 추정(14px).
const TAGLINE = "매일 가볍게 즐기는 금융 핀셋 가이드";

export default function Logo({ tagline = false, className = "" }: LogoProps) {
  return (
    <div className={`flex w-[232px] flex-col items-center gap-4 ${className}`}>
      <img
        src={logo}
        alt="Muffin"
        className="h-[66px] w-[188px] object-contain"
      />

      {tagline && <p className="text-body-16-bd-tighter text-primary">{TAGLINE}</p>}
    </div>
  );
}
