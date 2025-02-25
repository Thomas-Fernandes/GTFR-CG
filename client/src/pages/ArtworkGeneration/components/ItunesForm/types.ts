import { TransitionStartFunction } from "react";

import { ApiResponse, StateSetter } from "@/common/types";
import { ItunesResult } from "@/pages/ArtworkGeneration/components/ItunesResults/types";

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