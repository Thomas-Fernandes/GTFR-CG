import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@common/hooks/useTitle";
import { doesFileExist } from "@common/utils/fileUtils";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";

import { TITLE } from "@constants/browser";
import { VIEW_PATHS } from "@constants/paths";
import { TOAST } from "@constants/toasts";

import BackgroundImageDisplay from "./BackgroundImageDisplay";
import ThumbnailGallery from "./ThumbnailGallery";
import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH } from "./constants";

import "./ProcessedArtworks.css";

const ProcessedArtworks = (): JSX.Element => {
  useTitle(TITLE.PROCESSED_ARTWORKS);

  const navigate = useNavigate();

  useEffect(() => {
    doesFileExist(PROCESSED_ARTWORKS_PATH + "/" + COVER_ART_FILENAME).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists) {
        navigate(`${VIEW_PATHS.REDIRECT}?redirect_to=${VIEW_PATHS.ARTWORK_GENERATION}&error_text=${TOAST.NO_PROCESSED_IMAGE}`);
      }
    });
  });

  return (
    <div id="processed-artworks">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.HOME} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.ARTWORK_GENERATION} label={TITLE.ARTWORK_GENERATION} side="left" />
        <NavButton to={VIEW_PATHS.LYRICS} label={TITLE.LYRICS} side="right" />
        <NavButton to={VIEW_PATHS.CARDS_GENERATION} label={TITLE.CARDS_GENERATION} side="right" />
      </div>

      <h1>{TITLE.PROCESSED_ARTWORKS}</h1>

      <div id="image-panels">
        <BackgroundImageDisplay />
        <ThumbnailGallery />
      </div>

      <span className="top-bot-spacer" />
    </div>
  )
};

export default ProcessedArtworks;