import { DownloadButtonProps } from "./types";

import "./DownloadButton.scss";

const DownloadButton = ({ className, ...props }: DownloadButtonProps) => {
  return (
    <button type="button"
      className={`download-button ${className ?? ""}`}
      {...props}
    >
      <span className="download-button--label">
        {"Download"}
      </span>
    </button>
  );
};

export default DownloadButton;