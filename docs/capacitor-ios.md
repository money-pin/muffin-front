# Capacitor iOS 셋업 가이드 (#264)

## iOS APNs 푸시 (#322)

- Firebase·웹 FCM은 사용하지 않습니다. `@capacitor/push-notifications`가 전달한 APNs 토큰을 가공하지 않고 `PUT /api/notifications/device-token`에 보냅니다.
- 앱 실행·로그인·토큰 변경 시 등록합니다. 앱 복귀 시에도 권한과 등록 상태를 확인합니다. 로그아웃·탈퇴 토큰 해제는 서버가 처리하므로 별도 해제 API를 호출하지 않습니다.
- 첫 권한 요청은 온보딩이 완료된 홈 진입 후 자동으로 합니다. 거절한 사용자에게 반복 요청하지 않으며, 설정 화면에 iPhone 알림 설정 안내와 연결 재확인을 제공합니다.
- 포그라운드에서는 배너·소리·배지·별도 팝업을 표시하지 않습니다. 백그라운드·종료 상태에서 알림을 탭하면 `notification.data.deepLink`를 검증한 뒤 #321 경로 처리로 전달합니다. 알림을 수신하기만 해서는 자동 이동하지 않습니다.
- `AUTH_401_005`는 재발급이나 재등록 재시도 없이 로그인으로 이동합니다. 네트워크·서버 오류도 무한 재시도하지 않고 다음 실행·로그인·명시적 재확인에서 다시 등록합니다.
- OS 등록 콜백과 서버 토큰 업로드에는 각각 20초 대기 제한을 두어 계속 연결 중인 상태가 남지 않게 합니다. 네이티브 전송이 취소를 무시해도 늦은 결과로 UI를 덮어쓰지 않습니다. 클라이언트 취소가 서버에서 이미 처리 중인 요청을 되돌리지는 않습니다.

### 출시 전 남은 확인

- #322의 완료 조건인 **실기기 수신 검증은 아직 미완료**입니다. Windows의 단위 테스트·웹 빌드·`cap sync`는 Xcode 빌드, 서명, TestFlight 수신을 대신하지 않습니다.
- APNs 키·환경별 서버 설정과 Apple Developer capability/프로파일을 준비한 뒤 Debug 실기기와 TestFlight에서 각각 등록·수신·클릭을 확인합니다.
- 설정 화면은 서버 로그아웃을 최대 3초 기다린 뒤, 실패하더라도 로컬 세션·알림 목적지·조회 캐시를 정리하고 로그인 화면으로 이동합니다. 재시도를 강제하지 않습니다. 요청 중에는 기기 토큰 재등록을 중단하고, 정리 후에는 인증 정보가 없으므로 재등록하지 않습니다. access token 갱신은 동일 로그인으로 취급하며, 이전 로그아웃 응답으로 새 로그인을 지우지 않습니다. 로컬 로그아웃과 서버 해제 성공은 반환값에서 별도로 구분합니다.
- 서버가 로그아웃 시 토큰을 실제 삭제하는지, 이미 처리 중인 등록 PUT과 로그아웃이 겹쳐도 삭제 후 다시 등록되지 않는지는 백엔드·실기기 검증이 필요합니다. 클라이언트 취소만으로 서버 처리 취소를 보장할 수는 없습니다. 응답이 끊긴 경우에는 서버 로그아웃이 이미 완료됐을 수도 있습니다.
- #321의 정산 팝업 읽음 처리는 기기 저장소의 날짜 기준이며 아직 계정별로 분리되지 않았습니다. 한 기기에서 계정을 바꿀 때 정산 알림 목적지 검증은 이 후속 작업과 함께 진행합니다.

### 빌드 환경 (반드시 확인)

| 실행 방법                      | 웹 빌드 변수 `VITE_APNS_ENVIRONMENT` | Xcode 서명 entitlement |
| ------------------------------ | ------------------------------------ | ---------------------- |
| Xcode Debug 직접 설치          | `SANDBOX`                            | `development`          |
| TestFlight·App Store·Codemagic | `PRODUCTION`                         | `production`           |

로컬 Mac에서는 `.env.local`에 `VITE_APNS_ENVIRONMENT=SANDBOX`를 설정하고 `pnpm cap:sync` 후 **Debug**로 실행합니다. `pnpm build` 자체가 production mode인 것과 APNs 환경은 별개입니다. 다른 서명 방식(Ad Hoc 등)을 사용한다면 실제 프로비저닝 프로필의 `aps-environment`와 일치시키세요.

Codemagic TestFlight workflow에는 `PRODUCTION`을 명시하고 다른 값이면 빌드를 중단합니다. 값이 누락되거나 잘못되면 프론트는 환경을 추측하지 않고 기기 토큰 등록을 막습니다. 유효한 값이어도 서명 환경과 다르면 Apple이 `BadDeviceToken`으로 거절할 수 있으므로 임의로 바꾸지 마세요.

App ID `kr.ai.muffin`의 **Push Notifications capability**를 Apple Developer에서 활성화하고, 해당 capability가 포함된 프로비저닝 프로필을 다시 발급·적용해야 합니다. 소스의 entitlement 추가만으로 개발자 포털의 권한이 생기지는 않습니다. APNs 인증 키는 서버가 관리하며 프론트 저장소에 넣지 않습니다.

### 시뮬레이터 클릭 테스트 (Mac)

```bash
pnpm cap:sync
pnpm cap:open:ios
# Xcode에서 실행한 뒤, 앱을 백그라운드로 보내고 실행
xcrun simctl push booted kr.ai.muffin ios/push-test.apns
```

`ios/push-test.apns`의 `deepLink`를 아래 값으로 바꾸어 각 이동을 확인할 수 있습니다.

- `muffin://briefing/2026-11-23`
- `muffin://quiz/today`
- `muffin://home?popup=settlement`
- `muffin://ranking`
- `muffin://news/123`

로그인·로그아웃 상태, 앱 실행·백그라운드·종료 상태를 나눠 확인합니다. 포그라운드에서는 알림이 표시되지 않는 것이 정상입니다. `simctl push`는 OS 알림/클릭 경로 검증용이며, 서버 발송·유효 APNs 토큰 등록·서명 환경 검증을 대신하지 않습니다. 서버에 APNs 키가 없으면 서버는 발송 로그만 남기므로 실기기 종단 간 수신 완료로 판단하지 마세요.

실기기에서는 토큰 등록 PUT 200, 권한 거부 후 iPhone 설정에서 허용·앱 복귀, 토큰 변경, 계정 전환, 401_005 시 로그인 이동을 확인해야 합니다. 토큰 전체를 콘솔·스크린샷·이슈에 공개하지 마세요.

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

## Mac에서 직접 실행 (시뮬레이터·내 아이폰)

1. `ios` 브랜치에서 `.env.local`에 `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_KAKAO_NATIVE_APP_KEY`, `VITE_GOOGLE_IOS_CLIENT_ID` 입력 (`.env.example` 참고)
2. `pnpm install` → `pnpm build` → `npx cap sync ios` → `npx cap open ios`
3. Xcode에서 기기(시뮬레이터 또는 연결한 아이폰)를 고르고 ▶ 실행
   - 카카오·구글 로그인 복귀 주소는 프로젝트 빌드 설정에 들어 있어 따로 입력하지 않아도 됩니다.

내 아이폰에 무료 Apple ID로 설치할 때 (아래 변경은 **커밋하지 않기**)

- Signing & Capabilities → Team에 내 Apple ID 선택, **Sign in with Apple 항목 삭제** (유료 계정 전용)
- 번들 ID를 쓸 수 없다는 오류가 나면 `kr.ai.muffin.dev`처럼 잠깐 바꿔서 실행
- 아이폰 설정 → 개인정보 보호 및 보안 → 개발자 모드 켜기, 첫 실행 후 일반 → VPN 및 기기 관리에서 신뢰
- 무료 Apple ID로 설치한 앱은 7일 뒤 다시 실행(▶)해야 하고, 애플 로그인은 테스트할 수 없습니다.

카카오 로그인 플러그인은 Capacitor 버전 충돌을 막기 위해 `patches/`에서 의존성 버전을 고정합니다(`pnpm install` 시 자동 적용).

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

1. Codemagic에서 `iOS TestFlight` 워크플로를 `ios` 브랜치로 **Start build** ([브랜치 전략](branch-strategy.md))
2. 빌드가 끝나면 App Store Connect의 TestFlight에 자동 업로드됩니다(처리까지 수 분~수십 분).
3. 아이폰에 **TestFlight** 앱 설치 → 테스터로 초대받은 계정으로 로그인 → 머핀 설치
   - 팀원은 App Store Connect **TestFlight → 내부 테스트** 그룹에 추가

빌드 번호는 TestFlight 최신 번호 + 1로 자동 증가합니다. 앱 버전(1.0)은 출시 시 Xcode 프로젝트의 `MARKETING_VERSION`에서 올립니다.

## 앱 소셜 로그인 설정 (#266)

앱에서는 카카오·애플·구글 모두 각 SDK로 로그인하고, 받은 ID 토큰을 `POST /auth/{kakao|apple|google}`로 보냅니다.
웹은 구글만 지원합니다(카카오·애플은 백엔드가 앱에서 발급된 토큰만 받음).

| 항목   | 할 일                                                                                                   | 넣을 곳                                         |
| ------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 카카오 | 카카오 디벨로퍼스 > 플랫폼 > iOS에 번들 ID `kr.ai.muffin` 등록, 카카오 로그인·**OpenID Connect** 활성화 | 네이티브 앱 키 → `VITE_KAKAO_NATIVE_APP_KEY`    |
| 구글   | Google Cloud Console > 사용자 인증 정보 > OAuth 클라이언트 ID > **iOS** (번들 ID `kr.ai.muffin`) 생성   | iOS 클라이언트 ID → `VITE_GOOGLE_IOS_CLIENT_ID` |
| 애플   | Apple Developer > Identifiers > `kr.ai.muffin`에 **Sign in with Apple** 체크                            | 코드 설정 완료 (`App/App.entitlements`)         |
| 백엔드 | 구글 토큰 검증에 iOS 클라이언트 ID도 허용 (앱 로그인 토큰의 aud가 iOS 클라이언트 ID)                    | 백엔드 환경 변수                                |

- 두 값은 `codemagic.yaml`의 `vars`에 들어 있습니다(앱에 그대로 들어가는 공개 값). 웹 빌드 값과 함께 앱 코드에 들어가고, `codemagic.yaml`이 Info.plist의 로그인 복귀 주소(URL scheme)에도 넣어 줍니다.
- 애플 계정 회원 탈퇴 시 앱이 애플 로그인을 한 번 더 띄워 받은 `authorizationCode`를 탈퇴 API에 보냅니다.

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
