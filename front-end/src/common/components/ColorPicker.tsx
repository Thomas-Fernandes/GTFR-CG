import React, { useState } from "react";

import { TOAST, TOAST_TYPE } from "../../constants/Common";
import { sendToast } from "../Toast";

type Props = {
  id: string;
  latest?: string;
  label?: string;
  labelClassName?: string;
  setter: (color: string) => void;
};

const ColorPicker: React.FC<Props> = ({ id, latest, label, labelClassName, setter }) => {
  const [selectedColor, setSelectedColor] = useState<string>(""); // Default to black color

  const calculateLuminance = (hex: string) => {
    const hexColor = hex.replace("#", "");
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return 0.2 * r + 0.7 * g + 0.07 * b;
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    if (e === null) {
      setSelectedColor("");
      setter("");
      return;
    }
    setSelectedColor(e.target.value);
    setter(e.target.value);
  };

  const handleLoadLatest = () => {
    if (!latest){
      sendToast(TOAST.NO_LATEST_COLOR, TOAST_TYPE.WARN);
      return;
    }
    setSelectedColor(latest);
    setter(latest);
  };

  return (
    <div id={id} className="color-picker">
      <div className="flexbox g-p5">
        { selectedColor === ""
        ? <label htmlFor="color-picker"
            className={"italic " + (label ? labelClassName : "hidden")}
          >
            {label}
          </label>
        : <label htmlFor="color-picker"
            className="color-picker--color"
            style={{
              backgroundColor: selectedColor,
              color: calculateLuminance(selectedColor) > 128 ? "#000000" : "#ffffff",
            }}
          >
            {selectedColor}
          </label>
        }
        <div className={selectedColor !== "" ? "hidden" : "flexbox flex-row g-p5"}>
          <input
            type="color" name="color-picker"
            value={selectedColor !== "" ? selectedColor : "#000000"} onChange={handleColorChange}
          />
          <button
            type="button" className="color-picker--load-latest"
            onClick={handleLoadLatest}
          >
            {"Load latest"}
          </button>
        </div>
      </div>
      { selectedColor !== "" &&
        <button type="button" className="btn-remove"
          onClick={() => handleColorChange(null)}
        >
          <span className="btn-remove--cross">{"✖"}</span>
        </button>
      }
    </div>
  );
};

export default ColorPicker;
