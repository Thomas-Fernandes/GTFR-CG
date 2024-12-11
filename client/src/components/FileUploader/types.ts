
import { StateSetter } from "@/common/types";

export type FileUploaderProps = {
  id: string;
  label: string;
  caption?: string;
  accept?: string;
  labelClassName?: string;
  captionClassName?: string;
  setter: StateSetter<File | undefined>;
};