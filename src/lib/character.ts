import { useState } from "react";

// 머핀 캐릭터 종류. 온보딩에서 지정되는 건 plain/sprinkle/butter 3종이며,
// cream(샘크림)은 추후 레벨업 언락 전용이라 온보딩 결과에는 포함되지 않는다.
export type CharacterVariant = "plain" | "sprinkle" | "cream" | "butter";

const STORAGE_KEY = "muffin:character";
const DEFAULT_VARIANT: CharacterVariant = "plain";

export const CHARACTER_LABELS: Record<CharacterVariant, string> = {
  plain: "플레인 머핀",
  sprinkle: "스프링클 머핀",
  butter: "버터빛 머핀",
  cream: "생크림 머핀",
};

function isCharacterVariant(value: unknown): value is CharacterVariant {
  return (
    value === "plain" ||
    value === "sprinkle" ||
    value === "cream" ||
    value === "butter"
  );
}

// 온보딩 완료 시 결정된 캐릭터를 저장 (API 연동 전 localStorage 기반)
export function saveCharacter(variant: CharacterVariant) {
  try {
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // 저장 실패(프라이빗 모드 등)는 무시 — 기본값으로 동작
  }
}

export function getCharacter(): CharacterVariant {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isCharacterVariant(stored)) return stored;
  } catch {
    // 접근 실패 시 기본값
  }
  return DEFAULT_VARIANT;
}

// 컴포넌트에서 현재 캐릭터를 읽는 훅 (마운트 시 1회 읽기)
export function useCharacter(): CharacterVariant {
  const [variant] = useState(getCharacter);
  return variant;
}
