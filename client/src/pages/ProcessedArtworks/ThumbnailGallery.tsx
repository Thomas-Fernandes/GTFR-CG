import { JSX, useState } from "react";

import { DEFAULT_SELECTED_POSITION, LOGO_POSITIONS, PROCESSED_ARTWORKS_PATH } from "./constants";
import { handleSubmitDownloadImage } from "./handlers";
import { ThumbnailOptionProps } from "./types";
import { processImageName } from "./utils";

import "./ThumbnailGallery.css";

const ThumbnailOption: React.FC<ThumbnailOptionProps> = ({ logoPosition, idx, setSelectedThumbnail }): JSX.Element => {
  return (
    <div className="thumbnail-item" key={"thumbnail-item" + idx.toString()}>
      <label htmlFor={"radio_" + idx}>
        <img src={PROCESSED_ARTWORKS_PATH + "/" + processImageName(logoPosition)} alt={logoPosition} />
      </label>
      <input
        type="radio" id={"radio_" + idx} name="selected_thumbnail_idx" value={idx.toString()}
        defaultChecked={logoPosition === DEFAULT_SELECTED_POSITION}
        onClick={() => setSelectedThumbnail(logoPosition)}
      />
    </div>
  );
};

const ThumbnailGallery = (): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail ] = useState(DEFAULT_SELECTED_POSITION);

  return (
    <div id="thumbnails">
      <form onSubmit={(e) => handleSubmitDownloadImage(e, { selectedImage: processImageName(selectedThumbnail) })}>
        <div id="thumbnail-grid">
          { LOGO_POSITIONS.map((logoPosition, idx) =>
            <ThumbnailOption key={idx} logoPosition={logoPosition} idx={idx} setSelectedThumbnail={setSelectedThumbnail} />
          )}
        </div>
        <input type="submit" value="Download" className="button" />
      </form>
    </div>
  );
};

export default ThumbnailGallery;