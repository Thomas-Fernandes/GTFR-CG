import ImgWithOverlay from "@/components/ImgWithOverlay/ImgWithOverlay";

import { ImgButtonProps } from "./types";

import "./ImgButton.scss";

const ImgButton = ({ src, onClick, overlayText, newTabLink, ...imgProps }: ImgButtonProps) => {
  return (
    <div className="img-button">
      <button onClick={onClick}>
        {overlayText ? (
          <ImgWithOverlay
            overlayText={overlayText}
            newTabLink={newTabLink}
            src={src}
            alt={imgProps.alt}
            {...imgProps}
          />
        ) : (
          <img src={src} alt={imgProps.alt} {...imgProps} />
        )}
      </button>
    </div>
  );
};

export default ImgButton;
