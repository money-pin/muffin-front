import Button from "@/components/common/Button";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";
import newsIcon from "@/assets/onboarding/feature-news.svg";
import coinsIcon from "@/assets/onboarding/feature-coins.svg";
import clockIcon from "@/assets/onboarding/feature-clock.svg";

interface FeatureStepProps {
  onNext: () => void;
}

interface Feature {
  iconSrc: string;
  // Figma 실측 크기 (뉴스 40, 코인·시계 32)
  iconClass: string;
  label: string;
}

// 아이콘은 Figma 시안 SVG 원본 사용 (primary 컬러 내장, 뉴스=커스텀 / 코인·시계=tabler)
const FEATURES: Feature[] = [
  { iconSrc: newsIcon, iconClass: "h-10 w-10", label: "뉴스 읽기" },
  { iconSrc: coinsIcon, iconClass: "h-8 w-8", label: "베팅하기" },
  { iconSrc: clockIcon, iconClass: "h-8 w-8", label: "오전 10시 확인" },
];

export default function FeatureStep({ onNext }: FeatureStepProps) {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-12">
        <div className="flex items-start justify-center gap-4">
          {FEATURES.map((feature, i) => (
            <div key={feature.label} className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-secondary-50 flex h-[68px] w-[68px] items-center justify-center rounded-[16px]">
                  <img
                    src={feature.iconSrc}
                    alt=""
                    aria-hidden="true"
                    className={`${feature.iconClass} object-contain`}
                    draggable={false}
                  />
                </div>
                <span className="text-body-14-bd text-neutral-1000 whitespace-nowrap">
                  {feature.label}
                </span>
              </div>
              {i < FEATURES.length - 1 && (
                <img
                  src={chevronRightIcon}
                  alt=""
                  aria-hidden="true"
                  className="mt-[22px] h-6 w-6"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-heading-20-bd text-neutral-1000">
            오늘 사고, 내일 바로 확인하세요.
          </h2>
          <p className="text-body-16-md-tighter leading-[1.6] text-neutral-600">
            뉴스 보고 10만 원 단위로 베팅하면,
            <br />
            <span className="text-body-16-bd-tighter text-primary">
              다음 날 아침 10시
            </span>
            에 결과가 배달됩니다.
          </p>
        </div>
      </div>

      <Button onClick={onNext}>다음</Button>
    </div>
  );
}
