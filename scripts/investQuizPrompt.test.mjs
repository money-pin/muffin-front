import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function load(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2023,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const {
  getInvestmentQuizPromptVariant: variant,
  shouldCheckInvestmentQuiz: shouldCheck,
  INVESTMENT_QUIZ_PROMPT_COPY: copy,
} = await load("../src/pages/invest/trade/utils/investmentQuizPrompt.ts");
const { getKstDateKey: day } = await load(
  "../src/pages/invest/trade/utils/investmentDate.ts",
);
const quiz = (sessionStatus = "NOT_STARTED", quizSetStatus = "PUBLISHED") => ({
  quizSetStatus,
  sessionStatus,
  progress: {
    totalCount: 3,
    solvedCount: sessionStatus === "PROGRESS" ? 1 : 0,
    correctCount: 0,
    nextQuestionOrder: 1,
  },
  questions: [{ quizId: 1, quizOrder: 1, question: "test", options: [] }],
});
test("공개된 미응시·일부 진행 상태만 각각 안내한다", () => {
  assert.equal(variant(quiz()), "not-started");
  assert.equal(variant(quiz("PROGRESS")), "in-progress");
});
test("완료했거나 알 수 없는 진행 상태에서는 안내하지 않는다", () => {
  for (const status of ["FINISHED", "UNKNOWN", "", null])
    assert.equal(variant(quiz(status)), null);
});
test("미공개·생성 중·미제공 퀴즈는 안내하지 않는다", () => {
  for (const status of ["GENERATING", "READY", "UNAVAILABLE", "UNKNOWN"]) {
    assert.equal(variant(quiz("NOT_STARTED", status)), null);
    assert.equal(variant(quiz("PROGRESS", status)), null);
  }
});
test("공개 응답이어도 문제가 없으면 안내하지 않는다", () => {
  assert.equal(variant({ ...quiz(), questions: [] }), null);
});
test("수정 투자는 퀴즈 조회 대상에서 제외한다", () => {
  assert.equal(shouldCheck({ isEdit: true, dateKey: "today" }, "today"), false);
  assert.equal(shouldCheck({ isEdit: false, dateKey: "today" }, "today"), true);
  assert.equal(shouldCheck(null, "today"), false);
});
test("이전 날짜의 투자 완료는 퀴즈 안내를 시작하지 않는다", () => {
  assert.equal(
    shouldCheck({ isEdit: false, dateKey: "yesterday" }, "today"),
    false,
  );
});
test("KST 자정과 연말 경계를 브라우저 시간대와 무관하게 구분한다", () => {
  const before = day(new Date("2026-12-31T14:59:59Z"));
  const after = day(new Date("2026-12-31T15:00:00Z"));
  assert.notEqual(before, after);
  assert.equal(after, day(new Date("2027-01-01T00:00:00+09:00")));
  assert.equal(shouldCheck({ isEdit: false, dateKey: before }, after), false);
});
test("상태별 승인 문구와 버튼 레이블을 유지한다", () => {
  assert.equal(copy["not-started"].title, "아직 퀴즈를 풀지 않았어요!");
  assert.equal(
    copy["not-started"].description,
    "퀴즈를 풀고 최대 30만 원을 더 받아 투자해 보세요!",
  );
  assert.equal(copy["not-started"].action, "퀴즈 풀기");
  assert.equal(copy["in-progress"].title, "아직 퀴즈를 전부 풀지 않았어요!");
  assert.equal(
    copy["in-progress"].description,
    "남은 퀴즈를 풀고 투자금을 받아보세요!",
  );
  assert.equal(copy["in-progress"].action, "이어서 풀기");
});
