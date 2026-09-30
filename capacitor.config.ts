import type { CapacitorConfig } from "@capacitor/cli";

// Capacitor 하이브리드 앱 설정 (이슈 #264)
// ⚠️ appId(Bundle ID): 네이티브 프로젝트 생성(`npx cap add ios`) 시 그대로 박히는 값.
//    나중에 바꾸면 Apple/Google 콘솔 재등록·심사가 얽히므로, 아래 값을 확정된
//    Bundle ID로 반드시 먼저 교체할 것. (예: kr.ai.muffin)
const config: CapacitorConfig = {
  appId: "com.example.muffin", // TODO(#264): 확정된 Bundle ID로 교체
  appName: "Muffin",
  // Vite 빌드 결과물. `pnpm build` 후 `npx cap sync`로 네이티브에 복사된다.
  webDir: "dist",
  ios: {
    // WebView가 상태바·홈 인디케이터 영역까지 화면 전체를 쓰고, Safe Area는
    // 네이티브 inset이 아닌 CSS(viewport-fit=cover + env(safe-area-inset-*))로 처리한다.
    // TODO(#271): Safe Area CSS 적용 전까지는 네이티브 실행 시 상단이 상태바에 겹칠 수 있음
    contentInset: "never",
  },
};

export default config;
