import { useMemo, useState } from "react";

import { useTitle } from "@/common/hooks/useTitle";
import { ContentsGenerationMode } from "@/common/types";
import { getArrayOfSize } from "@/common/utils/arrayUtils";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import Skeleton from "@/components/Skeleton/Skeleton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { SessionStorage } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";
import { useAppContext } from "@/contexts";

import CardsGallery from "./components/CardsGallery/CardsGallery";
import CardsGenerationForm from "./components/CardsGenerationForm/CardsGenerationForm";
import { CardsGenerationContext, CardsGenerationFormContext } from "./contexts";
import { CardData } from "./types";

const CardsGeneration = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "pages.cardgen.title" }),
    homeTitle: intl.formatMessage({ id: "pages.home.title" }),
    artgenTitle: intl.formatMessage({ id: "pages.artgen.title" }),
    lyricsTitle: intl.formatMessage({ id: "pages.lyrics.title" }),
  };

  useTitle(labels.title);

  const [cardMetaname, setCardMetaname] = useState(sessionStorage.getItem(SessionStorage.CardMetaname) ?? "");
  const [outroContributors, setOutroContributors] = useState(
    JSON.parse(sessionStorage.getItem(SessionStorage.OutroContributors) ?? "[]")?.join(", ")
  );
  const cardMethod = sessionStorage.getItem(SessionStorage.CardMethod) ?? ContentsGenerationMode.Auto;
  const cardBottomColor = sessionStorage.getItem(SessionStorage.CardBottomColor) ?? "";

  const [bgImg, setBgImg] = useState<File>();
  const [colorPick, setColorPick] = useState<string>("");
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);
  const [generateOutro, setGenerateOutro] = useState(cardMethod === ContentsGenerationMode.Auto);
  const [includeBackgroundImg, setIncludeBackgroundImg] = useState(true);

  const [cardPaths, setCardPaths] = useState([] as string[]);
  const [cards, setCards] = useState([] as CardData[]);

  const [generationInProgress, setGenerationInProgress] = useState(false);

  const formContextValue = useMemo(
    () => ({
      outroContributors,
      setOutroContributors,
      setBgImg,
      setColorPick,
      setIncludeCenterArtwork,
      setGenerateOutro,
      setIncludeBackgroundImg,
      generationInProgress,
      setGenerationInProgress,
    }),
    []
  );
  const contextValue = useMemo(
    () => ({
      cardMethod,
      cardMetaname,
      setCardMetaname,
      bgImg,
      colorPick,
      includeCenterArtwork,
      generateOutro,
      includeBackgroundImg,
      cardBottomColor,
      generationInProgress,
    }),
    [
      cardMethod,
      cardMetaname,
      bgImg,
      colorPick,
      includeCenterArtwork,
      generateOutro,
      includeBackgroundImg,
      cardBottomColor,
      generationInProgress,
      cards,
    ]
  );

  return (
    <div id="cards-generation">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={labels.homeTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.ArtworkGeneration} label={labels.artgenTitle} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={labels.lyricsTitle} side={NavButtonSide.Left} />
      </div>

      <h1>{labels.title}</h1>

      <CardsGenerationContext.Provider value={contextValue}>
        <CardsGenerationFormContext.Provider value={formContextValue}>
          <CardsGenerationForm setCardPaths={setCardPaths} setCards={setCards} />
        </CardsGenerationFormContext.Provider>
      </CardsGenerationContext.Provider>

      {cardPaths.length > 0 && (
        <>
          <hr className="my-4" />

          <CardsGenerationContext.Provider value={contextValue}>
            <CardsGallery id="cards" initialCards={cards} />
          </CardsGenerationContext.Provider>
        </>
      )}
      {generationInProgress && (
        <>
          <hr className="my-4" />

          <ul className="card-gallery--cards skeleton">
            {getArrayOfSize(window.innerWidth / 320).map((_, idx) => (
              <li key={`skeleton_${idx}`} className="flex flex-col gap-2">
                <div className="card-container skeleton">
                  <Skeleton className="card-container--card" w="16.9rem" h="10rem" />
                  <Skeleton className="card-container--card" w="16.9rem" h="2rem" />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <TopBotSpacer />
    </div>
  );
};

export default CardsGeneration;
