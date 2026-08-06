interface MuffinVideoProps {
  src: string;
  className?: string;
  ariaLabel?: string;
}

// 머핀 캐릭터 mp4 애니메이션.
// - iOS 자동재생 조건: muted + playsInline 필수 (없으면 재생 안 되거나 전체화면으로 뜸)
// - mp4는 투명 배경이 없으므로 흰 배경(디자인상 흰색) 화면 위에서만 사용
export default function MuffinVideo({
  src,
  className = "",
  ariaLabel = "머핀 캐릭터 애니메이션",
}: MuffinVideoProps) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      aria-label={ariaLabel}
      className={className}
    />
  );
}
