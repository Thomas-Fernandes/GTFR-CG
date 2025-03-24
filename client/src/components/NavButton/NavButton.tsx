import { useNavigate } from "react-router-dom";

import { NavButtonProps } from "./types";

import "./NavButton.scss";

const NavButton = ({ to, label, side, ...buttonProps }: NavButtonProps) => {
  const navigate = useNavigate();

  return (
    <button type="button" className="nav-button"
      onClick={() => navigate(to)}
      {...buttonProps}
    >
      <span className={side}>
        {label}
      </span>
    </button>
  );
};

export default NavButton;