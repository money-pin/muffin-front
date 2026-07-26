import Button from "@/components/common/Button";
import CharacterAvatar from "@/components/common/CharacterAvatar";
import { useCharacter } from "@/lib/character";

interface QuizIntroProps {
  nickname: string;
  onStart: () => void;
  onLater: () => void;
}

// Figma 퀴즈 인트로: 캐릭터 + 인사 문구 + 시작/나중에 버튼
export default function QuizIntro({
  nickname,
  onStart,
  onLater,
}: QuizIntroProps) {
  const character = useCharacter();

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col px-5 pb-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <CharacterAvatar size="large" variant={character} />
        <p className="text-heading-20-bd text-center whitespace-pre-line text-neutral-900">
          {`${nickname}님, 오늘 구운 뉴스들로\n반죽을 만들어볼까요?`}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onStart}>퀴즈 시작하기</Button>
        <button
          type="button"
          onClick={onLater}
          className="text-body-16-bd-tighter flex h-[52px] w-full items-center justify-center rounded-[12px] bg-neutral-50 text-neutral-400"
        >
          나중에 하기
        </button>
      </div>
    </div>
  );
}
