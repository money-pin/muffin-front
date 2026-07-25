import { useState } from "react";
import wordSaveActiveIcon from "@/assets/icon-28px/wordsave-active.svg";
import SortDropdown from "@/components/common/SortDropdown";
import { SAVED_WORDS_MOCK_DATA, type SavedWord } from "../savedWordsData";

type SortValue = "korean" | "recent";

export default function SavedWordsTab() {
  const [sortValue, setSortValue] = useState<SortValue>("korean");
  const [words, setWords] = useState<SavedWord[]>(SAVED_WORDS_MOCK_DATA);

  const sortOptions = [
    { value: "korean", label: "가나다순" },
    { value: "recent", label: "최근 저장순" },
  ] as const;

  const handleRemoveWord = (id: number) => {
    setWords((prev) => prev.filter((word) => word.id !== id));
  };

  const sortedWords = [...words].sort((a, b) => {
    if (sortValue === "korean") {
      return a.term.localeCompare(b.term, "ko");
    }
    if (sortValue === "recent") {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    }
    return 0;
  });

  return (
    <div className="flex w-full flex-col mt-0 pt-0">
      {/* 상단 정렬 드롭다운 영역 */}
      <div className="flex w-full justify-end px-5 py-2 mt-0">
        <SortDropdown
          options={sortOptions}
          value={sortValue}
          onChange={(val) => setSortValue(val as SortValue)}
          align="end"
        />
      </div>

      {/* 저장된 용어 리스트 영역 */}
      <section className="flex flex-col gap-[12px] px-5 mt-1 pb-10">
        {sortedWords.map((item) => (
          <div
            key={item.id}
            className="flex w-full flex-col rounded-[16px] border border-neutral-100 bg-white p-[16px] gap-[11px] shadow-sm"
          >
            {/* 상단: 용어 제목 + 주황색 북마크 아이콘 */}
            <div className="flex items-center justify-between">
              {/* 📌 디자인 토큰 적용: text-primary */}
              <h3 className="text-[16px] font-bold leading-[160%] text-primary">
                {item.term}
              </h3>
              <button
                type="button"
                onClick={() => handleRemoveWord(item.id)}
                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center"
                aria-label="용어 저장 해제"
              >
                <img
                  src={wordSaveActiveIcon}
                  alt="저장됨"
                  className="h-full w-full object-contain"
                />
              </button>
            </div>

            {/* 하단: 용어 설명 텍스트 */}
            <p className="text-[16px] font-normal leading-[160%] text-neutral-900 word-keep-all break-keep">
              {item.description}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}