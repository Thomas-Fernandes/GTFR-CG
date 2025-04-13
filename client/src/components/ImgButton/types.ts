import { ComponentPropsWithoutRef } from "react";

export type ImgButtonProps = ComponentPropsWithoutRef<"img"> & {
  src: string;
  onClick?: () => void;
  overlayText?: string;
  newTabLink?: boolean;
};
