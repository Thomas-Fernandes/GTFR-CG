import NumberFlow from "@number-flow/react";
import { IntlShape } from "react-intl";

import { SpinnerId } from "@/constants/spinners";

import { defaultStatistics, StatName } from "./constants";
import { Statistics } from "./types";

export const getStatDisplayValue = (value: string) => {
  return value.includes("/")
    ? value // date-time
    : <NumberFlow value={parseInt(value)} />
  ;
}

export const isInitialized = (statValue: string) => !Object.values(defaultStatistics).includes(statValue);

export const getFormattedStatistics = (stats: Statistics, intl: IntlShape) => {
  const statisticsArray = [
    { label: StatName.DateFirstOperation, value: stats.dateFirstOperation, spinnerId: SpinnerId.StatsFirstOperation },
    { label: StatName.DateLastOperation,  value: stats.dateLastOperation,  spinnerId: SpinnerId.StatsLastOperation },
    { label: StatName.ArtworkGenerations, value: stats.artworkGenerations, spinnerId: SpinnerId.StatsArtworkGenerations },
    { label: StatName.LyricsFetches,      value: stats.lyricsFetches,      spinnerId: SpinnerId.StatsLyricsFetches },
    { label: StatName.CardsGenerated,     value: stats.cardsGenerated,     spinnerId: SpinnerId.StatsCardsGenerated },
  ];
  const jsonPropertyNames = Object.keys(stats);

  statisticsArray.forEach((stat, idx) => {
    stat.label = intl.formatMessage({ id: `pages.home.stats.${jsonPropertyNames[idx]}` }) as StatName;
  });

  return statisticsArray;
};