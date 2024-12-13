import { ComponentPropsWithoutRef } from "react";

export type DownloadButtonProps = ComponentPropsWithoutRef<"button"> & {
  label?: string;
  className?: string;
};