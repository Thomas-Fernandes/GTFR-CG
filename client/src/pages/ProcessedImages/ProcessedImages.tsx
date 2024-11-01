import { JSX, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useTitle from "../../common/UseTitle";
import { doesFileExist } from "../../common/utils/FileUtils";

import { TITLE } from "../../constants/Common";
import { COVER_ART_FILENAME, PROCESSED_IMAGES_PATH, VIEW_PATHS } from "../../constants/Paths";
import { DEFAULT_SELECTED_POSITION } from "../../constants/ProcessedImages";
import { TOAST } from "../../constants/Toast";

import { ProcessedImagesContext } from "./context";
import { handleSubmitDownloadImage } from "./handlers";
import ThumbnailGallery from "./ThumbnailGallery";
import { processImageName } from "./utils";

import "./ProcessedImages.css";

const ProcessedImages = (): JSX.Element => {
  useTitle(TITLE.PROCESSED_IMAGES);

  const navigate = useNavigate();

  const [selectedThumbnail, setSelectedThumbnail] = useState(DEFAULT_SELECTED_POSITION);
  const contextValue = useMemo(() => ({ selectedThumbnail, setSelectedThumbnail }), [selectedThumbnail, setSelectedThumbnail]);

  useEffect(() => {
    doesFileExist(PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists) {
        navigate(`${VIEW_PATHS.redirect}?redirect_to=${VIEW_PATHS.artworkGeneration}&error_text=${TOAST.NO_PROCESSED_IMAGE}`);
      }
    });
  });

  return (
    <ProcessedImagesContext.Provider value={contextValue}>
      <div id="processed-images">
        <div id="toast-container"></div>
        <span className="top-bot-spacer" />

        <div className="navbar">
          <button type="button" onClick={() => navigate(VIEW_PATHS.home)}>
            <span className="left">{TITLE.HOME}</span>
          </button>
          <button type="button" onClick={() => navigate(VIEW_PATHS.artworkGeneration)}>
            <span className="left">{TITLE.ARTWORK_GENERATION}</span>
          </button>
          <button type="button" onClick={() => navigate(VIEW_PATHS.lyrics)}>
            <span className="right">{TITLE.LYRICS}</span>
          </button>
          <button type="button" onClick={() => navigate(VIEW_PATHS.cardsGeneration)}>
            <span className="right">{TITLE.CARDS_GENERATION}</span>
          </button>
        </div>

        <h1>Processed Artworks</h1>

        <div id="image-panels">
          <div id="image-container">
            <img src={PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME} alt="background thumbnail" />
            <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: COVER_ART_FILENAME})}>
              <input type="submit" value="Download" className="button" />
            </form>
          </div>

          <div id="thumbnails">
            <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: processImageName(selectedThumbnail)})}>
              <ThumbnailGallery />
              <input type="submit" value="Download" className="button" />
            </form>
          </div>
        </div>

        <span className="top-bot-spacer" />
      </div>
    </ProcessedImagesContext.Provider>
  )
};

export default ProcessedImages;