import { StateSetter } from "@/common/types";

export type Option = {
  label: string;
  value: string;
};

export type SelectPopoverProps = {
  label: string;
  options: Option[];
  onSelect: StateSetter<string>;
  className?: string;
}