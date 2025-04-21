import ActionButton from "@/components/ActionButton/ActionButton";
import { ComponentPropsWithoutRef } from "react";

type ButtonWithSpinnerProps = ComponentPropsWithoutRef<"div"> & {
  label: string;
  isBusy?: boolean;
};

const ButtonWithSpinner = ({ label, isBusy, ...props }: ButtonWithSpinnerProps) => {
  return (
    <div className="button__with-spinner" {...props}>
      <ActionButton type="submit" label={label} className={`spaced ${isBusy ? "busy" : ""}`} />
      {/* <Spinner /> will be appended here upon call to showSpinner */}
    </div>
  );
};

export default ButtonWithSpinner;
