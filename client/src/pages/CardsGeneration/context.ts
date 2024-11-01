import { createNewContext } from "@common/contextProvider";
import { StateSetter } from "@common/types";

import { CardData } from "./CardsGallery";

export interface CardsGalleryContextType {
  setIsModalOpen: StateSetter<boolean>;
  currentCard: CardData | null;
  newLyrics: string;
  setNewLyrics: StateSetter<string>;
  setCards: StateSetter<CardData[]>;
}

const { context: CardsGalleryContext, useContext: useCardsGalleryContext } = createNewContext<CardsGalleryContextType>();

export { CardsGalleryContext, useCardsGalleryContext };

