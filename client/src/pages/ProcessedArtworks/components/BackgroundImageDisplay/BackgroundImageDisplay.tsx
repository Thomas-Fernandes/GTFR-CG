import DownloadButton from "@/components/DownloadButton/DownloadButton";
import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH } from "@/pages/ProcessedArtworks/constants";
import { handleSubmitDownloadImage } from "@/pages/ProcessedArtworks/handlers";

const BackgroundImageDisplay = () => {
  return (
    <div id="image-container">
      <img src={`${PROCESSED_ARTWORKS_PATH}/${COVER_ART_FILENAME}`} alt={"background thumbnail"} />

      <DownloadButton onClick={() => handleSubmitDownloadImage(COVER_ART_FILENAME)} className="mac" />
    </div>
  );
};

export default BackgroundImageDisplay;
