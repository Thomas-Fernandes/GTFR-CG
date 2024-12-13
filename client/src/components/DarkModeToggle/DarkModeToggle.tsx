import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";

import "./DarkModeToggle.scss";

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className={`dark-mode-toggle ${ isDarkMode ? "dark" : "light" }`}>
      <img src={"/svg/theme-circle.svg"} alt={"dark-mode-toggle"} />
    </button>
  );
};

export default DarkModeToggle;
