import muffinPlain from "@/assets/avatars/muffin-plain.png";
import muffinSprinkle from "@/assets/avatars/muffin-sprinkle.png";
import muffinCream from "@/assets/avatars/muffin-cream.png";
import muffinButter from "@/assets/avatars/muffin-butter.png";

interface CharacterAvatarProps {
  size?: "large" | "medium" | "small";
  variant?: "plain" | "sprinkle" | "cream" | "butter";
  alt?: string;
  className?: string;
}

// Figma: 머핀 캐릭터 이미지(캐릭터.png) 기반 — 원형 아님(일러스트).
// 사이즈 small 72×73 / medium 92×94 / large 103×105.
// 변형(플레인·스프링클·샘크림·버터빛 머핀)은 이미지로 구분.
const sizes = {
  large: "w-[103px] h-[105px]",
  medium: "w-[92px] h-[94px]",
  small: "w-[72px] h-[73px]",
};

const characterImages = {
  plain: muffinPlain,
  sprinkle: muffinSprinkle,
  cream: muffinCream,
  butter: muffinButter,
};

export default function CharacterAvatar({
  size = "medium",
  variant = "plain",
  alt = "머핀 캐릭터",
  className = "",
}: CharacterAvatarProps) {
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center ${className}`}
    >
      <img
        src={characterImages[variant]}
        alt={alt}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
