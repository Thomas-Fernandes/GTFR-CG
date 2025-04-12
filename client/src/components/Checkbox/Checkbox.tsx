import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";

import { CheckboxProps } from "./types";
import { getBackgroundColor, getBorder } from "./utils";

import "./Checkbox.scss";

const Checkbox = ({ size, checked, disabled, onChange, label, ...buttonProps }: CheckboxProps) => {
  const { isDarkMode } = useDarkModeContext();

  return (
    <button type="button" onClick={onChange} className={`checkbox ${disabled ? "disabled" : ""}`} {...buttonProps}>
      <div
        className="checkbox--box"
        style={{
          width: size,
          height: size,
          backgroundColor: getBackgroundColor(disabled ?? false, checked, isDarkMode),
          border: getBorder(checked, isDarkMode),
        }}
      >
        {checked && <img src={`/svg/check-mark.svg`} alt="check-mark" width={size * 0.75} className="checkbox--mark" />}
      </div>

      {label && <span className={`checkbox--label ${disabled ? "disabled" : ""}`}>{label}</span>}
    </button>
  );
};

export default Checkbox;
