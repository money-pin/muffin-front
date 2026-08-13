# 🧁 Muffin Front

---

## 1. 프로젝트 소개

**Muffin**은 경제·금융 뉴스를 쉽고 재미있게 학습할 수 있도록 돕는 모바일 웹앱입니다.

사용자는 뉴스를 읽고, 퀴즈를 풀고, 모의투자를 진행하며 경제 개념을 자연스럽게 학습할 수 있습니다.

### 🔗 배포 링크

- **서비스**: [https://muffin.ai.kr](https://muffin.ai.kr)
- **Vercel**: [https://muffin-front.vercel.app](https://muffin-front.vercel.app)

<br />

---

## 2. 팀원 및 역할

|                                                        머핀                                                        | 이름   | 역할     | 담당 업무                              | GitHub                                   |
| :----------------------------------------------------------------------------------------------------------------: | ------ | -------- | -------------------------------------- | ---------------------------------------- |
|      <img src="src/assets/avatars/muffin-plain.png" width="48" alt="플레인 머핀" />       | 황윤재 | Frontend | 홈, 인증, 온보딩, 퀴즈 화면 구현       | [@D5-wq](https://github.com/D5-wq)       |
|     <img src="src/assets/avatars/muffin-butter.png" width="48" alt="버터빛 머핀" />       | 유아영 | Frontend | 모의투자 화면 및 투자 플로우 구현      | [@ay-yoo](https://github.com/ay-yoo)     |
|   <img src="src/assets/avatars/muffin-sprinkle.png" width="48" alt="스프링클 머핀" />     | 한서경 | Frontend | 수익 통계, 랭킹 화면 구현              | [@seokyun9](https://github.com/seokyun9) |
|      <img src="src/assets/avatars/muffin-cream.png" width="48" alt="생크림 머핀" />       | 정해찬 | Frontend | 뉴스, 뉴스 상세, 학습 저장소 화면 구현 | [@hchnnn](https://github.com/hchnnn)     |

<br />

---

## 3. 기술 스택

| 역할                 | 종류                                                                                                                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core                 | <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> |
| Programming Language | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />                                                                                            |
| Styling              | <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />                                                                                         |
| Data Fetching        | <img src="https://img.shields.io/badge/TanStack Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />                                                                                        |
| Code Quality         | <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" />                                                                                                    |
| Package Manager      | <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" />                                                                                                        |
| Version Control      | <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" /> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /> |

<br />

---

## 4. 폴더 구조

| 폴더         | 설명                                                    |
| ------------ | ------------------------------------------------------- |
| `assets`     | 이미지, 아이콘 등 정적 리소스 관리                      |
| `components` | 공통 재사용 컴포넌트 관리                               |
| `layouts`    | 공통 레이아웃 관리 (MobileLayout, NavLayout, TopBarLayout) |
| `lib`        | API 요청·인증·캐릭터 등 도메인 로직 및 유틸 관리        |
| `pages`      | 페이지 단위 컴포넌트 관리 (도메인별 하위 폴더로 구성)   |
| `routes`     | 라우팅 설정 관리 (`router.tsx`)                         |
| `types`      | TypeScript 타입 관리                                    |

<br />

---

## 5. 브랜치 전략 & 커밋 컨벤션

### 브랜치 전략

| 브랜치                  | 용도                                |
| ----------------------- | ----------------------------------- |
| `main`                  | 배포용 브랜치, 직접 push 금지       |
| `dev`                   | 개발 통합 브랜치, PR로만 머지       |
| `feat/이슈번호-기능명`  | 기능 개발                           |
| `fix/이슈번호-버그명`   | 버그 수정                           |
| `chore/이슈번호-작업명` | 환경 설정, 패키지 변경 등 기타 작업 |
| `docs/이슈번호-문서명`  | 문서 작성 및 수정                   |

예시:

```bash
feat/12-login-page
fix/15-bottom-nav-icon
chore/4-project-setting
docs/7-readme
```

<br />

### 커밋 컨벤션

| 타입       | 설명                  |
| ---------- | --------------------- |
| `feat`     | 새 기능 추가          |
| `fix`      | 버그 수정             |
| `style`    | UI 스타일 변경        |
| `refactor` | 코드 리팩토링         |
| `chore`    | 설정, 패키지 변경     |
| `docs`     | 문서 수정             |
| `remove`   | 파일 또는 코드 삭제   |
| `rename`   | 파일 또는 폴더명 수정 |

커밋 형식:

```bash
타입: 작업 내용
```

예시:

```bash
feat: 로그인 페이지 구현
fix: 하단 탭 아이콘 오류 수정
chore: 모바일 레이아웃 및 라우팅 구조 세팅
docs: README 작성
```

<br />

### PR 컨벤션

- PR 제목은 `[타입] 작업 내용` 형식으로 작성합니다.
- PR은 `dev` 브랜치로만 생성합니다.
- 머지 전 최소 1명 이상의 리뷰를 받습니다.
- 단순 `LGTM`만 남기는 리뷰는 지양하고, 실질적인 코드 리뷰 코멘트를 작성합니다.
- PR 본문에 관련 이슈 번호를 연결합니다.

PR 제목 예시:

```txt
[feat] 로그인 페이지 구현
[fix] 하단 탭 아이콘 오류 수정
[chore] 개발 환경 세팅
[docs] README 작성
```

관련 이슈 작성 예시:

```txt
resolves #12
```

<br />

---

## 6. 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/money-pin/muffin-front.git
```

### 2. 프로젝트 폴더 이동

```bash
cd muffin-front
```

### 3. 패키지 설치

```bash
pnpm install
```

### 4. 환경 변수 설정

루트에 `.env` 파일을 만들고 아래 값을 채웁니다. (`.env.example` 참고)

```bash
# API 서버 base URL (끝 슬래시 없이)
VITE_API_BASE_URL=https://api.muffin.ai.kr

# Google OAuth Client ID (Google Cloud Console > 사용자 인증 정보)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> `.env`는 커밋하지 않습니다(`.gitignore` 처리). 값은 팀에서 공유받아 설정하세요.

### 5. 개발 서버 실행

```bash
pnpm dev
```

개발 서버 실행 후 아래 주소로 접속합니다.

```txt
http://localhost:5173/
```

<br />

---

## 7. 주요 명령어

| 명령어         | 설명               |
| -------------- | ------------------ |
| `pnpm dev`     | 개발 서버 실행     |
| `pnpm build`   | 프로덕션 빌드      |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm lint`    | ESLint 검사 실행   |

<br />

---

## 8. 화면 목록 및 라우팅 구조

| 화면 이름   | 페이지 ID           | 진입 경로                 |
| ----------- | ------------------- | ------------------------- |
| 스플래시    | `SplashPage`        | `/splash`                 |
| 로그인      | `LoginPage`         | `/login`                  |
| 회원가입    | `SignupPage`        | `/signup`                 |
| 온보딩      | `OnboardingPage`    | `/onboarding`             |
| 홈          | `HomePage`          | `/home`                   |
| 퀴즈        | `QuizPage`          | `/quiz`                   |
| 뉴스 목록   | `NewsPage`          | `/news`                   |
| 뉴스 상세   | `NewsDetailPage`    | `/news/:newsId`           |
| 학습 저장소 | `MyStoragePage`     | `/my/storage`             |
| 모의투자    | `InvestPage`        | `/invest`                 |
| 수익 통계   | `StatsPage`         | `/invest/stats`           |
| 수익 내역   | `ProfitHistoryPage` | `/invest/profit-history`  |
| 랭킹        | `RankingPage`       | `/invest/ranking`         |
| 마이페이지  | `MyPage`            | `/my`                     |
| 설정        | `MySettingsPage`    | `/my/settings`            |
| Not Found   | `NotFoundPage`      | `*`                       |

<br />

---

## 9. 기본 플로우

```txt
스플래시 / 진입
 └── 로그인 여부 확인
      ├── 비로그인 사용자 → 로그인 / 회원가입
      └── 로그인 사용자
           ├── 온보딩 미완료 → 온보딩
           └── 온보딩 완료 → 홈

홈
 ├── 오늘의 퀴즈 → 퀴즈
 ├── 뉴스 카드 → 뉴스 상세
 ├── 하단 탭 → 뉴스 / 모의투자 / 마이페이지
 └── 모의투자 탭 → 수익 통계 / 랭킹
```

<br />

---

## 10. 모바일 웹앱 레이아웃

본 프로젝트는 모바일 웹앱 기준으로 제작됩니다.

- 기준 디자인 사이즈: `390px`
- PC 브라우저에서는 화면이 중앙 정렬됩니다.
- 실제 페이지는 `MobileLayout` 내부에서 렌더링됩니다.

```txt
전체 브라우저 화면
└── MobileLayout
    └── 각 페이지
```
