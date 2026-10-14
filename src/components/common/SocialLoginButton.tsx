export type SocialProvider = "kakao" | "apple" | "google";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  label: string;
  onClick?: () => void;
}

// 브랜드 가이드 색상(카카오 #FEE500, 애플 #050708, 구글 텍스트 #1F1F1F)은 디자인 토큰이 아니라
// 각 사 로그인 버튼 규격이라 그대로 쓴다.
const PROVIDER_CLASS: Record<SocialProvider, string> = {
  kakao: "bg-[#fee500] text-neutral-1000",
  apple: "bg-[#050708] text-neutral-0",
  google: "border border-neutral-100 bg-neutral-0 text-[#1f1f1f]",
};

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M9 1.5C4.58 1.5 1 4.31 1 7.78c0 2.24 1.5 4.2 3.75 5.31l-.95 3.48a.28.28 0 0 0 .43.31l4.1-2.71c.22.02.44.03.67.03 4.42 0 8-2.81 8-6.28S13.42 1.5 9 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="15" height="18.75" viewBox="0 0 814 1000" aria-hidden="true">
      <path
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.62 4.62 0 01-2 3.03v2.51h3.23c1.89-1.74 2.97-4.3 2.97-7.34z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.07v2.59A10 10 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.41 11.9a5.99 5.99 0 010-3.8V5.51H1.07a10 10 0 000 8.98l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.97 9.97 0 0010 0 10 10 0 001.07 5.51l3.34 2.59C5.2 5.74 7.4 3.98 10 3.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

const PROVIDER_ICON: Record<SocialProvider, () => React.JSX.Element> = {
  kakao: KakaoIcon,
  apple: AppleIcon,
  google: GoogleIcon,
};

// Figma 회원가입·로그인 시트: h48 · 완전 둥근 모서리 · 아이콘 + Body/16_md_tighter
export default function SocialLoginButton({
  provider,
  label,
  onClick,
}: SocialLoginButtonProps) {
  const Icon = PROVIDER_ICON[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-body-16-md-tighter flex h-12 w-full items-center justify-center gap-2 rounded-[30px] ${PROVIDER_CLASS[provider]}`}
    >
      <Icon />
      {label}
    </button>
  );
}
