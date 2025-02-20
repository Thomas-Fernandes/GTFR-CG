import { useDarkModeContext } from "./contexts";

export const useDarkMode = () => {
  const context = useDarkModeContext();

  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }

  return context;
};
