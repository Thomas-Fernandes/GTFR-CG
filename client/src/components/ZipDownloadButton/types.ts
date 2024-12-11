import { ComponentPropsWithoutRef } from "react";

export type ZipDownloadButtonProps = ComponentPropsWithoutRef<"button"> & {
  paths: string[];
  output: string;
};