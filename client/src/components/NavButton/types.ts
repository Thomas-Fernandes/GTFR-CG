import { ComponentPropsWithoutRef } from "react";

import { NavButtonSide } from "./constants";

export type NavButtonProps = ComponentPropsWithoutRef<"button"> & {
  to: string;
  label: string;
  side: NavButtonSideType;
};

export type NavButtonSideType = `${NavButtonSide}`;