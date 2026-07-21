import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import type { TopBarOutletContext } from "@/layouts/TopBarLayout";
import { clearAccessToken } from "@/lib/auth";
import chevronRightIcon from "@/assets/icon-24px/chevron-right-thin.svg";

import SettingToggle from "./components/SettingToggle";
import ConfirmModal from "./components/ConfirmModal";
import { APP_VERSION } from "./myData";

type NotificationKey = "news" | "quiz" | "invest" | "ranking";

const NOTIFICATION_ROWS: { key: NotificationKey; label: string }[] = [
  { key: "news", label: "뉴스 업데이트 알림" },
  { key: "quiz", label: "일일 퀴즈 알림" },
  { key: "invest", label: "투자 결과 알림" },
  { key: "ranking", label: "랭킹 변동 알림" },
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

  const [notifications, setNotifications] = useState<
    Record<NotificationKey, boolean>
  >({
    news: true,
    quiz: true,
    invest: true,
    ranking: false,
  });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // accessToken만 지운다. refreshToken은 httpOnly 쿠키라 FE에서 삭제 불가 —
  // 완전한 세션 종료는 백엔드 로그아웃 API가 붙은 뒤 함께 호출해야 함
  const handleLogout = () => {
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setTopBar({ title: "설정", showBack: true });
    return resetTopBar;
  }, [setTopBar, resetTopBar]);

  const toggleNotification = (key: NotificationKey) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
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
              checked={notifications[key]}
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
        <LinkRow label="개인 정보 처리 방침" />
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
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default MySettingsPage;
