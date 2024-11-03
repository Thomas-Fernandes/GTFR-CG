import { ApiResponse, SongPartsCards, StateSetter } from "@common/types";

export type GenerationProps = {
  cardMetaname: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean | undefined;
  generateOutro: boolean;
  includeBackgroundImg: boolean;

  cardBottomColor: string;
};

export type CardData = {
  id: number;
  lyrics: string;
  src: string; // Img source path
}

export type HandleSaveModalProps = {
  generationProps: GenerationProps;
  newLyrics: string;
  generateSingleCardProps: {
    currentCard: CardData;
    setCards: StateSetter<CardData[]>;
    setIsModalSaving: StateSetter<boolean>;
    closeModal: () => void;
  }
};
export type CardEditModalProps = {
  generationProps: GenerationProps;
};

export type CardViewProps = {
  card: CardData;
  cardIdx: number;
};
export type CardsGalleryProps = {
  id: string;
  initialCards: CardData[];
  generationProps: GenerationProps;
};

export type CardsGenerationResponse = ApiResponse & {
  data: {
    cardsLyrics: SongPartsCards;
    cardBottomColor: string;
  };
};

export type CardsGenerationRequest = {
  cardMetaname: string;
  outroContributors?: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork?: boolean;
  generateOutro?: boolean;
  includeBackgroundImg: boolean;
};
export type SingleCardGenerationRequest = CardsGenerationRequest & {
  cardsContents: string[];
  cardFilename: string;
};
export type GenerateSingleCardProps = {
  currentCard: CardData;
  setCards: StateSetter<CardData[]>;
  setIsModalSaving: StateSetter<boolean>;
  closeModal: () => void;
};
export type HandleGenerateCardsProps = {
  generationInProgress: boolean;
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
};
export type GenerateCardsProps = {
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
};

export type CardsGenerationFormProps = {
  setCardPaths: StateSetter<string[]>,
  setCards: StateSetter<CardData[]>
};