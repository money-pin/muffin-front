# 모의투자 요청 복구 검증 — PR #273 후속

검증일: 2026-10-13. #274 수량 입력·예산 UI 변경은 포함하지 않는다.

## 실행 가능한 회귀 테스트

```bash
node --test scripts/investmentRecovery.test.mjs
pnpm exec tsc -p tsconfig.app.json --noEmit --pretty false
pnpm lint
pnpm exec prettier --check src/lib/errorMessages.ts src/lib/useApiErrorModal.ts src/pages/invest/trade/InvestPage.tsx src/pages/invest/trade/components/InvestBottomAction.tsx src/pages/invest/trade/hooks/useInvestmentSelection.ts src/pages/invest/trade/utils/investmentSelection.ts scripts/investmentRecovery.test.mjs
pnpm build
git diff --check
```

회귀 테스트 8개, 타입 검사, 전체 린트, 포맷, 빌드 및 diff 검사 통과.
테스트는 기존 TypeScript 개발 의존성과 Node 내장 테스트 러너만 사용한다.

## 브라우저 검증 결과

Edge headless + Playwright에서 외부 API를 가로채 모의 응답으로 검증했다. 실제 투자 요청은 전송하지 않았다.
각 시나리오에서 브라우저 런타임 오류 없음 및 360/375/390/430px 가로 넘침 없음을 확인했다.

| 시나리오                                            | 확인 결과                                                             |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| 예산 누락 상태에서 수량 감소                        | 3개 → 2개, 섹터 유지                                                  |
| POST 저장 후 응답 유실                              | 재시도 GET에서 동일 내역 확인, POST 총 1회                            |
| PATCH 저장 후 응답 유실                             | 동일 내역 확인, PATCH 총 1회                                          |
| 저장되지 않은 제출의 500 실패                       | GET 확인 후 사용자 재시도로 제출, 총 2회                              |
| 저장 결과 확인 GET 실패                             | 제출 재전송 없음, 완료 모달 없음                                      |
| 미등록 도메인 400 코드                              | 서버 문구 + 확인 버튼, 무조건 재시도하지 않음                         |
| 숫자 HTTP 400 fallback                              | 서버 문구 + 확인 버튼                                                 |
| 반복 백그라운드 조회 실패                           | 닫은 모달 재노출 없음, 인라인 재시도로 복구                           |
| 현황 화면에서 섹터 조회 실패                        | 불필요한 섹터 오류 모달 없음                                          |
| 제출 후 동일 내용의 GET 성공                        | 임시 확정 표시 종료, 서버 응답으로 전환                               |
| 실패한 수정 요청 이후 수량 변경                     | 새 수량으로 PATCH, 이전 요청을 완료로 오판하지 않음                   |
| 실패한 신규 요청 이후 수량 변경, 이전 요청은 저장됨 | 다른 신규 POST를 보내지 않음, 확정 내역 확인 안내                     |
| 오프라인 제출 재시도                                | 확인 GET 즉시 실패, 제출 대기열 없음, 온라인 복구만으로 제출하지 않음 |
| 실패 전에 시작된 오래된 GET이 진행 중               | 이전 조회 취소 후 새 GET, 오래된 결과로 재전송하지 않음               |
| KST 날짜 변경 후 제출 재시도                        | 이전 날짜의 요청 재전송 없음                                          |
| 재확인 응답에 예산 누락                             | 알 수 없는 예산으로 재전송하지 않음                                   |
| 재확인 중 투자 마감                                 | 제출 없음, 수정/확인 시트 종료 및 마감 화면                           |
| 지연된 제출 중 연속 클릭                            | 확정·초기화 잠금, 제출 총 1회                                         |
| 제출 성공 후 GET 실패                               | 확정 내역 유지, 오류 안내·재시도 복구, 추가 제출 없음                 |

## 머지 전 확인과 한계

- 실제 계정으로 신규 투자·수정 후 새로고침하여 서버 저장 결과 확인.
- 서버 저장과 조회 사이의 경합까지 클라이언트의 사전 GET으로 보장하지는 못한다. 중복 POST 처리·멱등성 정책은 백엔드 확인 필요.
- 실패한 요청 기록은 페이지 메모리에 보관한다. 새로고침·다른 기기에서도 유지되는 멱등 키는 구현하지 않는다.
- 실제 모바일 키보드·safe area는 #274 및 공통 레이아웃 작업에서 별도로 확인.
- 이 환경은 Node 24이며 프로젝트 지정 버전은 Node 22이다. Node 버전 경고와 500KB 초과 번들 경고가 남아 있다. Node 22 CI 확인 필요.
- 관련 이슈 번호가 실제 생성된 뒤 PR에 연결한다. #273은 배경 PR이므로 `resolves #273`을 쓰지 않는다.
