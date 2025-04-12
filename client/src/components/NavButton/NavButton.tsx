import { useNavigate } from "react-router-dom";

import { NavButtonProps } from "./types";

import "./NavButton.scss";

const NavButton = ({ to, label, side, ...buttonProps }: NavButtonProps) => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(to)} className="nav-button" {...buttonProps}>
      <span className={side}>{label}</span>
    </button>
  );
};

export default NavButton;
