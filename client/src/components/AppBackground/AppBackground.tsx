import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle";

import "./AppBackground.scss";

const AppBackground = () => {
  return (
    <>
      <div className="app-background--waves" />
      <div className="app-background--gif-gallery" />
      <DarkModeToggle />
    </>
  );
};

export default AppBackground;
