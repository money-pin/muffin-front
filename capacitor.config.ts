import type { CapacitorConfig } from "@capacitor/cli";

// Capacitor 하이브리드 앱 설정 (이슈 #264)
// ⚠️ appId(Bundle ID)는 App Store 등록 후 변경 불가. Apple 로그인·푸시 설정도 이 값에 묶인다.
const config: CapacitorConfig = {
  appId: "kr.ai.muffin",
  // 홈 화면에 표시되는 앱 이름
  appName: "머핀",
  // Vite 빌드 결과물. `pnpm build` 후 `npx cap sync`로 네이티브에 복사된다.
  webDir: "dist",
  ios: {
    // WebView가 상태바·홈 인디케이터 영역까지 화면 전체를 쓰고, Safe Area는
    // 네이티브 inset이 아닌 CSS(viewport-fit=cover + env(safe-area-inset-*))로 처리한다.
    // TODO(#271): Safe Area CSS 적용 전까지는 네이티브 실행 시 상단이 상태바에 겹칠 수 있음
    contentInset: "never",
  },
  plugins: {
    // 앱 소셜 로그인 (#266): 구글·애플만 쓰고 나머지 SDK는 앱에 넣지 않는다.
    // 카카오는 @team-lepisode/capacitor-kakao-login을 쓴다.
    SocialLogin: {
      providers: {
        google: true,
        apple: true,
        facebook: false,
        twitter: false,
      },
      logLevel: 1,
    },
  },
};

export default config;
