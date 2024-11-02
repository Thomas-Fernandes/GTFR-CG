import React from "react";

import "./ButtonRemove.css";

type Props = {
  className?: string;
  onClick: () => void;
};

const ButtonRemove: React.FC<Props> = ({ className, onClick }) => {
  return (
    <button type="button" className={"btn-remove " + (className ?? "")}
      onClick={onClick}
    >
      <span className="btn-remove--cross">{"✖"}</span>
    </button>
  );
};

export default ButtonRemove;
