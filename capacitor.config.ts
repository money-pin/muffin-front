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
    // 상태바/노치 영역은 앱 CSS(Safe Area)에서 직접 처리하므로 기본 inset 사용
    contentInset: "always",
  },
};

export default config;
