import { StateSetter } from "@/common/types";

export type Option = Readonly<{
  label: string;
  value: string;
}>;

export type SelectPopoverProps = Readonly<{
  label: string;
  options: Option[];
  onSelect: StateSetter<string>;
  className?: string;
}>;