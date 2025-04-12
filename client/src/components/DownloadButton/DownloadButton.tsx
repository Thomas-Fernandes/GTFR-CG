import { useAppContext } from "@/contexts";

import { DownloadButtonProps } from "./types";

import "./DownloadButton.scss";

const DownloadButton = ({ label, className, ...props }: DownloadButtonProps) => {
  const { intl } = useAppContext();
  const labels = {
    download: intl.formatMessage({ id: "components.downloadButton.download" }),
  };

  return (
    <button type="button" className={`download-button ${className ?? ""}`} {...props}>
      <span className="download-button--label">{label ?? labels.download}</span>
    </button>
  );
};

export default DownloadButton;
