import { Dispatch, SetStateAction } from "react";

/**************** CARDS ******************/

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
  outroContributors?: string;
  cardsContents: string[];
  cardFilename: string;
};

export type SongPartsCards = string[][];

/**************** LYRICS *****************/

export type LyricsContents = {
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPartType[];
  dismissedParts: number[];
};

export type PageMetadata = {
  artist: string;
  title: string;
  id: string;
  contributors: string[];
};
export type LyricsPartType = {
  section: string;
  lyrics: string;
};

export type LyricsResponse = ApiResponse & {
  data: {
    lyricsParts: LyricsPartType[];
  };
};
export type LyricsRequest = {
  artist: string;
  songName: string;
};

/*************** PROCESSED ***************/

export type ImageDownloadRequest = {
  selectedImage: string;
};

export type ProcessedImagesPathResponse = ApiResponse & {
  data: {
    path: string;
  };
};

/**************** ART_GEN ****************/

export type YoutubeRequest = {
  url: string;
};

export type ItunesImageRequest = {
  url: string;
};

export type FileUploadRequest = {
  localFile: File | undefined;
  includeCenterArtwork: boolean;
};

export type ItunesResult = {
  resultId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100: string;
};
export type ItunesResponse = ApiResponse & {
  data: {
    resultCount: number;
    results: ItunesResult[];
  }
};
export type ItunesRequest = {
  term: string;
  entity?: string;
  country: string;
  limit?: number;
};

/***************** HOME ******************/

export type StatisticsResponse = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: number;
  lyricsFetches: number;
  cardsGenerated: number;
};
export type Statistics = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: string;
  lyricsFetches: string;
  cardsGenerated: string;
};

/**************** GENERIC ****************/

export type ApiResponse = {
  status: number;
  message: string;
  data?: object;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ResponseStatus = "info" | "success" | "warn" | "error";
export type ToastType = "info" | "success" | "warn" | "error";

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Dict = { [key: string]: unknown };