export type ColorPickerProps = {
  id: string;
  latest?: string;
  label?: string;
  labelClassName?: string;
  setter: (color: string) => void;
};