import { ApiResponse } from "@common/types";

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

export type SongPartsCards = string[][];
