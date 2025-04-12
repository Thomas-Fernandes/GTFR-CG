import { ApiResponse, SongPartsCards, StateSetter } from "@/common/types";
import { CardData } from "@/pages/CardsGeneration/types";

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