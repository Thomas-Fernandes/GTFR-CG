import ImgWithOverlay from "@/components/ImgWithOverlay/ImgWithOverlay";

import { ImgButtonProps } from "./types";

import "./ImgButton.scss";

const ImgButton: React.FC<ImgButtonProps> = ({ src, alt, onClick, overlayText, newTabLink, ...imgProps }) => {
  return (
    <div className="img-button">
      <button onClick={onClick}>
        { overlayText
        ? <ImgWithOverlay overlayText={overlayText} newTabLink={newTabLink}
            src={src} alt={alt} {...imgProps}
          />
        : <img src={src} alt={alt} {...imgProps} />
        }
      </button>
    </div>
  );
};

export default ImgButton;
