import { ComponentPropsWithoutRef } from "react";

export type VerticalRuleProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  className?: string;
}>;