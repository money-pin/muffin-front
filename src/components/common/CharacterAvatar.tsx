interface CharacterAvatarProps {
  size?: "large" | "medium" | "small";
  src?: string;
  alt?: string;
}

// Figma: 머핀 캐릭터 이미지(캐릭터.png) 기반 — 원형 아님(일러스트).
// 사이즈 small 72×73 / medium 92×94 / large 103×105.
// 변형(플레인·스프링클·샘크림·버터빛 머핀)은 이미지로 구분.
// ⚠️ 실제 PNG는 Figma export 막혀서 디자이너에게 캐릭터 에셋 받아야 함 → src로 주입.
const sizes = {
  large: "w-[103px] h-[105px]",
  medium: "w-[92px] h-[94px]",
  small: "w-[72px] h-[73px]",
};

export default function CharacterAvatar({ size = "medium", src, alt = "머핀 캐릭터" }: CharacterAvatarProps) {
  return (
    <div className={`${sizes[size]} flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <span className="text-5xl">🧁</span>
      )}
    </div>
  );
}
