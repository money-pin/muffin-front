import { useMutation, useQuery } from "@tanstack/react-query";

import {
  confirmInvestment,
  getInvestmentSectors,
  getTodayInvestment,
  updateInvestment,
} from "@/pages/invest/trade/apis/investmentApi";

export const investmentQueryKeys = {
  all: ["investment"] as const,
  sectors: () => [...investmentQueryKeys.all, "sectors"] as const,
  today: () => [...investmentQueryKeys.all, "today"] as const,
};

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
  });
}

export function useConfirmInvestmentMutation() {
  return useMutation({
    mutationFn: confirmInvestment,
  });
}

export function useUpdateInvestmentMutation() {
  return useMutation({
    mutationFn: updateInvestment,
  });
}