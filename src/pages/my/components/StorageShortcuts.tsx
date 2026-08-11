import bookmarkIcon from "@/assets/icon-24px/bookmark-line-gray2.svg";
import wordIcon from "@/assets/icon-20px/word.svg";
import brainIcon from "@/assets/icon-20px/brain.svg";

interface StorageShortcutsProps {
  onNavigate: (menu: "news" | "word" | "quiz") => void;
}

const SHORTCUTS = [
  { key: "news", label: "스크랩한 뉴스", icon: bookmarkIcon },
  { key: "word", label: "저장한 용어", icon: wordIcon },
  { key: "quiz", label: "퀴즈 복습", icon: brainIcon },
] as const;

// Figma 학습 저장소: 카드 안 3개 진입 버튼, 세로 구분선
export default function StorageShortcuts({
  onNavigate,
}: StorageShortcutsProps) {
  return (
    <div className="flex w-full rounded-[16px] border border-neutral-100 bg-white py-5">
      {SHORTCUTS.map((shortcut, index) => (
        <button
          key={shortcut.key}
          type="button"
          onClick={() => onNavigate(shortcut.key)}
          className={`flex flex-1 flex-col items-center gap-2 ${
            index > 0 ? "border-l border-neutral-100" : ""
          }`}
        >
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-neutral-50">
            <img
              src={shortcut.icon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5"
              draggable={false}
            />
          </span>
          <span className="text-body-14-md text-neutral-900">
            {shortcut.label}
          </span>
        </button>
      ))}
    </div>
  );
}
