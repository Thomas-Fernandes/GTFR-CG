import { ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";

import { StateSetter } from "@/common/types";

import { ItunesResult } from "./components/ItunesResults/types";

export interface HandleSubmitArtworkGenerationProps {
  isProcessingLoading: boolean;
  setIsProcessingLoading: StateSetter<boolean>;
  navigate: NavigateFunction;
}

export interface ArtworkGenerationOption {
  h1: string;
  content: (itunesResults?: ItunesResult[], setItunesResults?: StateSetter<ItunesResult[]>) => ReactNode;
  className: string;
}
export interface GenerationOptionState {
  current: number;
  prevLabel: string;
  nextLabel: string;
}
