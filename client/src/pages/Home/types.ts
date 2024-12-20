import { ApiResponse } from "@/common/types";

export type StatisticsResponse = ApiResponse & Readonly<{
  data: {
    dateFirstOperation: string;
    dateLastOperation: string;
    artworkGenerations: number;
    lyricsFetches: number;
    cardsGenerated: number;
  }
}>;

export type Statistics = Readonly<{
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: string;
  lyricsFetches: string;
  cardsGenerated: string;
}>;

export type StatisticProps = Readonly<{
  label: string;
  value: string;
  spinnerId: string;
}>;
export type StatisticsBoardProps = Readonly<{
  stats: Statistics;
}>;

export type GeniusTokenResponse = ApiResponse & Readonly<{
  data: {
    token: string;
  }
}>;