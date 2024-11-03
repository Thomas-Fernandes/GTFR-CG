import { ComponentPropsWithoutRef, JSX } from "react";

import { StateSetter } from "@common/types";

import "./Selector.css";

export type Option = {
  label: string;
  value: string;
};

type Props = ComponentPropsWithoutRef<"select"> & {
  setter: StateSetter<string>;
  options: Option[];
};

const Selector: React.FC<Props> = ({ setter, options, ...props }): JSX.Element => {
  return (
    <select
      onChange={(e) => setter(e.target.value)}
      className={`selector ${props.className ?? ""}`}
      {...props}
    >
      { options.map((option, idx) => (
        <option
          key={`${idx.toString()}_${option.value}`} value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Selector;