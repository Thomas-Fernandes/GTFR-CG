import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";
import { ThemeType } from "@/components/DarkModeProvider/constants";
import { SvgPaths } from "@/constants/media";

import "./ThemeSwitch.scss";

const ThemeSwitch = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`theme-switch ${isDarkMode ? ThemeType.Dark : ThemeType.Light}`}
    >
      <img src={SvgPaths.ThemeCircle} alt={"theme-switch"} />
    </button>
  );
};

export default ThemeSwitch;
