import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import wordSaveActiveIcon from "@/assets/icon-28px/wordsave-active.svg";
import SortDropdown from "@/components/common/SortDropdown";
import type { SavedTermListResult } from "@/lib/mypageApi";
import { mypageQueryKeys, useSavedTermsQuery } from "@/lib/mypageQueries";
import { unsaveTerm } from "@/lib/newsApi";
import StorageEmptyState from "./StorageEmptyState";

type SortValue = "korean" | "recent";

const SORT_OPTIONS = [
  { value: "korean", label: "가나다순" },
  { value: "recent", label: "최근 저장순" },
] as const;

function StorageMessage({ children }: { children: string }) {
  return (
    <p className="text-body-14-md px-5 py-16 text-center text-neutral-400">
      {children}
    </p>
  );
}

export default function SavedWordsTab() {
  const [sortValue, setSortValue] = useState<SortValue>("korean");
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useSavedTermsQuery();
  const terms = data?.savedTerms ?? [];

  const { mutate: removeTerm } = useMutation({
    mutationFn: (termId: number) => unsaveTerm(termId),
    // 낙관적으로 목록에서 제거, 실패 시 재조회로 복구
    onMutate: (termId) => {
      queryClient.setQueryData<SavedTermListResult>(
        mypageQueryKeys.savedTerms(),
        (old) =>
          old
            ? {
                ...old,
                savedTerms: old.savedTerms.filter((t) => t.termId !== termId),
              }
            : old,
      );
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.savedTerms(),
      });
    },
  });

  const sortedTerms = [...terms].sort((a, b) => {
    if (sortValue === "recent") {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    }
    return a.term.localeCompare(b.term, "ko");
  });

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full justify-end px-5 py-2">
        <SortDropdown
          options={SORT_OPTIONS}
          value={sortValue}
          onChange={(val) => setSortValue(val as SortValue)}
          align="end"
        />
      </div>

      {isLoading ? (
        <StorageMessage>저장한 용어를 불러오는 중이에요.</StorageMessage>
      ) : isError ? (
        <StorageMessage>저장한 용어를 불러오지 못했어요.</StorageMessage>
      ) : sortedTerms.length === 0 ? (
        <StorageEmptyState
          title="아직 저장한 용어가 없어요."
          description="뉴스에서 궁금한 용어를 저장해보세요."
        />
      ) : (
        <section className="mt-1 flex flex-col gap-3 px-5 pb-10">
          {sortedTerms.map((item) => (
            <div
              key={item.termId}
              className="flex w-full flex-col gap-[11px] rounded-[12px] border border-neutral-100 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-body-16-bd-tighter text-primary min-w-0 flex-1 break-keep">
                  {item.term}
                </h3>
                <button
                  type="button"
                  onClick={() => removeTerm(item.termId)}
                  className="-mr-2 flex size-11 shrink-0 items-center justify-center"
                  aria-label="용어 저장 해제"
                >
                  <img
                    src={wordSaveActiveIcon}
                    alt="저장됨"
                    className="h-7 w-7 object-contain"
                  />
                </button>
              </div>

              <p className="text-body-16-rg-tighter break-keep text-neutral-900">
                {item.content}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
