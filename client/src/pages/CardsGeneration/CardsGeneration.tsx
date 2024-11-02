import { JSX, useEffect, useMemo, useState } from "react";

import { useTitle } from "@common/hooks/useTitle";

import NavButton from "@components/NavButton";
import ToastContainer from "@components/ToastContainer/ToastContainer";
import ZipDownloadButton from "@components/ZipDownloadButton";

import { SESSION_STORAGE, TITLE } from "@constants/browser";
import { VIEW_PATHS } from "@constants/paths";

import CardsGallery from "./CardsGallery";
import CardsGenerationForm from "./CardsGenerationForm";
import { CardData } from "./types";

import "./CardsGeneration.css";
import { CardsGenerationFormContext } from "./contexts";

const CardsGeneration = (): JSX.Element => {
  useTitle(TITLE.CARDS_GENERATION);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const [cardMetaname, setCardMetaname] = useState("");
  const [outroContributors, setOutroContributors] = useState("");
  const cardMethod = sessionStorage.getItem(SESSION_STORAGE.CARD_METHOD) ?? "auto";
  const cardBottomColor = sessionStorage.getItem(SESSION_STORAGE.CARD_BOTTOM_COLOR) ?? "";

  const [bgImg, setBgImg] = useState<File>();
  const [colorPick, setColorPick] = useState<string>("");
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);
  const [generateOutro, setGenerateOutro] = useState(cardMethod === "auto");
  const [includeBackgroundImg, setIncludeBackgroundImg] = useState(true);

  const [cardPaths, setCardPaths] = useState([] as string[]);
  const [cards, setCards] = useState([] as CardData[]);

  const contextValue = useMemo(
    () => ({
      outroContributors, setBgImg, setColorPick,
      setIncludeCenterArtwork, setGenerateOutro, setIncludeBackgroundImg
    }),
    [
      outroContributors, setBgImg, setColorPick,
      setIncludeCenterArtwork, setGenerateOutro, setIncludeBackgroundImg
    ]
  );

  useEffect(() => {
    if (isComponentMounted)
      return;

    setCardMetaname(sessionStorage.getItem(SESSION_STORAGE.CARD_METANAME) ?? "");
    const storedOutroContributors = sessionStorage.getItem(SESSION_STORAGE.OUTRO_CONTRIBUTORS);
    setOutroContributors(storedOutroContributors ? JSON.parse(storedOutroContributors).join(", ") : "");
    setIsComponentMounted(true);
  }, [isComponentMounted, colorPick]);

  return (
    <div id="cards-generation">
      <ToastContainer />
      <span className="top-bot-spacer" />

      <div className="navbar">
        <NavButton to={VIEW_PATHS.home} label={TITLE.HOME} side="left" />
        <NavButton to={VIEW_PATHS.artworkGeneration} label={TITLE.ARTWORK_GENERATION} side="left" />
        <NavButton to={VIEW_PATHS.lyrics} label={TITLE.LYRICS} side="left" />
      </div>

      <h1>{TITLE.CARDS_GENERATION}</h1>

      <CardsGenerationFormContext.Provider value={contextValue}>
        <CardsGenerationForm setCardPaths={setCardPaths} setCards={setCards} />
      </CardsGenerationFormContext.Provider>

      { cardPaths.length > 0 &&
        <>
          <hr className="mv-1" />

          <ZipDownloadButton id="download-all" paths={cardPaths} output={"cards.zip"} />
          <CardsGallery
            id="cards" initialCards={cards}
            generationProps={{
              cardMetaname, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor,
            }}
          />
        </>
      }

      <span className="top-bot-spacer" />
    </div>
  )
};

export default CardsGeneration;