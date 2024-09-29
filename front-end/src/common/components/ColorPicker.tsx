import React, { useState } from "react";

type Props = {
  id: string;
  defaultColor?: string;
  label?: string;
  labelClassName?: string;
  setter: (color: string) => void;
};

const ColorPicker: React.FC<Props> = ({ id, defaultColor, label, labelClassName, setter }) => {
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor ?? ""); // Default to black color

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
        <input
          type="color" name="color-picker" className={selectedColor !== "" ? "hidden" : ""}
          value={selectedColor} onChange={handleColorChange}
        />
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
