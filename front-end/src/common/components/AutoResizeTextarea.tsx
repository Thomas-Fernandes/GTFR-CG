import { forwardRef, useEffect, useRef } from "react";

type AutoResizeTextareaProps = React.ComponentPropsWithoutRef<"textarea"> & { value: string };

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(({ value, ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const combinedRef = ref || internalRef;

  useEffect(() => {
    const textarea = internalRef.current;

    if (textarea) {
      const resizeTextarea = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      resizeTextarea();
      textarea.addEventListener("input", resizeTextarea);
      return () => {
        textarea.removeEventListener("input", resizeTextarea);
      };
    }
  }, [value]);
  return <textarea ref={combinedRef} value={value} {...props} />;
});