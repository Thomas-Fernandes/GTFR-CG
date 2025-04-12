import { StateSetter } from "@/common/types";
import { CardData } from "@/pages/CardsGeneration/types";

type GenerationProps = {
  cardMetaname: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean | undefined;
  generateOutro: boolean;
  includeBackgroundImg: boolean;

  cardBottomColor: string;
};

export type HandleSaveModalProps = Readonly<{
  generationProps: GenerationProps;
  newLyrics: string;
  generateSingleCardProps: {
    currentCard: CardData;
    setCards: StateSetter<CardData[]>;
    setIsModalSaving: StateSetter<boolean>;
    closeModal: () => void;
  }
}>;

export type GenerateSingleCardProps = Readonly<{
  currentCard: CardData;
  setCards: StateSetter<CardData[]>;
  setIsModalSaving: StateSetter<boolean>;
  closeModal: () => void;
}>;