import { JSX, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/useTitle";
import { doesFileExist } from "@common/utils/fileUtils";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";

import { TITLE } from "@constants/browser";
import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH, VIEW_PATHS } from "@constants/paths";
import { DEFAULT_SELECTED_POSITION } from "@constants/thumbnails";
import { TOAST } from "@constants/toasts";

import BackgroundImageDisplay from "./BackgroundImageDisplay";
import { ProcessedArtworksContext } from "./context";
import ThumbnailGallery from "./ThumbnailGallery";

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
    doesFileExist(PROCESSED_ARTWORKS_PATH + "/" + COVER_ART_FILENAME).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists) {
        navigate(`${VIEW_PATHS.redirect}?redirect_to=${VIEW_PATHS.artworkGeneration}&error_text=${TOAST.NO_PROCESSED_IMAGE}`);
      }
    });
  });

  return (
    <div id="processed-artworks">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.home} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.artworkGeneration} label={TITLE.ARTWORK_GENERATION} side="left" />
        <NavButton to={VIEW_PATHS.lyrics} label={TITLE.LYRICS} side="right" />
        <NavButton to={VIEW_PATHS.cardsGeneration} label={TITLE.CARDS_GENERATION} side="right" />
      </div>

      <h1>{TITLE.PROCESSED_ARTWORKS}</h1>

      <div id="image-panels">
        <BackgroundImageDisplay />

        <ProcessedArtworksContext.Provider value={contextValue}>
          <ThumbnailGallery />
        </ProcessedArtworksContext.Provider>
      </div>

      <span className="top-bot-spacer" />
    </div>
  )
};

export default ProcessedArtworks;