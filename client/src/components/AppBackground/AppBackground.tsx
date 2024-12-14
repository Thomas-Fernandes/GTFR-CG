import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";

import "./AppBackground.scss";

const AppBackground = () => {
  const { isDarkMode } = useDarkModeContext();

  return (
    <>
      <div className={`app-background--waves ${isDarkMode ? "dark" : "light"}`} />
      <div className="app-background--gif-gallery" />
      <ThemeSwitch />
    </>
  );
};

export default AppBackground;
