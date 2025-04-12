import { useState } from "react";

import { ActionButtonProps } from "./types";

import "./ActionButton.scss";

const ActionButton = ({ label, className, newTabLink, ...props }: ActionButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`action-button ${!isHovered ? "gap-0" : "gap-2"} ${className ?? ""}`}
      {...props}
    >
      <span className="action-button--label">{label}</span>
      {newTabLink && (
        <img src={"/svg/new-tab.svg"} alt={"new-tab"} className={`action-button--icon ${isHovered ? "hovered" : ""}`} />
      )}
    </button>
  );
};

export default ActionButton;
