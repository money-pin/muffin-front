import { apiRequest } from "@/lib/api";

import type {
  ConfirmInvestmentRequest,
  ConfirmInvestmentResult,
  InvestmentSectorsResult,
  TodayInvestmentResult,
} from "@/pages/invest/trade/types/invest";

export function getInvestmentSectors() {
  return apiRequest<InvestmentSectorsResult>("/api/sectors", {
    method: "GET",
    auth: true,
  });
}

export function getTodayInvestment() {
  return apiRequest<TodayInvestmentResult>("/api/investments/today", {
    method: "GET",
    auth: true,
  });
}

export function confirmInvestment(body: ConfirmInvestmentRequest) {
  return apiRequest<ConfirmInvestmentResult>("/api/investments", {
    method: "POST",
    body,
    auth: true,
  });
}

export function updateInvestment(body: ConfirmInvestmentRequest) {
  return apiRequest<ConfirmInvestmentResult>("/api/investments/today", {
    method: "PATCH",
    body,
    auth: true,
  });
}