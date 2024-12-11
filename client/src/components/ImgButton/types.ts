import { ComponentPropsWithoutRef } from "react";

export type ImgButtonProps = ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
  onClick?: () => void;
  overlayText?: string;
  newTabLink?: boolean;
};