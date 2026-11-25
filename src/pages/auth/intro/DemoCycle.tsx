import type { ReactNode } from "react";

interface DemoCycleProps {
  cycle: number;
  isLeaving: boolean;
  children: ReactNode;
}

// 데모 한 바퀴를 감싸는 틀 (#335)
// 반복할 때마다 key로 새로 그려 역방향 전환 없이 처음 상태에서 다시 시작하고,
// 끝날 때는 흐려졌다가 새 바퀴는 서서히 나타난다.
// 안쪽 목업은 absolute라 이 틀은 위치를 잡지 않는다(position 없음).
export default function DemoCycle({
  cycle,
  isLeaving,
  children,
}: DemoCycleProps) {
  return (
    <div
      key={cycle}
      className={`intro-demo-cycle transition-opacity duration-[400ms] ease-in-out ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
