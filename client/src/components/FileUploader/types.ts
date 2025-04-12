import { StateSetter } from "@/common/types";

export interface FileUploaderProps {
  id: string;
  label: string;
  caption?: string;
  accept?: string;
  setter: StateSetter<File | undefined>;
}
