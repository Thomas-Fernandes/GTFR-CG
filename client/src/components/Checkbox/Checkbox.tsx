import { ComponentPropsWithoutRef, JSX } from "react";

import "./Checkbox.scss";

type Props = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: string;
};

const Checkbox: React.FC<Props> = ({ id, label, ...inputProps }): JSX.Element => {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox" name={id} id={id}
        {...inputProps}
      />
      <p className="checkbox--label italic">
        {label}
      </p>
    </label>
  )
};

export default Checkbox;