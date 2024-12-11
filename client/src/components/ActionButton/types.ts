import { ComponentPropsWithoutRef } from "react";

export type ActionButtonProps = ComponentPropsWithoutRef<"button"> & {
  label: string;
  className?: string;
};