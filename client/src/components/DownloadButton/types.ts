import { ComponentPropsWithoutRef } from "react";

export type DownloadButtonProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  label?: string;
  className?: string;
}>;