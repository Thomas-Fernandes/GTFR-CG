import { ActionButtonProps } from "./types";

import "./ActionButton.scss";

const ActionButton = ({ label, className, newTabLink, ...props }: ActionButtonProps) => {
  return (
    <button type="button"
      className={`action-button ${className ?? ""}`}
      {...props}
    >
      <span className="action-button--label">
        {label}
      </span>
      { newTabLink &&
        <img src={"/svg/new-tab.svg"} alt={"new-tab"} className="action-button--icon" />
      }
    </button>
  );
};

export default ActionButton;