import { useLayoutEffect, useRef, type RefObject } from "react";
import { registerDialogFocus } from "./dialogFocus";

export function useDialogFocus(
  active: boolean,
  rootRef: RefObject<HTMLDivElement | null>,
  dialogRef: RefObject<HTMLElement | null>,
  onEscape?: () => void,
  focusContainer = false,
) {
  const escapeRef = useRef(onEscape);
  useLayoutEffect(() => {
    escapeRef.current = onEscape;
  }, [onEscape]);
  useLayoutEffect(() => {
    if (!active || !rootRef.current || !dialogRef.current) return;
    return registerDialogFocus(
      rootRef.current,
      dialogRef.current,
      () => escapeRef.current?.(),
      focusContainer,
    );
  }, [active, rootRef, dialogRef, focusContainer]);
}
