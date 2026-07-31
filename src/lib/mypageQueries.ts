import { useQuery } from "@tanstack/react-query";

import { getMyHome } from "./mypageApi";

export const mypageQueryKeys = {
  all: ["mypage"] as const,
  home: () => [...mypageQueryKeys.all, "home"] as const,
};

// 홈 프로필(닉네임 등) 조회. 홈·마이가 같은 캐시를 공유해 닉네임 깜빡임을 막는다.
export function useMyHomeQuery() {
  return useQuery({
    queryKey: mypageQueryKeys.home(),
    queryFn: getMyHome,
    retry: false,
  });
}
