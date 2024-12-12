import { DEFAULT_SELECTED_POSITION, PROCESSED_ARTWORKS_PATH } from "./constants";
import { useThumbnailGalleryContext } from "./contexts";
import { ThumbnailOptionProps } from "./types";
import { processImageName } from "./utils";

import "./ThumbnailOption.scss";

const ThumbnailOption: React.FC<ThumbnailOptionProps> = ({ logoPosition, idx }): JSX.Element => {
  const { setSelectedThumbnail } = useThumbnailGalleryContext();

  return (
    <div className="thumbnail-option">
      <label htmlFor={`radio_${idx}`}>
        <img src={PROCESSED_ARTWORKS_PATH + "/" + processImageName(logoPosition)} alt={logoPosition} />
      </label>
      <input type="radio" id={`radio_${idx}`} name="selected_thumbnail_idx"
        value={idx.toString()}
        defaultChecked={logoPosition === DEFAULT_SELECTED_POSITION}
        onClick={() => setSelectedThumbnail(logoPosition)}
      />
    </div>
  );
};

export default ThumbnailOption;