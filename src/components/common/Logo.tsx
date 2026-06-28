interface LogoProps {
  src?: string;
  tagline?: boolean;
}

// Figma: Logotype(Muffin 워드마크 188×66, 주황) + 태그라인.
//  워드마크는 이미지 에셋이라 우선 텍스트 placeholder. 태그라인 폰트크기 추정(14px).
const TAGLINE = "매일 가볍게 즐기는 금융 핀셋 가이드";

export default function Logo({ src, tagline = false }: LogoProps) {
  return (
    <div className="flex w-[232px] flex-col items-center gap-4">
      {src ? (
        <img src={src} alt="Muffin" className="h-[66px] w-[188px] object-contain" />
      ) : (
        <span className="text-5xl font-extrabold text-[#F46C0E]">Muffin</span>
      )}
      {tagline && <p className="text-sm font-bold text-[#F46C0E]">{TAGLINE}</p>}
    </div>
  );
}
