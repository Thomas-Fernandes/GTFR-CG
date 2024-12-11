import { ActionButtonProps } from "./types";

import "./ActionButton.scss";

const ActionButton = ({ label, className, ...props }: ActionButtonProps) => {
  return (
    <button type="button"
      className={`action-button ${className ?? ""}`}
      {...props}
    >
      <span className="action-button--label">
        {label}
      </span>
    </button>
  );
};

export default ActionButton;