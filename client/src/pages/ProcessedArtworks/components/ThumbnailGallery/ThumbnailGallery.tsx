import { useMemo, useState } from "react";

import DownloadButton from "@/components/DownloadButton/DownloadButton";
import { LOGO_POSITIONS } from "@/pages/ProcessedArtworks/constants";
import { ThumbnailGalleryContext } from "@/pages/ProcessedArtworks/contexts";
import { handleSubmitDownloadImage } from "@/pages/ProcessedArtworks/handlers";
import { processImageName } from "@/pages/ProcessedArtworks/utils";

import ThumbnailOption from "./components/ThumbnailOption/ThumbnailOption";
import { DEFAULT_SELECTED_POSITION } from "./constants";

import "./ThumbnailGallery.scss";

const ThumbnailGallery = () => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(DEFAULT_SELECTED_POSITION);

  const contextValue = useMemo(() => ({ setSelectedThumbnail }), []);

  return (
    <div id="thumbnail-gallery">
      <ul id="thumbnail-gallery--grid">
        <ThumbnailGalleryContext.Provider value={contextValue}>
          {LOGO_POSITIONS.map((logoPosition, idx) => (
            <li key={`thumbnail-item_${idx}`}>
              <ThumbnailOption logoPosition={logoPosition} idx={idx} />
            </li>
          ))}
        </ThumbnailGalleryContext.Provider>
      </ul>
      <DownloadButton onClick={() => handleSubmitDownloadImage(processImageName(selectedThumbnail))} className="mac" />
    </div>
  );
};

export default ThumbnailGallery;
