interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode; // 예: 📢(IconMegaphone) — 에셋 대기, 호출부에서 주입
  right?: React.ReactNode; // 우측 액션(더보기 등), 선택
}

// Figma MainNewsHeader 기준: 가로 배치, 아이콘+제목, 간격 4px (예: "📢 따끈한 금융 소식")
// ⚠️ 제목 폰트 크기 미확인 — 우선 16px Bold(Subhead)로. Figma 확인 후 조정.
export default function SectionHeader({ title, icon, right }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center gap-1">
      {icon}
      <p className="text-base font-bold text-[#1B1B1B]">{title}</p>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}
