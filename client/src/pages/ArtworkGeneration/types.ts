import { JSX } from "react";
import { NavigateFunction } from "react-router-dom";

import { StateSetter } from "@/common/types";

import { ItunesResult } from "./components/ItunesResults/types";

export type HandleSubmitArtworkGenerationProps = Readonly<{
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
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