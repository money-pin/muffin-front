import newscardEconomy from "@/assets/newscard/newscard-economy.png";

export interface TermDefinition {
  term: string;
  definition: string;
}

export interface KnowledgeCard {
  id: number;
  title: string;
  paragraphs: {
    text: string;
    highlights?: string[];
  }[];
}

export interface NewsDetailItem {
  id: number;
  title: string;
  category: string;
  date: string;
  imageType: "economy" | "IT" | "world";
  imageUrl: string;
  originalUrl: string;
  reactions: {
    positive: string[];
    negative: string[];
  };
  body: string[];
  terms: Record<string, TermDefinition>; // 📌 용어 데이터 추가
  knowledgeCards: KnowledgeCard[];
}

export const NEWS_DETAIL_MOCK_DATA: Record<number, NewsDetailItem> = {
  1: {
    id: 1,
    title: "엔비디아 실적 발표, 국내 반도체 ETF에도 훈풍 부나?",
    category: "경제",
    date: "2026-05-08",
    imageType: "economy",
    imageUrl: newscardEconomy,
    originalUrl: "https://example.com",
    reactions: {
      positive: ["코인", "반도체", "테크", "에너지"],
      negative: ["바이오"],
    },
    body: [
      "엔비디아의 성공은 마치 금광을 캔 사람보다 곡괭이를 판 상인이 더 큰 돈을 벌었던 골드러시와 비슷해요. AI라는 금광을 캐려는 기업들이 엔비디아의 칩(곡괭이)을 사느라 줄을 서고 있죠.",
      "이 열기는 한국의 반도체 ETF에도 영향을 주어, 마치 옆가게도 덩달아 손님이 늘어나는 것처럼 함께 상승하고 있어요. {양적완화}가 지속되면 이런 흐름은 더 강해질 수 있답니다.",
    ],
    // 📌 용어 사전 데이터 정의
    terms: {
      양적완화: {
        term: "양적완화",
        definition: "중앙은행이 시중에 돈을 더 많이 풀어서 경제를 활성화하는 정책",
      },
    },
    knowledgeCards: [
      {
        id: 1,
        title: "왜 엔비디아를 '곡괭이 상인'이라고 부를까요? (곡괭이와 삽 전략)",
        paragraphs: [
          {
            text: "19세기 미국에서 금광 열풍(골드러시)이 불었을 때, 정작 금을 캐러 간 사람보다 돈을 더 많이 번 사람들은 곡괭이와 삽, 그리고 리바이스 청바지를 판 상인들이었어요.",
          },
          {
            text: "지금의 AI 열풍도 똑같아요. 구글이나 마이크로소프트 같은 기업들이 AI라는 금광을 캐려고 경쟁할 때, 그들에게 반드시 필요한 핵심 부품(GPU)을 파는 엔비디아가 가장 확실한 수익을 챙기고 있는 거죠. 이렇게 어떤 산업이 유행할 때 그에 꼭 필요한 '도구'를 파는 기업에 투자하는 걸 '곡괭이 전략'이라고 해요.",
          },
        ],
      },
      {
        id: 2,
        title: "옆 가게(한국 반도체)까지 손님이 넘치는 이유 (HBM과 밸류체인)",
        paragraphs: [
          {
            text: "엔비디아가 잘 나가면 왜 우리나라 반도체 ETF도 오를까요? 엔비디아의 AI 칩은 혼자서 작동하지 않거든요. 그 안에 들어가는 아주 빠른 메모리 반도체인 HBM(고대역폭 메모리)은 우리나라의 SK하이닉스와 삼성전자가 전 세계에서 가장 잘 만들어요.",
          },
          {
            text: "즉, 엔비디아(본점)가 주문을 감당 못 할 정도로 잘 되면, 부품을 대주는 한국 기업(협력점)들도 덩달아 바빠지는 구조예요. 그래서 '반도체 ETF'라는 바구니 안에 두 나라의 기업들이 끈끈하게 연결되어 있는 거랍니다.",
          },
        ],
      },
      {
        id: 3,
        title: "양적완화, 시장에 '돈의 비'가 내리는 것",
        paragraphs: [
          {
            text: "'양적완화'는 쉽게 말해 국가가 시장에 돈을 확 푸는 것을 말해요. 가뭄이 든 논에 물을 대듯, 나라에서 돈을 많이 찍어 세상에 흘려보내면 사람들은 그 돈으로 소비도 하고 투자도 하게 되죠. 시장에 돈이 흔해지면 주식 같은 자산의 가격이 오르기 쉬운 환경이 만들어져요.",
          },
          {
            text: "특히 엔비디아처럼 성장 가능성이 큰 기술주들은 이런 '돈의 비'가 내릴 때 더 쑥쑥 자라는 경향이 있답니다.",
          },
        ],
      },
    ],
  },
};