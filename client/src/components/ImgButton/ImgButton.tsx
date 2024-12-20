import React, { ComponentPropsWithoutRef, useState } from "react";

import "./ImgButton.css";

type Props = ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
  onClick?: () => void;
};

const ImgButton: React.FC<Props> = ({ src, alt, onClick, ...imgProps }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="img-button">
      <button
        style={{
          padding: isHovered ? ".33rem" : "0",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <img
          src={src} alt={alt}
          {...imgProps}
        />
      </button>
    </div>
  );
};

export default ImgButton;
