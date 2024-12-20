import { ComponentPropsWithoutRef } from "react";

export type CheckboxProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  size: number;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label?: string;
}>;