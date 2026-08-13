import { useState } from "react";

import CharacterAvatar from "@/components/common/CharacterAvatar";
import type { CharacterVariant } from "@/lib/character";
import type { HomeGreetingMessageGroups } from "@/pages/home/homeData";

interface CharacterGreetingProps {
  message: string;
  messageGroups: HomeGreetingMessageGroups;
  variant: CharacterVariant;
}

type MessageGroupKey = keyof HomeGreetingMessageGroups;

const MESSAGE_GROUP_KEYS: MessageGroupKey[] = [
  "news",
  "quiz",
  "investment",
  "stats",
  "character",
  "habit",
];

const INITIAL_MESSAGE_INDICES: Record<MessageGroupKey, number> = {
  news: 0,
  quiz: 0,
  investment: 0,
  stats: 0,
  character: 0,
  habit: 0,
};

function getNextMessageIndex(currentIndex: number, length: number) {
  if (length <= 1) return 0;

  return (currentIndex + 1 + Math.floor(Math.random() * (length - 1))) % length;
}

// Figma Character Info: 말풍선(170×40, 그림자) + 꼬리 + 머핀 캐릭터(large)
// 캐릭터는 서버(mypage/home) 값을 사용해 홈·마이가 항상 일치하도록 한다.
export default function CharacterGreeting({
  message,
  messageGroups,
  variant,
}: CharacterGreetingProps) {
  const [interactionCount, setInteractionCount] = useState(0);
  const [messageIndices, setMessageIndices] = useState(INITIAL_MESSAGE_INDICES);
  const getGroupMessage = (key: MessageGroupKey) =>
    messageGroups[key][messageIndices[key]] ?? messageGroups[key][0] ?? message;
  const messages = [
    message,
    getGroupMessage("news"),
    getGroupMessage("quiz"),
    getGroupMessage("investment"),
    message,
    getGroupMessage("stats"),
    getGroupMessage("character"),
    getGroupMessage("habit"),
  ];
  const currentMessage = messages[interactionCount];

  const showNextMessage = () => {
    if (interactionCount < messages.length - 1) {
      setInteractionCount((count) => count + 1);
      return;
    }

    setMessageIndices((currentIndices) =>
      MESSAGE_GROUP_KEYS.reduce(
        (nextIndices, key) => ({
          ...nextIndices,
          [key]: getNextMessageIndex(
            currentIndices[key],
            messageGroups[key].length,
          ),
        }),
        { ...currentIndices },
      ),
    );
    setInteractionCount(0);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        key={`message-${interactionCount}`}
        className="home-greeting-pop relative drop-shadow-[0px_1px_2.5px_rgba(0,0,0,0.14)]"
      >
        <div className="flex items-center justify-center rounded-[8px] bg-white px-4 py-2">
          <p className="text-body-14-md-tighter text-neutral-1000 whitespace-nowrap">
            {currentMessage}
          </p>
        </div>
        {/* 말풍선 꼬리: Figma Polygon(캐릭터 머리 위, 우측 치우침) */}
        <div className="absolute -bottom-[5px] left-[61%] h-[10px] w-[10px] rotate-45 bg-white" />
      </div>

      <button
        type="button"
        onClick={showNextMessage}
        aria-label="머핀의 다른 메시지 보기"
        className="focus-visible:outline-primary mt-[13px] rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <div
          key={`character-${interactionCount}`}
          className="home-character-bounce"
        >
          <CharacterAvatar size="large" variant={variant} />
        </div>
      </button>
    </div>
  );
}
