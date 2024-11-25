import React from "react";

import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} style={{width: "40%", alignSelf: "center"}}>
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};

export default DarkModeToggle;
