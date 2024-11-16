import React from "react";

import "./VerticalRule.css";

type Props = {
  className?: string;
};

const VerticalRule: React.FC<Props> = ({ className }) => {
  return (
    <div className={`vertical-rule ${className ?? ""}`} />
  );
};

export default VerticalRule;