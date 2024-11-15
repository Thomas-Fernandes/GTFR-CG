import { ComponentPropsWithoutRef, JSX } from "react";

import "./Checkbox.css";

type Props = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: React.FC<Props> = ({ id, label, onChange, ...inputProps }): JSX.Element => {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox" name={id} id={id}
        onChange={onChange}
        {...inputProps}
      />
      <p className="checkbox-label italic">
        {label}
      </p>
    </label>
  )
};

export default Checkbox;