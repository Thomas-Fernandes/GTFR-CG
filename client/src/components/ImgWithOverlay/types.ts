import { ComponentPropsWithoutRef } from "react";

export type ImgWithOverlayProps = ComponentPropsWithoutRef<"img"> & Readonly<{
  overlayText: string;
  newTabLink?: boolean;
  className?: string;
}>;