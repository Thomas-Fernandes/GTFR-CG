import { Dispatch, SetStateAction } from "react";

/**************** CARDS ******************/

export type CardsGenerationResponse = ApiResponse & {
  data: {
    generated: number;
  };
};

export type CardsGenerationRequest = {
  cardMetaname: string;
  bgImg: File | undefined;
  includeCenterArtwork?: boolean;
  generateOutro: boolean;
  includeBackgroundImg?: boolean;
};

export type SongPartsCards = string[][];

/**************** LYRICS *****************/

export type LyricsContents = {
  pageMetadata: PageMetadata;
  lyricsParts: LyricsPart[];
  dismissedParts: number[];
};

export type PageMetadata = {
  artist: string;
  title: string;
  id: string;
  url?: string;
};
export type LyricsPart = {
  section: string;
  lyrics: string;
};

export type LyricsResponse = ApiResponse & {
  data: {
    lyricsParts: LyricsPart[];
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

export type FileUploadRequest = {
  localFile: File | undefined;
  includeCenterArtwork: boolean;
};

export type ItunesResult = {
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100: string;
};
export type ItunesResponse = {
  resultCount: number;
  results: ItunesResult[];
};
export type ItunesRequest = {
  term: string;
  entity?: string;
  country: string;
  limit?: number;
};

/***************** HOME ******************/

export type Statistics = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: number;
  lyricsFetches: number;
  cardsGenerated: number;
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

export type Dict = { [key: string]: string };