import { useCallback, useEffect, useMemo, useState } from "react";

import { DarkModeContext } from "@/common/hooks/useDarkMode/contexts";

import { ThemeType } from "./constants";
import { DarkModeProviderProps } from "./types";

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === ThemeType.Dark);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? ThemeType.Dark : ThemeType.Light);
    localStorage.setItem("theme", isDarkMode ? ThemeType.Dark : ThemeType.Light);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  const contextValue = useMemo(
    () => ({ isDarkMode, toggleDarkMode }),
    [isDarkMode, toggleDarkMode]
  );

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
};
