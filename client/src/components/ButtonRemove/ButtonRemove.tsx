import React, { ComponentPropsWithoutRef } from "react";

import "./ButtonRemove.css";

type Props = ComponentPropsWithoutRef<"button"> & {
  className?: string;
  onClick: () => void;
};

const ButtonRemove: React.FC<Props> = ({ className, onClick, ...props }) => {
  return (
    <button type="button" onClick={onClick}
      className={"btn-remove " + (className ?? "")}
      {...props}
    >
      <span className="btn-remove--cross">{"✖"}</span>
    </button>
  );
};

export default ButtonRemove;
