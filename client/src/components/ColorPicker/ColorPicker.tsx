import { useState } from "react";

import { useDarkModeContext } from "@/common/hooks/useDarkMode/contexts";
import { sendToast } from "@/common/Toast";
import ButtonRemove from "@/components/ButtonRemove/ButtonRemove";
import { Toast, ToastType } from "@/constants/toasts";

import { ColorPickerProps } from "./types";

import "./ColorPicker.scss";

const ColorPicker: React.FC<ColorPickerProps> = ({ id, latest, label, labelClassName, setter }) => {
  const { isDarkMode } = useDarkModeContext();

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
    if (!latest) {
      sendToast(Toast.NoLatestColor, ToastType.Warn);
      return;
    }
    setSelectedColor(latest);
    setter(latest);
  };

  return (
    <div id={id} className="color-picker">
      { selectedColor === ""
      ? <>
          <span className={`color-picker--label ${label ? (labelClassName ?? "") : "hidden"}`}>
            {label}
          </span>
          <div className="color-picker--content">
            {/* if input had class 'hidden', element not found so picking tab is displayed at the top-left corner of the window */}
            <input
              type="color" name="color-picker" id="color-picker" className="hidden-h"
              value={selectedColor !== "" ? selectedColor : "black"} onChange={handleColorChange}
            />
            <label htmlFor="color-picker" className={`color-picker--content--img ${isDarkMode ? "dark" : "light"}`}>
              <span className="hidden">🎨</span>
            </label>

            <button type="button" className="color-picker--content--load-latest mac"
              onClick={handleLoadLatest}
            >
              {"Load latest"}
            </button>
          </div>
        </>
      : <div id="defined">
          <p className="hidden-v"> {/* hidden; is here so that the div keeps the same width when a color is picked */}
            {label}
          </p>

          <div className="color-picker--color">
            <span
              style={{
                backgroundColor: selectedColor,
                color: calculateLuminance(selectedColor) > 128 ? "$secondary-3" : "$secondary-1"
              }}
            >
              {selectedColor}
            </span>

            <ButtonRemove onClick={() => handleColorChange(null)} />
          </div>
        </div>
      }
    </div>
  );
};

export default ColorPicker;
