import { useMutation, useQuery } from "@tanstack/react-query";

import {
  confirmInvestment,
  getInvestmentSectors,
  getSectorGuide,
  getTodayInvestment,
  updateInvestment,
} from "@/pages/invest/trade/apis/investmentApi";

export const investmentQueryKeys = {
  all: ["investment"] as const,
  sectors: () => [...investmentQueryKeys.all, "sectors"] as const,
  sectorGuide: () => [...investmentQueryKeys.all, "sectorGuide"] as const,
  today: () => [...investmentQueryKeys.all, "today"] as const,
};

// 안내 화면이 열려 마운트될 때만 조회하며 투자 선택 상태와 분리한다.
export function useSectorGuideQuery() {
  return useQuery({
    queryKey: investmentQueryKeys.sectorGuide(),
    queryFn: getSectorGuide,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useInvestmentSectorsQuery() {
  return useQuery({
    queryKey: investmentQueryKeys.sectors(),
    queryFn: getInvestmentSectors,
    retry: false,
  });
}

export function useTodayInvestmentQuery() {
  return useQuery({
    queryKey: investmentQueryKeys.today(),
    queryFn: getTodayInvestment,
    retry: false,
    // InvestPage에서 포커스·탭 복귀 갱신을 처리한다.
    refetchOnWindowFocus: false,
  });
}

export function useConfirmInvestmentMutation() {
  return useMutation({
    mutationFn: confirmInvestment,
    // 오프라인 요청을 대기열에 남기지 않고 실패 안내 후 직접 재시도한다.
    networkMode: "always",
    retry: false,
  });
}

export function useUpdateInvestmentMutation() {
  return useMutation({
    mutationFn: updateInvestment,
    networkMode: "always",
    retry: false,
  });
}
