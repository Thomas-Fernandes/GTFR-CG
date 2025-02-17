import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { doesFileExist } from "@/common/utils/fileUtils";
import { getLocalizedToasts } from "@/common/utils/toastUtils";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { ViewPaths } from "@/constants/paths";
import { useAppContext } from "@/contexts";

import BackgroundImageDisplay from "./BackgroundImageDisplay";
import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH } from "./constants";
import ThumbnailGallery from "./ThumbnailGallery";

import "./ProcessedArtworks.scss";

const ProcessedArtworks = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "pages.procart.title" }),
    homeTitle: intl.formatMessage({ id: "pages.home.title" }),
    artgenTitle: intl.formatMessage({ id: "pages.artgen.title" }),
    lyricsTitle: intl.formatMessage({ id: "pages.lyrics.title" }),
    cardgenTitle: intl.formatMessage({ id: "pages.cardgen.title" }),
  };

  useTitle(labels.title);

  const toasts = getLocalizedToasts(intl);
  const navigate = useNavigate();

  useEffect(() => {
    doesFileExist(`${PROCESSED_ARTWORKS_PATH}/${COVER_ART_FILENAME}`).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists) {
        navigate(
          `${ViewPaths.Redirect}`
          + `?redirect_to=${ViewPaths.ArtworkGeneration}`
          + `&error_text=${toasts.Redirect.NoProcessedImage}`
        );
      }
    });
  });

  return (
    <div id="processed-artworks">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={labels.homeTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.ArtworkGeneration} label={labels.artgenTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={labels.lyricsTitle} side={NavButtonSide.Right} />
        <NavButton to={ViewPaths.CardsGeneration} label={labels.cardgenTitle} side={NavButtonSide.Right} />
      </div>

      <h1>{labels.title}</h1>

      <div id="image-panels">
        <BackgroundImageDisplay />
        <ThumbnailGallery />
      </div>

      <TopBotSpacer />
    </div>
  )
};

export default ProcessedArtworks;