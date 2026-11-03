import { useEffect, useRef } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

import ErrorModal from "@/components/common/ErrorModal";
import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { isBriefingVisible } from "@/lib/briefingApi";
import { DEFAULT_ERROR_MESSAGE } from "@/lib/errorMessages";
import { useApiErrorModal } from "@/lib/useApiErrorModal";

import BriefingIssueCard from "./components/BriefingIssueCard";
import { useBriefing, useRecordBriefingView } from "./briefingQueries";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`rounded bg-neutral-100 ${className}`} />
  );
}

// 오늘의 브리핑 화면 (Figma 런칭 전 수정 > 브리핑, CONTENT-09)
// /briefing → 오늘의 브리핑, /briefing?date=YYYY-MM-DD → 해당 날짜 브리핑 (알림 딥링크)
export default function BriefingPage() {
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date");
  const briefingDate =
    dateParam && DATE_PATTERN.test(dateParam) ? dateParam : undefined;

  const {
    data: briefing,
    isLoading,
    isError,
    error,
    refetch,
  } = useBriefing(briefingDate);
  const { mutate: recordView } = useRecordBriefingView();
  const recordedDateRef = useRef<string | null>(null);

  const {
    error: modalError,
    showError,
    closeError,
    handlePrimaryAction,
  } = useApiErrorModal({ onRetry: () => void refetch() });

  useEffect(() => {
    setTopBar({ title: "오늘의 브리핑", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  useEffect(() => {
    if (!isError) return;
    queueMicrotask(() => showError(error));
  }, [isError, error, showError]);

  const isVisible = isBriefingVisible(briefing);

  // 공개된 브리핑을 열면 날짜별로 한 번 열람 기록을 남긴다
  useEffect(() => {
    if (!briefing || !isVisible) return;
    if (recordedDateRef.current === briefing.briefingDate) return;
    recordedDateRef.current = briefing.briefingDate;
    recordView(briefing.briefingDate);
  }, [briefing, isVisible, recordView]);

  if (isLoading) {
    return (
      <div
        aria-busy="true"
        aria-label="브리핑을 불러오는 중"
        className="flex flex-col gap-2 px-5 pt-3 pb-11"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            className="h-[260px] w-full rounded-[12px]"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorModal
        isOpen={!!modalError}
        info={modalError?.info ?? DEFAULT_ERROR_MESSAGE}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={closeError}
        onClose={closeError}
      />
    );
  }

  if (!briefing || !isVisible) {
    const isPreparing =
      briefing?.status === "GENERATING" || briefing?.status === "READY";
    return (
      <p
        role="status"
        className="text-body-14-md px-5 py-20 text-center break-keep text-neutral-400"
      >
        {isPreparing
          ? "브리핑을 준비하고 있어요. 잠시 후 다시 확인해주세요."
          : "오늘은 브리핑이 없어요."}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2 px-5 pt-3 pb-11">
      {briefing.issues.map((issue) => (
        <BriefingIssueCard key={issue.order} issue={issue} />
      ))}
      <p className="text-caption-12-md-tighter text-neutral-400">
        AI가 요약·작성한 콘텐츠입니다.
      </p>
    </div>
  );
}
