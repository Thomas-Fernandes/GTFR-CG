import { useMemo, useState } from "react";

import { useTitle } from "@/common/hooks/useTitle";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { SessionStorage } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";
import { useAppContext } from "@/contexts";

import Description from "./components/Description/Description";
import DescriptionGenerationForm from "./components/DescriptionGenerationForm/DescriptionGenerationForm";
import { DescriptionGenerationContext } from "./contexts";
import { ArtistLinks } from "./types";

const DescriptionGeneration = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "pages.descgen.title" }),
    homeTitle: intl.formatMessage({ id: "pages.home.title" }),
    artgenTitle: intl.formatMessage({ id: "pages.artgen.title" }),
    lyricsTitle: intl.formatMessage({ id: "pages.lyrics.title" }),
    cardgenTitle: intl.formatMessage({ id: "pages.cardgen.title" }),
  };

  useTitle(labels.title);

  const songMetaname = sessionStorage.getItem(SessionStorage.CardMetaname) ?? "";
  const [artistLinks, setArtistLinks] = useState({} as ArtistLinks);
  const [description, setDescription] = useState("");

  const [generationInProgress, setGenerationInProgress] = useState(false);

  const formContextValue = useMemo(() => ({ setArtistLinks }), []);

  return (
    <div id="description-generation">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={labels.homeTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.ArtworkGeneration} label={labels.artgenTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={labels.lyricsTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.CardsGeneration} label={labels.cardgenTitle} side={NavButtonSide.Left} />
      </div>

      <h1>{labels.title}</h1>

      <DescriptionGenerationContext.Provider value={formContextValue}>
        <DescriptionGenerationForm meta={songMetaname} />
      </DescriptionGenerationContext.Provider>

      <Description content={description} />

      <TopBotSpacer />
    </div>
  );
};

export default DescriptionGeneration;
