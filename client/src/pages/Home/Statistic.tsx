import { StatisticProps } from "./types";

import "./Statistic.scss";

const Statistic: React.FC<StatisticProps> = ({ label, value, spinnerId }): JSX.Element => {
  return (
    <div className="stats-entry">
      <h3 className="stats-entry--title">
        {label}
      </h3>
      <p className="stats-entry--text" id={spinnerId}>
        {value}
      </p>
    </div>
  );
};

export default Statistic;