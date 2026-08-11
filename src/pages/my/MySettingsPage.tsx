import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { ApiError } from "@/lib/api";
import { clearAccessToken } from "@/lib/auth";
import { logout, withdraw } from "@/lib/authApi";
import ErrorModal from "@/components/common/ErrorModal";
import { getErrorMessage, type ErrorMessageInfo } from "@/lib/errorMessages";
import {
  updateNotificationSettings,
  type NotificationSettings,
} from "@/lib/mypageApi";
import {
  mypageQueryKeys,
  useNotificationSettingsQuery,
} from "@/lib/mypageQueries";
import chevronRightIcon from "@/assets/icon-24px/chevron-right-thin.svg";

import PrivacyPolicyModal from "@/pages/legal/PrivacyPolicyModal";

import SettingToggle from "./components/SettingToggle";
import ConfirmModal from "./components/ConfirmModal";
import { APP_VERSION } from "./myData";

type NotificationKey = keyof NotificationSettings;

const NOTIFICATION_ROWS: { key: NotificationKey; label: string }[] = [
  { key: "newsUpdate", label: "뉴스 업데이트 알림" },
  { key: "dailyQuiz", label: "일일 퀴즈 알림" },
  { key: "investResult", label: "투자 결과 알림" },
  { key: "rankingChange", label: "랭킹 변동 알림" },
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-body-16-bd-tighter text-neutral-900">{title}</p>
      <div className="flex flex-col rounded-[16px] border border-neutral-100 bg-white px-4">
        {children}
      </div>
    </section>
  );
}

interface LinkRowProps {
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

function LinkRow({ label, danger = false, onClick }: LinkRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[56px] w-full items-center justify-between border-b border-neutral-50 last:border-b-0"
    >
      <span
        className={`text-body-14-md ${danger ? "text-positive" : "text-neutral-900"}`}
      >
        {label}
      </span>
      <img
        src={chevronRightIcon}
        alt=""
        aria-hidden="true"
        className="h-6 w-6"
        draggable={false}
      />
    </button>
  );
}

// Figma 설정: 알림 토글 / 계정(로그아웃·회원 탈퇴 모달) / 고객지원 / 약관 / 앱 정보
// 알림 상태·로그아웃·탈퇴 동작은 API 연동 전 화면만 구현
function MySettingsPage() {
  const navigate = useNavigate();
  const { setTopBar, resetTopBar } = useOutletContext<TopBarOutletContext>();

  const queryClient = useQueryClient();
  const { data: notifications } = useNotificationSettingsQuery();
  const { mutate: saveNotifications } = useMutation({
    mutationFn: updateNotificationSettings,
    // 실패 시 서버 상태로 되돌리기 위해 재조회
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: mypageQueryKeys.notifications(),
      });
    },
  });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [withdrawError, setWithdrawError] = useState<ErrorMessageInfo | null>(
    null,
  );

  // 로그아웃: 백엔드에서 토큰 무효화 후 로컬 토큰 삭제.
  // API가 실패해도 로컬은 비우고 로그인 화면으로 보낸다(세션 종료 보장).
  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 무시 — 로컬 세션은 아래에서 정리
    }
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  // 회원 탈퇴: 서버 소프트 딜리트가 성공했을 때만 로컬 토큰을 지운다.
  // (로그아웃과 달리 실패 시 계정이 남으므로 성공처럼 처리하면 안 됨)
  const handleWithdraw = async () => {
    try {
      await withdraw();
    } catch (error) {
      setWithdrawModalOpen(false);
      setWithdrawError(
        getErrorMessage(error instanceof ApiError ? error.code : "", {
          title: "회원 탈퇴에 실패했어요.",
          description: "잠시 후 다시 시도해주세요.",
          primaryLabel: "확인",
        }),
      );
      return;
    }
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setTopBar({ title: "설정", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const toggleNotification = (key: NotificationKey) => {
    if (!notifications) return;
    const next: NotificationSettings = {
      ...notifications,
      [key]: !notifications[key],
    };
    // 낙관적으로 즉시 반영 후 서버 저장
    queryClient.setQueryData(mypageQueryKeys.notifications(), next);
    saveNotifications(next);
  };

  return (
    <div className="bg-neutral-0 flex flex-col gap-6 px-5 pt-2 pb-12">
      <Section title="알림 설정">
        {NOTIFICATION_ROWS.map(({ key, label }) => (
          <div
            key={key}
            className="flex h-[56px] items-center justify-between border-b border-neutral-50 last:border-b-0"
          >
            <span className="text-body-14-md text-neutral-900">{label}</span>
            <SettingToggle
              checked={notifications?.[key] ?? false}
              onToggle={() => toggleNotification(key)}
              label={label}
            />
          </div>
        ))}
      </Section>

      <Section title="계정 설정">
        <LinkRow label="로그아웃" onClick={() => setLogoutModalOpen(true)} />
        <LinkRow
          label="회원 탈퇴"
          danger
          onClick={() => setWithdrawModalOpen(true)}
        />
      </Section>

      <Section title="고객지원">
        <LinkRow label="고객 문의" />
      </Section>

      <Section title="약관 및 정책">
        <LinkRow label="이용약관" />
        <LinkRow
          label="개인 정보 처리 방침"
          onClick={() => setPrivacyModalOpen(true)}
        />
      </Section>

      <Section title="앱 정보">
        <div className="flex h-[56px] items-center justify-between">
          <span className="text-body-14-md text-neutral-900">버전정보</span>
          <span className="text-body-14-md text-neutral-400">
            {APP_VERSION}
          </span>
        </div>
      </Section>

      <ConfirmModal
        isOpen={logoutModalOpen}
        title="로그아웃 하시겠어요?"
        confirmLabel="확인"
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
      <ConfirmModal
        isOpen={withdrawModalOpen}
        title="정말 탈퇴하시겠어요?"
        description={"탈퇴 시 계정은 영구 삭제되며\n복구할 수 없습니다."}
        confirmLabel="탈퇴하기"
        danger
        onCancel={() => setWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
      />
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
      {withdrawError && (
        <ErrorModal
          isOpen
          info={withdrawError}
          onPrimaryAction={() => setWithdrawError(null)}
          onClose={() => setWithdrawError(null)}
        />
      )}
    </div>
  );
}

export default MySettingsPage;
