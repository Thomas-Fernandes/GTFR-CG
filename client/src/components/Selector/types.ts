import { ComponentPropsWithoutRef } from "react";

import { StateSetter } from "@/common/types";

export type Option = {
  label: string;
  value: string;
};

export type SelectorProps = ComponentPropsWithoutRef<"select"> & {
  setter: StateSetter<string>;
  options: Option[];
};