interface MuffinVideoProps {
  src: string;
  className?: string;
  ariaLabel?: string;
}

// 머핀 캐릭터 mp4 애니메이션.
// - iOS 자동재생 조건: muted + playsInline 필수 (없으면 재생 안 되거나 전체화면으로 뜸)
// - mp4는 투명 배경이 없다. 영상 배경은 모두 순수 흰색(#FFFFFF)으로 맞춰 두었고 (#335),
//   곱하기(multiply)로 섞어 흰 배경·그라데이션 배경 어디서든 네모가 보이지 않게 한다 (#333)
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
      className={`mix-blend-multiply ${className}`}
    />
  );
}
