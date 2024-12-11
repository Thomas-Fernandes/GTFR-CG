import { ComponentPropsWithoutRef } from "react";

export type CheckboxProps = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: string;
};