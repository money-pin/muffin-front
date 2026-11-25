interface MuffinVideoProps {
  src: string;
  className?: string;
  ariaLabel?: string;
}

// 머핀 캐릭터 mp4 애니메이션.
// - iOS 자동재생 조건: muted + playsInline 필수 (없으면 재생 안 되거나 전체화면으로 뜸)
// - mp4는 투명 배경이 없다. 영상 배경(#FDFDFD)이 화면 배경과 달라 네모가 보이므로,
//   살짝 밝혀 흰색으로 만든 뒤 곱하기(multiply)로 섞어 흰 배경·그라데이션 배경에 묻히게 한다 (#333)
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
      className={`mix-blend-multiply brightness-[1.02] ${className}`}
    />
  );
}
