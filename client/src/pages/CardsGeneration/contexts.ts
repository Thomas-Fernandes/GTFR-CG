import { createNewContext } from "@common/contextProvider";
import { StateSetter } from "@common/types";

import { CardData } from "./types";

interface CardsGalleryContextType {
  setIsModalOpen: StateSetter<boolean>;
  currentCard: CardData | null;
  setCurrentCard: StateSetter<CardData | null>;
  newLyrics: string;
  setNewLyrics: StateSetter<string>;
  setCards: StateSetter<CardData[]>;
}
const {
  context: CardsGalleryContext,
  useContext: useCardsGalleryContext
} = createNewContext<CardsGalleryContextType>();

interface CardsGenerationContextType {
  outroContributors: string;
  setBgImg: StateSetter<File | undefined>;
  setColorPick: StateSetter<string>;
  setIncludeCenterArtwork: StateSetter<boolean>;
  setGenerateOutro: StateSetter<boolean>;
  setIncludeBackgroundImg: StateSetter<boolean>;
}
const {
  context: CardsGenerationContext,
  useContext: useCardsGenerationContext
} = createNewContext<CardsGenerationContextType>();

export { CardsGalleryContext, CardsGenerationContext as CardsGenerationFormContext, useCardsGalleryContext, useCardsGenerationContext as useCardsGenerationFormContext };

