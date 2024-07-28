import { Dispatch, SetStateAction } from "react";

/**************** LYRICS *****************/

export type LyricsResponse = {
  status: number;
  message: string;
  data: {
    lyrics: string;
  };
};
export type LyricsRequest = {
  artist: string;
  track: string;
};

/*************** PROCESSED ***************/

export type ImageDownloadRequest = {
  selectedImage: string;
};

/**************** ART_GEN ****************/

export type YoutubeRequest = {
  url: string;
};

export type FileUploadRequest = {
  file?: File;
  includeCenterArtwork: boolean;
};

export type ItunesResult = {
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100: string;
};
export type ItunesResponse = {
  status: number;
  message: string;
  data: {
    resultCount: number;
    results: ItunesResult[];
  };
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
};

/**************** GENERIC ****************/

export type ApiResponse = {
  status: number;
  message: string;
  data: object;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ResponseStatus = "info" | "success" | "warn" | "error";
export type ToastType = "info" | "success" | "warn" | "error";

export type StateSetter<T> = Dispatch<SetStateAction<T>>;

export type Context = {
  // Redirect
  error_text?: string;
  redirect_to?: string;
  plural?: string;
}
