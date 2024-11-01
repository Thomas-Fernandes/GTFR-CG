import { JSX, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/useTitle";
import { doesFileExist } from "@common/utils/fileUtils";

import ToastContainer from "@/components/ToastContainer/ToastContainer";
import NavButton from "@components/NavButton";

import { TITLE } from "@constants/Common";
import { COVER_ART_FILENAME, PROCESSED_IMAGES_PATH, VIEW_PATHS } from "@constants/paths";
import { DEFAULT_SELECTED_POSITION } from "@constants/ProcessedArtworks";
import { TOAST } from "@constants/toasts";

import { ProcessedArtworksContext } from "./context";
import { handleSubmitDownloadImage } from "./handlers";
import ThumbnailGallery from "./ThumbnailGallery";
import { processImageName } from "./utils";

import "./ProcessedArtworks.css";

const ProcessedArtworks = (): JSX.Element => {
  useTitle(TITLE.PROCESSED_ARTWORKS);

  const navigate = useNavigate();

  const [selectedThumbnail, setSelectedThumbnail] = useState(DEFAULT_SELECTED_POSITION);
  const contextValue = useMemo(
    () => ({ selectedThumbnail, setSelectedThumbnail }),
    [selectedThumbnail, setSelectedThumbnail]
  );

  useEffect(() => {
    doesFileExist(PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists) {
        navigate(`${VIEW_PATHS.redirect}?redirect_to=${VIEW_PATHS.artworkGeneration}&error_text=${TOAST.NO_PROCESSED_IMAGE}`);
      }
    });
  });

  return (
    <div id="processed-images">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.home} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.artworkGeneration} label={TITLE.ARTWORK_GENERATION} side="right" />
        <NavButton to={VIEW_PATHS.lyrics} label={TITLE.LYRICS} side="right" />
        <NavButton to={VIEW_PATHS.cardsGeneration} label={TITLE.CARDS_GENERATION} side="right" />
      </div>

      <h1>{TITLE.PROCESSED_ARTWORKS}</h1>

      <div id="image-panels">
        <div id="image-container">
          <img src={PROCESSED_IMAGES_PATH + "/" + COVER_ART_FILENAME} alt="background thumbnail" />
          <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: COVER_ART_FILENAME})}>
            <input type="submit" value="Download" className="button" />
          </form>
        </div>

        <ProcessedArtworksContext.Provider value={contextValue}>
          <div id="thumbnails">
            <form onSubmit={(e) => handleSubmitDownloadImage(e, {selectedImage: processImageName(selectedThumbnail)})}>
              <ThumbnailGallery />
              <input type="submit" value="Download" className="button" />
            </form>
          </div>
        </ProcessedArtworksContext.Provider>
      </div>

      <span className="top-bot-spacer" />
    </div>
  )
};

export default ProcessedArtworks;