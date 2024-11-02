import { TransitionStartFunction } from "react";
import { NavigateFunction } from "react-router-dom";

import { ApiResponse, StateSetter } from "@common/types";

export type HandleSubmitArtworkGenerationProps = {
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
};
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

export type ItunesImageResultProps = {
  key?: number;
  item: ItunesResult;
  itemId: number;
  handleSubmitItunesImage: (item: ItunesResult, key: number, props: HandleSubmitArtworkGenerationProps) => void;
};
export type ItunesImageGalleryProps = {
  items: ItunesResult[];
  handleSubmitItunesImage: (item: ItunesResult, key: number, props: HandleSubmitArtworkGenerationProps) => void;
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
export type HandleSubmitItunesSearchProps = {
  setItunesResults: StateSetter<ItunesResult[]>;
};
export type ItunesRequest = {
  term: string;
  entity?: string;
  country: string;
  limit?: number;
};
export type HandleChangeTermProps = {
  setTerm: StateSetter<string>;
  startItunesSearch: TransitionStartFunction;
  setItunesResults: StateSetter<ItunesResult[]>;
};