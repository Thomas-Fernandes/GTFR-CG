import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";
import { ThemeType } from "@/components/DarkModeProvider/constants";

import "./ThemeSwitch.scss";

const ThemeSwitch: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button type="button" className={`theme-switch ${isDarkMode ? ThemeType.Dark : ThemeType.Light}`}
      onClick={toggleDarkMode}
    >
      <img src={"/svg/theme-circle.svg"} alt={"theme-switch"} />
    </button>
  );
};

export default ThemeSwitch;
