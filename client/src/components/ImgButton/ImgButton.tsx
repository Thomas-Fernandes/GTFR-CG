import React, { useState } from "react";

import "./ImgButton.css";

type Props = {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onClick?: () => void;
};

const ImgButton: React.FC<Props> = ({ src, alt, className, onLoad, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="img-button">
      <button
        style={{
          padding: isHovered ? "5px" : "0",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <img
          src={src} alt={alt} onLoad={onLoad}
          className={className}
        />
      </button>
    </div>
  );
};

export default ImgButton;
