import { TransitionStartFunction } from "react";

import { ApiResponse, StateSetter } from "@/common/types";
import { ItunesResult } from "@/pages/ArtworkGeneration/components/ItunesResults/types";

export interface ItunesResponse extends ApiResponse {
  data: {
    resultCount: number;
    results: ItunesResult[];
  }
}
export interface HandleSubmitItunesSearchProps {
  setItunesResults: StateSetter<ItunesResult[]>;
}
export interface ItunesRequest {
  term: string;
  entity?: string;
  country: string;
  limit?: number;
}
export interface HandleChangeTermProps {
  term: string;
  setTerm: StateSetter<string>;
  startItunesSearch: TransitionStartFunction;
  setItunesResults: StateSetter<ItunesResult[]>;
}
export interface ItunesFormProps {
  setItunesResults: StateSetter<ItunesResult[]>;
}