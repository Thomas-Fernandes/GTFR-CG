import { useNavigate } from "react-router-dom";

import { NavButtonProps } from "./types";

import "./NavButton.scss";

const NavButton: React.FC<NavButtonProps> = ({ to, label, side, ...buttonProps }) => {
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