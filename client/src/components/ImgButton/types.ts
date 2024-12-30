import { ComponentPropsWithoutRef } from "react";

export type ImgButtonProps = ComponentPropsWithoutRef<"img"> & Readonly<{
  src: string;
  onClick?: () => void;
  overlayText?: string;
  newTabLink?: boolean;
}>;