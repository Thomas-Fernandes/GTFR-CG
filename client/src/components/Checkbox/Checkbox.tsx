import { JSX } from "react";

import "./Checkbox.css";

type Props = {
  id: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: React.FC<Props> = ({ id, label, defaultChecked, disabled, onChange }): JSX.Element => {
  return (
    <label className="checkbox" htmlFor={id}>
      <input
        type="checkbox" name={id} id={id}
        defaultChecked={defaultChecked ?? false}
        disabled={disabled ?? false}
        onChange={onChange}
      />
      <p className="checkbox-label italic">
        {label}
      </p>
    </label>
  )
};

export default Checkbox;