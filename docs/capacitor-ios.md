# Capacitor iOS 셋업 가이드 (#264)

muffin-front를 Capacitor 기반 하이브리드 iOS 앱으로 전환하기 위한 셋업 문서입니다.
현재 리포에는 **네이티브 프로젝트 생성 전까지의 설정**이 들어가 있습니다.
`npx cap add ios`부터는 **macOS + Xcode + CocoaPods** 환경에서 실행해야 합니다.

## 이미 되어 있는 것 (이 브랜치)

- Capacitor 패키지 설치: `@capacitor/core`, `@capacitor/ios`, `@capacitor/cli` (v8)
- `capacitor.config.ts` — `webDir: "dist"` (Vite 빌드 결과), `appName: "Muffin"`
- `package.json` 스크립트: `cap`, `cap:sync`, `cap:open:ios`, `cap:run:ios`
- Node/pnpm 버전 고정: `packageManager`, `engines`, `.nvmrc`
- `.gitignore`에 iOS 빌드 산출물/Pods 제외 규칙

## ⚠️ 먼저 확정할 것

1. **Bundle ID** — `capacitor.config.ts`의 `appId`가 현재 `com.example.muffin` 플레이스홀더입니다.
   네이티브 프로젝트 생성 전에 확정된 값(예: `kr.ai.muffin`)으로 교체하세요.
   생성 후 변경하면 Apple 콘솔 재등록·프로비저닝·심사가 얽힙니다.
2. Apple Developer 계정 / 팀 ID

## macOS에서 진행 (Bundle ID 확정 후)

```bash
# 0) Node 버전 맞추기 (.nvmrc)
nvm use            # 22.22.2
corepack enable    # packageManager 고정 pnpm 사용

# 1) 의존성 설치 + 웹 빌드
pnpm install
pnpm build

# 2) iOS 네이티브 프로젝트 생성 (최초 1회) — appId 확정 후 실행
npx cap add ios

# 3) 웹 빌드 결과를 네이티브로 복사/동기화
pnpm cap:sync      # = pnpm build && cap sync ios

# 4) Xcode 열기 → 서명(Signing) 팀 설정 후 실기기/시뮬레이터 실행
pnpm cap:open:ios
```

- 코드/화면 수정 후에는 `pnpm cap:sync`로 다시 동기화합니다.
- CocoaPods가 필요합니다: `sudo gem install cocoapods` (또는 `brew install cocoapods`).

## 다음 단계 (별도 이슈)

- 네이티브 Google 로그인 교체: #266 (웹뷰 내 GIS 차단 대응)
- 푸시 알림(APNs): 계획서 4장
- Android 프로젝트(`@capacitor/android` + `npx cap add android`)는 iOS 안정화 후 진행
