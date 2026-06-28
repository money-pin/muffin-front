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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-[#F5F5F5] px-5 py-6">
      <h2 className="text-xs font-bold text-[#999999]">{title}</h2>
      {children}
    </section>
  );
}

// 공용 컴포넌트 검증용 쇼케이스 /showcase
export default function ShowcasePage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("HelloMuffin123");
  const [onb, setOnb] = useState(2);

  return (
    <div className="pb-[120px]">
      <TopBar title="컴포넌트 쇼케이스" onBack={() => window.history.back()} />

      <Section title="Logo">
        <Logo tagline />
      </Section>

      <Section title="TextField">
        <TextField label="이메일" placeholder="example@email.com" value={email} onChange={setEmail} required />
        <TextField label="비밀번호" type="password" value={pw} onChange={setPw} />
        <TextField label="에러 상태" value="잘못된 값" onChange={() => {}} error="에러 메시지입니다" />
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
          <OnboardingButton key={l} label={l} selected={onb === i} onClick={() => setOnb(i)} />
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

      <Section title="CharacterAvatar (이미지 에셋 대기 — placeholder)">
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
