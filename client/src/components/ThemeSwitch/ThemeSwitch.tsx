import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";

import "./ThemeSwitch.scss";

const ThemeSwitch: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className={`theme-switch ${isDarkMode ? "dark" : "light"}`}>
      <img src={"/svg/theme-circle.svg"} alt={"theme-switch"} />
    </button>
  );
};

export default ThemeSwitch;
