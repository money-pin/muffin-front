import { useState } from "react";
import { useNavigate } from "react-router-dom";

import chevronLeftIcon from "@/assets/icon-28px/chevron-left.svg";
import Button from "@/components/common/Button";
import TextField from "@/components/common/TextField";
import { findAccountEmail } from "@/lib/authApi";

// 계정(아이디=이메일) 찾기 화면 (이슈 #265)
// ⚠️ 백엔드 스펙 확정 전 스캐폴딩. findAccountEmail의 요청/응답 형태가 확정되면
//    이 화면은 대부분 그대로 동작한다. (식별자 추가 시 입력 필드만 보강)
function FindAccountPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = name.trim() !== "" && !isSubmitting;

  const handleFind = async () => {
    if (!canSubmit) return;

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { email } = await findAccountEmail({ name: name.trim() });
      setFoundEmail(email);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "계정을 찾지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="relative flex h-14 shrink-0 items-center px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          className="flex h-7 w-7 items-center justify-center"
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-7 w-7"
            draggable={false}
          />
        </button>
        <h1 className="text-heading-18-bd pointer-events-none absolute left-1/2 -translate-x-1/2 text-neutral-900">
          계정 찾기
        </h1>
      </header>

      {foundEmail === null ? (
        <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
          <h2 className="text-heading-20-bd text-neutral-1000 leading-[1.5]">
            가입 시 입력한
            <br />
            이름을 입력해주세요.
          </h2>

          <div className="mt-9">
            <TextField
              label="이름"
              placeholder="이름을 입력해주세요."
              value={name}
              onChange={setName}
              error={errorMessage || undefined}
            />
          </div>

          <div className="mt-auto">
            <Button onClick={handleFind} disabled={!canSubmit}>
              계정 찾기
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col px-5 pt-5 pb-8">
          <h2 className="text-heading-20-bd text-neutral-1000 leading-[1.5]">
            입력하신 정보로
            <br />
            가입된 계정이에요.
          </h2>

          <div className="mt-9 flex items-center justify-center rounded-[12px] bg-neutral-50 px-5 py-6">
            <span className="text-body-16-bd-tighter text-neutral-1000">
              {foundEmail}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Button onClick={() => navigate("/login")}>로그인하기</Button>
            <Button
              variant="outline"
              onClick={() => navigate("/find-password")}
            >
              비밀번호 찾기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindAccountPage;
