import { useEffect } from "react";
import { createPortal } from "react-dom";

import TopBar from "@/components/common/TopBar";
import {
  PRIVACY_POLICY_EFFECTIVE_DATE,
  PRIVACY_POLICY_LEAD,
  PRIVACY_POLICY_SECTIONS,
  type PrivacyBlock,
} from "@/pages/legal/privacyPolicyData";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function Block({ block }: { block: PrivacyBlock }) {
  if (typeof block === "string") {
    return (
      <p className="text-body-14-md break-keep text-neutral-700">{block}</p>
    );
  }
  return (
    <ul className="flex flex-col gap-1">
      {block.bullets.map((item) => (
        <li
          key={item}
          className="text-body-14-md flex gap-2 break-keep text-neutral-700"
        >
          <span aria-hidden="true" className="shrink-0 text-neutral-400">
            ·
          </span>
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

// 개인정보처리방침 전문 오버레이. 회원가입·설정 두 곳에서 재사용한다.
// 앱 프레임(max-w-app) 내부에 표시하고 바깥은 딤 처리(반응형 명세).
export default function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-center">
      <div
        aria-hidden="true"
        className="bg-neutral-1000/30 absolute inset-0"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full max-w-[var(--max-width-app)] flex-col bg-white">
        <TopBar title="개인정보처리방침" showBack onBack={onClose} />

        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-12">
          <p className="text-body-14-md break-keep text-neutral-700">
            {PRIVACY_POLICY_LEAD}
          </p>

          <div className="mt-8 flex flex-col gap-8">
            {PRIVACY_POLICY_SECTIONS.map((section) => (
              <section key={section.title} className="flex flex-col gap-3">
                <h2 className="text-body-16-bd-tighter text-neutral-900">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-2">
                  {section.body.map((block, index) => (
                    <Block key={index} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="text-body-14-md mt-10 text-neutral-400">
            {PRIVACY_POLICY_EFFECTIVE_DATE}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
