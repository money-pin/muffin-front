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

const SORT_OPTIONS = [
  { value: "investment-asc", label: "투자금 낮은 순" },
  { value: "investment-desc", label: "투자금 높은 순" },
  { value: "profit-desc", label: "수익률 높은 순" },
  { value: "profit-asc", label: "수익률 낮은 순" },
] as const satisfies readonly SortOption[];

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

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
  const [onb, setOnb] = useState(2);
  const [sort, setSort] = useState<SortValue>("profit-desc");

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
      </Section>

      <Section title="Button">
        <Button variant="primary">로그인 (primary)</Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="outline">outline</Button>
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
        <QuizButton label="선택됨 (selected)" state="selected" />
        <QuizButton label="정답 (correct · 파랑)" state="correct" />
        <QuizButton label="오답 (wrong · 빨강)" state="wrong" />
      </Section>

      <Section title="Indicator (5단계 중 3)">
        <Indicator total={5} current={3} />
      </Section>

      <Section title="SectionHeader">
        <SectionHeader title="따끈한 금융 소식" icon={<span>📢</span>} />
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

      <Section title="CharacterAvatar">
        <div className="flex items-end gap-4">
          <CharacterAvatar size="small" />
          <CharacterAvatar size="medium" />
          <CharacterAvatar size="large" />
        </div>
      </Section>

      <BottomNavigation />
    </div>
  );
}
