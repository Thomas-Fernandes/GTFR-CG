import { SpinnerId } from "@/constants/spinners";

import { StatName } from "./constants";
import { StatisticsBoardProps } from "./types";

import "./StatisticsBoard.scss";

const StatisticsBoard: React.FC<StatisticsBoardProps> = ({ stats }): JSX.Element => {
  const statistics = [
    { label: StatName.DateFirstOperation, value: stats.dateFirstOperation, spinnerId: SpinnerId.StatsFirstOperation },
    { label: StatName.DateLastOperation, value: stats.dateLastOperation, spinnerId: SpinnerId.StatsLastOperation },
    { label: StatName.ArtworkGenerations, value: stats.artworkGenerations, spinnerId: SpinnerId.StatsArtworkGenerations },
    { label: StatName.LyricsFetches, value: stats.lyricsFetches, spinnerId: SpinnerId.StatsLyricsFetches },
    { label: StatName.CardsGenerated, value: stats.cardsGenerated, spinnerId: SpinnerId.StatsCardsGenerated },
  ]
  return (
    <div className="stats-board">
      <div className="stats-board--sep">
        { statistics.map((_, i) => (i + 1 !== statistics.length && // n-1 separators
          <hr key={`hr_${i}`} />
        ))}
      </div>
      <div className="stats-board--stats">
        <div className="stats-board--stats--titles">
          { statistics.map((stat, i) => (
            <span key={`stat-title_${i}`}>
              {stat.label}
            </span>
          ))}
        </div>
        <div className="stats-board--stats--values">
          { statistics.map((stat, i) => (
            <span key={`stat-value_${i}`} id={stat.spinnerId}>
              {stat.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsBoard;