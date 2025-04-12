import { StateSetter } from "@/common/types";
import { CardData } from "@/pages/CardsGeneration/types";

interface GenerationProps {
  cardMetaname: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean | undefined;
  generateOutro: boolean;
  includeBackgroundImg: boolean;

  cardBottomColor: string;
}

export interface HandleSaveModalProps {
  generationProps: GenerationProps;
  newLyrics: string;
  generateSingleCardProps: {
    currentCard: CardData;
    setCards: StateSetter<CardData[]>;
    setIsModalSaving: StateSetter<boolean>;
    closeModal: () => void;
  };
}

export interface GenerateSingleCardProps {
  currentCard: CardData;
  setCards: StateSetter<CardData[]>;
  setIsModalSaving: StateSetter<boolean>;
  closeModal: () => void;
}
