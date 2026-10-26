import type { InvestAssetId } from "@/pages/invest/trade/types/invest";

interface SectorProduct {
  name: string;
  description: string;
  code: string;
}

// Figma 안내 문구. 서버 종목 정보가 제공되면 이 표시 데이터만 교체한다.
export const SECTOR_PRODUCTS = {
  deposit: {
    name: "KODEX CD금리액티브(합성)",
    description:
      "국내 단기금리의 흐름을 따라가요. 가격 변동이 비교적 작아 여유 자금을 안정적으로 운용할 때 살펴볼 수 있어요.",
    code: "459580",
  },
  gold: {
    name: "KODEX 골드선물(H)",
    description:
      "글로벌 금 선물 가격을 따라가요. 주식 시장이 불안하거나 물가가 오를 때 자산을 분산하는 용도로 활용할 수 있어요.",
    code: "132030",
  },
  dollar: {
    name: "KODEX 미국달러선물",
    description:
      "달러와 원화의 환율 움직임을 따라가요. 달러 가치가 원화보다 강해질 때 수익 기회를 기대할 수 있어요.",
    code: "261240",
  },
  bonds: {
    name: "KIWOOM 국고채10년",
    description:
      "우리나라의 10년 만기 국고채에 투자해요. 일반적으로 시장 금리가 내려가면 채권 가격은 오르는 경향이 있어요.",
    code: "148070",
  },
  // 코인 종목 정보는 확정 전까지 공란으로 둔다.
  coin: { name: "", description: "", code: "" },
  biotech: {
    name: "TIGER 미국나스닥바이오",
    description:
      "미국 나스닥에 상장된 바이오·제약 기업에 투자해요. 신약 개발과 헬스케어 기술의 성장 가능성에 주목해요.",
    code: "203780",
  },
  semiconductor: {
    name: "TIGER 미국필라델피아반도체나스닥",
    description:
      "미국의 주요 반도체 설계·제조 기업에 투자해요. AI와 데이터센터 확대로 성장하는 반도체 산업을 따라가요.",
    code: "381180",
  },
  technology: {
    // TODO: Figma에 예금 상품명이 중복되어 있어 기획·디자인 확인 후 수정.
    name: "KODEX CD금리액티브(합성)",
    description:
      "미국을 대표하는 대형 기술 기업 10곳에 집중 투자해요. 빅테크 산업의 성장 흐름을 한 번에 담을 수 있어요.",
    code: "381170",
  },
  energy: {
    name: "KODEX 미국S&P500에너지(합성)",
    description:
      "미국의 대표 에너지 기업에 투자해요. 국제 유가와 에너지 수요 변화에 영향을 받는 섹터예요.",
    code: "218420",
  },
  financials: {
    name: "KODEX 미국S&P500금융",
    description:
      "미국의 은행·보험·금융서비스 기업에 투자해요. 금리와 경기 변화가 금융사 실적에 어떤 영향을 주는지 살펴볼 수 있어요.",
    code: "453650",
  },
  automobile: {
    name: "KODEX 미국S&P500모빌리티S&P",
    description:
      "미국의 자동차와 모빌리티 관련 기업에 투자해요. 전기차와 미래 이동 수단의 성장 흐름을 살펴볼 수 있어요.",
    code: "390400",
  },
  defense: {
    name: "TIGER 미국방산TOP10",
    description:
      "미국의 주요 방산 기업 10곳에 집중 투자해요. 국방 예산과 글로벌 안보 수요의 영향을 받는 섹터예요.",
    code: "494840",
  },
} satisfies Record<InvestAssetId, SectorProduct>;
