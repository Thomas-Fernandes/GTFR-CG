import React, { useState } from "react";

import { sendToast } from "@/common/toast";

import { TOAST, TOAST_TYPE } from "@constants/Toast";

type Props = {
  id: string;
  latest?: string;
  label?: string;
  labelClassName?: string;
  setter: (color: string) => void;
};

const ColorPicker: React.FC<Props> = ({ id, latest, label, labelClassName, setter }) => {
  const trueLabelClassName = labelClassName ? (" " + labelClassName) : "";

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
    <div id={id} className="color-picker flex-row"> {/* flex-row stays for the color result label height calculation */}
      <div className={"flexbox" + (selectedColor === "" ? " g-p5" : "")}>
        { selectedColor === ""
        ? <><p className={"m-0 italic" + (label ? trueLabelClassName : " hidden")}>
            {label}
          </p>
          <div className="flex-row">
            {/* if input had class 'hidden', element not found so picking tab is displayed at the top-left corner of the window */}
            <input
              type="color" name="color-picker" id="color-picker" className="hidden-h"
              value={selectedColor !== "" ? selectedColor : "#000000"} onChange={handleColorChange}
            />
            <label htmlFor="color-picker" className="color-picker--img">
              <img src="/img/color-dropper-42.png" alt="color-picker" />
            </label>
            <button
              type="button" className="color-picker--load-latest"
              onClick={handleLoadLatest}
            >
              {"Load latest"}
            </button>
          </div></>
        : <><p className="m-0 italic hidden-v">
            {/* hidden; is here so that the div keeps the same width when a color is picked */}
            {label}
          </p>
          <div className="flex-row g-p5">
            <p
              className="color-picker--color"
              style={{
                backgroundColor: selectedColor,
                color: calculateLuminance(selectedColor) > 128 ? "#000000" : "#ffffff"
              }}
            >
              {selectedColor}
            </p>
            <button type="button" className="btn-remove"
              onClick={() => handleColorChange(null)}
            >
              <span className="btn-remove--cross">{"✖"}</span>
            </button>
          </div></>
        }
      </div>
    </div>
  );
};

export default ColorPicker;
