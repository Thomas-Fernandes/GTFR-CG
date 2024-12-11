import { SelectorProps } from "./types";

import "./Selector.scss";

const Selector: React.FC<SelectorProps> = ({ setter, options, ...selectProps }): JSX.Element => {
  return (
    <select
      onChange={(e) => setter(e.target.value)}
      className={`selector ${selectProps.className ?? ""}`}
      {...selectProps}
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