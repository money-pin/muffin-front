import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

export interface MyRecentNews {
  id: number;
  title: string;
  image: string;
  bookmarked: boolean;
}

// 화면 구현 확인용 임시 값 — 실제 데이터는 추후 API 연동 시 반영
// 캐릭터는 온보딩에서 정해진 값(@/lib/character)을 사용하므로 여기 두지 않음
export const MY_USER = {
  nickname: "예은",
  streakDays: 5,
};

// 일~토 순서, true = 학습 완료한 요일 (오늘은 목요일 가정)
export const MY_WEEK_CHECKS = [true, true, true, true, true, false, false];
export const MY_TODAY_INDEX = 4;

export const MY_RECENT_NEWS: MyRecentNews[] = [
  {
    id: 1,
    title: "엔비디아 실적 발표, 국내 반도체 ETF 급등",
    image: newscardEconomy,
    bookmarked: true,
  },
  {
    id: 2,
    title: "테크 기업 실적 발표 앞두고 관심",
    image: newscardIT,
    bookmarked: true,
  },
  {
    id: 3,
    title: "코인 시장 변동성 확대",
    image: newscardWorld,
    bookmarked: false,
  },
];

// 닉네임 중복 검사 목데이터 — API 연동 전 임시
export const TAKEN_NICKNAMES = ["투자 초보", "머핀"];

export const APP_VERSION = "1.0.0";
