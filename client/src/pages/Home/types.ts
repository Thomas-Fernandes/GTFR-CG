export type StatisticsBoardProps = {
  stats: Statistics;
};

export type StatisticsResponse = {
  dateFirstOperation: string;
  dateLastOperation: string;
  artworkGenerations: number;
  lyricsFetches: number;
  cardsGenerated: number;
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