import React, { ComponentPropsWithoutRef } from "react";

import "./VerticalRule.css";

type Props = ComponentPropsWithoutRef<"div"> & {
  className?: string;
};

const VerticalRule: React.FC<Props> = ({ className, ...divProps }) => {
  return (
    <div
      className={`vertical-rule ${className ?? ""}`}
      {...divProps}
    />
  );
};

export default VerticalRule;