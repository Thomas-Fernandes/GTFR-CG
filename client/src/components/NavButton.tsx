import { useNavigate } from "react-router-dom";

type NavButtonProps = {
  to: string;
  label: string;
  side: "left" | "right";
};

const NavButton = ({ to, label, side }: NavButtonProps) => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(to)}>
      <span className={side}>
        {label}
      </span>
    </button>
  );
};

export default NavButton;