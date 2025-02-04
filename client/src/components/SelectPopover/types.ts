import { StateSetter } from "@/common/types";

export type Option = Readonly<{
  label: string;
  value: string;
}>;

export type SelectPopoverProps = Readonly<{
  title?: string;
  label?: string;
  imgSrc?: string;

  options: Option[];
  onSelect: StateSetter<string>;
  className?: string;
}>;
