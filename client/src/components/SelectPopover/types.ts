import { Option, StateSetter } from "@/common/types";

export interface SelectPopoverProps {
  title?: string;
  label?: string;
  imgSrc?: string;

  options: Option[];
  onSelect: StateSetter<string>;
  className?: string;
}
