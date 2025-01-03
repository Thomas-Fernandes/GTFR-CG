import { ImgWithOverlayProps } from "./types";

import "./ImgWithOverlay.scss";

const ImgWithOverlay: React.FC<ImgWithOverlayProps> = ({ overlayText, newTabLink, className, ...imgProps }) => {
  return (
    <div className="iwo">
      <img
        alt={imgProps.alt}
        className={`iwo--image ${className ?? ""}`}
        {...imgProps}
      />
      <div className="iwo--overlay">
        <span className="iwo--overlay--text">{overlayText}</span>
        { newTabLink &&
          <img src={"/svg/new-tab.svg"} alt={"new-tab"} className="iwo--overlay--icon" />
        }
      </div>
    </div>
  );
};

export default ImgWithOverlay;
