import { ComponentPropsWithoutRef } from "react";

export type CardStackProps = ComponentPropsWithoutRef<"div"> & {
  label: string;
  imgSrc: string;
  stackSize?: number;
}