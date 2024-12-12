import { CheckboxProps } from "./types";

import "./Checkbox.scss";

const Checkbox: React.FC<CheckboxProps> = ({ id, label, ...inputProps }): JSX.Element => {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox" name={id} id={id}
        {...inputProps}
      />
      <span className="checkbox--label">
        {label}
      </span>
    </label>
  )
};

export default Checkbox;