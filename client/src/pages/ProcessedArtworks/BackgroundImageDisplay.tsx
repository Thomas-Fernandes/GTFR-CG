import { JSX } from "react";

import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH } from "./constants";
import { handleSubmitDownloadImage } from "./handlers";

import "./BackgroundImageDisplay.css";

const BackgroundImageDisplay = (): JSX.Element => {
  return (
    <div id="image-container">
      <img src={PROCESSED_ARTWORKS_PATH + "/" + COVER_ART_FILENAME} alt="background thumbnail" />
      <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: COVER_ART_FILENAME})}>
        <input type="submit" value="Download" className="button" />
      </form>
    </div>
  );
};

export default BackgroundImageDisplay;