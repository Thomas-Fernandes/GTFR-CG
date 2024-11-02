import { JSX } from "react";

import { PROCESSED_ARTWORKS_PATH } from "@constants/paths";
import { DEFAULT_SELECTED_POSITION, LOGO_POSITIONS } from "@constants/thumbnails";

import { useProcessedArtworksContext } from "./context";
import { handleSubmitDownloadImage } from "./handlers";
import { processImageName } from "./utils";

import "./ThumbnailGallery.css";

export type ThumbnailOptionProps = {
  key: number;
  logoPosition: string;
  idx: number;
};

const ThumbnailOption: React.FC<ThumbnailOptionProps> = ({key, logoPosition, idx}): JSX.Element => {
  const { setSelectedThumbnail } = useProcessedArtworksContext();
  key?.valueOf(); // unused

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
  const { selectedThumbnail } = useProcessedArtworksContext();

  return (
    <div id="thumbnails">
      <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: processImageName(selectedThumbnail)})}>
        <div id="thumbnail-grid">
          { LOGO_POSITIONS.map((logoPosition, idx) =>
            <ThumbnailOption key={idx} logoPosition={logoPosition} idx={idx} />
          )}
        </div>
        <input type="submit" value="Download" className="button" />
      </form>
    </div>
  );
};

export default ThumbnailGallery;