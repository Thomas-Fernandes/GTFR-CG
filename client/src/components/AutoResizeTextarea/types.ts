import { ComponentPropsWithoutRef } from "react";

export type AutoResizeTextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  value: string;
  className?: string;
};
