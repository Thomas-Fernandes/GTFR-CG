import { useEffect, useMemo, useState } from "react";

import { useTitle } from "@/common/hooks/useTitle";
import { ContentsGenerationMode } from "@/common/types";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { SessionStorage, Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import CardsGallery from "./CardsGallery";
import CardsGenerationForm from "./CardsGenerationForm";
import { CardsGenerationContext, CardsGenerationFormContext } from "./contexts";
import { CardData } from "./types";

import "./CardsGeneration.scss";

const CardsGeneration = (): JSX.Element => {
  useTitle(Title.CardsGeneration);

  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const [cardMetaname, setCardMetaname] = useState("");
  const [outroContributors, setOutroContributors] = useState("");
  const cardMethod = sessionStorage.getItem(SessionStorage.CardMethod) ?? ContentsGenerationMode.Auto;
  const cardBottomColor = sessionStorage.getItem(SessionStorage.CardBottomColor) ?? "";

  const [bgImg, setBgImg] = useState<File>();
  const [colorPick, setColorPick] = useState<string>("");
  const [includeCenterArtwork, setIncludeCenterArtwork] = useState(true);
  const [generateOutro, setGenerateOutro] = useState(cardMethod === ContentsGenerationMode.Auto);
  const [includeBackgroundImg, setIncludeBackgroundImg] = useState(true);

  const [cardPaths, setCardPaths] = useState([] as string[]);
  const [cards, setCards] = useState([] as CardData[]);

  const formContextValue = useMemo(
    () => ({
      outroContributors, setOutroContributors, setBgImg, setColorPick,
      setIncludeCenterArtwork, setGenerateOutro, setIncludeBackgroundImg
    }),
    [outroContributors]
  );
  const contextValue = useMemo(
    () => ({ cardMethod, cardMetaname, setCardMetaname, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor }),
    [cardMethod, cardMetaname, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor]
  );

  useEffect(() => {
    if (isComponentMounted)
      return;

    setCardMetaname(sessionStorage.getItem(SessionStorage.CardMetaname) ?? "");
    const storedOutroContributors = sessionStorage.getItem(SessionStorage.OutroContributors);
    setOutroContributors(storedOutroContributors ? JSON.parse(storedOutroContributors).join(", ") : "");
    setIsComponentMounted(true);
  }, [isComponentMounted, colorPick]);

  return (
    <div id="cards-generation">
      <ToastContainer />
      <TopBotSpacer />

      <div className="navbar">
        <NavButton to={ViewPaths.Home} label={Title.Home} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.ArtworkGeneration} label={Title.ArtworkGeneration} side={NavButtonSide.Left} />
        <NavButton to={ViewPaths.Lyrics} label={Title.Lyrics} side={NavButtonSide.Left} />
      </div>

      <h1>{Title.CardsGeneration}</h1>

      <CardsGenerationContext.Provider value={contextValue}>
        <CardsGenerationFormContext.Provider value={formContextValue}>
          <CardsGenerationForm setCardPaths={setCardPaths} setCards={setCards} />
        </CardsGenerationFormContext.Provider>
      </CardsGenerationContext.Provider>

      { cardPaths.length > 0 &&
        <>
          <hr className="my-4" />

          {/* <ZipDownloadButton id="download-all" paths={cardPaths} output={CARDS_ZIP_FILENAME} /> */}
          <CardsGenerationContext.Provider value={contextValue}>
            <CardsGallery id="cards" initialCards={cards} />
          </CardsGenerationContext.Provider>
        </>
      }

      <TopBotSpacer />
    </div>
  )
};

export default CardsGeneration;