import React, { useCallback, useEffect, useMemo, useState } from "react";

import { DarkModeContext } from "@/common/hooks/useDarkMode/contexts";

import { ThemeType } from "./constants";

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === ThemeType.Dark);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? ThemeType.Dark : ThemeType.Light);
    localStorage.setItem("theme", isDarkMode ? ThemeType.Dark : ThemeType.Light);
    // console.log("Dark mode:", isDarkMode); // Check the state value
    // document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    // localStorage.setItem("theme", isDarkMode ? "dark" : "light");
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
