interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode; // 예: 📢(IconMegaphone) — 에셋 대기, 호출부에서 주입
  right?: React.ReactNode; // 우측 액션(더보기 등), 선택
}

// Figma MainNewsHeader 기준: 가로 배치, 아이콘+제목, 간격 4px (예: "📢 따끈한 금융 소식")
// 제목 폰트 = Body/16_bd_tighter (Figma 변수 확인, 다른 화면들의 16px bold 텍스트와 동일 토큰)
export default function SectionHeader({ title, icon, right }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center gap-1">
      {icon}
      <p className="text-body-16-bd-tighter text-neutral-900">{title}</p>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}
