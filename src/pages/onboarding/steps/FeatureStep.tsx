import { TbNews, TbCoins, TbClock } from "react-icons/tb";
import type { IconType } from "react-icons";

import Button from "@/components/common/Button";
import chevronRightIcon from "@/assets/icon-24px/chevron-right.svg";

interface FeatureStepProps {
  onNext: () => void;
}

interface Feature {
  icon: IconType;
  label: string;
}

// 세 아이콘 모두 Tabler 컴포넌트로 통일해 stroke 두께·색상을 맞춘다.
const FEATURES: Feature[] = [
  { icon: TbNews, label: "뉴스 읽기" },
  { icon: TbCoins, label: "베팅하기" },
  { icon: TbClock, label: "오전 10시 확인" },
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
                  <feature.icon className="text-primary h-10 w-10" />
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
