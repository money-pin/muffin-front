import { useQuery } from "@tanstack/react-query";

import {
  getMyHome,
  getNotificationSettings,
  getRecentNews,
  getSavedTerms,
  getScraps,
} from "./mypageApi";

export const mypageQueryKeys = {
  all: ["mypage"] as const,
  home: () => [...mypageQueryKeys.all, "home"] as const,
  scraps: () => [...mypageQueryKeys.all, "scraps"] as const,
  recentNews: () => [...mypageQueryKeys.all, "recent-news"] as const,
  savedTerms: () => [...mypageQueryKeys.all, "saved-terms"] as const,
  notifications: () => [...mypageQueryKeys.all, "notifications"] as const,
};

// 홈 프로필(닉네임 등) 조회. 홈·마이가 같은 캐시를 공유해 닉네임 깜빡임을 막는다.
export function useMyHomeQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.home(),
    queryFn: getMyHome,
    retry: false,
  });
}

// 스크랩한 뉴스 목록 (정렬은 클라이언트에서 처리하므로 첫 페이지를 넉넉히 조회)
export function useScrapsQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.scraps(),
    queryFn: () => getScraps({ size: 50 }),
    retry: false,
  });
}

// 최근 읽은 뉴스 목록 (정렬은 클라이언트에서 처리하므로 첫 페이지를 넉넉히 조회)
export function useRecentNewsQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.recentNews(),
    queryFn: () => getRecentNews({ size: 50 }),
    retry: false,
  });
}

// 저장한 용어 목록
export function useSavedTermsQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.savedTerms(),
    queryFn: () => getSavedTerms({ size: 50 }),
    retry: false,
  });
}

// 알림 설정
export function useNotificationSettingsQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.notifications(),
    queryFn: getNotificationSettings,
    retry: false,
  });
}
