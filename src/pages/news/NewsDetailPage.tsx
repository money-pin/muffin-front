import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTopButton from "./components/ScrollToTopButton";
import bookmarkLine from "@/assets/icon-24px/bookmark-line-gray5.svg";
import bookmarkFill from "@/assets/icon-24px/bookmark-fill.svg";

import newscardEconomy from "@/assets/newscard/newscard-economy.png";
import newscardIT from "@/assets/newscard/newscard-IT.png";
import newscardWorld from "@/assets/newscard/newscard-world.png";

const NEWS_IMAGES = {
  economy: newscardEconomy,
  IT: newscardIT,
  world: newscardWorld,
} as const;

export default function NewsDetailPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const newsData = {
    title: "엔비디아 실적 발표, 국내 반도체 ETF에도 훈풍 부나?",
    category: "경제",
    date: "2026-05-08",
    imageType: "economy" as const,
    reactions: {
      positive: ["코인", "반도체", "테크", "에너지"],
      negative: ["바이오"],
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (containerRef.current.scrollTop > 300) {
      setShowScrollBtn(true);
    } else {
      setShowScrollBtn(false);
    }
  };

  const handleScrollToTop = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-[390px] h-[844px] bg-[#F5F5F5] flex flex-col text-black overflow-hidden relative mx-auto">
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full overflow-y-auto relative"
      >
        <div className="w-full h-[2850px] bg-white flex flex-col relative">
          
          {/* HeaderContent 영역 */}
          <header className="absolute top-[12px] left-0 w-full px-[20px] flex items-center justify-between z-40 bg-transparent">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-[28px] h-[28px] flex items-center justify-center shrink-0"
              aria-label="뒤로가기"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#FFFFFF" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 22l-8-8 8-8" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setIsBookmarked((prev) => !prev)}
              className="w-[24px] h-[24px] flex items-center justify-center shrink-0"
              aria-label="북마크"
            >
              <img
                src={isBookmarked ? bookmarkFill : bookmarkLine}
                alt=""
                className="w-full h-full object-contain"
              />
            </button>
          </header>

          {/* ArticleContainer 영역 */}
          <div className="w-full flex flex-col relative">
            
            {/* ArticleImage 영역 */}
            <div className="w-[390px] h-[225px] relative overflow-hidden shrink-0 bg-neutral-900">
              <div className="absolute inset-0 bg-black/60 z-10" />
              <img
                src={NEWS_IMAGES[newsData.imageType]}
                alt=""
                className="w-full h-full object-cover relative z-0"
                draggable={false}
              />
            </div>

            {/* ArticleInfoContainer 영역 */}
            <div className="absolute top-[122px] left-0 w-full px-[20px] flex flex-col gap-[8px] z-20">
              <h1 className="w-[350px] h-[56px] text-[20px] font-medium text-white leading-[140%] line-clamp-2">
                {newsData.title}
              </h1>

              <div className="flex items-center gap-[8px] h-[22px]">
                <span className="inline-flex items-center justify-center bg-[#FFF6E8] text-[#F46C0E] px-[6px] py-[4px] rounded-[4px] text-[12px] font-medium leading-[160%]">
                  {newsData.category}
                </span>
                <span className="text-[12px] font-medium text-[#E2E2E2] leading-[160%] h-[19px] flex items-center">
                  {newsData.date}
                </span>
              </div>
            </div>

            {/* ArticleBodyContainer 영역 */}
            <div className="w-full px-[20px] pt-[24px] pb-[20px] flex flex-col gap-[8px] bg-white">
              <div className="w-[350px] text-[16px] font-normal text-[#1B1B1B] leading-[160%] text-justify">
                <p className="mb-4">
                  엔비디아의 성공은 마치 금광을 캔 사람보다 곡괭이를 판 상인이 더 큰 돈을 벌었던 골드러시와 비슷해요. AI라는 금광을 캐려는 기업들이 엔비디아의 칩(곡괭이)을 사느라 줄을 서고 있죠.
                </p>
                <p>
                  이 열기는 한국의 반도체 ETF에도 영향을 주어, 마치 옆가게도 덩달아 손님이 늘어나는 것처럼 함께 상승하고 있어요.{" "}
                  <span className="text-[#F46C0E] font-medium underline underline-offset-2 cursor-pointer">
                    양적완화
                  </span>
                  가 지속되면 이런 흐름은 더 강해질 수 있답니다.
                </p>
              </div>

              {/* Link 영역 (원문 뉴스 보기 버튼) */}
              <a 
                href="https://example.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex justify-end items-center h-[24px] cursor-pointer"
              >
                <div className="flex items-center gap-[8px] h-[24px]">
                  <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M14 10V14H2V2H6" stroke="#999999" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 2H14V6" stroke="#999999" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 10L14 2" stroke="#999999" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="w-auto h-[26px] text-[16px] font-medium text-[#999999] leading-[160%] flex items-center justify-end whitespace-nowrap">
                    원문 뉴스 보기
                  </span>
                </div>
              </a>

            </div>

            {/* CommentsContainer 영역 */}
            <div className="w-full px-[20px] pb-[20px] flex flex-col gap-[8px] bg-white">
              
              {/* 긍정 반응 컨테이너 박스 */}
              <div className="w-[350px] p-[16px] bg-white border border-neutral-100 rounded-[16px] flex flex-col gap-[12px]">
                <div className="flex items-center gap-[4px] h-[26px] text-[16px] font-medium text-[#1B1B1B] leading-[160%]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <path d="M2 13L6 9L9 12L14 6M14 6H10M14 6V10" stroke="#F43F5E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[#F43F5E] font-bold">긍정</span>
                  <span>반응이 나타나요!</span>
                </div>
                
                <div className="flex flex-wrap gap-[4px]">
                  {newsData.reactions.positive.map((tag) => (
                    <span 
                      key={tag} 
                      className="h-[22px] px-[8px] py-[4px] bg-[#F5F5F5] text-[#999999] text-[12px] font-medium rounded-[4px] flex items-center justify-center"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 부정 반응 컨테이너 박스 */}
              <div className="w-[350px] p-[16px] bg-white border border-neutral-100 rounded-[16px] flex flex-col gap-[12px]">
                <div className="flex items-center gap-[4px] h-[26px] text-[16px] font-medium text-[#1B1B1B] leading-[160%]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                    <path d="M2 5L6 9L9 6L14 12M14 12H10M14 12V8" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[#3B82F6] font-bold">부정</span>
                  <span>반응이 나타나요!</span>
                </div>
                
                <div className="flex flex-wrap gap-[4px]">
                  {newsData.reactions.negative.map((tag) => (
                    <span 
                      key={tag} 
                      className="h-[22px] px-[8px] py-[4px] bg-[#F5F5F5] text-[#999999] text-[12px] font-medium rounded-[4px] flex items-center justify-center"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* EconomicsContentContainer 영역 (1, 2, 3번 상식 카드 결합부) */}
            <div className="w-full px-[20px] pb-[32px] flex flex-col items-center gap-[16px] bg-white">
              
              {/* 1번 경제 상식 카드 */}
              <div className="w-[348px] p-[20px] bg-white border border-neutral-100 rounded-[16px] shadow-sm flex flex-col gap-[16px]">
                <div className="flex items-start gap-[4px] w-full">
                  <div className="text-[16px] font-bold text-[#1B1B1B] leading-[160%] shrink-0 pt-[1px]">
                    1.
                  </div>
                  <h2 className="text-[16px] font-bold text-[#1B1B1B] leading-[160%] text-left flex-1">
                    왜 엔비디아를 &apos;곡괭이 상인&apos;이라고 부를까요? (곡괭이와 삽 전략)
                  </h2>
                </div>

                <div className="w-full text-[16px] font-normal text-[#1B1B1B] leading-[160%] text-justify flex flex-col gap-4">
                  <p>
                    19세기 미국에서 <span className="font-bold text-[#535353]">금광 열풍(골드러시)</span>이 불었을 때, 정작 금을 캐러 간 사람보다 돈을 더 많이 번 사람들은 곡괭이와 삽, 그리고 리바이스 청바지를 판 상인들이었어요.
                  </p>
                  <p>
                    지금의 <span className="font-bold">AI 열풍</span>도 똑같아요. 구글이나 마이크로소프트 같은 기업들이 AI라는 금광을 캐려고 경쟁할 때, 그들에게 반드시 필요한 핵심 부품(GPU)을 파는 엔비디아가 가장 확실한 수익을 챙기고 있는 거죠. 이렇게 어떤 산업이 유행할 때 그에 꼭 필요한 &apos;도구&apos;를 파는 기업에 투자하는 걸 <span className="font-bold text-[#535353]">&apos;곡괭이 전략&apos;</span>이라고 해요.
                  </p>
                </div>
              </div>

              {/* 2번 경제 상식 카드 */}
              <div className="w-[348px] p-[20px] bg-white border border-neutral-100 rounded-[16px] shadow-sm flex flex-col gap-[16px]">
                <div className="flex items-start gap-[4px] w-full">
                  <div className="text-[16px] font-bold text-[#1B1B1B] leading-[160%] shrink-0 pt-[1px]">
                    2.
                  </div>
                  <h2 className="text-[16px] font-bold text-[#1B1B1B] leading-[160%] text-left flex-1">
                    옆 가게(한국 반도체)까지 손님이 넘치는 이유 (HBM과 밸류체인)
                  </h2>
                </div>

                <div className="w-full text-[16px] font-normal text-[#1B1B1B] leading-[160%] text-justify flex flex-col gap-4">
                  <p>
                    엔비디아가 잘 나가면 왜 우리나라 반도체 ETF도 오를까요? 엔비디아의 AI 칩은 혼자서 작동하지 않거든요. 그 안에 들어가는 아주 빠른 메모리 반도체인 <span className="font-bold">HBM(고대역폭 메모리)</span>은 우리나라의 SK하이닉스와 삼성전자가 전 세계에서 가장 잘 만들어요.
                  </p>
                  <p>
                    즉, <span className="font-bold">엔비디아(본점)</span>가 주문을 감당 못 할 정도로 잘 되면, 부품을 대주는 <span className="font-bold text-[#535353]">한국 기업(협력점)</span>들도 덩달아 바빠지는 구조예요. 그래서 &apos;반도체 ETF&apos;라는 바구니 안에 두 나라의 기업들이 끈끈하게 연결되어 있는 거랍니다.
                  </p>
                </div>
              </div>

              {/* 3번 경제 상식 카드 (새로 요청하신 시안 전면 반영) */}
              <div className="w-[348px] p-[20px] bg-white border border-neutral-100 rounded-[16px] shadow-sm flex flex-col gap-[16px]">
                <div className="flex items-start gap-[4px] w-full">
                  <div className="text-[16px] font-bold text-[#1B1B1B] leading-[160%] shrink-0 pt-[1px]">
                    3.
                  </div>
                  <h2 className="text-[16px] font-bold text-[#1B1B1B] leading-[160%] text-left flex-1">
                    양적완화, 시장에 &apos;돈의 비&apos;가 내리는 것
                  </h2>
                </div>

                <div className="w-full text-[16px] font-normal text-[#1B1B1B] leading-[160%] text-justify flex flex-col gap-4">
                  <p>
                    &apos;양적완화&apos;는 쉽게 말해 <span className="font-bold text-[#535353]">국가가 시장에 돈을 확 푸는 것</span>을 말해요. 가뭄이 든 논에 물을 대듯, 나라에서 돈을 많이 찍어 세상에 흘려보내면 사람들은 그 돈으로 소비도 하고 투자도 하게 되죠. 시장에 돈이 흔해지면 <span className="font-bold text-[#535353]">주식 같은 자산의 가격이 오르기 쉬운 환경</span>이 만들어져요.
                  </p>
                  <p>
                    특히 엔비디아처럼 성장 가능성이 큰 기술주들은 이런 &apos;돈의 비&apos;가 내릴 때 더 쑥쑥 자라는 경향이 있답니다.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {showScrollBtn && (
        <div className="absolute bottom-6 right-5 z-50">
          <ScrollToTopButton onClick={handleScrollToTop} />
        </div>
      )}
    </div>
  );
}