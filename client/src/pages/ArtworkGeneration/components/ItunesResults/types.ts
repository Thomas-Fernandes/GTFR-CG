
import { StateSetter } from "@/common/types";

export interface ItunesImageRequest {
  url: string;
}

export interface ItunesImageResultProps {
  item: ItunesResult;
  itemId: number;
}
export interface ItunesResultsProps {
  items: ItunesResult[];
  setItunesResults: StateSetter<ItunesResult[]>;
}
export interface ItunesResult {
  resultId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  artworkUrl100: string;
}