import { ComponentPropsWithoutRef } from "react";

export type CheckboxProps = ComponentPropsWithoutRef<"div"> & {
  size: number;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label?: string;
};