import { ComponentPropsWithoutRef } from "react";

export type ColorPickerProps = ComponentPropsWithoutRef<"div"> & {
  id: string;
  latest?: string;
  label?: string;
  labelClassName?: string;
  setter: (color: string) => void;
};
