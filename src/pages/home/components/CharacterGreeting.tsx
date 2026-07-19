import CharacterAvatar from "@/components/common/CharacterAvatar";
import { useCharacter } from "@/lib/character";

interface CharacterGreetingProps {
  message: string;
}

// Figma Character Info: 말풍선(170×40, 그림자) + 꼬리 + 머핀 캐릭터(large)
// 캐릭터는 온보딩에서 정해진 값(홈·마이·퀴즈 공유)을 사용
export default function CharacterGreeting({ message }: CharacterGreetingProps) {
  const character = useCharacter();

  return (
    <div className="flex flex-col items-center">
      <div className="relative drop-shadow-[0px_1px_2.5px_rgba(0,0,0,0.14)]">
        <div className="flex items-center justify-center rounded-[8px] bg-white px-4 py-2">
          <p className="whitespace-nowrap text-body-14-md-tighter text-neutral-1000">
            {message}
          </p>
        </div>
        {/* 말풍선 꼬리: Figma Polygon(캐릭터 머리 위, 우측 치우침) */}
        <div className="absolute -bottom-[5px] left-[61%] h-[10px] w-[10px] rotate-45 bg-white" />
      </div>

      <CharacterAvatar size="large" variant={character} className="mt-[13px]" />
    </div>
  );
}
