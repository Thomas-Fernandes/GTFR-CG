import { ButtonRemoveProps } from "./types";

import "./ButtonRemove.scss";

const ButtonRemove = ({ onClick, className, ...buttonProps }: ButtonRemoveProps) => {
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
