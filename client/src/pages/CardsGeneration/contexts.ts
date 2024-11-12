import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

import { CardData } from "./types";

interface CardsGalleryContextType {
  setCards: StateSetter<CardData[]>;
  setIsModalOpen: StateSetter<boolean>;
  currentCard: CardData | null;
  setCurrentCard: StateSetter<CardData | null>;
  newLyrics: string;
  setNewLyrics: StateSetter<string>;
}
const {
  context: CardsGalleryContext,
  useContext: useCardsGalleryContext
} = createNewContext<CardsGalleryContextType>();

interface CardsGenerationFormContextType {
  outroContributors: string;
  setOutroContributors: StateSetter<string>;
  setBgImg: StateSetter<File | undefined>;
  setColorPick: StateSetter<string>;
  setIncludeCenterArtwork: StateSetter<boolean>;
  setGenerateOutro: StateSetter<boolean>;
  setIncludeBackgroundImg: StateSetter<boolean>;
}
const {
  context: CardsGenerationFormContext,
  useContext: useCardsGenerationFormContext
} = createNewContext<CardsGenerationFormContextType>();

interface CardsGenerationContextType {
  cardMethod: string;
  cardMetaname: string;
  setCardMetaname: StateSetter<string>;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean;
  generateOutro: boolean;
  includeBackgroundImg: boolean;
  cardBottomColor: string;
}
const {
  context: CardsGenerationContext,
  useContext: useCardsGenerationContext
} = createNewContext<CardsGenerationContextType>();

export {
    CardsGalleryContext, CardsGenerationContext, CardsGenerationFormContext,
    useCardsGalleryContext, useCardsGenerationContext, useCardsGenerationFormContext
};

