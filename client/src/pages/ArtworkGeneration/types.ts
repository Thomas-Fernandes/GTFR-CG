import { JSX, TransitionStartFunction } from "react";
import { NavigateFunction } from "react-router-dom";

import { ApiResponse, StateSetter } from "@/common/types";

export type HandleSubmitArtworkGenerationProps = Readonly<{
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
}>;
export type YoutubeRequest = Readonly<{
  url: string;
}>;
export type FileUploadRequest = Readonly<{
  localFile: File | undefined;
  includeCenterArtwork: boolean;
}>;
export type ItunesImageRequest = Readonly<{
  url: string;
}>;

export type ItunesImageResultProps = Readonly<{
  item: ItunesResult;
  itemId: number;
}>;
export type ItunesResultsProps = Readonly<{
  items: ItunesResult[];
  setItunesResults: StateSetter<ItunesResult[]>;
}>;
export type ItunesResult = {
  resultId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100: string;
};

export type ItunesResponse = ApiResponse & Readonly<{
  data: {
    resultCount: number;
    results: ItunesResult[];
  }
}>;
export type HandleSubmitItunesSearchProps = Readonly<{
  setItunesResults: StateSetter<ItunesResult[]>;
}>;
export type ItunesRequest = Readonly<{
  term: string;
  entity?: string;
  country: string;
  limit?: number;
}>;
export type HandleChangeTermProps = Readonly<{
  term: string;
  setTerm: StateSetter<string>;
  startItunesSearch: TransitionStartFunction;
  setItunesResults: StateSetter<ItunesResult[]>;
}>;
export type ItunesFormProps = Readonly<{
  setItunesResults: StateSetter<ItunesResult[]>;
}>;

export type ArtworkGenerationOption = Readonly<{
  h1: string;
  content: (itunesResults?: ItunesResult[], setItunesResults?: StateSetter<ItunesResult[]>) => JSX.Element;
  className: string;
}>;
export type GenerationOptionState = Readonly<{
  current: number;
  prevLabel: string;
  nextLabel: string;
}>;