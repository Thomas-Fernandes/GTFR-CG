import { useEffect, useState } from "react";

import { useAppContext } from "@/contexts";

import { StatisticsBoardProps, StatisticsProps } from "./types";
import { getFormattedStatistics, getStatDisplayValue, isInitialized } from "./utils";

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
        <div className={`stats-board--stats--values ${isInitialized(statistics[2].value) ? "initialized" : ""}`}>
          { statistics.map((stat, i) => (
            <span key={`stat-value_${i}`} id={stat.spinnerId}>
              <p
                className={
                  `${isInitialized(stat.value) ? "" : "opacity-0 hidden-v"}
                  ${stat.value.includes("/") ? "datetime" : ""}`
                }
              >
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
            <span id={stat.spinnerId} className={`${isInitialized(stat.value) ? "" : "opacity-0 hidden-v"}`}>
              <p className={stat.value.includes("/") ? "datetime" : ""}>
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
  const { intl } = useAppContext();

  const statsToDisplay = getFormattedStatistics(stats, intl);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1600);

  const updateMedia = () => {
    setIsDesktop(window.innerWidth > 1600);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return (
    <div className="stats-board">
      { isDesktop
      ? <StatisticsHorizontal statistics={statsToDisplay} />
      : <StatisticsVertical   statistics={statsToDisplay} />
      }
    </div>
  );
};

export default StatisticsBoard;