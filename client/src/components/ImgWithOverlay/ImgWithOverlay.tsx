import React, { ComponentPropsWithoutRef } from "react";

import "./ImgWithOverlay.css";

type Props = ComponentPropsWithoutRef<"img"> & {
  alt: string;
  overlayText: string;
  className?: string;
};

const ImgWithOverlay: React.FC<Props> = ({ alt, overlayText, className, ...imgProps }) => {
  return (
    <div className="image-container">
      <img
        alt={alt}
        className={`${className} image`}
        {...imgProps}
      />
      <div className="overlay">
        <span className="overlay-text">{overlayText}</span>
      </div>
    </div>
  );
};

export default ImgWithOverlay;
