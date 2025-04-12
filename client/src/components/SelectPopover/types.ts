import { StateSetter } from "@/common/types";

export interface Option {
  label: string;
  value: string;
}

export interface SelectPopoverProps {
  title?: string;
  label?: string;
  imgSrc?: string;

  options: Option[];
  onSelect: StateSetter<string>;
  className?: string;
}
