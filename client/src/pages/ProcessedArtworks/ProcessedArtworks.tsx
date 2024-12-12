import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTitle } from "@/common/hooks/useTitle";
import { doesFileExist } from "@/common/utils/fileUtils";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";
import { Toast } from "@/constants/toasts";

import BackgroundImageDisplay from "./BackgroundImageDisplay";
import { COVER_ART_FILENAME, PROCESSED_ARTWORKS_PATH } from "./constants";
import ThumbnailGallery from "./ThumbnailGallery";

import "./ProcessedArtworks.scss";

const ProcessedArtworks = (): JSX.Element => {
  useTitle(Title.ProcessedArtworks);

  const navigate = useNavigate();

  useEffect(() => {
    doesFileExist(PROCESSED_ARTWORKS_PATH + "/" + COVER_ART_FILENAME).then((anyProcessedImageExists: boolean) => {
      if (!anyProcessedImageExists)
        navigate(`${ViewPaths.Redirect}?redirect_to=${ViewPaths.ArtworkGeneration}&error_text=${Toast.NoProcessedImage}`);
    });
  });

  return (
    <div id="processed-artworks">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={Title.Home} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.ArtworkGeneration} label={Title.ArtworkGeneration} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={Title.Lyrics} side={NavButtonSide.Right} />
        <NavButton to={ViewPaths.CardsGeneration} label={Title.CardsGeneration} side={NavButtonSide.Right} />
      </div>

      <h1>{Title.ProcessedArtworks}</h1>

      <div id="image-panels">
        <BackgroundImageDisplay />
        <ThumbnailGallery />
      </div>

      <TopBotSpacer />
    </div>
  )
};

export default ProcessedArtworks;