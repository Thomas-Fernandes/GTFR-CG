import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";
import { ThemeType } from "@/components/DarkModeProvider/constants";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";

import "./AppBackground.scss";

const AppBackground: React.FC = () => {
  const { isDarkMode } = useDarkModeContext();

  return (
    <>
      <div className={`app-background--waves ${isDarkMode ? ThemeType.Dark : ThemeType.Light}`} />
      <div className="app-background--gif-gallery" />
      <ThemeSwitch />
    </>
  );
};

export default AppBackground;
