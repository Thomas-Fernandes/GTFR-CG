import { ComponentPropsWithoutRef } from "react";

export type ColorPickerProps = ComponentPropsWithoutRef<"div"> & Readonly<{
  id: string;
  latest?: string;
  label?: string;
  labelClassName?: string;
  setter: (color: string) => void;
}>;