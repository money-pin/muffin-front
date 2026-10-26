import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export const BottomNavigationVisibilityContext = createContext<
  Dispatch<SetStateAction<boolean>>
>(() => {});

export function useBottomNavigationVisibility() {
  return useContext(BottomNavigationVisibilityContext);
}
