import { ComponentPropsWithoutRef } from "react";

import { ApiResponse, SongPartsCards, StateSetter } from "@/common/types";

export type GenerationProps = {
  cardMetaname: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork: boolean | undefined;
  generateOutro: boolean;
  includeBackgroundImg: boolean;

  cardBottomColor: string;
};

export type CardData = Readonly<{
  id: number;
  lyrics: string;
  imgSrc: string;
}>;

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

export type CardViewProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  card: CardData;
  cardIdx: number;
}>;
export type CardsGalleryProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  initialCards: CardData[];
}>;

export type CardsGenerationResponse = ApiResponse & Readonly<{
  data: {
    cardsLyrics: SongPartsCards;
    cardBottomColor: string;
  };
}>;

export type CardsGenerationRequest = Readonly<{
  cardMetaname: string;
  outroContributors?: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork?: boolean;
  generateOutro?: boolean;
  includeBackgroundImg: boolean;
}>;
export type SingleCardGenerationRequest = CardsGenerationRequest & Readonly<{
  cardsContents: string[];
  cardFilename: string;
}>;
export type GenerateSingleCardProps = Readonly<{
  currentCard: CardData;
  setCards: StateSetter<CardData[]>;
  setIsModalSaving: StateSetter<boolean>;
  closeModal: () => void;
}>;
export type HandleGenerateCardsProps = Readonly<{
  generationInProgress: boolean;
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
  setColorPick: StateSetter<string>;
}>;
export type GenerateCardsProps = Readonly<{
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
  setColorPick: StateSetter<string>;
}>;

export type CardsGenerationFormProps = Readonly<{
  setCardPaths: StateSetter<string[]>,
  setCards: StateSetter<CardData[]>
}>;