import { ComponentPropsWithoutRef } from "react";

export type CardStackProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  label: string;
  imgSrc: string;
  stackSize?: number;
}>;