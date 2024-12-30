import { useMemo, useState } from "react";

import DownloadButton from "@/components/DownloadButton/DownloadButton";

import { DEFAULT_SELECTED_POSITION, LOGO_POSITIONS } from "./constants";
import { ThumbnailGalleryContext } from "./contexts";
import { handleSubmitDownloadImage } from "./handlers";
import ThumbnailOption from "./ThumbnailOption";
import { processImageName } from "./utils";

import "./ThumbnailGallery.scss";

const ThumbnailGallery = () => {
  const [selectedThumbnail, setSelectedThumbnail ] = useState(DEFAULT_SELECTED_POSITION);

  const contextValue = useMemo(() => ({ setSelectedThumbnail }), []);

  return (
    <div id="thumbnail-gallery">
      <ul id="thumbnail-gallery--grid">
        <ThumbnailGalleryContext.Provider value={contextValue}>
          { LOGO_POSITIONS.map((logoPosition, idx) =>
            <li key={`thumbnail-item_${idx}`}>
              <ThumbnailOption logoPosition={logoPosition} idx={idx} />
            </li>
          )}
        </ThumbnailGalleryContext.Provider>
      </ul>
      <DownloadButton className="mac"
        onClick={() => handleSubmitDownloadImage(processImageName(selectedThumbnail))}
      />
    </div>
  );
};

export default ThumbnailGallery;