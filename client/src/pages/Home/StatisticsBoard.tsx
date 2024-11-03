import { JSX } from "react";

import { StatisticProps, StatisticsBoardProps } from "@pages/Home/types";

import { SPINNER_ID } from "@constants/spinners";

import { STAT_NAME } from "./constants";

import "./StatisticsBoard.css";

const Statistic: React.FC<StatisticProps> = ({ label, value, spinnerId }): JSX.Element => {
  return (
    <div className="stats-entry">
      <h3 className="stat-title">
        {label}
      </h3>
      <p className="stat-text" id={spinnerId}>
        {value}
      </p>
    </div>
  );
};

const StatisticsBoard: React.FC<StatisticsBoardProps> = ({ stats }): JSX.Element => {
  return (
    <div className="stats-board">
      <Statistic label={STAT_NAME.DATE_FIRST_OPERATION} value={stats.dateFirstOperation} spinnerId={SPINNER_ID.STATISTICS_FIRST_OPERATION} />
      <hr />
      <Statistic label={STAT_NAME.DATE_LAST_OPERATION} value={stats.dateLastOperation} spinnerId={SPINNER_ID.STATISTICS_LAST_OPERATION} />
      <hr />
      <Statistic label={STAT_NAME.ARTWORK_GENERATIONS} value={stats.artworkGenerations} spinnerId={SPINNER_ID.STATISTICS_ARTWORK_GENERATIONS} />
      <hr />
      <Statistic label={STAT_NAME.LYRICS_FETCHES} value={stats.lyricsFetches} spinnerId={SPINNER_ID.STATISTICS_LYRICS_FETCHES} />
      <hr />
      <Statistic label={STAT_NAME.CARDS_GENERATED} value={stats.cardsGenerated} spinnerId={SPINNER_ID.STATISTICS_CARDS_GENERATED} />
    </div>
  );
};

export default StatisticsBoard;