import { ComponentPropsWithoutRef } from "react";

export type ImgWithOverlayProps = ComponentPropsWithoutRef<"img"> & {
  overlayText: string;
  newTabLink?: boolean;
  className?: string;
};
