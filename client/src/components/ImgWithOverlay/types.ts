import { ComponentPropsWithoutRef } from "react";

export type ImgWithOverlayProps = ComponentPropsWithoutRef<"img"> & {
  alt: string;
  overlayText: string;
  newTabLink?: boolean;
  className?: string;
};