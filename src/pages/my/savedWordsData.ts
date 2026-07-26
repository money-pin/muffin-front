// 🔴 기존: interface SavedWord
// 🟢 수정: export interface SavedWord (export 추가!)
export interface SavedWord {
  id: number;
  term: string;
  description: string;
  savedAt: string;
}

export const SAVED_WORDS_MOCK_DATA: SavedWord[] = [
  {
    id: 1,
    term: "양적완화",
    description: "중앙은행이 시중에 돈을 더 많이 풀어서 경제를 활성화하는 정책",
    savedAt: "2026-05-01",
  },
  {
    id: 2,
    term: "ETF",
    description:
      "상장지수펀드. 특정 지수의 움직임을 추종하는 인덱스 펀드를 거래소에 상장시켜 투자자들이 주식처럼 편리하게 거래할 수 있도록 만든 상품",
    savedAt: "2026-05-02",
  },
  {
    id: 3,
    term: "PBR",
    description:
      "주가순자산비율. 주가를 주당순자산(BPS)으로 나누어 얻은 값으로, 자산 가치 대비 주가 수준을 평가하는 지표",
    savedAt: "2026-05-03",
  },
  {
    id: 4,
    term: "ROE",
    description:
      "자기자본이익률. 기업이 자기자본을 활용해 1년간 얼마의 이익을 냈는지를 나타내는 지표",
    savedAt: "2026-05-04",
  },
];
