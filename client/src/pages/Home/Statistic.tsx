import { JSX } from "react";

import { StatisticProps } from "./types";

import "./Statistic.css";

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

export default Statistic;