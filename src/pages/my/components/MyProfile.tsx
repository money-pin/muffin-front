import CharacterAvatar from "@/components/common/CharacterAvatar";
import type { CharacterVariant } from "@/lib/character";
import pencilIcon from "@/assets/icon-20px/pencil.svg";

interface MyProfileProps {
  nickname: string;
  characterVariant: CharacterVariant;
  characterLabel: string;
  onEditNickname: () => void;
}

const CHARACTER_TAG_CLASS_MAP: Record<CharacterVariant, string> = {
  plain: "bg-character-plain-tag-bg text-character-plain-tag-text",
  butter: "bg-character-butter-tag-bg text-character-butter-tag-text",
  sprinkle: "bg-character-sprinkle-tag-bg text-character-sprinkle-tag-text",
  cream: "bg-character-cream-tag-bg text-character-cream-tag-text",
};

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
        <span
          className={`text-caption-12-md-tighter absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[4px] px-1.5 py-0.5 whitespace-nowrap ${CHARACTER_TAG_CLASS_MAP[characterVariant]}`}
        >
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
        <img
          src={pencilIcon}
          alt=""
          aria-hidden="true"
          className="size-5 shrink-0"
          draggable={false}
        />
      </button>
    </section>
  );
}
