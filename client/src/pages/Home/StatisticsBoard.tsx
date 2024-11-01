import { JSX } from "react";

import { Statistics } from "@common/types";

import { SPINNER_ID } from "@constants/spinners";
import { STAT_NAME } from "@constants/statistics";

import "./StatisticsBoard.css";

type StatisticProps = {
  stat_name: string;
  label: string;
  spinnerId: string;
};

const Statistic: React.FC<StatisticProps> = ({ stat_name, label, spinnerId }): JSX.Element => {
  return (
    <div className="stats-entry">
      <h3 className="stat-title">
        {stat_name}
      </h3>
      <p className="stat-text" id={spinnerId}>
        {label}
      </p>
    </div>
  );
};

type StatisticsBoardProps = {
  stats: Statistics;
};

const StatisticsBoard: React.FC<StatisticsBoardProps> = ({ stats }): JSX.Element => {
  return (
    <div className="stats-board">
      <Statistic stat_name={STAT_NAME.DATE_FIRST_OPERATION} label={stats.dateFirstOperation} spinnerId={SPINNER_ID.STATISTICS_FIRST_OPERATION} />
      <hr />
      <Statistic stat_name={STAT_NAME.DATE_LAST_OPERATION} label={stats.dateLastOperation} spinnerId={SPINNER_ID.STATISTICS_LAST_OPERATION} />
      <hr />
      <Statistic stat_name={STAT_NAME.ARTWORK_GENERATIONS} label={stats.artworkGenerations} spinnerId={SPINNER_ID.STATISTICS_ARTWORK_GENERATION} />
      <hr />
      <Statistic stat_name={STAT_NAME.LYRICS_FETCHES} label={stats.lyricsFetches} spinnerId={SPINNER_ID.STATISTICS_LYRICS_FETCHES} />
      <hr />
      <Statistic stat_name={STAT_NAME.CARDS_GENERATED} label={stats.cardsGenerated} spinnerId={SPINNER_ID.STATISTICS_CARDS_GENERATION} />
    </div>
  );
};

export default StatisticsBoard;