# Capacitor iOS 셋업 가이드 (#264)

muffin-front를 Capacitor 기반 하이브리드 iOS 앱으로 출시하기 위한 문서입니다.
팀에 Mac이 없어서 **클라우드 빌드(Codemagic) → TestFlight → 아이폰 설치** 흐름으로 테스트합니다.

## 현재 상태

| 항목                  | 값 / 상태                                           |
| --------------------- | --------------------------------------------------- |
| Bundle ID             | `kr.ai.muffin` (App Store 등록 후 변경 불가)        |
| 앱 표시 이름          | 머핀                                                |
| iOS 네이티브 프로젝트 | `ios/` 생성 완료 (SPM 방식)                         |
| 지원 기기 / 방향      | 아이폰 전용 / 세로 고정                             |
| 최소 iOS 버전         | 15.0                                                |
| 클라우드 빌드 설정    | `codemagic.yaml`                                    |
| 앱 아이콘·스플래시    | ⚠️ Capacitor 기본 이미지. 디자인 에셋으로 교체 필요 |

- 아이폰 전용으로 설정해 App Store 심사 때 아이패드 스크린샷이 필요하지 않습니다.
- `ITSAppUsesNonExemptEncryption = false`: HTTPS만 사용하므로 수출 규정(암호화) 신고가 면제되어 TestFlight 업로드마다 질문이 뜨지 않습니다.

## 코드 수정 후 iOS에 반영

```bash
pnpm cap:sync   # = pnpm build && cap sync ios (웹 빌드 결과를 ios/에 복사)
```

`ios/App/App/public`, `capacitor.config.json` 등 생성 파일은 `ios/.gitignore`로 제외됩니다.
클라우드 빌드는 매번 이 과정을 자동으로 실행하므로, 웹 코드만 바꿨다면 별도 커밋이 필요 없습니다.

## 클라우드 빌드 (Mac 없이 TestFlight로 테스트)

> **Apple Developer Program(유료, 연 $99) 가입이 먼저 필요합니다.** TestFlight는 유료 계정에서만 쓸 수 있습니다.

### 1. Apple 쪽 준비 (계정 주인이 1회)

1. [Apple Developer Program](https://developer.apple.com/programs/) 가입
2. **Certificates, Identifiers & Profiles → Identifiers**에서 App ID `kr.ai.muffin` 등록
   - 필요 기능: Push Notifications, Sign in with Apple (해당 작업 시 체크)
3. **App Store Connect → 앱 → 새로운 앱** 생성 (번들 ID `kr.ai.muffin`, 이름 머핀)
   - 생성 후 **앱 정보 > Apple ID**(숫자)를 `codemagic.yaml`의 `APP_STORE_APPLE_ID`에 넣기
4. **App Store Connect → 사용자 및 액세스 → 통합 → App Store Connect API**에서 키 생성
   - 권한: 앱 관리(App Manager)
   - `.p8` 파일, Issuer ID, Key ID를 보관 (`.p8`은 한 번만 다운로드됨)

### 2. Codemagic 쪽 준비 (1회)

1. [Codemagic](https://codemagic.io) 가입 후 GitHub 저장소 `money-pin/muffin-front` 연결
2. **Teams → Integrations → App Store Connect**에 1-4의 API 키 등록, 이름을 `muffin-asc`로 지정
3. **환경 변수 그룹 `muffin_env`** 생성 후 웹 빌드에 필요한 값 등록
   - `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`
4. 서명 인증서·프로파일은 Codemagic이 API 키로 자동 생성합니다(`xcode-project use-profiles`).

### 3. 빌드하고 아이폰에 설치

1. Codemagic에서 `iOS TestFlight` 워크플로를 브랜치 선택 후 **Start build**
2. 빌드가 끝나면 App Store Connect의 TestFlight에 자동 업로드됩니다(처리까지 수 분~수십 분).
3. 아이폰에 **TestFlight** 앱 설치 → 테스터로 초대받은 계정으로 로그인 → 머핀 설치
   - 팀원은 App Store Connect **TestFlight → 내부 테스트** 그룹에 추가

빌드 번호는 TestFlight 최신 번호 + 1로 자동 증가합니다. 앱 버전(1.0)은 출시 시 Xcode 프로젝트의 `MARKETING_VERSION`에서 올립니다.

## iOS 의존성 관리: SPM

Capacitor 8 기본값인 **Swift Package Manager(SPM)** 를 사용합니다. CocoaPods는 필요 없습니다.
네이티브 플러그인(소셜 로그인, 푸시 등)을 추가할 때는 SPM 지원 여부를 먼저 확인하세요.

## Safe Area 방침

- `ios.contentInset: "never"`: WebView가 상태바·홈 인디케이터 영역까지 화면 전체를 씁니다.
- Safe Area는 CSS로 처리합니다(`viewport-fit=cover` + `env(safe-area-inset-*)`) → **#271**
- #271 적용 전에 실행하면 상단이 상태바에 겹치는 것이 정상입니다.

## 후속 작업 (별도 이슈)

- 앱 아이콘(1024×1024)·스플래시 디자인 에셋 반영
- Safe Area CSS 대응: #271
- 네이티브 소셜 로그인(구글 #266, 애플, 카카오)
- 푸시 알림(APNs)
