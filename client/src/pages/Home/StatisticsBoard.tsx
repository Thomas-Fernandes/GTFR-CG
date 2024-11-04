import { JSX } from "react";

import { SpinnerId } from "@constants/spinners";

import { StatName } from "./constants";
import Statistic from "./Statistic";
import { StatisticsBoardProps } from "./types";

import "./StatisticsBoard.css";

const StatisticsBoard: React.FC<StatisticsBoardProps> = ({ stats }): JSX.Element => {
  return (
    <div className="stats-board">
      <Statistic label={StatName.DateFirstOperation} value={stats.dateFirstOperation} spinnerId={SpinnerId.StatsFirstOperation} />
      <hr />
      <Statistic label={StatName.DateLastOperation} value={stats.dateLastOperation} spinnerId={SpinnerId.StatsLastOperation} />
      <hr />
      <Statistic label={StatName.ArtworkGenerations} value={stats.artworkGenerations} spinnerId={SpinnerId.StatsArtworkGenerations} />
      <hr />
      <Statistic label={StatName.LyricsFetches} value={stats.lyricsFetches} spinnerId={SpinnerId.StatsLyricsFetches} />
      <hr />
      <Statistic label={StatName.CardsGenerated} value={stats.cardsGenerated} spinnerId={SpinnerId.StatsCardsGenerated} />
    </div>
  );
};

export default StatisticsBoard;