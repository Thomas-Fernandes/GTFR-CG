import { ComponentPropsWithoutRef } from "react";

export type SkeletonProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  w: string;
  h: string;
}>;