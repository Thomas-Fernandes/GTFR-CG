import { useEffect, useState } from "react";

import { SpinnerId } from "@/constants/spinners";

import { StatName } from "./constants";
import { StatisticsBoardProps, StatisticsProps } from "./types";
import { getStatDisplayValue, statIsInitialized } from "./utils";

import "./StatisticsBoard.scss";

const StatisticsHorizontal: React.FC<StatisticsProps> = ({ statistics }) => {
  return (
    <>
      <div className="stats-board--sep__h">
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
        <div className={`stats-board--stats--values ${statIsInitialized(statistics[2].value) ? "initialized" : ""}`}>
          { statistics.map((stat, i) => (
            <span key={`stat-value_${i}`} id={stat.spinnerId}>
              <p className={`${statIsInitialized(stat.value) ? "" : "opacity-0 hidden-v"}`}>
                {getStatDisplayValue(stat.value)}
              </p>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

const StatisticsVertical: React.FC<StatisticsProps> = ({ statistics }) => {
  return (
    <>
      { statistics.map((stat, i) => (
        <div key={`stat-title_${i}`} className="stats-board__v">
          <div className="stats-board--title">
            <span>
              {stat.label}
            </span>
          </div>

          <div className="stats-board--value">
            <span id={stat.spinnerId}>
              <p className={`${statIsInitialized(stat.value) ? "" : "opacity-0 hidden-v"}`}>
                {getStatDisplayValue(stat.value)}
              </p>
            </span>
          </div>

          { i + 1 !== statistics.length &&
            <div className="stats-board--sep">
              <hr />
            </div>
          }
        </div>
      ))}
    </>
  );
};

const StatisticsBoard: React.FC<StatisticsBoardProps> = ({ stats }) => {
  const statistics = [
    { label: StatName.DateFirstOperation, value: stats.dateFirstOperation, spinnerId: SpinnerId.StatsFirstOperation },
    { label: StatName.DateLastOperation,  value: stats.dateLastOperation,  spinnerId: SpinnerId.StatsLastOperation },
    { label: StatName.ArtworkGenerations, value: stats.artworkGenerations, spinnerId: SpinnerId.StatsArtworkGenerations },
    { label: StatName.LyricsFetches,      value: stats.lyricsFetches,      spinnerId: SpinnerId.StatsLyricsFetches },
    { label: StatName.CardsGenerated,     value: stats.cardsGenerated,     spinnerId: SpinnerId.StatsCardsGenerated },
  ];

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1500);

  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 1500);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <div className="stats-board">
      { isDesktop
      ? <StatisticsHorizontal statistics={statistics} />
      : <StatisticsVertical   statistics={statistics} />
      }
    </div>
  );
};

export default StatisticsBoard;