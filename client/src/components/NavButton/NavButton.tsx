import { ComponentPropsWithoutRef } from "react";
import { useNavigate } from "react-router-dom";

import { NavButtonSideType } from "./types";

type Props = ComponentPropsWithoutRef<"button"> & {
  to: string;
  label: string;
  side: NavButtonSideType;
};

const NavButton: React.FC<Props> = ({ to, label, side, ...props }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button" onClick={() => navigate(to)}
      {...props}
    >
      <span className={side}>{label}</span>
    </button>
  );
};

export default NavButton;