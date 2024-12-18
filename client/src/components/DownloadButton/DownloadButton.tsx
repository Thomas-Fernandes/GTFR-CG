import { DownloadButtonProps } from "./types";

import "./DownloadButton.scss";

const DownloadButton = ({ label, className, ...props }: DownloadButtonProps) => {
  return (
    <button type="button"
      className={`download-button ${className ?? ""}`}
      {...props}
    >
      <span className="download-button--label">
        {label ?? "Download"}
      </span>
    </button>
  );
};

export default DownloadButton;