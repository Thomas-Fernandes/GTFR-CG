import { ComponentPropsWithoutRef } from "react";

export type GenerationModeFlipperProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  className?: string;
}>;