import { DEFAULT_SELECTED_POSITION } from "@/pages/ProcessedArtworks/components/ThumbnailGallery/constants";
import { PROCESSED_ARTWORKS_PATH } from "@/pages/ProcessedArtworks/constants";
import { useThumbnailGalleryContext } from "@/pages/ProcessedArtworks/contexts";
import { processImageName } from "@/pages/ProcessedArtworks/utils";

import { ThumbnailOptionProps } from "./types";

import "./ThumbnailOption.scss";

const ThumbnailOption = ({ logoPosition, idx }: ThumbnailOptionProps) => {
  const { setSelectedThumbnail } = useThumbnailGalleryContext();

  return (
    <div className="thumbnail-option">
      <label htmlFor={`radio_${idx}`}>
        <img src={`${PROCESSED_ARTWORKS_PATH}/${processImageName(logoPosition)}`} alt={logoPosition} />
      </label>
      <input
        type="radio"
        id={`radio_${idx}`}
        name="selected_thumbnail_idx"
        value={idx.toString()}
        defaultChecked={logoPosition === DEFAULT_SELECTED_POSITION}
        onClick={() => setSelectedThumbnail(logoPosition)}
      />
    </div>
  );
};

export default ThumbnailOption;
