import { ComponentPropsWithoutRef } from "react";

export type ButtonRemoveProps = ComponentPropsWithoutRef<"button"> & {
  onClick: () => void;
  className?: string;
};
