import { useContext } from "react";
import { ThemeContext } from "./context";

export function useThemeContext() {
  return useContext(ThemeContext);
}
