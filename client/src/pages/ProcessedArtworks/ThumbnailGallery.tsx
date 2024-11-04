import { JSX, useMemo, useState } from "react";

import { DEFAULT_SELECTED_POSITION, LOGO_POSITIONS } from "./constants";
import { ThumbnailGalleryContext } from "./contexts";
import { handleSubmitDownloadImage } from "./handlers";
import ThumbnailOption from "./ThumbnailOption";
import { processImageName } from "./utils";

import "./ThumbnailGallery.css";

const ThumbnailGallery = (): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail ] = useState(DEFAULT_SELECTED_POSITION);

  const contextValue = useMemo(() => ({ setSelectedThumbnail }), []);

  return (
    <div id="thumbnails">
      <form onSubmit={(e) => handleSubmitDownloadImage(e, { selectedImage: processImageName(selectedThumbnail) })}>
        <div id="thumbnail-grid">
          <ThumbnailGalleryContext.Provider value={contextValue}>
            { LOGO_POSITIONS.map((logoPosition, idx) =>
              <ThumbnailOption key={`thumbnail-item_${idx}`} logoPosition={logoPosition} idx={idx} />
            )}
          </ThumbnailGalleryContext.Provider>
        </div>
        <input type="submit" value="Download" className="button" />
      </form>
    </div>
  );
};

export default ThumbnailGallery;