import { useEffect, useState } from "react";
import type { RefObject } from "react";

// VisualViewport는 키보드가 화면을 덮는 브라우저와 화면을 줄이는 브라우저를
// 모두 지원한다. 핀치 줌은 키보드 높이로 취급하지 않는다.
export function useQuantityKeyboard(
  isEditing: boolean,
  inputRef: RefObject<HTMLInputElement | null>,
) {
  const [keyboard, setKeyboard] = useState({ inset: 0, isOpen: false });

  useEffect(() => {
    if (!isEditing) return;
    const viewport = window.visualViewport;
    if (!viewport) return;
    const initialHeight = window.innerHeight;
    let frame = 0;
    let hasOpenedKeyboard = false;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (viewport.scale !== 1) return;
        const inset = Math.max(
          0,
          window.innerHeight - viewport.height - viewport.offsetTop,
        );
        const keyboardHeight =
          initialHeight - viewport.height - viewport.offsetTop;
        // 작은 주소창 높이 변화는 키보드로 취급하지 않는다.
        const isOpen = keyboardHeight > 120;
        setKeyboard({ inset, isOpen });
        if (isOpen) hasOpenedKeyboard = true;
        else if (hasOpenedKeyboard) inputRef.current?.blur();
      });
    };
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isEditing, inputRef]);

  return {
    keyboardInset: isEditing ? keyboard.inset : 0,
    isKeyboardOpen: isEditing && keyboard.isOpen,
  };
}
