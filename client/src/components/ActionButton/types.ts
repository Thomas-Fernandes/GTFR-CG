import { ComponentPropsWithoutRef } from "react";

export type ActionButtonProps = ComponentPropsWithoutRef<"button"> & {
  label: string;
  newTabLink?: boolean;
  className?: string;
};