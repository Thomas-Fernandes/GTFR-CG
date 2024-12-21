import { ComponentPropsWithoutRef } from "react";

export type ButtonRemoveProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  onClick: () => void;
  className?: string;
}>;