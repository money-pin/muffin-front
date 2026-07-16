import CharacterAvatar from "@/components/common/CharacterAvatar";

interface MyProfileProps {
  nickname: string;
  characterVariant: "plain" | "sprinkle" | "cream" | "butter";
  characterLabel: string;
  onEditNickname: () => void;
}

// Figma 마이 프로필: 캐릭터 + 캐릭터 태그(하단 겹침) + 닉네임·연필 버튼
export default function MyProfile({
  nickname,
  characterVariant,
  characterLabel,
  onEditNickname,
}: MyProfileProps) {
  return (
    <section className="flex flex-col items-center">
      <div className="relative">
        <CharacterAvatar size="medium" variant={characterVariant} />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-secondary-100 px-1.5 py-0.5 text-caption-12-md text-secondary">
          {characterLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={onEditNickname}
        className="mt-3 flex items-center gap-1"
        aria-label="닉네임 변경"
      >
        <span className="text-heading-20-bd text-neutral-900">{nickname}</span>
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-neutral-400)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </button>
    </section>
  );
}
