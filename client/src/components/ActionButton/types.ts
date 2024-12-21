import { ComponentPropsWithoutRef } from "react";

export type ActionButtonProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  label: string;
  newTabLink?: boolean;
  className?: string;
}>;