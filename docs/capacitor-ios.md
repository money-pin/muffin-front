# Capacitor iOS 셋업 가이드 (#264)

muffin-front를 Capacitor 기반 하이브리드 iOS 앱으로 전환하기 위한 셋업 문서입니다.
현재 리포에는 **네이티브 프로젝트 생성 전까지의 설정**이 들어가 있습니다.
`npx cap add ios`부터는 **macOS + Xcode** 환경에서 실행해야 합니다.

## 이미 되어 있는 것

- Capacitor 패키지 설치: `@capacitor/core`, `@capacitor/ios`, `@capacitor/cli` (v8)
- `capacitor.config.ts` — `webDir: "dist"` (Vite 빌드 결과), `appName: "Muffin"`, `ios.contentInset: "never"`
- `package.json` 스크립트: `cap`, `cap:sync`, `cap:open:ios`, `cap:run:ios`
- Node/pnpm 버전 고정: `packageManager`, `engines`, `.nvmrc`

## ⚠️ 먼저 확정할 것

1. **Bundle ID** — `capacitor.config.ts`의 `appId`가 현재 `com.example.muffin` 플레이스홀더입니다.
   네이티브 프로젝트 생성 전에 확정된 값(예: `kr.ai.muffin`)으로 교체하세요.
   생성 후 변경하면 Apple 콘솔 재등록·프로비저닝·심사가 얽힙니다.
2. Apple Developer 계정 / 팀 ID

## iOS 의존성 관리: SPM (기본값)

Capacitor 8부터 `npx cap add ios`는 **Swift Package Manager(SPM)** 가 기본입니다.
CocoaPods 설치는 필요 없습니다.

- 사용하려는 플러그인이 SPM을 지원하지 않아 CocoaPods가 꼭 필요하다면, 최초 생성 시
  `npx cap add ios --packagemanager CocoaPods`로 명시합니다. (이 경우 `brew install cocoapods` 필요)
- 생성 이후에는 관리 방식을 바꾸기 번거로우므로, 도입할 플러그인(네이티브 Google 로그인 #266,
  푸시 알림 등)의 SPM 지원 여부를 먼저 확인하세요.

## Safe Area 방침

- `ios.contentInset: "never"` — WebView가 상태바·홈 인디케이터 영역까지 화면 전체를 씁니다.
- Safe Area는 네이티브 inset이 아니라 CSS로 일괄 처리합니다.
  (`viewport-fit=cover` + `env(safe-area-inset-*)`) → **#271**
- #271 적용 전에 네이티브로 실행하면 상단이 상태바에 겹치는 것이 정상입니다.

## macOS에서 진행 (Bundle ID 확정 후)

```bash
# 0) Node 버전 맞추기 (.nvmrc)
nvm use            # 22.22.2
corepack enable    # packageManager에 고정된 pnpm 사용

# 1) 의존성 설치 + 웹 빌드
pnpm install
pnpm build

# 2) iOS 네이티브 프로젝트 생성 (최초 1회, SPM 기본) — appId 확정 후 실행
npx cap add ios

# 3) 웹 빌드 결과를 네이티브로 복사/동기화
pnpm cap:sync      # = pnpm build && cap sync ios

# 4) Xcode 열기 → Signing & Capabilities에서 팀 설정 후 시뮬레이터/실기기 실행
pnpm cap:open:ios
```

- 코드나 화면을 수정한 뒤에는 `pnpm cap:sync`로 다시 동기화합니다.
- 빌드 산출물·생성 설정 파일은 `cap add ios`가 만드는 `ios/.gitignore`에서 제외됩니다.

## 후속 작업 (별도 이슈)

- Safe Area CSS 대응: #271
- 네이티브 Google 로그인 교체: #266 (웹뷰 내 GIS 차단 대응)
- 푸시 알림(APNs): 계획서 4장
