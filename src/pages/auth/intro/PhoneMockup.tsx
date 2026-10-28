import type { CSSProperties, ReactNode } from "react";

interface PhoneMockupProps {
  children: ReactNode;
  // 바깥 카드 위치·높이·모서리 (예: "top-[215px] h-[675px] rounded-[30px]")
  className?: string;
  style?: CSSProperties;
}

// Figma 소개 화면의 앱 미리보기 카드: 실제 앱 화면(390px)을 80%로 줄인 312px 카드.
// 내용은 앱과 같은 크기·토큰으로 그리고, 바깥에서 한 번에 축소한다.
export default function PhoneMockup({
  children,
  className = "",
  style,
}: PhoneMockupProps) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`bg-neutral-0 pointer-events-none absolute left-[calc(50%-156px)] w-[312px] overflow-hidden ${className}`}
    >
      <div className="w-[390px] origin-top-left scale-[0.8]">{children}</div>
    </div>
  );
}
