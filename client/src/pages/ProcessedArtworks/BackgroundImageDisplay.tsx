import DownloadButton from "@/components/DownloadButton/DownloadButton";

import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH } from "./constants";
import { handleSubmitDownloadImage } from "./handlers";

import "./BackgroundImageDisplay.scss";

const BackgroundImageDisplay = () => {
  return (
    <div id="image-container">
      <img src={`${PROCESSED_ARTWORKS_PATH}/${COVER_ART_FILENAME}`} alt={"background thumbnail"} />

      <DownloadButton className="mac"
        onClick={() => handleSubmitDownloadImage(COVER_ART_FILENAME)}
      />
    </div>
  );
};

export default BackgroundImageDisplay;