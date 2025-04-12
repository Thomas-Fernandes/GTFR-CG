import { VerticalRuleProps } from "./types";

import "./VerticalRule.scss";

const VerticalRule = ({ className, ...divProps }: VerticalRuleProps) => {
  return <div className={`vertical-rule ${className ?? ""}`} {...divProps} />;
};

export default VerticalRule;
