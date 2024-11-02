import { ApiResponse } from "../../common/types";

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
