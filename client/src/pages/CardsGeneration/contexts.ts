import { createNewContext } from "@/common/contextCreator";
import { StateSetter } from "@/common/types";

import { CardData } from "./types";

interface ICardsGalleryContext {
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
} = createNewContext<ICardsGalleryContext>();

interface ICardsGenerationFormContext {
  outroContributors: string;
  setOutroContributors: StateSetter<string>;
  setBgImg: StateSetter<File | undefined>;
  setColorPick: StateSetter<string>;
  setIncludeCenterArtwork: StateSetter<boolean>;
  setGenerateOutro: StateSetter<boolean>;
  setIncludeBackgroundImg: StateSetter<boolean>;
  generationInProgress: boolean;
  setGenerationInProgress: StateSetter<boolean>;
}
const {
  context: CardsGenerationFormContext,
  useContext: useCardsGenerationFormContext
} = createNewContext<ICardsGenerationFormContext>();

interface ICardsGenerationContext {
  cardMethod: string;
  cardMetaname: string;
  setCardMetaname: StateSetter<string>;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean;
  generateOutro: boolean;
  includeBackgroundImg: boolean;
  cardBottomColor: string;
  generationInProgress: boolean;
}
const {
  context: CardsGenerationContext,
  useContext: useCardsGenerationContext
} = createNewContext<ICardsGenerationContext>();

export {
  CardsGalleryContext, CardsGenerationContext, CardsGenerationFormContext,
  useCardsGalleryContext, useCardsGenerationContext, useCardsGenerationFormContext
};

