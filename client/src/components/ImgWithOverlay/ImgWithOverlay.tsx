import React, { ComponentPropsWithoutRef } from "react";

import "./ImgWithOverlay.scss";

type Props = ComponentPropsWithoutRef<"img"> & {
  alt: string;
  overlayText: string;
  className?: string;
};

const ImgWithOverlay: React.FC<Props> = ({ alt, overlayText, className, ...imgProps }) => {
  return (
    <div className="iwo">
      <img
        alt={alt}
        className={`iwo--image ${className ?? ""}`}
        {...imgProps}
      />
      <div className="iwo--overlay">
        <span className="iwo--overlay--text">{overlayText}</span>
      </div>
    </div>
  );
};

export default ImgWithOverlay;
