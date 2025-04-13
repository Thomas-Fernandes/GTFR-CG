import { useEffect, useRef, useState } from "react";

import { SelectPopoverProps } from "./types";

import "./SelectPopover.scss";

const SelectPopover = ({ title, label, imgSrc, options, onSelect, className, ...divProps }: SelectPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`popover ${className ?? ""}`} {...divProps}>
      <button
        type="button"
        title={title ?? "popover"}
        onClick={() => setIsOpen((prev) => !prev)}
        className="popover--toggle"
      >
        {label && <span>{label}</span>}
        {imgSrc && <img src={imgSrc} alt={imgSrc} />}
      </button>

      {isOpen && (
        <div ref={popoverRef} className="popover--dropdown">
          <ul className="popover--dropdown--list">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className="popover--dropdown--list--option"
              >
                <li>{option.label}</li>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectPopover;
