import { createNewContext } from "@common/ContextProvider";
import { StateSetter } from "@common/Types";

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

