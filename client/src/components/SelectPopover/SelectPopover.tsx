import { useEffect, useRef, useState } from "react";

import { SelectPopoverProps } from "./types";

import "./SelectPopover.scss";

const SelectPopover: React.FC<SelectPopoverProps> = ({ label, imgSrc, options, onSelect, className, ...divProps }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node))
        setIsOpen(false);
    };

    if (isOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`popover ${className ?? ""}`} {...divProps}>
      <button type="button" title="popover" className="popover--toggle"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {label && <span>{label}</span>}
        {imgSrc && <img src={imgSrc} alt={imgSrc} />}
      </button>

      { isOpen &&
        <div ref={popoverRef} className="popover--dropdown">
          <ul className="popover--dropdown--list">
            { options.map((option) => (
              <div key={option.value} className="popover--dropdown--list--option"
                onClick={() => handleOptionClick(option.value)}
              >
                <li>
                  {option.label}
                </li>
              </div>
            ))}
          </ul>
        </div>
      }
    </div>
  );
};

export default SelectPopover;
