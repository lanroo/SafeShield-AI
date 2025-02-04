import { createContext } from "react";

export type ThemeContextType = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);
