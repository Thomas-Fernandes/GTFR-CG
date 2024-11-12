import { ApiResponse } from "@/common/types";

export type StatisticsResponse = ApiResponse & {
  data: {
    dateFirstOperation: string;
    dateLastOperation: string;
    artworkGenerations: number;
    lyricsFetches: number;
    cardsGenerated: number;
  }
};

export type Statistics = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: string;
  lyricsFetches: string;
  cardsGenerated: string;
};

export type StatisticProps = {
  label: string;
  value: string;
  spinnerId: string;
};
export type StatisticsBoardProps = {
  stats: Statistics;
};

export type GeniusTokenResponse = ApiResponse & {
  data: {
    token: string;
  }
};