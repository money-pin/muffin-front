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
        <CharacterAvatar size="large" variant={characterVariant} />
        <span className="bg-secondary-400 text-caption-12-bd absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[4px] px-1.5 py-0.5 whitespace-nowrap text-white">
          {characterLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={onEditNickname}
        className="mt-3 flex max-w-full items-center gap-1 px-5"
        aria-label="닉네임 변경"
      >
        <span className="text-heading-20-bd min-w-0 truncate text-neutral-900">
          {nickname}
        </span>
        <svg
          aria-hidden="true"
          className="shrink-0"
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
