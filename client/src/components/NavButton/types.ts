import { ComponentPropsWithoutRef } from "react";

import { NavButtonSide } from "./constants";

export type NavButtonProps = ComponentPropsWithoutRef<"button"> & Readonly<{
  to: string;
  label: string;
  side: NavButtonSide;
}>;