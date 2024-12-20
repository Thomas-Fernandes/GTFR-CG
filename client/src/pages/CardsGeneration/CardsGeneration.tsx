import { useEffect, useMemo, useState } from "react";

import { useTitle } from "@/common/hooks/useTitle";
import { ContentsGenerationMode } from "@/common/types";
import { getArrayOfSize } from "@/common/utils/arrayUtils";
import { NavButtonSide } from "@/components/NavButton/constants";
import NavButton from "@/components/NavButton/NavButton";
import Skeleton from "@/components/Skeleton/Skeleton";
import ToastContainer from "@/components/ToastContainer/ToastContainer";
import TopBotSpacer from "@/components/TopBotSpacer/TopBotSpacer";
import { SessionStorage, Title } from "@/constants/browser";
import { ViewPaths } from "@/constants/paths";

import CardsGallery from "./CardsGallery";
import CardsGenerationForm from "./CardsGenerationForm";
import { CardsGenerationContext, CardsGenerationFormContext } from "./contexts";
import { CardData } from "./types";

const CardsGeneration = () => {
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

  const [generationInProgress, setGenerationInProgress] = useState(false);

  const formContextValue = useMemo(
    () => ({
      outroContributors, setOutroContributors, setBgImg, setColorPick, setIncludeCenterArtwork,
      setGenerateOutro, setIncludeBackgroundImg, generationInProgress, setGenerationInProgress
    }), []
  );
  const contextValue = useMemo(
    () => ({
      cardMethod, cardMetaname, setCardMetaname,
      bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor, generationInProgress
    }),
    [cardMethod, cardMetaname, bgImg, colorPick, includeCenterArtwork, generateOutro, includeBackgroundImg, cardBottomColor, generationInProgress, cards]
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

          <CardsGenerationContext.Provider value={contextValue}>
            <CardsGallery id="cards" initialCards={cards} />
          </CardsGenerationContext.Provider>
        </>
      }
      { generationInProgress &&
        <>
          <hr className="my-4" />

          <ul className="card-gallery--cards skeleton">
            { getArrayOfSize(window.innerWidth / 256).map((_, idx) =>
                <li key={`skeleton_${idx}`} className="flex flex-col gap-2">
                  <div className="card-container skeleton">
                    <Skeleton className="card-container--card" w="16.9rem" h="10rem" />
                    <Skeleton className="card-container--card" w="16.9rem" h="2rem"  />
                  </div>
                </li>
              )
            }
          </ul>
        </>
      }

      <TopBotSpacer />
    </div>
  )
};

export default CardsGeneration;