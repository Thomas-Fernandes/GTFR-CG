import React, { ComponentPropsWithoutRef } from "react";

import ImgWithOverlay from "../ImgWithOverlay/ImgWithOverlay";
import "./ImgButton.css";

type Props = ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
  onClick?: () => void;
  overlayText?: string;
};

const ImgButton: React.FC<Props> = ({ src, alt, onClick, overlayText, ...imgProps }) => {

  return (
    <div className="img-button">
      <button onClick={onClick}>
        { overlayText
        ? <ImgWithOverlay overlayText={overlayText}
            src={src} alt={alt} {...imgProps}
          />
        : <img src={src} alt={alt} {...imgProps} />
        }
      </button>
    </div>
  );
};

export default ImgButton;
