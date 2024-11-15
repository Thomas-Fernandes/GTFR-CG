import React, { ComponentPropsWithoutRef } from "react";

import "./ButtonRemove.css";

type Props = ComponentPropsWithoutRef<"button"> & {
  onClick: () => void;
  className?: string;
};

const ButtonRemove: React.FC<Props> = ({ onClick, className, ...buttonProps }) => {
  return (
    <button type="button" onClick={onClick}
      className={`btn-remove ${className ?? ""}`}
      {...buttonProps}
    >
      <span className="btn-remove--cross">{"✖"}</span>
    </button>
  );
};

export default ButtonRemove;
