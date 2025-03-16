import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";
import { ThemeType } from "@/components/DarkModeProvider/constants";
import LocaleSwitch from "@/components/LocaleSwitch/LocaleSwitch";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";
import { ViewPaths } from "@/constants/paths";

import "./AppBackground.scss";

const AppBackground: React.FC = () => {
  const { isDarkMode } = useDarkModeContext();

  const location = useLocation();
  const [isLandingPage, setIsLandingPage] = useState(false);

  useEffect(() => {
    setIsLandingPage(location.pathname === ViewPaths.LandingPage);
  }, [location])

  return (
    <>
      <div className={`app-background--gif-gallery ${isLandingPage ? "landing-page" : ""}`} />
      <div className={`app-background--waves ${isLandingPage ? "landing-page" : ""} ${isDarkMode ? ThemeType.Dark : ThemeType.Light}`} />
      <ThemeSwitch />
      <LocaleSwitch />
    </>
  );
};

export default AppBackground;
