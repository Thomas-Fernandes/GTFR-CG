
import { StateSetter } from "@/common/types";

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
