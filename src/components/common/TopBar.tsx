interface TopBarProps {
  title?: string;
  onBack?: () => void;
  rightIcon?: React.ReactNode;
}

// Figma: 390×56, space-between, 좌우패딩 20, bg #FFF
// 백버튼 28×28(클릭→뒤로) / 타이틀 Heading/18_bd = 18px Bold, 가운데
export default function TopBar({ title, onBack, rightIcon }: TopBarProps) {
  return (
    <div className="flex h-[56px] items-center justify-between px-5 bg-white">
      {onBack ? (
        <button onClick={onBack} className="shrink-0 text-neutral-900" aria-label="뒤로">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 22l-8-8 8-8" />
          </svg>
        </button>
      ) : (
        <div className="w-7 shrink-0" />
      )}
      {title && <p className="flex-1 text-center text-heading-18-bd text-neutral-900">{title}</p>}
      {rightIcon ?? <div className="w-7 shrink-0" />}
    </div>
  );
}
