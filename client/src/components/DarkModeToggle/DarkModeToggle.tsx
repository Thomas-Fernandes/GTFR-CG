import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";

import "./DarkModeToggle.scss";

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className="dark-mode-toggle">
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
