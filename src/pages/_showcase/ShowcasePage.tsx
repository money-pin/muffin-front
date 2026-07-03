import { useState } from "react";
import Logo from "@/components/common/Logo";
import TextField from "@/components/common/TextField";
import Button from "@/components/common/Button";
import SocialLoginButton from "@/components/common/SocialLoginButton";
import OnboardingButton from "@/components/common/OnboardingButton";
import QuizButton from "@/components/common/QuizButton";
import Indicator from "@/components/common/Indicator";
import SectionHeader from "@/components/common/SectionHeader";
import CharacterAvatar from "@/components/common/CharacterAvatar";
import TopBar from "@/components/common/TopBar";
import BottomNavigation from "@/components/common/BottomNavigation";
import SortDropdown, {
  type SortOption,
} from "@/components/common/SortDropdown";
import Badge from "@/components/common/Badge";
import TabBar from "@/components/common/TabBar";
import BottomSheet from "@/components/common/BottomSheet";
import megaphoneIcon from "@/assets/icon-20px/megaphone.svg";

const SORT_OPTIONS = [
  { value: "investment-asc", label: "투자금 낮은 순" },
  { value: "investment-desc", label: "투자금 높은 순" },
  { value: "profit-desc", label: "수익률 높은 순" },
  { value: "profit-asc", label: "수익률 낮은 순" },
] as const satisfies readonly SortOption[];

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const NEWS_TABS = [
  { value: "all", label: "전체" },
  { value: "economy", label: "경제" },
  { value: "stock", label: "증권" },
  { value: "world", label: "세계" },
] as const;

type NewsTabValue = (typeof NEWS_TABS)[number]["value"];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 border-b border-neutral-50 px-5 py-6">
      <h2 className="text-caption-12-bd text-neutral-400">{title}</h2>
      {children}
    </section>
  );
}

// 공용 컴포넌트 검증용 쇼케이스 /showcase
export default function ShowcasePage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("HelloMuffin123");
  const [otp, setOtp] = useState("");
  const [onb, setOnb] = useState(2);
  const [sort, setSort] = useState<SortValue>("profit-desc");
  const [newsTab, setNewsTab] = useState<NewsTabValue>("all");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <div className="pb-[120px]">
      <TopBar title="컴포넌트 쇼케이스" onBack={() => window.history.back()} />

      <Section title="Logo">
        <Logo tagline />
      </Section>

      <Section title="TextField">
        <TextField
          label="이메일"
          placeholder="example@email.com"
          value={email}
          onChange={setEmail}
          required
        />
        <TextField
          label="비밀번호"
          type="password"
          value={pw}
          onChange={setPw}
        />
        <TextField
          label="에러 상태"
          value="잘못된 값"
          onChange={() => {}}
          error="에러 메시지입니다"
        />
        <TextField
          label="인증번호"
          placeholder="인증번호 6자리"
          value={otp}
          onChange={setOtp}
          rightSlot={
            <span className="text-body-14-md text-primary">05:00</span>
          }
        />
      </Section>

      <Section title="Button">
        <Button variant="primary">로그인 (primary)</Button>
        <Button disabled>비활성 (disabled)</Button>
      </Section>

      <Section title="SocialLoginButton">
        <SocialLoginButton />
      </Section>

      <Section title="OnboardingButton (선택 토글)">
        {["거의 안 봐요", "가끔 봐요", "매일 챙겨봐요"].map((l, i) => (
          <OnboardingButton
            key={l}
            label={l}
            selected={onb === i}
            onClick={() => setOnb(i)}
          />
        ))}
      </Section>

      <Section title="QuizButton">
        <QuizButton label="기본 (default)" state="default" />
        <QuizButton label="정답 (correct)" state="correct" />
        <QuizButton label="오답 (wrong · 빨강)" state="wrong" />
      </Section>

      <Section title="Indicator (5단계 중 3)">
        <Indicator total={5} current={3} />
      </Section>

      <Section title="SectionHeader">
        <SectionHeader
          title="따끈한 금융 소식"
          icon={
            <img
              src={megaphoneIcon}
              alt=""
              aria-hidden="true"
              className="size-5"
            />
          }
        />
      </Section>

      <Section title="SortDropdown">
        <div className="flex justify-end">
          <SortDropdown
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex items-center gap-2">
          <Badge variant="orange">경제</Badge>
          <Badge variant="gray">3/5</Badge>
        </div>
      </Section>

      <Section title="TabBar">
        <TabBar
          tabs={NEWS_TABS}
          currentTab={newsTab}
          onTabChange={setNewsTab}
        />
      </Section>

      <Section title="CharacterAvatar">
        <div className="flex items-end gap-4">
          <CharacterAvatar size="small" />
          <CharacterAvatar size="medium" />
          <CharacterAvatar size="large" />
        </div>
      </Section>

      <Section title="BottomSheet">
        <Button onClick={() => setIsBottomSheetOpen(true)}>
          바텀시트 열기
        </Button>
      </Section>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        ariaLabel="용어 설명"
      >
        <div className="px-[21px] pb-[60px] pt-4">
          <div className="border-b border-neutral-100 py-2">
            <h3 className="text-heading-20-bd text-neutral-1000">
              <span className="text-primary">양적완화</span>란?
            </h3>
          </div>

          <p className="pt-4 text-body-16-rg-tighter text-neutral-900">
            중앙은행이 시중에 돈을 더 많이 풀어서 경제를 활성화하는 정책
          </p>
        </div>
      </BottomSheet>

      <BottomNavigation />
    </div>
  );
}
