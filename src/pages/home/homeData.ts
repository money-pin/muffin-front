// 홈 화면 정적 데이터.
// 캐릭터 인사말 문구(message)는 서버 응답에 해당 필드가 없어 정적으로 유지한다.

export interface HomeUser {
  nickname: string;
  streakDays: number;
  message: string;
}

export const HOME_USER: HomeUser = {
  nickname: "예은",
  streakDays: 5,
  message: "투자 성과가 아주 좋아요!",
};
