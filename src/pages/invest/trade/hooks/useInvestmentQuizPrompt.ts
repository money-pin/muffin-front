import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getTodayQuiz } from "@/pages/quiz/api/quizApi";
import { quizQueryKeys } from "@/pages/quiz/api/queries";
import { getKstDateKey } from "@/pages/invest/trade/utils/investmentDate";
import {
  getInvestmentQuizPromptVariant,
  shouldCheckInvestmentQuiz,
  type InvestmentCompletion,
  type InvestmentQuizPromptVariant,
} from "@/pages/invest/trade/utils/investmentQuizPrompt";

const MAX_PROMPT_DELAY_MS = 5000;

// 완료 모달 확인 시에만 조회한다. 미공개·조회 실패는 투자 성공 흐름을 막지 않는다.
export function useInvestmentQuizPrompt(enabled: boolean) {
  const queryClient = useQueryClient();
  const [variant, setVariant] = useState<InvestmentQuizPromptVariant | null>(
    null,
  );
  const handledCompletion = useRef<InvestmentCompletion | null>(null);
  const requestVersion = useRef(0);
  const lifecycleRef = useRef({ active: false });

  const dismiss = useCallback(() => {
    requestVersion.current++;
    setVariant(null);
  }, []);

  useEffect(() => {
    const lifecycle = { active: enabled };
    lifecycleRef.current = lifecycle;
    if (!enabled) {
      queueMicrotask(() => {
        if (lifecycleRef.current === lifecycle) setVariant(null);
      });
    }
    return () => {
      lifecycle.active = false;
    };
  }, [enabled]);

  const showAfterCompletion = async (
    completion: InvestmentCompletion | null,
  ) => {
    const lifecycle = lifecycleRef.current;
    if (
      !completion ||
      !lifecycle.active ||
      !shouldCheckInvestmentQuiz(completion, getKstDateKey(new Date())) ||
      handledCompletion.current === completion
    )
      return;
    handledCompletion.current = completion;
    const version = ++requestVersion.current;
    const startedAt = Date.now();
    try {
      // 이전 퀴즈 캐시를 근거로 안내하지 않도록 최신 완료 여부를 확인한다.
      const quiz = await queryClient.fetchQuery({
        queryKey: quizQueryKeys.today(),
        queryFn: getTodayQuiz,
        staleTime: 0,
        retry: false,
        networkMode: "always",
      });
      if (
        !lifecycle.active ||
        requestVersion.current !== version ||
        Date.now() - startedAt > MAX_PROMPT_DELAY_MS ||
        completion.dateKey !== getKstDateKey(new Date())
      )
        return;
      setVariant(getInvestmentQuizPromptVariant(quiz));
    } catch {
      // 선택적 안내다. 오류 팝업이나 미완료 추측으로 투자 완료 흐름을 방해하지 않는다.
    }
  };

  return { variant, dismiss, showAfterCompletion };
}
