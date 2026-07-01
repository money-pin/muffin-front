interface SocialLoginButtonProps {
  onClick?: () => void;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.62 4.62 0 01-2 3.03v2.51h3.23c1.89-1.74 2.97-4.3 2.97-7.34z" fill="#4285F4" />
      <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.05.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H1.07v2.59A10 10 0 0010 20z" fill="#34A853" />
      <path d="M4.41 11.9a5.99 5.99 0 010-3.8V5.51H1.07a10 10 0 000 8.98l3.34-2.59z" fill="#FBBC05" />
      <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.97 9.97 0 0010 0 10 10 0 001.07 5.51l3.34 2.59C5.2 5.74 7.4 3.98 10 3.98z" fill="#EA4335" />
    </svg>
  );
}

// Figma 로그인 화면: "구글로 계속하기" 버튼 (h56 · r10 · border #E5E5EC · bg #FFF)
export default function SocialLoginButton({ onClick }: SocialLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#E5E5EC] bg-white text-body-16-md-tighter text-neutral-900 transition-all"
    >
      <GoogleIcon />
      구글로 계속하기
    </button>
  );
}
