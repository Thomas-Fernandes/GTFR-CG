import { VerticalRuleProps } from "./types";

import "./VerticalRule.scss";

const VerticalRule: React.FC<VerticalRuleProps> = ({ className, ...divProps }) => {
  return (
    <div
      className={`vertical-rule ${className ?? ""}`}
      {...divProps}
    />
  );
};

export default VerticalRule;