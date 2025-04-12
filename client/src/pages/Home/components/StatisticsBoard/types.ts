import { ApiResponse } from "@/common/types";

export interface StatisticsResponse extends ApiResponse {
  data: {
    dateFirstOperation: string;
    dateLastOperation: string;
    artworkGenerations: number;
    lyricsFetches: number;
    cardsGenerated: number;
  };
}

export interface Statistics {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: string;
  lyricsFetches: string;
  cardsGenerated: string;
}
export interface StatisticsBoardProps {
  stats: Statistics;
}

export interface StatisticProps {
  label: string;
  value: string;
  spinnerId: string;
}
export interface StatisticsProps {
  statistics: StatisticProps[];
}
