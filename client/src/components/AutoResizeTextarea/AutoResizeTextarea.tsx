import { ComponentPropsWithoutRef, forwardRef, useEffect, useRef } from "react";

import "./AutoResizeTextarea.css";

type Props = ComponentPropsWithoutRef<"textarea"> & {
  value: string;
  className?: string;
};

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, Props>(({ value, className, ...props }, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const combinedRef = ref || internalRef;

  useEffect(() => {
    const textarea = internalRef.current;

    if (textarea) {
      const resizeTextarea = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${(textarea.scrollHeight + 8) / 17.777}rem`;
      };
      resizeTextarea();
      textarea.addEventListener("input", resizeTextarea);
      return () => {
        textarea.removeEventListener("input", resizeTextarea);
      };
    }
  }, [value]);

  return (
    <textarea
      ref={combinedRef}
      value={value}
      className={`lyrics-textarea ${className ?? ""}`}
      {...props}
    />
  );
});