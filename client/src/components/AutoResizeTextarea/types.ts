import { ComponentPropsWithoutRef } from "react";

export type AutoResizeTextareaProps = ComponentPropsWithoutRef<"textarea"> & Readonly<{
  value: string;
  className?: string;
}>;