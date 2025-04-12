import { ApiResponse, SongPartsCards, StateSetter } from "@/common/types";
import { CardData } from "@/pages/CardsGeneration/types";

export interface CardsGenerationResponse extends ApiResponse {
  data: {
    cardsLyrics: SongPartsCards;
    cardBottomColor: string;
  };
}

export interface CardsGenerationRequest {
  cardMetaname: string;
  outroContributors?: string;
  bgImg: File | undefined;
  colorPick: string;
  includeCenterArtwork?: boolean;
  generateOutro?: boolean;
  includeBackgroundImg: boolean;
}
export interface SingleCardGenerationRequest extends CardsGenerationRequest {
  cardsContents: string[];
  cardFilename: string;
}

export interface HandleGenerateCardsProps {
  generationInProgress: boolean;
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
  setColorPick: StateSetter<string>;
}
export interface GenerateCardsProps {
  setGenerationInProgress: StateSetter<boolean>;
  setCardPaths: StateSetter<string[]>;
  setCards: StateSetter<CardData[]>;
  setColorPick: StateSetter<string>;
}

export interface CardsGenerationFormProps {
  setCardPaths: StateSetter<string[]>,
  setCards: StateSetter<CardData[]>
}