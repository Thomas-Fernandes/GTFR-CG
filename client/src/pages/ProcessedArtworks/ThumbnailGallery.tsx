import { useMemo, useState } from "react";

import DownloadButton from "@/components/DownloadButton/DownloadButton";

import { DEFAULT_SELECTED_POSITION, LOGO_POSITIONS } from "./constants";
import { ThumbnailGalleryContext } from "./contexts";
import { handleSubmitDownloadImage } from "./handlers";
import ThumbnailOption from "./ThumbnailOption";
import { processImageName } from "./utils";

import "./ThumbnailGallery.scss";

const ThumbnailGallery = (): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail ] = useState(DEFAULT_SELECTED_POSITION);

  const contextValue = useMemo(() => ({ setSelectedThumbnail }), []);

  return (
    <div id="thumbnail-gallery">
      <div id="thumbnail-gallery--grid">
        <ThumbnailGalleryContext.Provider value={contextValue}>
          { LOGO_POSITIONS.map((logoPosition, idx) =>
            <ThumbnailOption key={`thumbnail-item_${idx}`} logoPosition={logoPosition} idx={idx} />
          )}
        </ThumbnailGalleryContext.Provider>
      </div>
      <DownloadButton className="mac"
        onClick={() => handleSubmitDownloadImage(processImageName(selectedThumbnail))}
      />
    </div>
  );
};

export default ThumbnailGallery;