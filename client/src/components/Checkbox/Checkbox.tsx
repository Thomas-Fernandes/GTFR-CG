import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";

import { CheckboxProps } from "./types";
import { getBackgroundColor, getBorder } from "./utils";

import "./Checkbox.scss";

const Checkbox: React.FC<CheckboxProps> = ({ size, checked, disabled, onChange, label, ...buttonProps }) => {
  const { isDarkMode } = useDarkModeContext();

  return (
    <button type="button" className={`checkbox ${disabled ? "disabled" : ""}`}
      onClick={onChange}
      {...buttonProps}
    >
      <div className="checkbox--box"
        style={{
          width: size, height: size,
          backgroundColor: getBackgroundColor(disabled ?? false, checked, isDarkMode),
          border: getBorder(checked, isDarkMode),
        }}
      >
        { checked &&
          <img className="checkbox--mark"
            src={`/svg/check-mark.svg`} alt="check-mark" width={size * .75}
          />
        }
      </div>

      { label &&
        <span className={`checkbox--label ${disabled ? "disabled" : ""}`}>
          {label}
        </span>
      }
    </button>
  );
};

export default Checkbox;