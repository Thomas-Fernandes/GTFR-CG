import { ComponentPropsWithoutRef } from "react";

export type DownloadButtonProps = ComponentPropsWithoutRef<"button"> & {
  className?: string;
};